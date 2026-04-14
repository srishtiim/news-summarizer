"use client";
import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ rotateY: 180, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // cubic-bezier mimicking flip
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      className="min-h-screen origin-left"
    >
      {children}
    </motion.div>
  );
}
