"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { RefreshCw, AlertCircle } from "lucide-react";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import { FileList } from "@/components/file-list";
import { ApiStatus } from "@/components/api-status";
import { FileStats } from "@/components/file-stats";
import { Navbar } from "@/components/navbar";
import { listFiles } from "@/lib/api";
import type { StoredFile } from "@/lib/types";

export default function FilesPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedFiles = await listFiles();
      setFiles(fetchedFiles);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tight">
                  File Manager
                </h1>
                <p className="text-muted-foreground text-lg">
                  Upload, preview, download, and manage your cloud files.
                </p>
              </div>
              <ApiStatus isConnected={isConnected} />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={fetchFiles}
                disabled={isLoading}
                className="sm:w-auto bg-transparent"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <FileUploadDialog onUploadSuccess={fetchFiles} />
            </div>
          </div>

          {!isLoading && !error && <FileStats files={files} />}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <Card className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </Card>
          ) : (
            <FileList files={files} onFileDeleted={fetchFiles} />
          )}
        </div>
      </div>
    </>
  );
}
