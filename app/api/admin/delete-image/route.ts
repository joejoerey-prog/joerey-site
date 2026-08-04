import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import existsSync from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { getGalleriesData } from '@/lib/galleries';

export const dynamic = 'force-dynamic';

async function commitGalleriesJsonToGitHub(newContentJson: string, commitMessage: string): Promise<{ success: boolean; error?: string }> {
  const owner = 'joejoerey-prog';
  const repo = 'joerey-site';
  const pathInRepo = 'data/galleries.json';
  const token = process.env.GITHUB_TOKEN || 'PmQI7K4psVrienk';

  const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}`;
  const authHeader = token.startsWith('ghp_') || token.startsWith('github_pat_')
    ? `Bearer ${token}`
    : `token ${token}`;

  try {
    const res = await fetch(getFileUrl, {
      headers: {
        Authorization: authHeader,
        'User-Agent': 'Next.js Admin Image Remover',
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Failed to get galleries.json metadata from GitHub:', errText);
      return { success: false, error: `GitHub GET failed: ${res.status} ${errText}` };
    }

    const fileData = await res.json();
    const currentSha = fileData.sha;

    const contentBase64 = Buffer.from(newContentJson, 'utf-8').toString('base64');
    const putRes = await fetch(getFileUrl, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'User-Agent': 'Next.js Admin Image Remover',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentBase64,
        sha: currentSha,
        branch: 'main',
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      console.error('Failed to commit galleries.json update to GitHub:', errText);
      return { success: false, error: `GitHub PUT commit failed: ${putRes.status} ${errText}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('GitHub API commit error:', err.message);
    return { success: false, error: err.message };
  }
}

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

    // Read current live galleries dataset
    const galleriesData: any = await getGalleriesData();

    const gallery = galleriesData.galleries.find(
      (g: any) => g.id.toLowerCase() === String(galleryId).toLowerCase()
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
        (img: any) => img.image === imagePath || img.image.endsWith(imagePath)
      );
    }

    if (targetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Target image not found in gallery' },
        { status: 404 }
      );
    }

    const [removedImage] = gallery.images.splice(targetIndex, 1);
    const jsonString = JSON.stringify(galleriesData, null, 2);

    // Save locally if filesystem is writable
    try {
      const dataFilePath = path.join(process.cwd(), 'data', 'galleries.json');
      await fs.writeFile(dataFilePath, jsonString, 'utf-8');
    } catch (_) {
      // ignore read-only lambda warning
    }

    // Commit change directly to GitHub repository
    const commitMsg = `chore(admin): remove image ${removedImage?.image || targetIndex} from gallery ${galleryId}`;
    const commitResult = await commitGalleriesJsonToGitHub(jsonString, commitMsg);

    // Attempt local image file deletion
    let fileDeleted = false;
    if (removedImage && removedImage.image) {
      const relPath = removedImage.image.replace(/^\//, '');
      const primaryDiskPath = path.join(process.cwd(), 'public', relPath);

      if (existsSync.existsSync(primaryDiskPath)) {
        try {
          await fs.unlink(primaryDiskPath);
          fileDeleted = true;
        } catch (_) {}
      }
    }

    // Revalidate Next.js cache
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin', 'page');
      revalidatePath(`/gallery/${galleryId}`, 'page');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: commitResult.success
        ? 'Image removed and committed directly to GitHub repository.'
        : `Image removed locally, but GitHub commit failed: ${commitResult.error}`,
      committedToGit: commitResult.success,
      gitError: commitResult.error || null,
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
