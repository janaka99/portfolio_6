"use client";

import { Suspense, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, LogOut, Plus, Settings, Trash } from "lucide-react";
import Link from "next/link";
import Container from "../layouts/container";
import { KnowledgeTrainingPanel } from "../chatbot/chatbot-file-upload-form";
import { ProjectDashboard } from "../project/project-dashboard";

type User = {
  name?: string | null;
  email?: string | null;
};

export default function AdminDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("chatbot");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Container className="flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to site</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Portfolio Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Signed in as{" "}
              <span className="font-medium text-foreground">{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </Container>
      </header>

      <Container className="container py-6 border border-border/40 mt-20 bg-card/30 backdrop-blur-sm rounded-xl">
        <Tabs defaultValue="knowledge" className="space-y-4">
          <TabsList>
            <TabsTrigger value="knowledge">🧠 AI Knowledge</TabsTrigger>
            <TabsTrigger value="projects">📁 Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">AI Knowledge Base</h2>
                <p className="text-sm text-muted-foreground">
                  Train your portfolio chatbot with your personal information.
                </p>
              </div>
            </div>
            <div className="bg-card/40 p-6 rounded-lg border border-border/40">
              <KnowledgeTrainingPanel />
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Suspense fallback={<div>Loading projects...</div>}>
              <ProjectDashboard />
            </Suspense>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
