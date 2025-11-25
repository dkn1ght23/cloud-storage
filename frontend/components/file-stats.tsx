"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, HardDrive } from "lucide-react";
import { formatFileSize } from "@/lib/format";
import type { StoredFile } from "@/lib/types";

interface FileStatsProps {
  files: StoredFile[];
}

export function FileStats({ files }: FileStatsProps) {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-lg bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Files
            </p>
            <p className="text-2xl font-bold">{files.length}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-lg bg-primary/10 p-3">
            <HardDrive className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Storage
            </p>
            <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
