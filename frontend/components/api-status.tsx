"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface ApiStatusProps {
  isConnected: boolean;
}

export function ApiStatus({ isConnected }: ApiStatusProps) {
  return (
    <Badge
      variant={isConnected ? "default" : "destructive"}
      className="flex items-center gap-1.5"
    >
      {isConnected ? (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Connected to API
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          API Unreachable
        </>
      )}
    </Badge>
  );
}
