import  prisma  from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { id } = params

  if (id === 'default-user-id') {
    return NextResponse.json({ status: 200 })
  }

  try {
    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkid: id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find the video by filename
    const existingVideo = await prisma.video.findFirst({
      where: { source: body.filename },
    })

    if (!existingVideo) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    await prisma.video.update({
      where: { id: existingVideo.id },
      data: {
        processing: false,
        source: body.videoUrl, // Update source with Cloudinary URL
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to complete processing' },
      { status: 500 }
    )
  }

  return NextResponse.json({ status: 200 })
}


//! CHANGED FOR DEPLOYMENT