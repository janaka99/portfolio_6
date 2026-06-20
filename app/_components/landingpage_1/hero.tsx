"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { SOCIAL_MEDIA } from "@/constants";

/* ---------- Magnetic cursor blob ---------- */
function CursorBlob() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 200);
      y.set(e.clientY - 200);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-0 h-[400px] w-[400px] rounded-full"
      style={{
        left: springX,
        top: springY,
        background:
          "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.08) 50%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

/* ---------- Animated counter ---------- */
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = value / 40;
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setDisplay(value);
              clearInterval(timer);
            } else {
              setDisplay(Math.floor(start));
            }
          }, 40);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      {display}
      {suffix}
    </div>
  );
}

/* ---------- 3D Tilt Glass Stat Card ---------- */
function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setRotateX(-dy * 12);
    setRotateY(dx * 12);
    setGlare({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const reset = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare({ x: 50, y: 50 });
  };

  return (
    <div
      className="relative cursor-default"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      <div
        className="relative rounded-2xl overflow-hidden text-center px-6 py-5"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glare overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
          }}
        />
        {/* Inner content (elevated) */}
        <div style={{ transform: "translateZ(20px)" }}>
          <div className="text-2xl font-black text-white tabular-nums">
            <Counter value={value} suffix={suffix} />
          </div>
          <div className="font-mono text-[9px] text-white/40 uppercase tracking-widest mt-1">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Letter split animation ---------- */
function SplitWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <>
      {word.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: delay + i * 0.035,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </>
  );
}

/* ---------- Floating 3D glass card (decorative) ---------- */
function FloatingCodeCard() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [0, 1, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="hidden lg:block absolute right-16 top-1/3 -translate-y-1/2 z-10"
      style={{ perspective: "600px" }}
    >
      <div
        className="rounded-2xl px-6 py-5 font-mono text-xs min-w-[240px]"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.6), 0 4px 16px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.12)",
          transform: "rotateY(-8deg) rotateX(4deg)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div>
            <span className="text-violet-400">const</span>{" "}
            <span className="text-cyan-400">engineer</span>{" "}
            <span className="text-white/50">= {"{"}</span>
          </div>
          <div className="pl-4">
            <span className="text-pink-400">role</span>
            <span className="text-white/50">: </span>
            <span className="text-emerald-400">"Full-Stack + AI"</span>
            <span className="text-white/50">,</span>
          </div>
          <div className="pl-4">
            <span className="text-pink-400">stack</span>
            <span className="text-white/50">: </span>
            <span className="text-emerald-400">"Next · LangGraph"</span>
            <span className="text-white/50">,</span>
          </div>
          <div className="pl-4">
            <span className="text-pink-400">status</span>
            <span className="text-white/50">: </span>
            <span className="text-emerald-400">"available"</span>
          </div>
          <div className="text-white/50">{"}"}</div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-1.5 h-3.5 bg-violet-400 ml-0.5 mt-2 align-middle"
        />
      </div>
    </motion.div>
  );
}

const STATS = [
  { value: 2, suffix: "+", label: "Yrs Experience" },
  { value: 30, suffix: "+", label: "Projects Shipped" },
  { value: 15, suffix: "+", label: "Tech Stack" },
];

export default function HeroLP1() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050505]">
      <CursorBlob />

      {/* Deep ambient glows – layered for depth */}
      <div className="pointer-events-none absolute -top-60 -left-40 h-[700px] w-[700px] rounded-full bg-violet-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[550px] w-[550px] rounded-full bg-pink-600/8 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-600/6 blur-[100px]" />

      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px",
        }}
      />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#050505] to-transparent z-[2]" />

      {/* Floating decorative card */}
      <FloatingCodeCard />

      {/* ── CONTENT ── */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-36 pb-24">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: "rgba(139,92,246,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(139,92,246,0.2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="font-mono text-xs text-violet-300/80 uppercase tracking-widest">
              Available for opportunities
            </span>
          </motion.div>

          {/* Giant headline */}
          <div className="overflow-hidden mb-2">
            <h1 className="font-black leading-[0.85] tracking-tighter text-foreground">
              <div className="text-[15vw] sm:text-[12vw] lg:text-[9.5rem] overflow-hidden">
                <SplitWord word="Janaka" delay={0.2} />
              </div>
              <div className="text-[15vw] sm:text-[12vw] lg:text-[9.5rem] overflow-hidden">
                <SplitWord word="Chamith" delay={0.45} />
              </div>
            </h1>
          </div>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-10 mt-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-violet-500 to-pink-500" />
            <span className="font-mono text-sm text-muted-foreground uppercase tracking-[0.25em]">
              Full-Stack & AI Engineer
            </span>
          </motion.div>

          {/* Description + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg mb-10"
          >
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
              I craft{" "}
              <span className="text-foreground font-medium">intelligent, premium interfaces</span>{" "}
              at the intersection of agentic AI and modern full-stack engineering.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {/* Primary CTA — glass gradient */}
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold text-white cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899, #06b6d4)",
                  boxShadow: "0 4px 24px rgba(124,58,237,0.4), 0 1px 4px rgba(0,0,0,0.4)",
                }}
              >
                <span className="relative z-10">View My Work</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
              </motion.a>

              {/* Secondary CTA — glass */}
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                Get in Touch
              </motion.a>
            </div>
          </motion.div>

          {/* 3D Glass Stat Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            {STATS.map((s, i) => (
              <StatCard key={i} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            {[
              { href: SOCIAL_MEDIA.github, Icon: Github, label: "GitHub" },
              { href: SOCIAL_MEDIA.linkedin, Icon: Linkedin, label: "LinkedIn" },
              { href: SOCIAL_MEDIA.x, Icon: Twitter, label: "X" },
            ].map(({ href, Icon, label }) => (
              <Link key={label} href={href} target="_blank" rel="noopener noreferrer">
                <motion.div
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-violet-400 transition-colors duration-200 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.3em]">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-violet-500/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
