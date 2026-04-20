'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account, APPWRITE_CONFIG } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Lock, Activity } from 'lucide-react';
import { Client, Account } from 'appwrite';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Diagnostic State
  const [testProjectId, setTestProjectId] = useState(APPWRITE_CONFIG.projectId);
  const [diagOutput, setDiagOutput] = useState<string | null>(null);

  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        await account.get();
        router.push('/admin');
      } catch (err) {
        // Not logged in, stay on login page
      }
    };
    checkUser();
  }, [router]);

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

  const runDiagnostic = async () => {
    setDiagOutput("Running diagnostics...");
    let logs = "";
    const log = (msg: string) => { logs += msg + "\n"; setDiagOutput(logs); };

    try {
      log(`1. Testing Internet: Fetching Google...`);
      await fetch('https://www.google.com', { mode: 'no-cors' });
      log(`✅ Internet reachable.`);

      log(`2. Testing Appwrite Connection with ID: ${testProjectId}`);
      const testClient = new Client()
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject(testProjectId);
      const testAccount = new Account(testClient);
      
      try {
        await testAccount.get();
        log(`✅ Appwrite reached! (Already logged in)`);
      } catch (err: any) {
        if (err.message.includes('fetch')) {
          log(`❌ FAILED TO FETCH: This is almost certainly a CORS/Platform issue or an Ad-blocker.`);
        } else {
          log(`✅ Appwrite reached, server returned: ${err.message}`);
        }
      }
      
      log(`\nADVICE: If you see 'Failed to fetch', ensure 'joereyphotography.com' is added to PLATFORMS in Appwrite Settings AND disable any ad-blockers.`);
    } catch (err: any) {
      log(`❌ Diagnostic failed: ${err.message}`);
    }
  };

  return (
    <main className="min-h-[80dvh] flex flex-col items-center justify-center p-6 bg-background space-y-6">
      <Card className="w-full max-w-md bg-background-alt border-border text-foreground shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-secondary/30 p-3 rounded-full w-fit">
            <Lock className="text-accent" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Login</CardTitle>
          <CardDescription className="text-foreground-muted">
            Sign in to manage your portfolio.
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
          <CardFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-primary text-foreground font-bold transition-all h-12"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Advanced Diagnostics Card */}
      <Card className="w-full max-w-md bg-black/20 border-white/10 text-foreground">
        <CardHeader className="py-4">
          <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 opacity-50">
            <Activity size={14} /> Connection Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold opacity-40 ml-1">Test Project ID</label>
            <div className="flex gap-2">
              <Input 
                value={testProjectId} 
                onChange={(e) => setTestProjectId(e.target.value)}
                className="h-8 text-xs bg-black/20 border-white/5"
              />
              <Button size="sm" onClick={runDiagnostic} className="h-8 bg-white/10 hover:bg-white/20">Test</Button>
            </div>
          </div>
          
          {diagOutput && (
            <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] whitespace-pre-wrap border border-white/5 leading-relaxed">
              {diagOutput}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
