'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { KeyRound, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!userId || !secret) {
      setError("Invalid or expired reset link.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await account.updateRecovery(userId, secret, password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md bg-background-alt border-border text-foreground shadow-2xl text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit">
            <CheckCircle2 className="text-green-400" size={48} />
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset!</CardTitle>
          <CardDescription className="text-foreground-muted">
            Your password has been updated. Redirecting you to login...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-background-alt border-border text-foreground shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto bg-secondary/30 p-3 rounded-full w-fit">
          <KeyRound className="text-accent" size={32} />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create New Password</CardTitle>
        <CardDescription className="text-foreground-muted">
          Set a secure password for your admin account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleReset}>
        <CardContent className="space-y-4">
          {!userId || !secret ? (
            <p className="text-amber-400 text-sm bg-amber-400/10 p-3 rounded-lg border border-amber-400/20 flex gap-2">
              <AlertCircle size={16} />
              Invalid reset link. Please request a new one.
            </p>
          ) : null}
          
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">New Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="bg-background border-border focus:ring-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Confirm New Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-background border-border focus:ring-accent"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={loading || !userId || !secret}
            className="w-full bg-secondary hover:bg-primary text-foreground font-bold transition-all h-12"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6 bg-background">
      <Suspense fallback={<Loader2 className="animate-spin text-accent" size={48} />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
