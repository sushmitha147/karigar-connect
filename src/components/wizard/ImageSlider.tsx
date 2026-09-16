"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, Sliders } from "lucide-react";

interface ImageSliderProps {
  originalUrl: string;
  enhancedUrl: string;
}

export function ImageSlider({ originalUrl, enhancedUrl }: ImageSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPos(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden cursor-ew-resize select-none border-2 border-[#E5DCCD] bg-[#FAF8F3] shadow-sm"
      >
        {/* Enhanced Image (Background base layer) */}
        <div className="absolute inset-0 bg-[#FAF8F3]">
          <img
            src={enhancedUrl || originalUrl}
            alt="AI Studio Enhanced"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-[#243B53] text-[#FAF8F3] px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 z-10">
            <Sparkles className="w-3.5 h-3.5 text-[#C65D3B]" />
            <span>AI Studio Clean</span>
          </div>
        </div>

        {/* Original Image (Clipped top layer) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={originalUrl}
            alt="Original Workshop Photo"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
          />
          <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
            Original Photo
          </div>
        </div>

        {/* Dividing Slider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#243B53] border-2 border-white text-white flex items-center justify-center shadow-lg">
            <Sliders className="w-4 h-4 text-[#FAF8F3]" />
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-gray-500 font-medium">
        ↔ Drag slider left or right to compare Original vs AI Studio Enhanced
      </p>
    </div>
  );
}
