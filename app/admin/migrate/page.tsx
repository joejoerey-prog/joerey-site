'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, storage, ID, APPWRITE_CONFIG, Query } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Database, Loader2, Play, CheckCircle2, AlertCircle, ArrowLeft, MessageSquareText, Sparkles } from 'lucide-react';
import galleriesData from '@/data/legacy/galleries.json';

export default function MigratePage() {
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [syncingCaptions, setSyncingCaptions] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
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
                }
            }
        }

        // 2. Process Images
        for (const img of gallery.images) {
          const fileName = img.image.split('/').pop() || 'image.jpg';
          log(`   📸 Processing: ${fileName}...`);
          
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
            log(`      ✅ Uploaded & Linked.`);
          } catch (e: any) {
            log(`      ❌ Error: ${e.message}`);
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

  const handleSyncCaptions = async () => {
    if (!window.confirm("This will find all existing images in Appwrite and update their missing captions from the JSON file. Continue?")) return;

    setSyncingCaptions(true);
    setError(null);
    setProgress([]);

    try {
      const DB_ID = APPWRITE_CONFIG.databaseId;
      const IMAGES_COL_ID = APPWRITE_CONFIG.imagesCollectionId;

      log("🔍 Starting Caption Sync...");

      // 1. Get all images from database
      const response = await databases.listDocuments(DB_ID, IMAGES_COL_ID, [Query.limit(200)]);
      log(`Found ${response.documents.length} images in database.`);

      // 2. Create a map of filename -> caption from our local data
      const captionMap = new Map();
      galleriesData.galleries.forEach(g => {
        g.images.forEach(img => {
          const fileName = img.image.split('/').pop();
          if (fileName) captionMap.set(fileName, img.caption);
        });
      });

      // 3. Update each document
      let updatedCount = 0;
      const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

      for (const doc of response.documents) {
        if (!doc.file_id) {
          log(`   ⚠️ Skipping DB doc ${doc.$id} (No file_id found).`);
          continue;
        }

        try {
          // Retrieve actual storage metadata to extract the original uploaded filename
          const fileMeta = await storage.getFile(APPWRITE_CONFIG.bucketId, doc.file_id);
          const originalName = fileMeta.name;

          // Lookup matching caption from local map based on exact original filename
          if (originalName && captionMap.has(originalName) && (!doc.caption || doc.caption.trim() === "")) {
            const correctCaption = captionMap.get(originalName);
            log(`✍️ Updating DB caption for: ${originalName}`);
            
            await databases.updateDocument(DB_ID, IMAGES_COL_ID, doc.$id, {
              caption: correctCaption
            });
            updatedCount++;
          }
        } catch (e: any) {
          log(`   ❌ Could not lookup storage file ${doc.file_id}: ${e.message}`);
        }

        // Delay to prevent hitting Appwrite rate limits
        await delay(100);
      }

      log(`🎉 Caption Sync complete! Updated ${updatedCount} images.`);
    } catch (err: any) {
      setError(err.message || "Caption sync failed.");
    } finally {
      setSyncingCaptions(false);
    }
  };

  const handleAIGenerateCaptions = async () => {
    if (!window.confirm("This will analyze all images using AI and generate artistic descriptions. This may take several minutes. Continue?")) return;

    setGeneratingAI(true);
    setError(null);
    setProgress([]);

    try {
      const DB_ID = APPWRITE_CONFIG.databaseId;
      const IMAGES_COL_ID = APPWRITE_CONFIG.imagesCollectionId;

      log("✨ Starting AI Caption Generation...");

      const response = await databases.listDocuments(DB_ID, IMAGES_COL_ID, [Query.limit(200)]);
      log(`Found ${response.documents.length} images to process.`);

      let successCount = 0;
      const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

      for (const doc of response.documents) {
        // Skip if it already has a long caption (meaning it's likely already processed)
        if (doc.caption && doc.caption.length > 200) {
          log(`   ⏩ Skipping ${doc.$id} (already has AI description).`);
          continue;
        }

        log(`   🤖 Analyzing Image: ${doc.$id}...`);

        try {
          const aiRes = await fetch('/api/generate-caption', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: doc.image_url })
          });

          if (!aiRes.ok) throw new Error(`AI API failed: ${aiRes.statusText}`);

          const { caption, error: aiError } = await aiRes.json();
          if (aiError) throw new Error(aiError);

          await databases.updateDocument(DB_ID, IMAGES_COL_ID, doc.$id, {
            caption: caption
          });

          log(`      ✅ Caption generated.`);
          successCount++;
        } catch (e: any) {
          log(`      ❌ Error: ${e.message}`);
        }

        // Wait between calls to stay within rate limits
        await delay(5000);
      }

      log(`🎉 AI Generation complete! Processed ${successCount} images.`);
    } catch (err: any) {
      setError(err.message || "AI generation failed.");
    } finally {
      setGeneratingAI(false);
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
            <CardTitle className="text-3xl font-black">Dynamic Sync Tool</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-background rounded-2xl p-6 h-[300px] overflow-y-auto font-mono text-xs space-y-1 border border-border">
              {progress.length === 0 ? <p className="text-foreground-muted italic text-center py-20">Ready for action...</p> : progress.map((p, idx) => <p key={idx} className={p.includes('✅') ? 'text-green-400' : p.includes('❌') ? 'text-red-400' : 'text-foreground/70'}>{p}</p>)}
              {error && <p className="text-red-400 font-bold mt-4">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="pb-10 px-8 flex flex-col gap-4">
            <Button 
              onClick={handleAIGenerateCaptions} 
              disabled={generatingAI || migrating || syncingCaptions} 
              className="w-full bg-accent hover:bg-accent/80 text-background font-black h-14"
            >
              {generatingAI ? <Loader2 className="mr-2 animate-spin" /> : <><Sparkles className="mr-2" size={20}/> Generate AI Descriptions (Artistic)</>}
            </Button>

            <Button onClick={handleSyncCaptions} disabled={syncingCaptions || migrating || generatingAI} className="w-full bg-secondary hover:bg-primary text-foreground font-bold h-12">
              {syncingCaptions ? <Loader2 className="mr-2 animate-spin" /> : <><MessageSquareText className="mr-2" size={20}/> Sync Missing Captions Only</>}
            </Button>
            
            <div className="relative w-full py-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <span className="relative bg-background-alt px-4 text-[10px] text-foreground-muted uppercase font-bold tracking-widest">Or Full Sync</span>
            </div>

            <Button onClick={handleMigrate} disabled={migrating || syncingCaptions || generatingAI} variant="ghost" className="w-full border border-white/5 text-foreground-muted hover:text-foreground h-12 text-xs">
              {migrating ? <Loader2 className="animate-spin" /> : "Run Full Data & Image Migration"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
