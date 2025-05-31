"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { extractPdfText } from "@/actions/train-chatbot-action";

// Client-side validation schema
const formSchema = z.object({
  file: z
    .custom<FileList>((val) => val instanceof FileList, {
      message: "Expected a PDF File",
    })
    .refine((files) => files.length === 1, "Please select a file")
    .refine(
      (files) => files[0]?.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine(
      (files) => files[0]?.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function ChatbotFileUploadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true);
      setError(null);

      const file = data.file[0];
      const formData = new FormData();
      formData.append("file", file);

      const result = await extractPdfText(formData);
      if (result.success) {
        toast("Chat bot has been successfully trained");
        form.reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        // @ts-ignore
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ref, ...rest } }) => (
              <FormItem>
                <FormLabel>PDF File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => onChange(e.target.files)}
                    disabled={isLoading}
                    ref={(el) => {
                      fileInputRef.current = el;
                      ref(el); // forward to React Hook Form
                    }}
                    {...rest}
                    className="cursor-pointer"
                  />
                </FormControl>
                <FormDescription>Upload a PDF file (max 10MB)</FormDescription>
                <FormDescription>
                  When train your chat bot all the past data will be erased
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="darkBlue" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Train Chat Bot
              </>
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
