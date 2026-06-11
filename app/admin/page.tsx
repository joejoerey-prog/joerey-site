'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account, databases, storage, ID, Query, APPWRITE_CONFIG } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Upload, LogOut, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, Edit, Save, Database } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { calculateFileHash } from '@/lib/utils';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [galleries, setGalleries] = useState<any[]>([]);
  
  // Gallery Edit State
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdatingGallery, setIsUpdatingGallery] = useState(false);

  // Form State
  const [selectedGallery, setSelectedGallery] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setUser({ email: 'joereyphotography@hotmail.com' });
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
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.galleriesCollectionId,
        [Query.orderAsc('order'), Query.limit(100)]
      );

      // Deduplicate by the slug 'id'
      const uniqueGalleriesMap = new Map();
      response.documents.forEach(doc => {
        const slugId = doc.id || doc.Id;
        if (slugId && !uniqueGalleriesMap.has(slugId)) {
          uniqueGalleriesMap.set(slugId, doc);
        }
      });

      const uniqueGalleries = Array.from(uniqueGalleriesMap.values());
      setGalleries(uniqueGalleries);
      
      if (uniqueGalleries.length > 0) {
        const firstId = uniqueGalleries[0].id || uniqueGalleries[0].Id;
        setSelectedGallery(firstId);
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

  const handleUpdateGallery = async () => {
    if (!editingGallery) return;
    setIsUpdatingGallery(true);
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.galleriesCollectionId,
        editingGallery.$id,
        {
          title: editTitle,
          description: editDescription
        }
      );
      
      // Update local state
      setGalleries(prev => prev.map(g => 
        g.$id === editingGallery.$id ? { ...g, title: editTitle, description: editDescription } : g
      ));
      
      setEditingGallery(null);
      setMessage({ type: 'success', text: 'Gallery updated successfully!' });
    } catch (err: any) {
      console.error('Failed to update gallery:', err);
      setMessage({ type: 'error', text: `Failed to update gallery: ${err.message}` });
    } finally {
      setIsUpdatingGallery(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedGallery) return;

    setMessage(null);
    setUploading(true);

    try {
      // 1. Calculate File Hash (Fingerprint)
      const fileHash = await calculateFileHash(file);
      console.log(`[Admin] Generated file hash: ${fileHash}`);

      // 2. Check for Duplicates in Database
      const existing = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.imagesCollectionId,
        [Query.equal('file_hash', fileHash)]
      );

      if (existing.total > 0) {
        const dup = existing.documents[0];
        throw new Error(`This image has already been uploaded to the "${dup.gallery_id}" gallery.`);
      }

      // 3. Upload to Storage
      const uploadedFile = await storage.createFile(
        APPWRITE_CONFIG.bucketId,
        ID.unique(),
        file
      );

      // 4. Construct public URL
      const imageUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${APPWRITE_CONFIG.bucketId}/files/${uploadedFile.$id}/view?project=${APPWRITE_CONFIG.projectId}`;

      // 5. Create Database record
      const slugId = selectedGallery.toLowerCase();
      console.log(`[Admin] Uploading new image. Targeting gallery_id: '${slugId}'`);

      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.imagesCollectionId,
        ID.unique(),
        {
          gallery_id: slugId,
          file_id: uploadedFile.$id,
          image_url: imageUrl,
          caption: caption,
          file_hash: fileHash, // Save the hash for future checks
          created_at: new Date().toISOString()
        }
      );

      setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
      setCaption('');
      setFile(null);
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      console.error("Upload Error:", err);
      setMessage({ type: 'error', text: err.message || 'Upload failed' });
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

        {/* Manage Galleries */}
        <Card className="bg-background-alt border-border text-foreground shadow-xl overflow-hidden">
          <CardHeader className="bg-accent/10 border-b border-border py-6">
            <div className="flex items-center gap-3">
              <Database className="text-accent" size={24} />
              <div>
                <CardTitle className="text-xl">Manage Galleries</CardTitle>
                <CardDescription className="text-foreground-muted text-xs">Update your gallery names and descriptions.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {galleries.map((g) => (
                <div key={g.$id} className="flex items-center justify-between p-4 hover:bg-background/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-bold text-foreground">{g.title}</p>
                    <p className="text-xs text-foreground-muted line-clamp-1">{g.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingGallery(g);
                      setEditTitle(g.title);
                      setEditDescription(g.description || '');
                    }}
                    className="border-border hover:bg-accent/10 hover:text-accent"
                  >
                    <Edit className="mr-2" size={14} />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                    {galleries.map((g) => {
                      const val = g.id || g.Id;
                      return (
                        <option key={g.$id} value={val}>{g.title}</option>
                      );
                    })}
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

      {/* Edit Gallery Dialog */}
      <Dialog open={!!editingGallery} onOpenChange={(open) => !open && setEditingGallery(null)}>
        <DialogContent className="sm:max-w-lg bg-background-alt border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Edit Gallery</DialogTitle>
            <DialogDescription className="text-foreground-muted">
              Update the details for "{editingGallery?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-accent font-bold uppercase tracking-wider text-xs">Gallery Title</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-accent font-bold uppercase tracking-wider text-xs">Description</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-background border-border min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditingGallery(null)}
              className="text-foreground-muted hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateGallery}
              disabled={isUpdatingGallery}
              className="bg-secondary hover:bg-primary text-foreground font-bold"
            >
              {isUpdatingGallery ? (
                <Loader2 className="mr-2 animate-spin" size={18} />
              ) : (
                <Save className="mr-2" size={18} />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
