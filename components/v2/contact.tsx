"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AtSign, Mail, MapPin, Phone, Send, ArrowRight, Bot, Loader2 } from "lucide-react";
import { SOCIAL_MEDIA } from "@/constants";
import { sendContactEmail } from "@/actions/contact-action";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "janakachamith99@gmail.com",
    href: "mailto:janakachamith99@gmail.com",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+94 (76) 766-1535",
    href: "tel:+94767661535",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Walapane, Sri Lanka",
    href: null,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: AtSign,
    label: "Social",
    value: "LinkedIn · GitHub · X",
    href: SOCIAL_MEDIA.linkedin,
    gradient: "from-orange-500 to-amber-500",
  },
];

// 3D grid perspective floor component (pure CSS)
function PerspectiveGrid() {
  return (
    <div
      className="absolute bottom-0 left-0 w-full h-64 pointer-events-none overflow-hidden"
      style={{ perspective: "600px" }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[200%] opacity-[0.06]"
        style={{
          transform: "rotateX(60deg)",
          transformOrigin: "bottom center",
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Fade overlay at top of grid */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#050505] to-transparent" />
    </div>
  );
}

export default function ContactV2() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await sendContactEmail(form);
      if (result.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 5000);
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-[#050505] relative overflow-hidden">
      {/* 3D perspective grid floor */}
      <PerspectiveGrid />

      {/* Radial ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-900/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Get in Touch</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Let&apos;s Build
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Something.
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            Have a project in mind or want to discuss collaboration? Reach out directly or use the form.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            {CONTACT_INFO.map(({ icon: Icon, label, value, href, gradient }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 hover:border-border/70 hover:bg-card/40 transition-all duration-300"
                  >
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-sm text-foreground/80 truncate">{value}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/20">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-sm text-foreground/80">{value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* AI assistant CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="mt-4 p-5 rounded-2xl border border-purple-500/20 bg-purple-950/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium text-foreground">Try my AI assistant</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Ask my AI chatbot to send me a message — it will verify and deliver it directly to my inbox.
              </p>
              <span className="text-xs font-mono text-purple-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Always online · Human-verified delivery
              </span>
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm overflow-hidden p-7">
              {/* Top glow accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

              <h3 className="text-lg font-bold text-foreground mb-6">Send a Message</h3>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                    <Send className="h-7 w-7 text-emerald-400" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-1">Message sent!</p>
                  <p className="text-sm text-muted-foreground">I&apos;ll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full h-10 px-3.5 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full h-10 px-3.5 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="What are you working on?"
                      className="w-full px-3.5 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm text-white shadow-lg shadow-purple-900/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)" }}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {loading ? "Sending..." : "Send Message"}
                  </motion.button>
                  {error && (
                    <p className="text-red-400 text-sm text-center mt-3">{error}</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
