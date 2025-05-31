// @ts-nocheck
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import ChatInterface from "./chat-interface";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Pulse animation that plays continuously
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgba(147, 51, 234, 0)",
      "0 0 0 10px rgba(147, 51, 234, 0.3)",
      "0 0 0 0 rgba(147, 51, 234, 0)",
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    },
  };

  // Hover animation
  const hoverAnimation = {
    scale: 1.1,
    boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
    transition: { duration: 0.3 },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && <ChatInterface onClose={() => setIsOpen(false)} />}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.button
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium shadow-lg"
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={isHovered ? hoverAnimation : pulseAnimation}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <Bot className="h-5 w-5" />
          </motion.div>
          <span>Ask Janaka</span>
        </motion.button>
      </motion.div>
    </>
  );
}
