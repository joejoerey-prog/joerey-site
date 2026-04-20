'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, storage, ID, APPWRITE_CONFIG } from '@/lib/appwrite';
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
    if (!window.confirm("This will attempt to push all local JSON data and public photos to Appwrite. Continue?")) return;

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

      log("🚀 Starting Smart Migration...");

      for (let i = 0; i < galleriesData.galleries.length; i++) {
        const gallery = galleriesData.galleries[i];
        log(`📂 Processing Gallery: ${gallery.title}...`);

        // 1. Create Gallery Document
        try {
          // Flexible key handling: sending both 'id' and 'Id' to handle console mismatches
          await databases.createDocument(DB_ID, GALLERIES_COL_ID, ID.unique(), {
            id: gallery.id,
            Id: gallery.id, 
            title: gallery.title,
            description: gallery.description,
            order: i + 1
          });
          log(`✅ Created gallery: ${gallery.id}`);
        } catch (e: any) {
          if (e.message.includes('already exists')) {
            log(`ℹ️ Gallery ${gallery.id} already exists, skipping.`);
          } else {
            log(`⚠️ Gallery Error: ${e.message}`);
          }
        }

        // 2. Process Images
        for (const img of gallery.images) {
          log(`📸 Uploading: ${img.image.split('/').pop()}...`);
          try {
            const response = await fetch(img.image);
            if (!response.ok) throw new Error(`HTTP ${response.status} - Image not found on disk.`);
            
            const blob = await response.blob();
            const fileName = img.image.split('/').pop() || 'image.jpg';
            const file = new File([blob], fileName, { type: blob.type });

            // Upload to storage
            const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
            const imageUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${PROJECT_ID}`;

            // Create Image Document
            await databases.createDocument(DB_ID, IMAGES_COL_ID, ID.unique(), {
              gallery_id: gallery.id,
              file_id: uploadedFile.$id,
              image_url: imageUrl,
              caption: img.caption || "",
              created_at: new Date().toISOString()
            });
            log(`   ✅ Linked to database.`);
          } catch (e: any) {
            log(`   ❌ Error: ${e.message}`);
            if (e.message.includes('permissions')) {
              log(`   💡 ACTION REQUIRED: Go to Appwrite Storage -> Bucket Settings -> Permissions and add Role 'Users' with all permissions.`);
            }
          }
        }
      }

      log("🎉 Migration process finished!");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setMigrating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin')} className="text-foreground-muted">
            <ArrowLeft size={20} className="mr-2" />
            Back to Admin
          </Button>
        </div>

        <Card className="bg-background-alt border-border text-foreground shadow-xl">
          <CardHeader className="text-center py-10 border-b border-border">
            <Database className="mx-auto text-accent mb-4" size={48} />
            <CardTitle className="text-3xl font-black text-foreground">Smart Migration</CardTitle>
            <CardDescription className="text-foreground-muted max-w-md mx-auto">
              Syncing local images and JSON data to Appwrite Cloud.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <div className="bg-background rounded-2xl p-6 h-[400px] overflow-y-auto font-mono text-xs space-y-1 border border-border shadow-inner">
              {progress.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
                  <Play size={40} />
                  <p className="italic">Ready to begin migration...</p>
                </div>
              ) : (
                progress.map((p, idx) => (
                  <p key={idx} className={p.includes('✅') ? 'text-green-400' : p.includes('❌') ? 'text-red-400' : 'text-foreground/70'}>
                    {p}
                  </p>
                ))
              )}
              {error && (
                <p className="text-red-400 font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20 mt-4 flex gap-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="pb-10 px-8">
            <Button
              onClick={handleMigrate}
              disabled={migrating}
              className="w-full bg-accent hover:bg-accent/80 text-background font-black text-xl h-16 transition-all shadow-lg active:scale-[0.99]"
            >
              {migrating ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={24} />
                  Migrating Assets...
                </>
              ) : (
                <>
                  <Play className="mr-2" fill="currentColor" size={24} />
                  Run Full Migration
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
