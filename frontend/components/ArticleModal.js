"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ShareButtons from "./ShareButtons";

export default function ArticleModal({ article, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!article || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {/* Overlay: fixed, full-screen, flex to center content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-paper-cream shadow-modal"
        >
            {/* Inner Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
            }}></div>

            <div className="relative z-10 p-8 md:p-12 border-[3px] border-ink-dark/10 m-2 md:m-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-ink-dark hover:text-accent-crimson transition-colors"
                title="Close"
              >
                <X size={32} strokeWidth={3} />
              </button>

              <div className="text-center mb-6">
                <span className="font-mono text-xs font-bold tracking-widest text-ink-dark border-b border-ink-dark/20 pb-1 uppercase">
                  {article.Category || "NEWS FEATURE"}
                </span>
              </div>

              <h2 className="font-headline font-bold text-3xl md:text-5xl leading-tight text-ink-brown mb-6">
                {article.Title}
              </h2>

              <div className="font-body text-lg text-ink-dark leading-relaxed mb-8">
                <p className="indent-8 text-justify">
                  {article.Abstractive_Summary || article.Extractive_Summary || article.Description}
                </p>
              </div>

              {article.Quick_Pointers && (
                <div className="mb-8 p-6 bg-paper-sepia/50 border border-ink-dark/20">
                  <h4 className="font-masthead font-black tracking-widest uppercase text-ink-brown mb-4 text-sm border-b border-ink-dark/20 pb-2">
                    Quick Pointers
                  </h4>
                  <ul className="list-disc pl-5 font-body text-base space-y-2">
                    {article.Quick_Pointers.split('\n').filter(Boolean).map((pt, i) => (
                      <li key={i}>{pt.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8 mb-8 border-t-2 border-dashed border-ink-dark/30 pt-8">
                {article.MCQ_Sample && (
                  <div className="font-mono text-sm bg-paper-cream border-[2px] border-ink-dark p-4 shadow-[4px_4px_0_0_#1A1A1A]">
                    <h4 className="font-bold underline mb-3 uppercase">Test Your Knowledge</h4>
                    <div className="whitespace-pre-wrap">{article.MCQ_Sample}</div>
                  </div>
                )}

                {article.Easy_Explanation && (
                  <div className="font-body text-base bg-white/50 border-l-[4px] border-accent-gold p-4 italic">
                    <h4 className="font-bold mb-2 not-italic font-masthead uppercase text-xs tracking-wider">Exam Context</h4>
                    {article.Easy_Explanation}
                  </div>
                )}
              </div>

              <div className="text-center pt-6 border-t-[3px] border-double border-ink-dark/40">
                <a
                  href={article.URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-masthead font-black uppercase tracking-[0.2em] text-accent-crimson hover:bg-accent-crimson hover:text-paper-cream transition-colors border-2 border-accent-crimson px-6 py-3 inline-block"
                >
                  View Original Article
                </a>
              </div>
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
