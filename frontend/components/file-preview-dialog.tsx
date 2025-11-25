"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { StoredFile } from "@/lib/types";
import { getDownloadUrl } from "@/lib/api";

interface FilePreviewDialogProps {
  file: StoredFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilePreviewDialog({
  file,
  open,
  onOpenChange,
}: FilePreviewDialogProps) {
  if (!file) return null;

  const url = getDownloadUrl(file);
  const isImage = file.contentType?.startsWith("image/");
  const isPDF = file.contentType === "application/pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{file.filename}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full h-[70vh]">
          {isImage ? (
            <div className="flex items-center justify-center p-4">
              <img
                src={url || "/placeholder.svg"}
                alt={file.filename}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          ) : isPDF ? (
            <iframe
              src={url}
              className="w-full h-full min-h-[600px] rounded-lg"
              title={file.filename}
            />
          ) : (
            <div className="flex items-center justify-center p-12 text-center">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Preview not available for this file type.
                </p>
                <p className="text-sm text-muted-foreground">
                  Content Type:{" "}
                  <span className="font-mono">
                    {file.contentType || "unknown"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
