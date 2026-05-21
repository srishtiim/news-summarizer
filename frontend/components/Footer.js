"use client";
import React, { useEffect, useState, useRef } from "react";

const stickersData = [
  { id: "whatsapp", text: "WhatsApp", link: "https://wa.me/", hasPeel: false },
  { id: "twitter", text: "Twitter", link: "https://twitter.com/", hasPeel: false },
  { id: "github", text: "GitHub", link: "https://github.com/srishtiim/news-summarizer", hasPeel: false },
  { id: "ai", text: "Made with AI", link: null, hasPeel: true },
  { id: "star", text: "*", link: null, hasPeel: false }
];

export default function Footer() {
  const containerRef = useRef(null);
  const [stickers, setStickers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Slight delay to ensure layout is done
    const initStickers = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newStickers = stickersData.map((sticker) => {
        const rotation = Math.random() * 30 - 15; // -15deg to +15deg
        // Calculate random positions, keeping them mostly within the footer
        const padding = 60;
        const width = containerRect.width > 0 ? containerRect.width : 1000;
        const height = containerRect.height > 0 ? containerRect.height : 400;
        
        const x = Math.max(padding, Math.random() * (width - 200));
        const y = Math.max(padding, Math.random() * (height - 100));
        
        return { ...sticker, rotation, x, y };
      });
      setStickers(newStickers);
    };

    initStickers();
  }, []);

  const handleMouseDown = (e, idx) => {
    if (isMobile) return;
    e.preventDefault();
    const sticker = stickers[idx];
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = sticker.x;
    const initialY = sticker.y;
    let dragged = false;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragged = true;
      }
      setStickers((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], x: initialX + dx, y: initialY + dy };
        return next;
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      
      if (!dragged && sticker.link) {
        window.open(sticker.link, "_blank");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <style>{`
        .peeled-sticker {
          position: relative;
        }
        .peeled-sticker::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          border-bottom: 16px solid #1a1814;
          border-left: 16px solid #d4d4d4;
          width: 0;
          height: 0;
          border-bottom-right-radius: 4px;
        }
      `}</style>
      <footer ref={containerRef} className="relative bg-[#1a1814] text-paper-cream overflow-hidden py-16 px-6 md:px-12 lg:px-20 min-h-[500px] flex flex-col justify-end">
        
        {/* Draggable Stickers */}
        {!isMobile ? (
          stickers.map((sticker, idx) => (
            <div
              key={sticker.id}
              onMouseDown={(e) => handleMouseDown(e, idx)}
              style={{
                position: "absolute",
                left: `${sticker.x}px`,
                top: `${sticker.y}px`,
                transform: `rotate(${sticker.rotation}deg)`,
                cursor: sticker.link ? (isMobile ? "pointer" : "grab") : "grab",
                zIndex: 10
              }}
              className={`font-mono text-ink-dark bg-white px-5 py-2 rounded-lg shadow-lg select-none active:cursor-grabbing hover:scale-105 transition-transform duration-200 ${
                sticker.hasPeel ? "peeled-sticker" : ""
              }`}
            >
              {sticker.text}
            </div>
          ))
        ) : (
          <div className="flex flex-wrap gap-4 mb-12 justify-center z-10 relative">
            {stickersData.map((sticker) => (
              <a
                key={sticker.id}
                href={sticker.link || undefined}
                target={sticker.link ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`font-mono text-ink-dark bg-white px-5 py-2 rounded-lg shadow-md select-none ${
                  sticker.hasPeel ? "peeled-sticker" : ""
                }`}
              >
                {sticker.text}
              </a>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="z-0 relative mt-auto pt-20 pointer-events-none">
          <h2 className="font-masthead text-7xl md:text-9xl lg:text-[14rem] font-black uppercase tracking-tighter leading-none mb-6 text-center text-paper-cream">
            CONTACT
          </h2>
          
          <div className="h-[1px] bg-paper-cream/30 w-full mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs md:text-sm uppercase tracking-widest text-paper-cream/70">
            <div className="text-center md:text-left">
              Just drop us a line.
            </div>
            <div className="text-center font-bold">
              The Times Summariser
            </div>
            <div className="text-center md:text-right">
              © 2026 The Times Summariser
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
