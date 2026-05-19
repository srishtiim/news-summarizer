import "./globals.css";
import { Playfair_Display, Libre_Baskerville, Crimson_Text, Courier_Prime, IM_Fell_English, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import AuthProvider from "../components/AuthProvider";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-playfair" });
const libre = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libre" });
const crimson = Crimson_Text({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-crimson" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier" });
const imFell = IM_Fell_English({ subsets: ["latin"], weight: ["400"], variable: "--font-im-fell", adjustFontFallback: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex" });

export const metadata = {
  title: "The Times of India - News Summariser",
  description: "A vintage 1970s broadsheet news reading experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${libre.variable} ${crimson.variable} ${courier.variable} ${imFell.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
