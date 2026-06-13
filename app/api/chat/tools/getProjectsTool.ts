/**
 * Tool: getProjects
 *
 * Fetches live portfolio project data from the Prisma/PostgreSQL database.
 * Returns structured project info: title, description, technologies, links.
 *
 * Features:
 * - Optional technology filter (e.g., "React", "Python", "Next.js")
 * - Results ordered by the admin-configured `order` field
 * - Only returns published projects
 *
 * Flow:
 *   orchestrator calls tool with optional technology filter
 *     → Prisma queries PostgreSQL
 *     → returns formatted project list
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import prisma from "@/lib/prisma/prisma";

export const getProjectsTool = tool(
  async ({ technology }: { technology?: string }) => {
    try {
      const projects = await prisma.project.findMany({
        where: {
          published: true,
          ...(technology
            ? {
                technologies: {
                  has: technology,
                },
              }
            : {}),
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          technologies: true,
          livelink: true,
          githublink: true,
          tags: true,
        },
      });

      if (!projects || projects.length === 0) {
        return technology
          ? `No published projects found using ${technology}. Janaka may have other projects not listed here.`
          : "No published projects found at this time.";
      }

      const formatted = projects
        .map((p, i) => {
          const techs = p.technologies.join(", ");
          const live = p.livelink ? `Live: ${p.livelink}` : null;
          const github = p.githublink ? `GitHub: ${p.githublink}` : null;
          const links = [live, github].filter(Boolean).join(" | ");
          return [
            `### ${i + 1}. ${p.title}`,
            p.description ? p.description : null,
            techs ? `**Tech Stack**: ${techs}` : null,
            links ? links : null,
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n\n");

      return `Found ${projects.length} project(s):\n\n${formatted}`;
    } catch (error) {
      console.error("[getProjects] Error:", error);
      return "I encountered an error while fetching project data.";
    }
  },
  {
    name: "getProjects",
    description:
      "Fetch Janaka's live portfolio projects from the database. Call this when asked about his projects, portfolio work, or what he has built. Optionally filter by a specific technology.",
    schema: z.object({
      technology: z
        .string()
        .optional()
        .describe(
          "Optional technology to filter by (e.g., 'React', 'Next.js', 'Python', 'TypeScript'). Leave empty to return all projects."
        ),
    }),
  }
);
