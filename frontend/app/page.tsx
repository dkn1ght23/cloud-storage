"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background to-muted/20 flex items-center justify-center px-4">
        <div className="container max-w-3xl">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center space-y-6 pb-8 pt-12">
              <div className="flex justify-center">
                <div className="rounded-3xl bg-linear-to-br from-primary to-primary/80 p-6 shadow-lg">
                  <Cloud className="h-16 w-16 text-primary-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                <CardTitle className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                  CloudVault
                </CardTitle>
                <CardDescription className="text-lg max-w-md mx-auto leading-relaxed">
                  Upload, manage, and download your files from secure cloud
                  storage.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center pb-12">
              <Button
                asChild
                size="lg"
                className="w-full max-w-sm h-12 text-base shadow-md"
              >
                <Link href="/files">Go to File Manager</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
