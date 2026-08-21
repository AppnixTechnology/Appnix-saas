"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { config } from "@/lib/config";
import { useAuth } from "@/lib/auth/auth-context";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const authError = searchParams.get("error");

    if (authError) {
      setError(decodeURIComponent(authError));
      return;
    }

    if (!token) {
      setError("Authentication failed: No access token received.");
      return;
    }

    const processAuth = async () => {
      try {
        localStorage.setItem(config.auth.tokenKey, token);
        if (refreshToken) {
          localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
        }
        await refreshUser();
        router.replace("/dashboard");
      } catch (err: any) {
        setError(err.message || "Failed to finalize authentication session.");
      }
    };

    processAuth();
  }, [searchParams, router, refreshUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md p-6 text-center shadow-lg border-destructive/30">
          <CardContent className="space-y-4 pt-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-bold text-foreground">Authentication Failed</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button asChild className="w-full mt-4">
              <Link href="/signin">Return to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <h2 className="text-lg font-semibold text-foreground">Completing sign in...</h2>
        <p className="text-sm text-muted-foreground">Setting up your workspace session, please wait.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
