"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Code,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Container from "./layouts/container";
const specializations = [
  {
    title: "AI Integration",
    description:
      "Seamlessly integrating artificial intelligence into applications to create intelligent, adaptive user experiences that solve real-world problems.",
    icon: <Brain className="h-10 w-10" />,
    color: "from-purple-600 to-fuchsia-500",
    highlights: [
      "Natural Language Processing",
      "Generative AI & LLMs",
      "Retrieval-Augmented Generation (RAG)",
      "AI-Driven Automation",
      "Agentic AI Solutions",
    ],
  },
  {
    title: "Full-Stack Development",
    description:
      "Building scalable, high-performance web applications from front-end to back-end with a focus on modern architecture, security, and seamless user experience.",
    icon: <Code className="h-10 w-10" />,
    color: "from-blue-500 to-cyan-500",
    highlights: [
      "User-Centered Architecture",
      "Performance & Scalability",
      "REST APIs & Authentication",
      "Database Design & Optimization",
    ],
  },
  {
    title: "Mobile Applications",
    description:
      "Creating cross-platform mobile experiences that are responsive, performant, and tailored for user engagement on the go.",
    icon: <Smartphone className="h-10 w-10" />,
    color: "from-indigo-500 to-sky-500",
    highlights: [
      "Cross-Platform Experiences",
      "Real-Time Engagement",
      "Mobile Accessibility",
      "User Retention Strategies",
    ],
  },
  // {
  //   title: "Web3 & Blockchain",
  //   description:
  //     "Integrating decentralized technologies into applications, enabling secure crypto payments and smart contract automation.",
  //   icon: <ShieldCheck className="h-10 w-10" />,
  //   color: "from-teal-500 to-emerald-500",
  //   highlights: [
  //     "Smart Contracts",
  //     "Crypto Payment Integration",
  //     "Web3 Development",
  //   ],
  // },
  // {
  //   title: "SEO & Content Strategy",
  //   description:
  //     "Optimizing websites and content to enhance visibility, improve search engine rankings, and drive organic traffic.",
  //   icon: <TrendingUp className="h-10 w-10" />,
  //   color: "from-green-500 to-lime-500",
  //   highlights: [
  //     "Organic Growth",
  //     "Audience Engagement",
  //     "Content Optimization",
  //     "Search Visibility",
  //   ],
  // },
  // {
  //   title: "Innovation Strategy",
  //   description:
  //     "Developing forward-thinking strategies that leverage cutting-edge technologies to create competitive advantages and drive business growth.",
  //   icon: <Lightbulb className="h-10 w-10" />,
  //   color: "from-amber-500 to-orange-500",
  //   highlights: [
  //     "Vision-Led Planning",
  //     "Tech-Driven Growth",
  //     "Value-Centered Design",
  //     "Agile Innovation",
  //   ],
  // },
];

export default function Specializations() {
  return (
    <section
      id="specializations"
      className="py-20 bg-gradient-to-b from-background via-background/90 to-background"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-custom-dark-blue">
            My Specializations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Focused on creating intelligent, interactive experiences at the
            intersection of AI and design
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specializations.map((specialization, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div
                  className={`h-2 bg-gradient-to-r ${specialization.color}`}
                />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-r ${specialization.color} text-white transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      {specialization.icon}
                    </div>
                    <Sparkles className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardTitle className="text-2xl mt-4">
                    {specialization.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    {specialization.description}
                  </p>
                  <div className="space-y-3">
                    {specialization.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className={`p-1 rounded-full bg-gradient-to-r ${specialization.color} text-white flex items-center justify-center`}
                        >
                          <Zap className="h-3 w-3" />
                        </div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Card className="border-none shadow-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Rocket className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Ready to innovate?</h3>
                  <p className="text-muted-foreground">
                    Let's create something amazing together
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Start a Project
                  <Zap className="h-4 w-4" />
                </a>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
