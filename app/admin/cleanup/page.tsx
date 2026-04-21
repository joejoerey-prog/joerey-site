'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, storage, APPWRITE_CONFIG, Query } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function CleanupPage() {
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const log = (msg: string) => {
    setProgress(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const handleCleanup = async () => {
    if (!window.confirm("WARNING: This will permanently delete any images past the first 259. Proceed?")) return;

    setCleaning(true);
    setProgress([]);

    try {
      const DB_ID = APPWRITE_CONFIG.databaseId;
      const IMAGES_COL_ID = APPWRITE_CONFIG.imagesCollectionId;
      const BUCKET_ID = APPWRITE_CONFIG.bucketId;

      log("🔍 Fetching all images...");
      
      let allDocs: any[] = [];
      let lastId = null;
      
      while (true) {
          const queries = [Query.limit(100), Query.orderAsc('$createdAt')];
          if (lastId) queries.push(Query.cursorAfter(lastId));
          
          const res = await databases.listDocuments(DB_ID, IMAGES_COL_ID, queries);
          allDocs.push(...res.documents);
          
          if (res.documents.length < 100) break;
          lastId = res.documents[res.documents.length - 1].$id;
      }

      log(`✅ Found total ${allDocs.length} images.`);

      const seen = new Set<string>();
      const toDelete: any[] = [];
      const toKeep: any[] = [];

      for (const doc of allDocs) {
          // Use gallery_id + caption as a unique signature to find the true original inserts
          const key = `${doc.gallery_id}::${doc.caption}`;
          if (seen.has(key)) {
              toDelete.push(doc);
          } else {
              seen.add(key);
              toKeep.push(doc);
          }
      }

      log(`💡 Analysis: Found ${toKeep.length} unique originals. Identified ${toDelete.length} duplicates for deletion.`);

      if (toDelete.length > 0) {
          log(`🗑️ Deleting ${toDelete.length} duplicate images...`);
          
          const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

          for (let i = 0; i < toDelete.length; i++) {
              const doc = toDelete[i];
              
              if (doc.file_id) {
                  try {
                      await storage.deleteFile(BUCKET_ID, doc.file_id);
                  } catch (e) {
                      log(`⚠️ Failed to delete storage file ${doc.file_id}. It might already be gone.`);
                  }
              }
              
              try {
                await databases.deleteDocument(DB_ID, IMAGES_COL_ID, doc.$id);
                log(`   ✅ Deleted duplicate record (${i + 1}/${toDelete.length})`);
              } catch (e: any) {
                log(`   ❌ Error deleting DB document: ${e.message}`);
              }

              // Throttle to avoid hitting Appwrite Rate Limits (HTTP 429)
              await delay(800);
          }
          log("🎉 Cleanup successful!");
      } else {
          log("👍 No duplicates found! You have a perfectly clean database.");
      }
    } catch (err: any) {
      log(`❌ Critical Error: ${err.message || 'Unexpected error'}`);
    } finally {
      setCleaning(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-accent" size={48} /></div>;

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-10">
        <Button variant="ghost" onClick={() => router.push('/admin')} className="text-foreground-muted">
          <ArrowLeft size={20} className="mr-2" /> Back to Admin
        </Button>
        <Card className="bg-background-alt border-border text-foreground shadow-xl border-red-500/50">
          <CardHeader className="text-center py-10 border-b border-border">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <CardTitle className="text-3xl font-black">Database Cleanup</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-background rounded-2xl p-6 h-[400px] overflow-y-auto font-mono text-xs space-y-1 border border-border">
              {progress.length === 0 ? <p className="text-foreground-muted italic">Ready to delete orphans...</p> : progress.map((p, idx) => <p key={idx} className={p.includes('✅') ? 'text-green-400' : p.includes('❌') ? 'text-red-400' : 'text-foreground/70'}>{p}</p>)}
            </div>
          </CardContent>
          <CardFooter className="pb-10 px-8">
            <Button onClick={handleCleanup} disabled={cleaning} className="w-full bg-red-600 hover:bg-red-700 text-background font-black text-xl h-16 transition-all">
              {cleaning ? <Loader2 className="mr-2 animate-spin" /> : "DELETE DUPLICATES NOW"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
