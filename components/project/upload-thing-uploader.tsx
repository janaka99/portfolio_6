"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/lib/uploadthing/uploadthing-comp";

interface UploadThingUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  className?: string;
}

export function UploadThingUploader({
  value,
  onChange,
  onRemove,
  className,
}: UploadThingUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      {value ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <Image
              src={value || "/placeholder.svg"}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 px-4 text-sm"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                onChange(res[0].url);
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
                : "Drop your image here, or click to browse",
              allowedContent: "PNG, JPG, WebP up to 4MB",
            }}
          />
        </div>
      )}
    </div>
  );
}
