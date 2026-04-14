"use client";
import Link from "next/link";

export default function Home() {
  const categories = [
    "NATIONAL",
    "BUSINESS",
    "POLITICS",
    "TECH",
    "SPORTS",
    "INTERNATIONAL",
    "EDITORIAL",
  ];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-20 max-w-[1400px] mx-auto">
      <header className="border-b-[8px] border-double border-ink-dark pb-6 mb-16 text-center">
        <h1 className="font-masthead text-5xl md:text-7xl lg:text-8xl font-black text-ink-brown uppercase tracking-tighter mb-4">
          The Times of India
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 border-y-[3px] border-ink-dark py-2 font-mono text-sm md:text-base font-bold uppercase px-4 space-y-2 md:space-y-0">
          <span>Vol. I — No. 1</span>
          <span className="tracking-[0.2em] font-black text-accent-crimson">News Summariser</span>
          <span>{today}</span>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {categories.map((category, index) => (
          <Link
            key={category}
            href={`/${category.toLowerCase()}`}
            className={`group block vintage-border p-8 text-center transition-all duration-300 ease-out hover:bg-paper-sepia hover:scale-105 hover:shadow-vintage-hover shadow-vintage bg-paper-cream ${
              index === 0 ? "md:col-span-2 lg:col-span-3 pb-12" : ""
            }`}
          >
            <h2
              className={`font-masthead font-black uppercase text-ink-brown group-hover:text-accent-crimson transition-colors ${
                index === 0 ? "text-6xl md:text-8xl" : "text-4xl md:text-5xl"
              }`}
            >
              {category}
            </h2>
            <div className="mt-4 border-t border-dashed border-border-tan pt-4 w-3/4 mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
              <span className="font-mono text-xs font-bold tracking-widest text-ink-dark">
                &raquo; TURN TO SECTION &laquo;
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
