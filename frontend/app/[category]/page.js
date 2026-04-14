"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ArticleCard from "../../components/ArticleCard";
import ArticleModal from "../../components/ArticleModal";

export default function CategoryPage({ params }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const category = params.category;
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        // Convert to Title Case for API if needed, or API handles logic.
        const res = await fetch(`${apiUrl}/api/articles?category=${category}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [category]);

  const categoryTitle = category.toUpperCase();

  return (
    <main className="min-h-screen p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto bg-paper-cream relative">
      <Link 
        href="/"
        className="inline-block mb-8 font-mono text-sm font-bold tracking-widest uppercase border-b-2 border-ink-dark/30 pb-1 hover:text-accent-crimson hover:border-accent-crimson transition-colors"
      >
        &larr; Back to Sections
      </Link>

      <header className="border-b-[4px] border-ink-dark pb-6 mb-12 text-center">
        <h1 className="font-masthead text-6xl md:text-8xl font-black text-ink-brown uppercase tracking-tighter">
          {categoryTitle}
        </h1>
      </header>

      {loading ? (
        <div className="text-center py-20 font-mono text-lg animate-pulse uppercase tracking-widest text-ink-dark/60">
          Gathering Intelligence...
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 font-headline text-2xl italic text-ink-dark/60">
          No dispatches found for this section today.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 columns-1 md:columns-2 lg:columns-3" style={{ columnGap: '3rem' }}>
          {articles.map((article, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.15 }}
            >
              <ArticleCard 
                article={article} 
                onReadMore={() => setSelectedArticle(article)} 
              />
            </motion.div>
          ))}
        </div>
      )}

      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </main>
  );
}
