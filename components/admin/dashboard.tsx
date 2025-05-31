"use client";

import { useState } from "react";
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
import { ChatbotFileUploadForm } from "../chatbot/chatbot-file-upload-form";

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

      <Container className="container py-6">
        <Tabs
          defaultValue="chatbot"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">chatbot</h2>
              <Button variant="darkBlue">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="grid gap-4">
              <ChatbotFileUploadForm />
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
