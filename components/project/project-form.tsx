"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { projectSchema, type Project } from "@/lib/validations";
import { toast } from "sonner";
import { createProject, updateProject } from "@/actions/project-actions";
import { UploadThingUploader } from "./upload-thing-uploader";
import { MultiUploadThingUploader } from "./multi-upload-thing-uploader";

interface ProjectFormProps {
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectForm({ project, open, onOpenChange }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      content: project?.content || "",
      livelink: project?.livelink || "",
      githublink: project?.githublink || "",
      tags: project?.tags || [],
      technologies: project?.technologies || [],
      cover: project?.cover || "",
      images: project?.images || [],
      order: project?.order || 0,
      published: project?.published || false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: project?.title || "",
        description: project?.description || "",
        content: project?.content || "",
        livelink: project?.livelink || "",
        githublink: project?.githublink || "",
        tags: project?.tags || [],
        technologies: project?.technologies || [],
        cover: project?.cover || "",
        images: project?.images || [],
        order: project?.order || 0,
        published: project?.published || false,
      });
    }
  }, [project, open, form]);

  const addTag = () => {
    const currentTags = form.getValues("tags") || [];
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const addTech = () => {
    const currentTechs = form.getValues("technologies") || [];
    if (techInput.trim() && !currentTechs.includes(techInput.trim())) {
      form.setValue("technologies", [...currentTechs, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTech = (techToRemove: string) => {
    const currentTechs = form.getValues("technologies") || [];
    form.setValue(
      "technologies",
      currentTechs.filter((tech) => tech !== techToRemove)
    );
  };

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const formData = new FormData();

      if (project) {
        formData.append("id", project.id);
      }

      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("content", data.content || "");
      formData.append("livelink", data.livelink || "");
      formData.append("githublink", data.githublink || "");
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("technologies", JSON.stringify(data.technologies));
      formData.append("cover", data.cover);
      formData.append("images", JSON.stringify(data.images));
      formData.append("order", data.order.toString());
      formData.append("published", data.published.toString());

      const result = project
        ? await updateProject(formData)
        : await createProject(formData);

      if (result.success) {
        toast.success(
          project
            ? "Project updated successfully!"
            : "Project created successfully!"
        );
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Update your detailed project case study."
              : "Add a new detailed project to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief overview of the project"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Use Case (Markdown)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="# Problem&#10;&#10;# Architecture&#10;&#10;# Outcomes"
                      className="min-h-[250px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a detailed case study highlighting your senior-level
                    impact.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="livelink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-project.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githublink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/user/repo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <UploadThingUploader
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                        onRemove={() => field.onChange("")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Images</FormLabel>
                    <FormControl>
                      <MultiUploadThingUploader
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. Next.js, Postgres"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTech();
                            }
                          }}
                        />
                        <Button type="button" onClick={addTech} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                      {(field.value || []).map((tech) => (
                          <Badge
                            key={tech}
                            variant="default"
                            className="flex items-center gap-1"
                          >
                            {tech}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeTech(tech)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                      {(field.value || []).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <FormDescription>
                      Make this project visible to the public
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : project
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
