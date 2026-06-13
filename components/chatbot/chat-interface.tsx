"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  User,
  X,
  Loader2,
  Check,
  X as XIcon,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

// ─── HITL Types ───────────────────────────────────────────────────────────────
interface HITLInterrupt {
  type: "email_confirmation";
  threadId: string;
  pending: {
    visitorName: string;
    visitorEmail: string;
    message: string;
  };
  prompt: string;
}

// ─── HITL Confirmation Card ───────────────────────────────────────────────────
function EmailConfirmCard({
  interrupt,
  onConfirm,
  onCancel,
  isLoading,
}: {
  interrupt: HITLInterrupt;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const { pending } = interrupt;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full max-w-[95%] rounded-xl border border-purple-500/30 bg-[#0f0a1a] p-4 space-y-3 shadow-lg shadow-purple-900/20"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-purple-500/15 border border-purple-500/30">
          <Mail className="h-3.5 w-3.5 text-purple-400" />
        </div>
        <span className="text-sm font-medium text-purple-300">
          Ready to send your message
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-transparent" />

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-14 shrink-0 pt-0.5">
            Name
          </span>
          <span className="text-foreground/90 leading-snug">{pending.visitorName}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-14 shrink-0 pt-0.5">
            Email
          </span>
          <span className="text-foreground/90 leading-snug">{pending.visitorEmail}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-14 shrink-0 pt-0.5">
            Message
          </span>
          <span className="text-foreground/80 leading-snug italic">
            &ldquo;{pending.message}&rdquo;
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-transparent" />

      {/* Actions */}
      <div className="flex gap-2 pt-0.5">
        <Button
          size="sm"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 h-8 text-xs font-medium gap-1.5 bg-purple-600 hover:bg-purple-500 text-white border-0 shadow-md shadow-purple-900/30 transition-all"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          {isLoading ? "Sending…" : "Yes, send it"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-8 text-xs font-medium gap-1.5 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <XIcon className="h-3 w-3" />
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Typing Dots animation ────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Chat Interface ───────────────────────────────────────────────────────
export default function ChatInterface({ onClose }: { onClose: () => void }) {
  // Stable thread ID for this session (HITL + MemorySaver)
  const [threadId] = useState(
    () => `thread-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );

  // Pending HITL interrupt state
  const [pendingInterrupt, setPendingInterrupt] =
    useState<HITLInterrupt | null>(null);
  const [hitlLoading, setHitlLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: { threadId },
    // Custom fetch intercepts HITL interrupt responses BEFORE the AI SDK tries to
    // parse them as data-stream events. Without this, useChat would attempt to read
    // the interrupt JSON as SSE, fail, and set status to "error" — even though the
    // interrupt was handled correctly.
    fetch: async (url, init) => {
      const res = await fetch(url, init as RequestInit);
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await res.clone().json();
        if (
          data.type === "interrupt" &&
          data.data?.type === "email_confirmation"
        ) {
          setPendingInterrupt({
            ...data.data,
            threadId: data.threadId,
          });
          // Return an empty 200 so useChat ends cleanly without adding a blank message
          return new Response("", { status: 200 });
        }
      }
      return res;
    },
    onError: (error) => {
      console.error("[Chat] Error:", error);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingInterrupt]);

  // ─── HITL Handlers ─────────────────────────────────────────────────────────
  const handleHITLConfirm = useCallback(async () => {
    if (!pendingInterrupt) return;
    setHitlLoading(true);

    try {
      const response = await fetch("/api/chat/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: pendingInterrupt.threadId,
          resume: true,
        }),
      });

      if (response.ok) {
        // Read the streamed response and add as assistant message
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
          }
        }
        // Parse AI SDK data-stream format: lines prefixed with `0:` carry
        // JSON-encoded text tokens. Using JSON.parse handles all escape sequences
        // correctly (the previous slice(3,-1) approach was fragile).
        const assistantMsg =
          fullText
            .split("\n")
            .filter((line) => line.startsWith("0:"))
            .map((line) => {
              try {
                return JSON.parse(line.slice(2)) as string;
              } catch {
                return "";
              }
            })
            .join("") || "✅ Message sent to Janaka!";

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: assistantMsg,
          },
        ]);
      }
    } catch (error) {
      console.error("[HITL Confirm] Error:", error);
    } finally {
      setPendingInterrupt(null);
      setHitlLoading(false);
    }
  }, [pendingInterrupt, setMessages]);

  const handleHITLCancel = useCallback(async () => {
    if (!pendingInterrupt) return;
    setHitlLoading(true);

    try {
      await fetch("/api/chat/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: pendingInterrupt.threadId,
          resume: false,
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "No problem! I've cancelled the message. Is there anything else I can help you with?",
        },
      ]);
    } catch (error) {
      console.error("[HITL Cancel] Error:", error);
    } finally {
      setPendingInterrupt(null);
      setHitlLoading(false);
    }
  }, [pendingInterrupt, setMessages]);

  const isThinking = status === "submitted" || status === "streaming";

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-50 w-full max-w-md overflow-hidden rounded-2xl border border-border/50 bg-[#080808] shadow-2xl shadow-black/60"
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.92 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Header ── */}
      <div className="relative flex items-center justify-between px-4 py-3 overflow-hidden border-b border-border/40">
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 via-purple-900/40 to-transparent pointer-events-none" />
        {/* Glow top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/60 via-purple-400/30 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#080808]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-none">
              Janaka AI
            </h3>
            <p className="text-[11px] text-purple-300/70 mt-0.5">
              Always here to help
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="relative h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Messages ── */}
      <ScrollArea className="h-[58vh] px-4 py-4">
        <div className="space-y-4">
          {/* Welcome bubble */}
          <div className="flex justify-start">
            <div className="flex gap-2.5 max-w-[85%]">
              <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mt-0.5">
                <Bot className="h-3.5 w-3.5 text-purple-300" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 bg-muted/70 border border-border/30">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Hi there! I&apos;m Janaka&apos;s AI assistant. Ask me about
                  his experience, projects, or send him a message! 👋
                </p>
              </div>
            </div>
          </div>

          {/* Conversation messages */}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2.5 max-w-[88%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center mt-0.5 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 shadow-md shadow-purple-900/30"
                        : "bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-500/20"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-purple-300" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-tr-sm bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-md shadow-purple-900/30"
                        : "rounded-tl-sm bg-muted/70 border border-border/30 text-foreground/85"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const isInline = !match;
                          return !isInline && match ? (
                            <div className="my-2">
                              <SyntaxHighlighter
                                language={match[1]}
                                style={vscDarkPlus}
                                PreTag="div"
                                customStyle={{
                                  fontSize: "0.72rem",
                                  borderRadius: "0.5rem",
                                  margin: 0,
                                  background: "#0d0d0d",
                                  border: "1px solid #27272a",
                                }}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code
                              className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-purple-200"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        h1: ({ children }) => (
                          <h1 className="text-base font-bold mb-2 mt-3 first:mt-0 text-foreground">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-sm font-bold mb-1.5 mt-2.5 first:mt-0 text-foreground">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0 text-foreground/90">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-sm mb-2 last:mb-0 leading-relaxed">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="text-sm mb-2 pl-4 space-y-0.5 list-disc marker:text-purple-400">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="text-sm mb-2 pl-4 space-y-0.5 list-decimal marker:text-purple-400">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-sm leading-relaxed">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-purple-500/50 pl-3 py-0.5 my-2 text-muted-foreground text-sm italic">
                            {children}
                          </blockquote>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-foreground/80">{children}</em>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* HITL Interrupt Card */}
          {pendingInterrupt && (
            <div className="flex justify-start">
              <EmailConfirmCard
                interrupt={pendingInterrupt}
                onConfirm={handleHITLConfirm}
                onCancel={handleHITLCancel}
                isLoading={hitlLoading}
              />
            </div>
          )}

          {/* Typing / thinking indicator */}
          {isThinking && !pendingInterrupt && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-purple-300" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 bg-muted/70 border border-border/30 flex items-center">
                  <TypingDots />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="flex justify-start">
              <div className="flex gap-2.5 max-w-[80%]">
                <div className="h-7 w-7 shrink-0 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-red-400" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 bg-red-950/40 border border-red-500/20 text-sm text-red-300">
                  Something went wrong. Please try again.
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* ── Input ── */}
      <div className="px-4 py-3 border-t border-border/40 bg-[#080808]">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            placeholder="Ask about Janaka…"
            value={input}
            onChange={handleInputChange}
            disabled={isThinking || !!pendingInterrupt}
            className="flex-1 h-9 bg-muted/40 border-border/40 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-purple-500/40 focus-visible:border-purple-500/40 rounded-xl transition-all"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isThinking || !!pendingInterrupt || !input.trim()}
            className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border-0 shadow-md shadow-purple-900/30 disabled:opacity-40 transition-all"
          >
            {isThinking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
          AI can make mistakes · HITL-verified emails
        </p>
      </div>
    </motion.div>
  );
}
