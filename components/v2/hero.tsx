"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, Github, Linkedin, X } from "lucide-react";
import Link from "next/link";
import { SOCIAL_MEDIA } from "@/constants";
import dynamic from "next/dynamic";

const SceneV2 = dynamic(() => import("@/components/ui/scene-v2"), {
  ssr: false,
});

const TYPEWRITER_LINES = [
  "> initializing portfolio.exe...",
  "> loading Janaka Chamith...",
  "> status: Software Engineer",
];

function Typewriter({ lines }: { lines: string[] }) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) {
      setDone(true);
      return;
    }
    if (currentChar < lines[currentLine].length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), 38);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDisplayed((prev) => [...prev, lines[currentLine]]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, 320);
    return () => clearTimeout(t);
  }, [currentChar, currentLine, lines]);

  return (
    <div className="font-mono text-sm text-emerald-400/80 space-y-1 mb-8">
      {displayed.map((line, i) => (
        <div key={i} className="opacity-70">
          {line}
        </div>
      ))}
      {currentLine < lines.length && (
        <div>
          {lines[currentLine].slice(0, currentChar)}
          <span className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 animate-pulse" />
        </div>
      )}
      {done && <div className="text-purple-400/80">&gt; ready.</div>}
    </div>
  );
}

export default function HeroV2() {
  const [typewriterDone, setTypewriterDone] = useState(false);

  useEffect(() => {
    // Estimate when typewriter finishes to reveal headline
    const totalChars = TYPEWRITER_LINES.reduce((acc, l) => acc + l.length, 0);
    const totalTime = totalChars * 38 + TYPEWRITER_LINES.length * 320 + 200;
    const t = setTimeout(() => setTypewriterDone(true), totalTime);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* 3D Scene */}
      <SceneV2 />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[1] bg-radial-gradient pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, #050505 80%)",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#050505] to-transparent z-[1] pointer-events-none" />

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center sm:items-start text-center sm:text-left">
          {/* Terminal typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typewriter lines={TYPEWRITER_LINES} />
          </motion.div>

          {/* Name label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: typewriterDone ? 1 : 0,
              y: typewriterDone ? 0 : 20,
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.3em] mb-3 block">
              Janaka Chamith · Full-Stack & AI Engineer
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: typewriterDone ? 1 : 0,
              y: typewriterDone ? 0 : 40,
            }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[13vw] sm:text-[9vw] md:text-[8rem] font-black leading-[0.88] tracking-tighter text-foreground mb-6">
              Software
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Engineer.
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: typewriterDone ? 1 : 0,
              y: typewriterDone ? 0 : 30,
            }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground font-light mb-10 max-w-xl leading-relaxed"
          >
            2+ years building full-stack apps — now blending them with{" "}
            <span className="text-purple-400">agentic AI</span> to create
            intelligent, premium interfaces.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: typewriterDone ? 1 : 0,
              y: typewriterDone ? 0 : 20,
            }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-5"
          >
            <a href="#projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-wide overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #9333ea, #ec4899, #06b6d4)",
                }}
              >
                <span className="relative z-10 text-white">View Projects</span>
                <ArrowDown className="relative z-10 h-4 w-4 text-white group-hover:translate-y-0.5 transition-transform" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              </motion.button>
            </a>

            <div className="flex gap-3 items-center">
              {[
                { href: SOCIAL_MEDIA.github, icon: Github, label: "GitHub" },
                {
                  href: SOCIAL_MEDIA.linkedin,
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                { href: SOCIAL_MEDIA.x, icon: X, label: "X" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      borderColor: "rgba(168,85,247,0.6)",
                    }}
                    className="h-11 w-11 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: typewriterDone ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-6 w-0.5 bg-gradient-to-b from-purple-500/60 to-transparent rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
