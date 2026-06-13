"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2, Upload, Trash2, Brain, FileText, Type, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import {
  extractPdfText,
  trainFromText,
  getKnowledgeBaseStats,
  clearKnowledgeBase,
} from "@/actions/train-chatbot-action";

export function KnowledgeTrainingPanel() {
  const [isPending, startTransition] = useTransition();

  // Stats
  const [stats, setStats] = useState<{
    count: number;
    latestChunk: string | null;
    latestDate: Date | null;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // PDF upload
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Text input
  const [textContent, setTextContent] = useState("");
  const [textLabel, setTextLabel] = useState("");

  // Feedback
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clear dialog
  const [clearOpen, setClearOpen] = useState(false);

  const loadStats = async () => {
    setStatsLoading(true);
    const s = await getKnowledgeBaseStats();
    setStats({
      count: s.count,
      latestChunk: s.latestChunk ?? null,
      latestDate: s.latestDate ?? null,
    });
    setStatsLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handlePdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;
    setMessage(null);
    const formData = new FormData();
    formData.append("file", pdfFile);

    startTransition(async () => {
      const result = await extractPdfText(formData);
      if (result.success) {
        toast.success(result.message);
        setMessage({ type: "success", text: result.message });
        setPdfFile(null);
        await loadStats();
      } else {
        setMessage({ type: "error", text: result.error });
        toast.error(result.error);
      }
    });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) return;
    setMessage(null);

    startTransition(async () => {
      const result = await trainFromText(textContent, textLabel || undefined);
      if (result.success) {
        toast.success(result.message);
        setMessage({ type: "success", text: result.message });
        setTextContent("");
        setTextLabel("");
        await loadStats();
      } else {
        setMessage({ type: "error", text: result.error });
        toast.error(result.error);
      }
    });
  };

  const handleClear = () => {
    startTransition(async () => {
      const result = await clearKnowledgeBase();
      if (result.success) {
        toast.success("Knowledge base cleared.");
        setClearOpen(false);
        await loadStats();
      } else {
        toast.error("Failed to clear knowledge base.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex items-center gap-4 p-4 bg-card/40 rounded-lg border border-border/40">
        <Brain className="h-5 w-5 text-blue-600" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Knowledge Base</span>
            {statsLoading ? (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            ) : (
              <Badge variant={stats?.count ? "default" : "secondary"}>
                {stats?.count ?? 0} chunks stored
              </Badge>
            )}
          </div>
          {stats?.latestChunk && (
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">
              Latest: "{stats.latestChunk}"
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={loadStats} disabled={statsLoading}>
            <RefreshCw className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setClearOpen(true)}
            disabled={isPending || !stats?.count}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Training Tabs */}
      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">
            <Type className="h-4 w-4 mr-2" />
            Add Text
          </TabsTrigger>
          <TabsTrigger value="pdf">
            <FileText className="h-4 w-4 mr-2" />
            Upload PDF
          </TabsTrigger>
        </TabsList>

        {/* Text Input Tab */}
        <TabsContent value="text">
          <form onSubmit={handleTextSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="label">Label (optional)</Label>
              <Input
                id="label"
                placeholder="e.g. Work Experience, Skills, Education"
                value={textLabel}
                onChange={(e) => setTextLabel(e.target.value)}
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                A short label to identify what this content is about.
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">Knowledge Content</Label>
              <Textarea
                id="content"
                placeholder="Paste or type your information here...

Example:
Janaka Chamith is a Senior Software Engineer with 5+ years of experience specializing in React, Next.js, and Node.js. He has worked at XYZ company as a Lead Engineer where he architected a microservices platform serving 500k users..."
                className="min-h-[220px] font-mono text-sm"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                This content will be chunked, embedded with OpenAI, and stored in MongoDB.
                New entries are appended — existing data is preserved.
              </p>
            </div>
            <Button type="submit" disabled={isPending || !textContent.trim()} variant="darkBlue">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Embedding...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Add to Knowledge Base
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        {/* PDF Upload Tab */}
        <TabsContent value="pdf">
          <form onSubmit={handlePdfSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="pdf">PDF File</Label>
              <Input
                id="pdf"
                type="file"
                accept=".pdf,application/pdf"
                disabled={isPending}
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Max 10MB. ⚠️ Uploading a PDF will{" "}
                <strong>replace all existing knowledge base data</strong>.
              </p>
            </div>
            {pdfFile && (
              <p className="text-sm text-muted-foreground">
                Selected: <strong>{pdfFile.name}</strong> ({(pdfFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
            <Button type="submit" disabled={isPending || !pdfFile} variant="darkBlue">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Training...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Train from PDF
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {/* Confirm Clear Dialog */}
      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear entire knowledge base?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {stats?.count} stored embeddings. The chatbot will
              have no knowledge until you re-train it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClear}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Clearing..." : "Clear All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
