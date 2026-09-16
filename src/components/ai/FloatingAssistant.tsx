"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  Package,
  ArrowRight,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  toolCalled?: string;
  data?: any;
  timestamp: Date;
}

export function FloatingAssistant() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Namaste! I am your Karigar Assistant. You can ask me in English, Hindi, Telugu, or Tamil about your orders, inventory stock, pricing tips, or government schemes.",
      timestamp: new Date(),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const user = session?.user as any;

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: "📦 Pending Orders", query: "Show my pending orders" },
    { label: "⚠️ Low Stock Alert", query: "Check my inventory stock levels" },
    { label: "🏛️ Govt Schemes", query: "What govt schemes am I eligible for?" },
    { label: "💰 Pricing Advice", query: "How should I calculate my wholesale margin?" },
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          context: {
            sellerId: user?.sellerProfileId,
            buyerId: user?.buyerProfileId,
            role: user?.role || "GUEST",
            language: user?.language || "en",
          },
        }),
      });

      if (!res.ok) throw new Error("Assistant request failed");

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.reply,
        toolCalled: data.toolCalled,
        data: data.data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: "I couldn't connect to the server right now. You can check your dashboard directly or try asking again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = user?.language === "te" ? "te-IN" : user?.language === "hi" ? "hi-IN" : user?.language === "ta" ? "ta-IN" : "en-IN";

      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } catch (e) {
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#243B53] text-[#FAF8F3] rounded-full shadow-xl hover:bg-[#334E68] border-2 border-[#E5DCCD] transition-all transform hover:scale-105 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#C65D3B] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm pr-1">Ask My Assistant</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3E6650] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3E6650]"></span>
          </span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-[#FAF8F3] rounded-2xl shadow-2xl border border-[#E5DCCD] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-[#243B53] text-[#FAF8F3] px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C65D3B] flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-[#FAF8F3]">Karigar Assistant</h3>
                <p className="text-[11px] text-[#F4EBDD]/80">Connected to your live workshop DB</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-[#FAF8F3]/80 hover:text-white hover:bg-[#334E68]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#243B53] text-[#FAF8F3] flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    क
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#C65D3B] text-white rounded-br-none"
                      : "bg-[#F4EBDD] text-[#263238] border border-[#E5DCCD] rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Render dynamic DB tool output if present */}
                  {m.toolCalled === "getPendingOrders" && m.data && Array.isArray(m.data) && (
                    <div className="mt-2.5 pt-2 border-t border-[#E5DCCD] space-y-1.5">
                      <p className="font-bold text-[11px] text-[#243B53]">Live Orders from Database:</p>
                      {m.data.slice(0, 2).map((ord: any) => (
                        <div key={ord.id} className="bg-white p-2 rounded-lg border border-[#E5DCCD] text-[11px]">
                          <div className="font-semibold text-[#243B53]">{ord.orderNumber}</div>
                          <div className="text-gray-600">Qty: {ord.quantity} | Total: ₹{ord.totalAmount}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="block text-[9px] mt-1 opacity-70 text-right">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#C65D3B] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                <div className="w-6 h-6 rounded-full bg-[#243B53] text-white flex items-center justify-center animate-pulse text-[10px]">
                  क
                </div>
                Karigar Assistant is consulting your workshop database...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-[#FAF8F3] border-t border-[#E5DCCD] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p) => (
              <button
                key={p.label}
                onClick={() => handleSend(p.query)}
                className="whitespace-nowrap text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F4EBDD] text-[#243B53] hover:bg-[#EAE0CD] transition-colors border border-[#E5DCCD]"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#FAF8F3] border-t border-[#E5DCCD] flex items-center gap-2">
            <button
              onClick={toggleVoiceRecording}
              className={`p-2 rounded-xl transition-colors ${
                isRecording
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-[#F4EBDD] text-[#243B53] hover:bg-[#EAE0CD]"
              }`}
              title={isRecording ? "Stop listening" : "Tap and Speak"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask in Hindi, Telugu, or English..."
              className="flex-1 bg-white border border-[#E5DCCD] rounded-xl px-3 py-2 text-xs text-[#263238] focus:outline-none focus:ring-1 focus:ring-[#243B53]"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-[#C65D3B] text-white hover:bg-[#B24E2E] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
