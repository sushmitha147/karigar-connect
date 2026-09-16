"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { X, QrCode, Download, Share2, Award, ExternalLink } from "lucide-react";
import Link from "next/link";

interface StoryQRModalProps {
  productId: string;
  productTitle: string;
  artisanName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function StoryQRModal({
  productId,
  productTitle,
  artisanName,
  isOpen,
  onClose,
}: StoryQRModalProps) {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && productId) {
      const storyPageUrl = `${window.location.origin}/story/${productId}`;
      QRCode.toDataURL(storyPageUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#243B53",
          light: "#FAF8F3",
        },
      }).then(setQrUrl);
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-[#E5DCCD] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-[#F4EBDD]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#F4EBDD] text-[#C65D3B] flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-bold text-lg text-[#243B53]">Artisan Story QR Code</h3>
          <p className="text-xs text-[#263238]/70 mt-1">
            Provenance verification for <strong>{productTitle}</strong> by {artisanName}
          </p>
        </div>

        {qrUrl ? (
          <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#E5DCCD] inline-block shadow-inner">
            <img src={qrUrl} alt="Story QR Code" className="w-52 h-52 mx-auto rounded-lg" />
          </div>
        ) : (
          <div className="w-52 h-52 bg-gray-100 rounded-xl mx-auto flex items-center justify-center text-xs text-gray-500">
            Generating QR...
          </div>
        )}

        <p className="text-[11px] text-gray-600 leading-snug">
          Attach this QR code to the product packaging. Retail and boutique end-customers can scan it to view master weaver history, video, and GI authenticity proof.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          {qrUrl && (
            <a
              href={qrUrl}
              download={`StoryQR-${productId}.png`}
              className="btn-cta text-xs py-2.5 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable Label</span>
            </a>
          )}

          <Link
            href={`/story/${productId}`}
            className="btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
          >
            <span>Preview Provenance Story Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
