import ChatButton from "@/components/chatbot/chat-button";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Container from "@/components/layouts/container";
import Projects from "@/components/projects";
import Specializations from "@/components/specializations";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function page() {
  return (
    <>
      <Hero />
      <Specializations />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
      <ChatButton />
    </>
  );
}
