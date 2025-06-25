"use server";

import { revalidatePath } from "next/cache";
import {
  createProjectSchema,
  updateProjectSchema,
  type Project,
} from "@/lib/validations";
import prisma from "@/lib/prisma/prisma";

// Mock database - replace with your actual database queries
let projects: Project[] = [];

export async function createProject(formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      livelink: formData.get("livelink"),
      githublink: formData.get("githublink"),
      tags: formData.get("tags")
        ? JSON.parse(formData.get("tags") as string)
        : [],
      cover: formData.get("cover"), // This will be the UploadThing URL
      published: formData.get("published") === "true",
    };

    const validatedData = createProjectSchema.parse(rawData);

    // TODO: Replace with actual database query
    // const project = await db.project.create({
    //   data: validatedData
    // })

    const newProject = {
      ...validatedData,
    };

    await prisma.project.create({
      data: newProject,
    });

    revalidatePath("/dashboard");
    return { success: true, project: newProject };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(formData: FormData) {
  try {
    const projectId = formData.get("id") as string;

    // Find existing project
    const existingProject = projects.find((p) => p.id === projectId);
    if (!existingProject) {
      return { success: false, error: "Project not found" };
    }

    const coverUrl = formData.get("cover") as string;

    const rawData = {
      id: projectId,
      title: formData.get("title"),
      description: formData.get("description"),
      livelink: formData.get("livelink"),
      githublink: formData.get("githublink"),
      tags: formData.get("tags")
        ? JSON.parse(formData.get("tags") as string)
        : [],
      cover: coverUrl || existingProject.cover, // Use new URL or keep existing
      published: formData.get("published") === "true",
    };

    const validatedData = updateProjectSchema.parse(rawData);

    // TODO: Replace with actual database query
    // const project = await db.project.update({
    //   where: { id: validatedData.id },
    //   data: validatedData
    // })

    const projectIndex = projects.findIndex((p) => p.id === validatedData.id);
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...validatedData,
      updatedAt: new Date(),
    };

    revalidatePath("/dashboard");
    return { success: true, project: projects[projectIndex] };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({ where: { id: parseInt(projectId) } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
      },
    });
    return projects;
  } catch (error) {
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    // TODO: Replace with actual database query
    // const project = await db.project.findUnique({
    //   where: { id }
    // })

    return projects.find((p) => p.id === id) || null;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}
