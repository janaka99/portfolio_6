"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from "@ai-sdk/react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface({ onClose }: { onClose: () => void }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-50 w-full max-w-md bg-background border rounded-xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="Janaka AI"
            />
            <AvatarFallback className="bg-purple-700">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">Janaka AI</h3>
            <p className="text-xs text-white/80">
              Ask me anything about Janaka
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <ScrollArea className="h-80 p-4">
        <div className="space-y-4">
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%] flex-row ">
              <Avatar
                className={`h-8 w-8 "bg-purple-600
                  }`}
              >
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className={`rounded-lg px-4 py-2 bg-muted`}>
                <p className="text-sm">
                  Hi there! I'm Janaka's AI assistant. How can I help you learn
                  more about Janaka's work and experience?
                </p>
              </div>
            </div>
          </div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar
                  className={`h-8 w-8 ${
                    message.role === "user" ? "bg-blue-500" : "bg-purple-600"
                  }`}
                >
                  <AvatarFallback>
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8 bg-purple-600">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          placeholder="Ask about Janaka's experience, projects, or skills..."
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </motion.div>
  );
}
