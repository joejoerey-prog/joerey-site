'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md bg-background-alt border-border text-foreground shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-secondary/30 p-3 rounded-full w-fit">
            <Lock className="text-accent" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Login</CardTitle>
          <CardDescription className="text-foreground-muted">
            Enter your credentials to manage your portfolio.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Email</label>
              <Input
                type="email"
                placeholder="joe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border focus:ring-accent"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-xs text-accent hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-primary text-foreground font-bold transition-all h-12"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={async () => {
                try {
                  console.log("Testing connection to project:", process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
                  await account.get();
                  alert("Connection successful (but no active session).");
                } catch (err: any) {
                  console.error("Diagnostic Error:", err);
                  alert(`Diagnostic Result: ${err.message}\nCheck browser console (F12) for details.`);
                }
              }}
              className="w-full text-[10px] text-foreground-muted uppercase tracking-widest opacity-50"
            >
              Run Diagnostic
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
