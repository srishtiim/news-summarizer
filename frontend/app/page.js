"use client";
import Link from "next/link";
import Footer from "../components/Footer";
import FolderCard from "../components/FolderCard";

const folders = [
  { category: "National", emoji: "🗺️", color: "#c8b89a", route: "/national" },
  { category: "Business", emoji: "📈", color: "#a8c5a0", route: "/business" },
  { category: "Politics", emoji: "🏛️", color: "#c4a882", route: "/politics" },
  { category: "Tech", emoji: "💻", color: "#9ab5c8", route: "/tech" },
  { category: "Sports", emoji: "🏏", color: "#c8a09a", route: "/sports" },
  { category: "International", emoji: "🌍", color: "#b8a8c8", route: "/international" },
  { category: "Editorial", emoji: "✒️", color: "#c8c4a0", route: "/editorial" },
];

export default function Home() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <main 
        className="min-h-screen p-6 md:p-12 lg:p-16 w-full flex flex-col"
        style={{
          background: "linear-gradient(135deg, #FFFEF0 0%, #F4E8D0 50%, #E6DCC8 100%)"
        }}
      >
        <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b-[8px] border-double border-ink-dark pb-6 text-center shrink-0">
            <h1 className="font-masthead text-5xl md:text-7xl lg:text-8xl font-black text-ink-brown uppercase tracking-tighter mb-4">
              The Times of India
            </h1>
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 border-y-[3px] border-ink-dark py-2 font-mono text-sm md:text-base font-bold uppercase px-4 space-y-2 md:space-y-0">
              <span>Vol. I — No. 1</span>
              <span className="tracking-[0.2em] font-black text-accent-crimson">News Summariser</span>
              <span>{today}</span>
            </div>
          </header>

          <div className="my-6 md:my-8 text-center shrink-0">
            <div className="h-[1px] bg-ink-dark/30 w-3/4 mx-auto mb-4"></div>
            <p className="font-masthead text-lg md:text-xl italic text-ink-brown/80">
              Select your section to read today's dispatches.
            </p>
            <div className="h-[1px] bg-ink-dark/30 w-3/4 mx-auto mt-4"></div>
          </div>

          {/* Grid Container */}
          <div className="mt-4 md:mt-8 w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center pb-12">
            {/* Top row: 4 folders */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 justify-items-center mb-6 md:mb-8 w-full">
              {folders.slice(0, 4).map((f) => (
                <FolderCard key={f.category} {...f} />
              ))}
            </div>

            {/* Bottom row: 3 folders centered */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 justify-items-center w-full md:w-3/4 mx-auto">
              {folders.slice(4).map((f) => (
                <FolderCard key={f.category} {...f} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
