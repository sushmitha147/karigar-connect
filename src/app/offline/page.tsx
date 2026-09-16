import Link from "next/link";
import { WifiOff, RotateCcw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center card-artisan p-8 bg-white space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#243B53]">You Are Offline</h1>
        <p className="text-sm text-[#263238]/80 leading-relaxed">
          It looks like you have lost internet connection. KARIGAR CONNECT caches your critical artisan data so you can continue viewing your saved products and drafts.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 btn-cta w-full justify-center"
          >
            <RotateCcw className="w-4 h-4" />
            Check Connection & Retry
          </Link>
        </div>
      </div>
    </div>
  );
}
