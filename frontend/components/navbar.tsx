"use client";

import Link from "next/link";
import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity"
        >
          <div className="rounded-lg bg-primary p-1.5">
            <Cloud className="h-5 w-5 text-primary-foreground" />
          </div>
          CloudVault
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/files">Files</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
