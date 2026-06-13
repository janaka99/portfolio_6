import ChatButton from "@/components/chatbot/chat-button";
import Footer from "@/components/footer";
import prisma from "@/lib/prisma/prisma";

// v2 redesigned sections
import HeroV2 from "@/components/v2/hero";
import SkillsBar from "@/components/v2/skills-bar";
import ProjectsV2 from "@/components/v2/projects";
import ExperienceV2 from "@/components/v2/experience";
import ContactV2 from "@/components/v2/contact";

export default async function Page() {
  // Fetch projects for the "Selected Work" section
  const dbProjectsRaw = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const dbProjects = dbProjectsRaw.map((p) => ({
    title: p.title,
    desc: p.description || "",
    image: p.cover || p.images?.[0] || "",
    techstack: p.technologies || [],
    git: p.githublink || "",
    link: p.livelink || null,
    category: p.category || "AI",
  }));

  return (
    <>
      <HeroV2 />
      <SkillsBar />
      <ProjectsV2 dbProjects={dbProjects} />
      <ExperienceV2 />
      <ContactV2 />
      <Footer />
      <ChatButton />
    </>
  );
}
