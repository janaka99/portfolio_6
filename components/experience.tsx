"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar } from "lucide-react";
import Container from "./layouts/container";

const experiences = [
  {
    title: "Associate Software Engineer ",
    company: "Artslab Creatives",
    period: "June/2024 - Present",
    description:
      "Leading the end-to-end development of full-stack, AI-powered applications for enterprise clients. Spearheading the integration of Large Language Models (LLMs) into web platforms, ensuring robust performance, scalability, and security. Building modern web applications using Next.js and Node.js, with a strong focus on full-stack architecture, responsive UI/UX, and efficient data flow across systems.",
    achievements: [
      "Collaborated with cross-functional teams to develop, test, and deploy high-quality, scalable software solutions for clients.",
      "Completed various full-stack development tasks in a team-oriented Agile environment, ensuring efficiency and continuous improvement.",
      "Developed and maintained databases, optimizing performance, security, and scalability while implementing user authentication and authorization mechanisms.",
      "Contributed to the design and implementation of a RESTful API, enhancing web application integration and management. ",
      "Integrated Generative AI and Large Language Models (LLMs) to build next-generation applications, enhancing automation, personalization, and efficiency.",
      "Actively participated in development meetings and continuous improvement initiatives, contributing to team growth and refining project delivery processes.",
      "Engaged in ongoing education to stay current with emerging technologies and best practices in full-stack development, including CI/CD, cloud technologies (AWS and GCP), artificial intelligence, and machine learning to enhance user experience and scalability.",
      "Built Retrieval-Augmented Generation (RAG) chatbots using LLMs and vector databases to deliver context-aware, intelligent responses in real-time applications.",
      "Worked with Three.js to create interactive 3D experiences on the web, bringing immersive and visually engaging elements to modern web applications.",
    ],
    skills: [
      "Next.js",
      "PostgreSQL",
      "Mongo DB",
      "LLMs",
      "Vector DB",
      "Node JS",
      "Express",
      "AWS",
      "GCP",
      "React.js",
      "UX/UI",
    ],
  },
  {
    title: "Freelance Software Engineer",
    company: "Freealnce",
    period: "2021 - Present",
    description:
      "Worked independently on a wide range of full-stack web and mobile projects using React.js, Node.js, and React Native. Designed and developed smart systems leveraging LLMs, including intelligent route suggestion engines and AI chatbots using RAG (Retrieval-Augmented Generation) techniques and vector databases. Also integrated Web3 solutions for crypto payment systems and built performant, accessible user interfaces.",
    achievements: [
      "Built and deployed full-stack applications using React.js and Node.js, focusing on scalable architecture and responsive design.",
      "Developed cross-platform mobile apps using React Native, ensuring high performance and smooth UX.",
      "Integrated Web3 technologies to enable secure crypto payments on client websites.",
      "Engineered smart systems powered by LLMs, including intelligent route suggestion platforms and AI chatbots using RAG pipelines with vector databases.",
      "Integrated crypto payment systems into web applications using Web3.js and MetaMask, enabling seamless blockchain transactions.",
      "Collaborated with clients to design and audit smart contracts for handling payments, subscriptions, and NFT-based access systems.",
      "Designed and developed custom WordPress websites for clients, focusing on performance, responsiveness, and user-friendly interfaces.",
      "Created and published SEO-optimized articles targeting niche keywords to boost organic traffic and domain authority.",
      "Integrated SEO best practices into web development workflows to ensure long-term visibility and search engine performance.",
    ],
    skills: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Mongo DB",
      "MySQL",
      "PostgreSQL",
      "Solidity",
      "Next.js",
      "PostgreSQL",
      "React Native",
      "GraphQL",
      "Vector DB",
      "Wordpress",
    ],
  },
];

export default function Experience() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  return (
    <section
      id="experience"
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
            Professional Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My journey through the tech industry, specializing in AI and
            frontend development
          </p>
        </motion.div>

        <div className="relative" ref={containerRef}>
          {/* Timeline line container */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-muted rounded-full hidden md:block" />

          {/* Animated fill line that grows as you scroll */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full origin-top hidden md:block"
            style={{
              scaleY: scrollYProgress,
              height: "100%",
              transformOrigin: "top",
            }}
          />

          <div className="space-y-12 hidden md:block">
            {experiences.map((exp, index) => {
              const left = index % 2 === 0;

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center"
                >
                  {/* Left side experience */}
                  {index % 2 === 0 && (
                    <motion.div
                      className="md:w-1/2 md:pr-12 text-left md:text-right"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <ExperienceCard experience={exp} index={index} />
                    </motion.div>
                  )}

                  {/* Right side experience */}
                  {index % 2 === 1 && (
                    <motion.div
                      className="md:w-1/2 translate-x-full md:pl-12 text-left"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <ExperienceCard experience={exp} index={index} />
                    </motion.div>
                  )}

                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`hidden md:flex items-center justify-center  z-10 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg ${
                      !left && "-translate-x-full"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-background" />
                  </motion.div>

                  {/* For mobile view, show all cards in a single column */}
                  <div className="md:hidden w-full">
                    <ExperienceCard experience={exp} index={index} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-12 md:hidden">
            {experiences.map((exp, index) => (
              <ExperienceCard experience={exp} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// Extracted Experience Card component for reusability
interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
}

function ExperienceCard({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden md:block">
      <div
        className={`h-2 bg-gradient-to-r ${
          index % 2 === 0
            ? "from-purple-500 to-pink-500"
            : "from-blue-500 to-cyan-500"
        }`}
      />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between mt-5">
          <span className="">{experience.title}</span>
          <Badge variant="outline" className="font-normal">
            <Calendar className="h-3 w-3 mr-1" />
            {experience.period}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Building className="h-4 w-4" />
          {experience.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <p className="mb-4 text-start">{experience.description}</p>
        <h4 className="font-semibold mb-2 text-start">Key Achievements:</h4>
        <ul className="space-y-1 mb-4 text-start">
          {experience.achievements.map((achievement, idx) => (
            <li key={idx} className="text-sm">
              • {achievement}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          {experience.skills.map((skill, idx) => (
            <Badge key={idx} variant="secondary" className="font-normal">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
