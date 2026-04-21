'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, storage, ID, APPWRITE_CONFIG, Query } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Database, Loader2, Play, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import galleriesData from '@/data/legacy/galleries.json';

export default function MigratePage() {
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  const handleMigrate = async () => {
    if (!window.confirm("Ready to retry migration? Images already uploaded will be skipped.")) return;

    setMigrating(true);
    setError(null);
    setProgress([]);

    try {
      const DB_ID = APPWRITE_CONFIG.databaseId;
      const GALLERIES_COL_ID = APPWRITE_CONFIG.galleriesCollectionId;
      const IMAGES_COL_ID = APPWRITE_CONFIG.imagesCollectionId;
      const BUCKET_ID = APPWRITE_CONFIG.bucketId;
      const PROJECT_ID = APPWRITE_CONFIG.projectId;
      const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';

      log("🚀 Starting Resilient Migration...");

      for (let i = 0; i < galleriesData.galleries.length; i++) {
        const gallery = galleriesData.galleries[i];
        log(`📂 Processing Gallery: ${gallery.title}...`);

        // 1. Create Gallery Document
        try {
            // First attempt: matching exactly what the code expects
            await databases.createDocument(DB_ID, GALLERIES_COL_ID, ID.unique(), {
                id: gallery.id,
                title: gallery.title,
                description: gallery.description,
                order: i + 1
            });
            log(`   ✅ Gallery created.`);
        } catch (e: any) {
            if (e.message.includes('already exists')) {
                log(`   ℹ️ Gallery already exists.`);
            } else {
                log(`   ⚠️ Retrying with capital 'Id'...`);
                try {
                    await databases.createDocument(DB_ID, GALLERIES_COL_ID, ID.unique(), {
                        Id: gallery.id,
                        title: gallery.title,
                        description: gallery.description,
                        order: i + 1
                    });
                    log(`   ✅ Gallery created (using Id).`);
                } catch (e2: any) {
                    log(`   ❌ Gallery creation failed: ${e2.message}`);
                    log(`   💡 Ensure 'id' exists in Appwrite -> Database -> galleries -> Attributes.`);
                }
            }
        }

        // 2. Process Images
        for (const img of gallery.images) {
          const fileName = img.image.split('/').pop() || 'image.jpg';
          
          // Check if already in database to avoid duplicates
          try {
              const existing = await databases.listDocuments(DB_ID, IMAGES_COL_ID, [
                  Query.equal('image_url', { 
                      startsWith: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/`
                  } as any),
                  Query.limit(100) // Rough check
              ]);
              
              // We'll just look for the filename in the metadata as a shortcut
              const isUploaded = existing.documents.some(doc => doc.image_url.includes(fileName));
              if (isUploaded) {
                  log(`   ⏭️ Skipping ${fileName} (already uploaded).`);
                  continue;
              }
          } catch (e) {}

          log(`   📸 Uploading: ${fileName}...`);
          try {
            const response = await fetch(img.image);
            if (!response.ok) throw new Error("File not on disk");
            
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: blob.type });

            const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
            const imageUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;

            await databases.createDocument(DB_ID, IMAGES_COL_ID, ID.unique(), {
              gallery_id: gallery.id,
              file_id: uploadedFile.$id,
              image_url: imageUrl,
              caption: img.caption || "",
              created_at: new Date().toISOString()
            });
            log(`   ✅ Success.`);
          } catch (e: any) {
            log(`   ❌ Error: ${e.message}`);
          }
        }
      }

      log("🎉 Done!");
    } catch (err: any) {
      setError(err.message || "Unexpected error.");
    } finally {
      setMigrating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-accent" size={48} /></div>;

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-10">
        <Button variant="ghost" onClick={() => router.push('/admin')} className="text-foreground-muted">
          <ArrowLeft size={20} className="mr-2" /> Back to Admin
        </Button>
        <Card className="bg-background-alt border-border text-foreground shadow-xl">
          <CardHeader className="text-center py-10 border-b border-border">
            <Database className="mx-auto text-accent mb-4" size={48} />
            <CardTitle className="text-3xl font-black">Final Sync</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-background rounded-2xl p-6 h-[400px] overflow-y-auto font-mono text-xs space-y-1 border border-border">
              {progress.length === 0 ? <p className="text-foreground-muted italic">Ready to fix the galleries...</p> : progress.map((p, idx) => <p key={idx} className={p.includes('✅') ? 'text-green-400' : p.includes('❌') ? 'text-red-400' : 'text-foreground/70'}>{p}</p>)}
              {error && <p className="text-red-400 font-bold mt-4">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="pb-10 px-8">
            <Button onClick={handleMigrate} disabled={migrating} className="w-full bg-accent hover:bg-accent/80 text-background font-black text-xl h-16 transition-all">
              {migrating ? <Loader2 className="mr-2 animate-spin" /> : "Run Final Sync"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
