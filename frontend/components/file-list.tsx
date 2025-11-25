"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Eye } from "lucide-react";
import { deleteFile, getDownloadUrl } from "@/lib/api";
import { formatFileSize, formatDate } from "@/lib/format";
import type { StoredFile } from "@/lib/types";
import { FilePreviewDialog } from "./file-preview-dialog";

interface FileListProps {
  files: StoredFile[];
  onFileDeleted: () => void;
}

export function FileList({ files, onFileDeleted }: FileListProps) {
  const [fileToDelete, setFileToDelete] = useState<StoredFile | null>(null);
  const [fileToPreview, setFileToPreview] = useState<StoredFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async (file: StoredFile) => {
    const url = getDownloadUrl(file);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleView = (file: StoredFile) => {
    setFileToPreview(file);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    try {
      await deleteFile(fileToDelete.id);
      onFileDeleted();
      setFileToDelete(null);
    } catch (error) {
      console.error("Failed to delete file:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (files.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-16 text-center bg-muted/20">
        <div className="space-y-2">
          <p className="text-lg font-medium">No files yet</p>
          <p className="text-sm text-muted-foreground">
            Click &quot;Add File&quot; to upload your first file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card shadow-sm">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Filename</TableHead>
                <TableHead className="font-semibold">Size</TableHead>
                <TableHead className="font-semibold">Content Type</TableHead>
                <TableHead className="font-semibold">Last Modified</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow
                  key={file.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell
                    className="font-medium max-w-xs truncate"
                    title={file.filename}
                  >
                    {file.filename}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(file.size)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {file.contentType || "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(file.lastModified)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(file)}
                        className="hover:bg-primary/10"
                        title="Preview file"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file)}
                        className="hover:bg-primary/10"
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFileToDelete(file)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        title="Delete file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <FilePreviewDialog
        file={fileToPreview}
        open={!!fileToPreview}
        onOpenChange={() => setFileToPreview(null)}
      />

      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={() => setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              <span className="font-semibold">{fileToDelete?.filename}</span>
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
