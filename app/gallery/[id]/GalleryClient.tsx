'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Edit2, Loader2, Save, Trash2 } from "lucide-react";
import { account, databases, APPWRITE_CONFIG, Query } from "@/lib/appwrite";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type GalleryImage = {
  id: string;
  image: string;
  caption?: string;
};

type Gallery = {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
};

type GalleryOption = {
  id: string;
  title: string;
};

interface GalleryClientProps {
  gallery?: Gallery;
}

export default function GalleryClient({ gallery: initialGallery }: GalleryClientProps) {
  const [gallery, setGallery] = useState<Gallery | undefined>(initialGallery);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [newCaption, setNewCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [galleries, setGalleries] = useState<GalleryOption[]>([]);
  const [newGalleryId, setNewGalleryId] = useState("");

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

      const uniqueGalleries = Array.from(uniqueGalleriesMap.values()).map(doc => ({
        id: (doc.id || doc.Id || '').toLowerCase(),
        title: doc.title
      }));

      setGalleries(uniqueGalleries);
    } catch (err) {
      console.error('Failed to fetch galleries:', err);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await account.get();
        setIsAdmin(true);
        await fetchGalleries();
      } catch (err) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleSaveImageChanges = async () => {
    if (!editingImage || !gallery) return;
    setIsSaving(true);
    try {
      const updateData: any = { caption: newCaption };
      
      // If gallery ID changed, include it in the update
      if (newGalleryId && newGalleryId !== gallery.id) {
        updateData.gallery_id = newGalleryId;
      }
      
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.imagesCollectionId,
        editingImage.id,
        updateData
      );
      
      // Update local state for immediate feedback
      if (newGalleryId && newGalleryId !== gallery.id) {
        // Remove image from current gallery since it moved to a different page
        const updatedImages = gallery.images.filter(img => img.id !== editingImage.id);
        setGallery({ ...gallery, images: updatedImages });
      } else {
        // Update caption only
        const updatedImages = gallery.images.map(img => 
          img.id === editingImage.id ? { ...img, caption: newCaption } : img
        );
        setGallery({ ...gallery, images: updatedImages });
      }
      
      setEditingImage(null);
      setNewGalleryId("");
    } catch (err) {
      console.error("Failed to update image:", err);
      alert("Failed to update image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete || !gallery) return;
    setIsDeleting(true);
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.imagesCollectionId,
        imageToDelete.id
      );
      
      // Update local state for immediate feedback
      const updatedImages = gallery.images.filter(img => img.id !== imageToDelete.id);
      setGallery({ ...gallery, images: updatedImages });
      setImageToDelete(null);
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Failed to delete image. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!gallery) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-background text-foreground">
        <p>Gallery not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Top section */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="text-sm text-foreground-muted hover:text-foreground transition"
        >
          ← Back to Galleries
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">{gallery.title}</h1>
        <p className="text-foreground-muted max-w-2xl">{gallery.description}</p>
      </section>

      {/* Images */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.images.map((img: GalleryImage, i: number) => (
            <figure
              key={img.id || i}
              className="rounded-2xl overflow-hidden border border-border bg-background-alt flex flex-col relative group"
            >
              <div
                className="relative w-full aspect-[4/3] flex items-center justify-center bg-background cursor-pointer"
                onClick={() => setOpenIndex(i)}
              >
                <Image
                  src={img.image}
                  alt={img.caption || gallery.title}
                  fill
                  className="object-cover transition-transform duration-200 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}     // preload first few images
                  quality={80}          // slightly higher quality for photography
                  loading={i < 3 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                />

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingImage(img);
                        setNewCaption(img.caption || "");
                        setNewGalleryId(gallery.id);
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      title="Edit Description"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageToDelete(img);
                      }}
                      className="p-2 bg-red-500/50 hover:bg-red-500/70 text-white rounded-full transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {img.caption && (
                <figcaption className="p-3 text-sm text-center text-foreground-muted bg-background/70">
                  {img.caption}
                </figcaption>
              )}

              <div className="p-4 flex justify-center bg-background/70 mt-auto">
                <Link
                  href="https://payhip.com/JRPhotoStore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-secondary text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary transition"
                >
                  Download
                </Link>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {openIndex !== null && (
        <Lightbox
          open={true}
          close={() => setOpenIndex(null)}
          index={openIndex}
          slides={gallery.images.map((img: GalleryImage) => ({
            src: img.image,
            description: img.caption || "",
          }))}
          plugins={[Thumbnails]}
        />
      )}

      {/* Edit Image Dialog */}
      <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image Description</DialogTitle>
            <DialogDescription>
              Update the caption and gallery for this photograph.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Gallery Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Gallery</label>
              <select
                value={newGalleryId}
                onChange={(e) => setNewGalleryId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg p-2 text-foreground focus:ring-2 focus:ring-accent outline-none"
              >
                {galleries.map((gal) => (
                  <option key={gal.id} value={gal.id}>
                    {gal.title}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Caption Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Enter description..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingImage(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveImageChanges}
              disabled={isSaving}
              className="bg-secondary hover:bg-primary text-foreground"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            {imageToDelete && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <Image
                  src={imageToDelete.image}
                  alt="Image to delete"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setImageToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteImage}
              disabled={isDeleting}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Image
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  );
}
