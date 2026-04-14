"use client";
import React from "react";

export default function ArticleCard({ article, onReadMore }) {
  const { Title, Extractive_Summary } = article;
  
  // Extract first letter for Drop Cap
  const firstLetter = Extractive_Summary ? Extractive_Summary.charAt(0) : "";
  const restSummary = Extractive_Summary ? Extractive_Summary.slice(1) : "";

  return (
    <article className="border-b border-border-tan pb-6 mb-6">
      <h3 className="font-headline font-bold text-2xl md:text-3xl lg:text-4xl leading-tight text-ink-brown mb-4">
        {Title}
      </h3>
      
      <div className="font-body text-base lg:text-lg text-ink-dark leading-relaxed text-justify relative">
        {firstLetter && (
          <span className="font-dropcap float-left text-6xl lg:text-7xl leading-none mt-1 mr-2 text-ink-brown">
            {firstLetter}
          </span>
        )}
        <p className="line-clamp-4">
          {restSummary}
        </p>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={onReadMore}
          className="font-masthead font-black uppercase text-sm tracking-widest text-accent-crimson hover:text-ink-brown transition-colors group flex items-center gap-1"
        >
          Read More
          <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
        </button>
      </div>
    </article>
  );
}
