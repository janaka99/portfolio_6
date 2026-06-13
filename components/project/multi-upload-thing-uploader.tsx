"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/lib/uploadthing/uploadthing-comp";

interface MultiUploadThingUploaderProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  className?: string;
}

export function MultiUploadThingUploader({
  value = [],
  onChange,
  className,
}: MultiUploadThingUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleRemove = (indexToRemove: number) => {
    const newValue = [...value];
    newValue.splice(indexToRemove, 1);
    onChange(newValue);
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden border">
              <Image
                src={url || "/placeholder.svg"}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 text-xs"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              const newUrls = res.map((r) => r.url);
              onChange([...value, ...newUrls]);
              setIsUploading(false);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error);
            setIsUploading(false);
          }}
          onUploadBegin={() => {
            setIsUploading(true);
          }}
          appearance={{
            container: "border-none p-6 ",
            uploadIcon: "text-muted-foreground",
            label: "text-sm font-medium",
            allowedContent: "text-xs text-muted-foreground",
            button:
              "bg-primary text-primary-foreground hover:bg-primary/90 ut-ready:bg-primary ut-uploading:cursor-not-allowed ut-uploading:bg-primary/50 px-4 text-sm",
          }}
          content={{
            label: isUploading
              ? "Uploading..."
              : "Drop images here, or click to browse",
            allowedContent: "PNG, JPG, WebP up to 4MB (Max 10)",
          }}
        />
      </div>
    </div>
  );
}
