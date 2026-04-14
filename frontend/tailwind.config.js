/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          cream: "#FFFEF0",
          sepia: "#F4E8D0",
        },
        ink: {
          dark: "#1A1A1A",
          brown: "#2B1B0E",
        },
        accent: {
          crimson: "#8B1A1A",
          gold: "#D4AF37",
        },
        border: {
          tan: "#C0A882",
        }
      },
      fontFamily: {
        masthead: ['"Playfair Display"', 'serif'],
        headline: ['"Libre Baskerville"', 'serif'],
        body: ['"Crimson Text"', 'serif'],
        mono: ['"Courier Prime"', 'monospace'],
        dropcap: ['"IM Fell English"', 'serif'],
      },
      boxShadow: {
        vintage: "4px 4px 12px rgba(0,0,0,0.3)",
        'vintage-hover': "6px 6px 16px rgba(0,0,0,0.4)",
        modal: "8px 8px 16px rgba(0,0,0,0.4)",
      }
    },
  },
  plugins: [],
};
