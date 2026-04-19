'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, storage, ID, Query } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Upload, LogOut, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [galleries, setGalleries] = useState<any[]>([]);
  
  // Form State
  const [selectedGallery, setSelectedGallery] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        setUser(session);
        await fetchGalleries();
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const fetchGalleries = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID!,
        [Query.orderAsc('order')]
      );
      setGalleries(response.documents);
      if (response.documents.length > 0) {
        setSelectedGallery(response.documents[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch galleries:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedGallery) return;

    setMessage(null);
    setUploading(true);

    try {
      // 1. Upload to Storage
      const uploadedFile = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
        ID.unique(),
        file
      );

      // 2. Construct public URL
      const imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

      // 3. Create Database record
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_IMAGES_COLLECTION_ID!,
        ID.unique(),
        {
          gallery_id: selectedGallery,
          file_id: uploadedFile.$id,
          image_url: imageUrl,
          caption: caption,
          created_at: new Date().toISOString()
        }
      );

      setMessage({ type: 'success', text: 'Photo uploaded successfully to the portfolio!' });
      setCaption('');
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
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
        {/* Header */}
        <div className="flex justify-between items-center bg-background-alt p-6 rounded-2xl border border-border shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-foreground-muted">Logged in as {user?.email}</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-foreground-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </Button>
        </div>

        {/* Upload Form */}
        <Card className="bg-background-alt border-border text-foreground shadow-xl overflow-hidden">
          <CardHeader className="bg-secondary/10 border-b border-border py-8">
            <div className="flex items-center gap-3">
              <Upload className="text-accent" size={28} />
              <div>
                <CardTitle className="text-2xl">Upload New Photo</CardTitle>
                <CardDescription className="text-foreground-muted">Add a new image to your live galleries.</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <form onSubmit={handleUpload}>
            <CardContent className="space-y-6 pt-8">
              {/* Gallery Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-accent/80">1. Target Gallery</label>
                {galleries.length === 0 ? (
                  <p className="text-amber-400 text-xs italic bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                    No galleries found in database. Please create them in Appwrite first.
                  </p>
                ) : (
                  <select
                    value={selectedGallery}
                    onChange={(e) => setSelectedGallery(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-accent outline-none appearance-none"
                    required
                  >
                    {galleries.map((g) => (
                      <option key={g.$id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-accent/80">2. Select Image</label>
                <div className="relative group">
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    required
                  />
                  <label 
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-border rounded-2xl cursor-pointer bg-background hover:bg-background/50 hover:border-accent transition-all p-6 text-center"
                  >
                    {file ? (
                      <div className="flex flex-center gap-3 items-center">
                        <CheckCircle2 className="text-green-400" size={32} />
                        <div>
                          <p className="font-bold text-foreground">{file.name}</p>
                          <p className="text-xs text-foreground-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="text-foreground-muted mb-3 group-hover:scale-110 transition-transform" size={40} />
                        <p className="font-medium text-foreground">Click to browse or drag and drop</p>
                        <p className="text-xs text-foreground-muted mt-1">High-quality JPEGs or PNGs recommended</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-accent/80">3. Caption (Optional)</label>
                <Textarea
                  placeholder="Tell the story behind this shot..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-background border-border min-h-[100px] focus:ring-accent"
                />
              </div>

              {/* Feedback Message */}
              {message && (
                <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="pb-8">
              <Button
                type="submit"
                disabled={uploading || !file || galleries.length === 0}
                className="w-full bg-secondary hover:bg-primary text-foreground font-black text-lg h-14 shadow-lg shadow-accent/5 transition-all active:scale-[0.98]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Uploading to Portfolio...
                  </>
                ) : (
                  'Publish Photo'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
