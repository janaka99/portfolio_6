"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Github,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";
import { type Project } from "@/lib/validations";
import { deleteProject, getProjects, reorderProjects } from "@/actions/project-actions";
import { ProjectForm } from "./project-form";

export function ProjectDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchTech, setSearchTech] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | undefined>();
  const [deletingProject, setDeletingProject] = useState<any | undefined>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (!searchTech.trim()) {
      setFilteredProjects(projects);
    } else {
      const lowerSearch = searchTech.toLowerCase();
      const filtered = projects.filter((p) =>
        p.technologies.some((tech: string) =>
          tech.toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredProjects(filtered);
    }
  }, [searchTech, projects]);

  const loadProjects = async () => {
    const fetchedProjects = await getProjects();
    setProjects(fetchedProjects);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
  };

  const confirmDelete = () => {
    if (!deletingProject) return;

    startTransition(async () => {
      const result = await deleteProject(deletingProject.id.toString());

      if (result.success) {
        toast.success("Project deleted successfully!");
        await loadProjects();
      } else {
        toast.error(result.error || "Failed to delete project");
      }

      setDeletingProject(undefined);
    });
  };

  const handleFormClose = async (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingProject(undefined);
      await loadProjects();
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...filteredProjects];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    saveOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === filteredProjects.length - 1) return;
    const newOrder = [...filteredProjects];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    saveOrder(newOrder);
  };

  const saveOrder = (reorderedProjects: any[]) => {
    setFilteredProjects(reorderedProjects); // Optimistic UI update
    startTransition(async () => {
      const orderedIds = reorderedProjects.map((p) => p.id);
      const result = await reorderProjects(orderedIds);
      if (result.success) {
        await loadProjects();
      } else {
        toast.error(result.error || "Failed to save order");
        await loadProjects(); // Revert on failure
      }
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by technology..."
            className="pl-8 w-full"
            value={searchTech}
            onChange={(e) => setSearchTech(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add New Project
        </Button>
      </div>

      <div className="border border-border/40 rounded-md bg-card/40 overflow-hidden backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Technologies</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project, index) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 disabled:opacity-50"
                        onClick={() => moveUp(index)}
                        disabled={index === 0 || isPending || !!searchTech}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 disabled:opacity-50"
                        onClick={() => moveDown(index)}
                        disabled={index === filteredProjects.length - 1 || isPending || !!searchTech}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted hidden sm:block">
                        <Image
                          src={project.cover || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {project.livelink && (
                            <a
                              href={project.livelink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Live
                            </a>
                          )}
                          {project.githublink && (
                            <a
                              href={project.githublink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center hover:underline"
                            >
                              <Github className="h-3 w-3 mr-1" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies?.slice(0, 3).map((tech: string) => (
                        <Badge key={tech} variant="outline" className="text-xs font-normal">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies?.length > 3 && (
                        <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={project.published ? "default" : "secondary"}>
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProjectForm
        project={editingProject}
        open={isFormOpen}
        onOpenChange={handleFormClose}
      />

      <AlertDialog
        open={!!deletingProject}
        onOpenChange={() => setDeletingProject(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project "{deletingProject?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
