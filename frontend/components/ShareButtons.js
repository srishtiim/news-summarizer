"use client";
import React from "react";
import { MessageSquare, Twitter } from "lucide-react";

export default function ShareButtons({ article }) {
  if (!article) return null;

  const shareText = `📰 "${article.Title}" - Summarized by TOI News Summariser`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + (article.URL || shareUrl))}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(article.URL || shareUrl)}`;

  return (
    <div className="flex items-center gap-4 py-4 justify-center border-t border-dashed border-ink-dark/20 mt-4">
      <span className="font-mono text-xs uppercase tracking-widest text-ink-dark/60">Share Dispatch:</span>
      <div className="flex gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 border border-ink-dark font-mono text-xs uppercase tracking-wider bg-white hover:bg-[#25D366] hover:text-white transition-all shadow-[2px_2px_0_0_#1A1A1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#1A1A1A]"
        >
          <MessageSquare size={14} />
          WhatsApp
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 border border-ink-dark font-mono text-xs uppercase tracking-wider bg-white hover:bg-[#1DA1F2] hover:text-white transition-all shadow-[2px_2px_0_0_#1A1A1A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#1A1A1A]"
        >
          <Twitter size={14} />
          Twitter / X
        </a>
      </div>
    </div>
  );
}
