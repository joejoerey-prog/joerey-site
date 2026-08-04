import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import existsSync from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { getGalleriesData, saveGalleriesData } from '@/lib/galleriesStore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { galleryId, imagePath, imageIndex } = body;

    if (!galleryId || (!imagePath && imageIndex === undefined)) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: galleryId and imagePath or imageIndex' },
        { status: 400 }
      );
    }

    const galleriesData = await getGalleriesData();

    const gallery = galleriesData.galleries.find(
      (g) => g.id.toLowerCase() === String(galleryId).toLowerCase()
    );

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: `Gallery with ID "${galleryId}" not found` },
        { status: 404 }
      );
    }

    let targetIndex = -1;
    if (imageIndex !== undefined && imageIndex >= 0 && imageIndex < gallery.images.length) {
      targetIndex = imageIndex;
    } else if (imagePath) {
      targetIndex = gallery.images.findIndex(
        (img) => img.image === imagePath || img.image.endsWith(imagePath)
      );
    }

    if (targetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Target image not found in gallery' },
        { status: 404 }
      );
    }

    const [removedImage] = gallery.images.splice(targetIndex, 1);

    // Save updated JSON to persistent cloud storage & local disk
    const savedToCloud = await saveGalleriesData(galleriesData);

    // Attempt physical file removal from public directory if accessible
    let fileDeleted = false;
    let fileDeleteNote = savedToCloud ? 'Saved to cloud database.' : 'Saved locally.';

    if (removedImage && removedImage.image) {
      const relPath = removedImage.image.replace(/^\//, '');
      const primaryDiskPath = path.join(process.cwd(), 'public', relPath);

      if (existsSync.existsSync(primaryDiskPath)) {
        try {
          await fs.unlink(primaryDiskPath);
          fileDeleted = true;
          fileDeleteNote += ` Deleted local file ${relPath}.`;
        } catch (err: any) {
          fileDeleteNote += ` Could not delete local file: ${err.message}.`;
        }
      }

      // Check if filename also exists in public/photos/{galleryId}/
      const filename = path.basename(relPath);
      const secondaryDiskPath = path.join(process.cwd(), 'public', 'photos', galleryId, filename);
      if (existsSync.existsSync(secondaryDiskPath)) {
        try {
          await fs.unlink(secondaryDiskPath);
          fileDeleted = true;
        } catch (_) {
          // ignore secondary error
        }
      }
    }

    // Revalidate paths for Next.js ISR/SSG
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin', 'page');
      revalidatePath(`/gallery/${galleryId}`, 'page');
    } catch (_) {
      // ignore revalidation warnings
    }

    return NextResponse.json({
      success: true,
      message: `Image and metadata removed successfully. ${fileDeleteNote}`,
      fileDeleted,
      removedImage,
      galleries: galleriesData.galleries,
    });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
