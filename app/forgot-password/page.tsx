'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // The second parameter is the URL the user will be redirected to from their email
      const resetUrl = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, resetUrl);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-[80dvh] flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md bg-background-alt border-border text-foreground shadow-2xl text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit">
              <CheckCircle2 className="text-green-400" size={48} />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-foreground-muted">
              We've sent a password reset link to <span className="text-foreground font-bold">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-secondary hover:bg-primary text-foreground font-bold"
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md bg-background-alt border-border text-foreground shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-secondary/30 p-3 rounded-full w-fit">
            <Mail className="text-accent" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
          <CardDescription className="text-foreground-muted">
            Enter your email and we'll send you a recovery link.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetRequest}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="joe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-primary text-foreground font-bold transition-all h-12"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => router.push('/login')}
              className="w-full text-foreground-muted hover:text-foreground"
            >
              <ArrowLeft className="mr-2" size={18} />
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
