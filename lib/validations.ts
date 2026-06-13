import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  content: z.string().optional(),
  livelink: z.string().url("Invalid URL").optional().or(z.literal("")),
  githublink: z.string().url("Invalid URL").optional().or(z.literal("")),
  tags: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  cover: z.string().optional().or(z.literal("")),
  images: z.array(z.string()).optional().default([]),
  order: z.number().default(0),
  published: z.boolean().default(false),
});

export const createProjectSchema = projectSchema;
export const updateProjectSchema = projectSchema.extend({
  id: z.string().min(1, "Project ID is required"),
});

export type Project = z.infer<typeof projectSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
