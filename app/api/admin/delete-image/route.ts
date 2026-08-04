import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import existsSync from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

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

    const dataFilePath = path.join(process.cwd(), 'data', 'galleries.json');
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const galleriesData = JSON.parse(fileContent);

    const gallery = galleriesData.galleries.find(
      (g: { id: string }) => g.id.toLowerCase() === String(galleryId).toLowerCase()
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
        (img: { image: string }) => img.image === imagePath || img.image.endsWith(imagePath)
      );
    }

    if (targetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Target image not found in gallery' },
        { status: 404 }
      );
    }

    const [removedImage] = gallery.images.splice(targetIndex, 1);

    // Save updated JSON
    await fs.writeFile(dataFilePath, JSON.stringify(galleriesData, null, 2), 'utf-8');

    // Attempt physical file removal from public directory
    let fileDeleted = false;
    let fileDeleteNote = '';

    if (removedImage && removedImage.image) {
      const relPath = removedImage.image.replace(/^\//, '');
      const primaryDiskPath = path.join(process.cwd(), 'public', relPath);

      if (existsSync.existsSync(primaryDiskPath)) {
        try {
          await fs.unlink(primaryDiskPath);
          fileDeleted = true;
          fileDeleteNote = `Deleted file at ${relPath}`;
        } catch (err: any) {
          fileDeleteNote = `Failed to delete file: ${err.message}`;
        }
      } else {
        fileDeleteNote = `File did not exist on disk at ${relPath}`;
      }

      // Check if filename also exists in public/photos/{galleryId}/
      const filename = path.basename(relPath);
      const secondaryDiskPath = path.join(process.cwd(), 'public', 'photos', galleryId, filename);
      if (existsSync.existsSync(secondaryDiskPath)) {
        try {
          await fs.unlink(secondaryDiskPath);
          fileDeleted = true;
          fileDeleteNote += ` (also deleted from photos/${galleryId}/${filename})`;
        } catch (_) {
          // ignore secondary error
        }
      }
    }

    // Revalidate paths for Next.js ISR/SSG
    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/gallery/${galleryId}`, 'page');
    } catch (_) {
      // ignore revalidation warnings in dev mode
    }

    return NextResponse.json({
      success: true,
      message: `Image and metadata removed successfully. ${fileDeleteNote}`,
      fileDeleted,
      removedImage,
    });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
