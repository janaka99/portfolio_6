import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  livelink: z.string().url("Invalid URL").optional().or(z.literal("")),
  githublink: z.string().url("Invalid URL").optional().or(z.literal("")),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  cover: z
    .string()
    .url("Invalid cover image URL")
    .min(1, "Cover image is required"),
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
