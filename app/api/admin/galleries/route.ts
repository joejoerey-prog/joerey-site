import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'galleries.json');
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const galleriesData = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      galleries: galleriesData.galleries || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to read gallery data' },
      { status: 500 }
    );
  }
}
