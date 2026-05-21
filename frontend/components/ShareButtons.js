"use client";
import React from "react";
import { MessageSquare } from "lucide-react";

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
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          Twitter / X
        </a>
      </div>
    </div>
  );
}
