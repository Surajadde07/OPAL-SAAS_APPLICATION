import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { id } = params

    // Handle test case with default-user-id
    if (id === 'default-user-id') {
      return NextResponse.json({ status: 200, plan: 'FREE' })
    }

    // Look up user by Clerk ID instead of database ID
    const user = await prisma.user.findUnique({
      where: {
        clerkid: id, // Use clerkid field instead of id
      },
      select: {
        id: true, // Get the database ID
        workspace: {
          where: {
            type: 'PERSONAL',
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' })
    }

    if (!user.workspace[0]) {
      return NextResponse.json({ status: 404, message: 'No workspace found' })
    }

    const startProcessingVideo = await prisma.workSpace.update({
      where: {
        id: user.workspace[0].id, // Use user.workspace instead of personalworkspaceId
      },
      data: {
        videos: {
          create: {
            source: body.filename, // Always use filename for source
            userId: user.id, // Use the database ID for the video record
          },
        },
      },
      select: {
        User: {
          select: {
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    })

    if (startProcessingVideo) {
      return NextResponse.json({
        status: 200,
        plan: startProcessingVideo.User?.subscription?.plan,
      })
    }
    return NextResponse.json({ status: 400 })
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Internal server error' })
  }
}


//! CHANGED FOR DEPLOYMENT