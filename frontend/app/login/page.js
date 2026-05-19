"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, List, BookOpen, Settings } from "lucide-react";
import styles from "./login.module.css";

const carouselData = [
  {
    title: "Daily News, Simplified",
    body: "Stay informed with AI-powered summaries of today's top stories, delivered fresh daily.",
  },
  {
    title: "7 Categories, One Place",
    body: "From National politics to Global tech, get the breadth of the news without the noise.",
  },
  {
    title: "Smart Summaries",
    body: "Extractive and abstractive AI processing to give you the exact context you need.",
  },
  {
    title: "Updated Daily",
    body: "Our intelligence gathers fresh dispatches every morning to keep your library current.",
  }
];

export default function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleMockAction = () => {
    alert("Email login coming soon — use Google for now.");
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.frame}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Nav Rail */}
        <div className={styles.navRail}>
          <div className={styles.navItem}>
            <Home size={24} strokeWidth={1.5} />
            <span>Home</span>
          </div>
          <div className={styles.navItem}>
            <List size={24} strokeWidth={1.5} />
            <span>Categories</span>
          </div>
          <div className={styles.navItem}>
            <BookOpen size={24} strokeWidth={1.5} />
            <span>Library</span>
          </div>
          <div className={styles.navItem} style={{ borderBottom: "none", marginTop: "auto" }}>
            <Settings size={24} strokeWidth={1.5} />
            <span>Settings</span>
          </div>
        </div>

        {/* Middle Panel - Feature Showcase */}
        <div className={styles.middlePanel}>
          <div className={styles.illustrationBox}>
            {/* Inline SVG Illustration (Retro Line Art) */}
            <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* House background */}
              <path d="M40 160 L160 160 L160 80 L100 40 L40 80 Z" fill="#7A9E7E" fillOpacity="0.8" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M70 120 L130 120 L130 80 L70 80 Z" fill="#F5EBE0" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="100" cy="100" r="15" fill="none" stroke="#1A1A1A" strokeWidth="2"/>
              <path d="M90 60 L100 70 L110 60" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinejoin="round"/>
              {/* Seat */}
              <rect x="50" y="150" width="100" height="10" fill="#1A1A1A"/>
              {/* Person reading */}
              <path d="M50 140 C50 140 60 110 80 140" fill="none" stroke="#1A1A1A" strokeWidth="2"/>
              <rect x="70" y="115" width="60" height="35" fill="#F5EBE0" stroke="#1A1A1A" strokeWidth="2"/>
              <line x1="75" y1="122" x2="125" y2="122" stroke="#1A1A1A" strokeWidth="2"/>
              <line x1="75" y1="130" x2="120" y2="130" stroke="#1A1A1A" strokeWidth="2"/>
              <line x1="75" y1="138" x2="125" y2="138" stroke="#1A1A1A" strokeWidth="2"/>
              <line x1="75" y1="146" x2="110" y2="146" stroke="#1A1A1A" strokeWidth="2"/>
              {/* Head */}
              <circle cx="100" cy="95" r="12" fill="#F5EBE0" stroke="#1A1A1A" strokeWidth="2"/>
              <path d="M95 90 Q100 85 105 90" fill="none" stroke="#1A1A1A" strokeWidth="2"/>
            </svg>
          </div>
          
          <div className={styles.textContent}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className={styles.heading}>{carouselData[currentSlide].title}</h2>
                <p className={styles.bodyText}>{carouselData[currentSlide].body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.carouselDots}>
            {carouselData.map((_, idx) => (
              <div 
                key={idx} 
                className={`${styles.dot} ${idx === currentSlide ? styles.dotActive : ""}`} 
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Auth */}
        <div className={styles.authPanel}>
          <h1 className={styles.authHeading}>Create an<br/>account</h1>
          <p className={styles.authSubtext}>One account for all your news summaries</p>

          <motion.button 
            whileTap={{ scale: 0.97 }}
            className={styles.googleBtn}
            onClick={handleSignIn}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </motion.button>

          <div className={styles.divider}>— or sign up with —</div>

          <div className={styles.inputGroup}>
            <input 
              type="email" 
              placeholder="email" 
              className={styles.input} 
              readOnly 
              onClick={handleMockAction}
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
              type="password" 
              placeholder="password" 
              className={styles.input} 
              readOnly 
              onClick={handleMockAction}
            />
          </div>

          <motion.button 
            whileTap={{ scale: 0.97 }}
            className={styles.continueBtn}
            onClick={handleMockAction}
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
