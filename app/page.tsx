import prisma from "@/lib/prisma/prisma";
import ChatButton from "@/components/chatbot/chat-button";

// ─── landingpage_1 — new redesign (active) ───────────────────────────────────
import NavbarLP1 from "@/app/_components/landingpage_1/navbar";
import HeroLP1 from "@/app/_components/landingpage_1/hero";
import SkillsLP1 from "@/app/_components/landingpage_1/skills";
import AboutLP1 from "@/app/_components/landingpage_1/about";
import ProjectsLP1 from "@/app/_components/landingpage_1/projects";
import ExperienceLP1 from "@/app/_components/landingpage_1/experience";
import ArchivedLP1 from "@/app/_components/landingpage_1/archived";
import ContactLP1 from "@/app/_components/landingpage_1/contact";
import FooterLP1 from "@/app/_components/landingpage_1/footer";

// ─── v2 backup (kept for reference) ─────────────────────────────────────────
// import HeroV2 from "@/components/v2/hero";
// import SkillsBar from "@/components/v2/skills-bar";
// import ProjectsV2 from "@/components/v2/projects";
// import ExperienceV2 from "@/components/v2/experience";
// import ContactV2 from "@/components/v2/contact";
// import Footer from "@/components/footer";

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
      <NavbarLP1 />
      <HeroLP1 />
      <SkillsLP1 />
      <AboutLP1 />
      <ProjectsLP1 dbProjects={dbProjects} />
      <ExperienceLP1 />
      <ArchivedLP1 />
      <ContactLP1 />
      <FooterLP1 />
      <ChatButton />
    </>
  );
}
