import { NextResponse } from 'next/server';
import { list } from '@vercel/blob'

export async function POST(request: Request): Promise<NextResponse> {
  const images = await list()

  return NextResponse.json(images.blobs);
}