'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Search,
  X,
  FileText,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface GalleryImage {
  image: string;
  caption?: string;
  title?: string;
  alt?: string;
  description?: string;
}

interface Gallery {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
}

export default function AdminPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [activeGalleryId, setActiveGalleryId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Confirmation Modal state
  const [targetImage, setTargetImage] = useState<{
    galleryId: string;
    imagePath: string;
    imageIndex: number;
    filename: string;
    caption?: string;
    title?: string;
  } | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchGalleries = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/galleries', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.galleries)) {
        setGalleries(data.galleries);
        if (!activeGalleryId && data.galleries.length > 0) {
          setActiveGalleryId(data.galleries[0].id);
        }
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Failed to load gallery data.',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: 'Network error fetching gallery data: ' + err.message,
      });
    } finally {
      setLoading(false);
      if (showRefreshSpinner) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const activeGallery = galleries.find((g) => g.id === activeGalleryId);

  const filteredImages = activeGallery
    ? activeGallery.images.filter((img, idx) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const filename = img.image.split('/').pop() || '';
        return (
          filename.toLowerCase().includes(term) ||
          (img.caption && img.caption.toLowerCase().includes(term)) ||
          (img.title && img.title.toLowerCase().includes(term)) ||
          (img.alt && img.alt.toLowerCase().includes(term))
        );
      })
    : [];

  const handleConfirmDelete = async () => {
    if (!targetImage) return;

    setDeleting(true);
    setNotification(null);

    try {
      const res = await fetch('/api/admin/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          galleryId: targetImage.galleryId,
          imagePath: targetImage.imagePath,
          imageIndex: targetImage.imageIndex,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setNotification({
          type: 'success',
          message: `Removed ${targetImage.filename} cleanly from ${activeGallery?.title || 'gallery'}. ${result.message || ''}`,
        });

        // Update local state immediately
        setGalleries((prevGalleries) =>
          prevGalleries.map((g) => {
            if (g.id === targetImage.galleryId) {
              const updatedImages = [...g.images];
              updatedImages.splice(targetImage.imageIndex, 1);
              return { ...g, images: updatedImages };
            }
            return g;
          })
        );
      } else {
        setNotification({
          type: 'error',
          message: `Deletion failed: ${result.error || 'Unknown error'}`,
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: `Deletion request failed: ${err.message}`,
      });
    } finally {
      setDeleting(false);
      setTargetImage(null);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="border-b border-border bg-background-alt px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors py-1 px-3 rounded-lg border border-border bg-background hover:bg-background-alt"
            >
              <ArrowLeft size={16} />
              <span>Back to Site</span>
            </Link>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground flex items-center gap-2">
                <span>Gallery Admin</span>
                <span className="text-xs uppercase px-2 py-0.5 rounded bg-accent/15 text-accent font-semibold tracking-wider">
                  Management Tool
                </span>
              </h1>
              <p className="text-xs text-foreground-muted">
                Manage gallery images, descriptions, and metadata cleanly.
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchGalleries(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-background-alt transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-3 shadow-md transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'success' ? (
                <CheckCircle2 size={20} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle size={20} className="text-rose-400 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium leading-relaxed">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-foreground-muted hover:text-foreground p-1 rounded-md"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-foreground-muted gap-3">
            <RefreshCw size={32} className="animate-spin text-accent" />
            <p className="text-base font-medium">Loading galleries...</p>
          </div>
        ) : (
          <>
            {/* Gallery Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-3">
              {galleries.map((gallery) => {
                const isActive = gallery.id === activeGalleryId;
                return (
                  <button
                    key={gallery.id}
                    onClick={() => {
                      setActiveGalleryId(gallery.id);
                      setSearchTerm('');
                    }}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent text-white shadow-md'
                        : 'bg-background-alt text-foreground-muted hover:text-foreground hover:bg-background border border-border'
                    }`}
                  >
                    <span>{gallery.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white font-semibold'
                          : 'bg-background text-foreground-muted'
                      }`}
                    >
                      {gallery.images.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Gallery Info & Search Bar */}
            {activeGallery && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-alt/50 p-4 rounded-xl border border-border">
                <div>
                  <h2 className="text-lg font-serif font-bold text-foreground">
                    {activeGallery.title}
                  </h2>
                  <p className="text-xs text-foreground-muted max-w-2xl mt-0.5">
                    {activeGallery.description}
                  </p>
                </div>

                <div className="relative w-full md:w-72">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                  />
                  <input
                    type="text"
                    placeholder="Search filename or caption..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Gallery Images Grid */}
            {filteredImages.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-border rounded-xl p-8 bg-background-alt/20">
                <ImageIcon size={40} className="mx-auto text-foreground-muted opacity-40 mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">
                  No images found
                </h3>
                <p className="text-xs text-foreground-muted max-w-sm mx-auto">
                  {searchTerm
                    ? `No images in ${activeGallery?.title} match "${searchTerm}".`
                    : `There are currently no images assigned to ${activeGallery?.title}.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((img) => {
                  const filename = img.image.split('/').pop() || img.image;
                  const realIndex = activeGallery!.images.indexOf(img);

                  return (
                    <div
                      key={`${img.image}-${realIndex}`}
                      className="group rounded-xl border border-border bg-background overflow-hidden flex flex-col justify-between hover:border-accent/50 transition-all shadow-sm hover:shadow-md"
                    >
                      <div>
                        {/* Image Preview */}
                        <div className="relative w-full aspect-[4/3] bg-background-alt overflow-hidden border-b border-border">
                          <Image
                            src={img.image}
                            alt={img.alt || img.title || filename}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>

                        {/* Metadata Details */}
                        <div className="p-4 flex flex-col gap-2.5 text-xs">
                          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                            <span className="font-mono text-xs font-semibold text-accent truncate bg-accent/10 px-2 py-0.5 rounded">
                              {filename}
                            </span>
                            <span className="text-[11px] text-foreground-muted shrink-0">
                              #{realIndex + 1}
                            </span>
                          </div>

                          {img.title && (
                            <div>
                              <span className="font-semibold text-foreground block mb-0.5">
                                Title:
                              </span>
                              <span className="text-foreground-muted">{img.title}</span>
                            </div>
                          )}

                          <div>
                            <span className="font-semibold text-foreground block mb-0.5 flex items-center gap-1">
                              <FileText size={12} className="text-foreground-muted" />
                              <span>Description / Caption:</span>
                            </span>
                            <p className="text-foreground-muted leading-relaxed line-clamp-3 bg-background-alt/50 p-2 rounded border border-border/40 italic">
                              {img.caption || img.description || 'No caption provided'}
                            </p>
                          </div>

                          {img.alt && (
                            <div>
                              <span className="font-semibold text-foreground block mb-0.5">
                                Alt Text:
                              </span>
                              <span className="text-foreground-muted">{img.alt}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="p-3 bg-background-alt border-t border-border mt-2 flex justify-end">
                        <button
                          onClick={() =>
                            setTargetImage({
                              galleryId: activeGallery!.id,
                              imagePath: img.image,
                              imageIndex: realIndex,
                              filename,
                              caption: img.caption || img.description,
                              title: img.title,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-600 border border-rose-800/40 hover:border-rose-600 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                          <span>Remove Image</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {targetImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 relative">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-foreground">
                  Confirm Image Deletion
                </h3>
                <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                  Are you sure you want to remove this image and its metadata? This action will cleanly remove the entry from live site data and disk storage.
                </p>
              </div>
            </div>

            {/* Target Preview */}
            <div className="flex items-center gap-3 p-3 bg-background-alt rounded-xl border border-border text-xs">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-black/20">
                <Image
                  src={targetImage.imagePath}
                  alt={targetImage.filename}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="font-mono font-semibold text-foreground truncate">
                  {targetImage.filename}
                </p>
                <p className="text-foreground-muted line-clamp-2 mt-0.5 italic">
                  {targetImage.caption || 'No description'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setTargetImage(null)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium text-foreground-muted hover:text-foreground border border-border rounded-lg bg-background hover:bg-background-alt transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-md disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Yes, Delete Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
