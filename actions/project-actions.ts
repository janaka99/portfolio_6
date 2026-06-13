"use server";

import { revalidatePath } from "next/cache";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/lib/validations";
import prisma from "@/lib/prisma/prisma";

export async function createProject(formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      content: formData.get("content"),
      livelink: formData.get("livelink"),
      githublink: formData.get("githublink"),
      tags: formData.get("tags")
        ? JSON.parse(formData.get("tags") as string)
        : [],
      technologies: formData.get("technologies")
        ? JSON.parse(formData.get("technologies") as string)
        : [],
      images: formData.get("images")
        ? JSON.parse(formData.get("images") as string)
        : [],
      cover: formData.get("cover") || "", 
      order: Number(formData.get("order")) || 0,
      published: formData.get("published") === "true",
    };

    const validatedData = createProjectSchema.parse(rawData);

    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        livelink: validatedData.livelink,
        githublink: validatedData.githublink,
        tags: validatedData.tags,
        technologies: validatedData.technologies,
        images: validatedData.images,
        cover: validatedData.cover,
        order: validatedData.order,
        published: validatedData.published,
      },
    });

    revalidatePath("/admin");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(formData: FormData) {
  try {
    const projectId = formData.get("id") as string;

    const rawData = {
      id: projectId,
      title: formData.get("title"),
      description: formData.get("description"),
      content: formData.get("content"),
      livelink: formData.get("livelink"),
      githublink: formData.get("githublink"),
      tags: formData.get("tags")
        ? JSON.parse(formData.get("tags") as string)
        : [],
      technologies: formData.get("technologies")
        ? JSON.parse(formData.get("technologies") as string)
        : [],
      images: formData.get("images")
        ? JSON.parse(formData.get("images") as string)
        : [],
      cover: formData.get("cover") || "", 
      order: Number(formData.get("order")) || 0,
      published: formData.get("published") === "true",
    };

    const validatedData = updateProjectSchema.parse(rawData);

    const project = await prisma.project.update({
      where: { id: parseInt(validatedData.id) },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        livelink: validatedData.livelink,
        githublink: validatedData.githublink,
        tags: validatedData.tags,
        technologies: validatedData.technologies,
        images: validatedData.images,
        cover: validatedData.cover,
        order: validatedData.order,
        published: validatedData.published,
      },
    });

    revalidatePath("/admin");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({ where: { id: parseInt(projectId) } });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return projects;
  } catch (error) {
    return [];
  }
}

export async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    return project;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export async function reorderProjects(orderedIds: number[]) {
  try {
    // Update each project's order based on its index in the array
    const updates = orderedIds.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { order: index },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder projects:", error);
    return { success: false, error: "Failed to reorder projects" };
  }
}
