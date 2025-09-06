import { client } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  console.log('Endpoint hit ✅')

  try {
    // Skip database operations during build time or if no DATABASE_URL
    if (!process.env.DATABASE_URL || process.env.NEXT_PHASE === 'phase-production-build' || !client) {
      return NextResponse.json({ 
        status: 503, 
        message: 'Database not available during build' 
      })
    }

    const userProfile = await client.user.findUnique({
      where: {
        clerkid: id,
      },
      include: {
        studio: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })
    if (userProfile)
      return NextResponse.json({ status: 200, user: userProfile })
    const clerkUserInstance = await clerkClient.users.getUser(id)
    const createUser = await client.user.create({
      data: {
        clerkid: id,
        email: clerkUserInstance.emailAddresses[0].emailAddress,
        firstname: clerkUserInstance.firstName,
        lastname: clerkUserInstance.lastName,
        studio: {
          create: {},
        },
        workspace: {
          create: {
            name: `${clerkUserInstance.firstName}'s Workspace`,
            type: 'PERSONAL',
          },
        },
        subscription: {
          create: {},
        },
      },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    if (createUser) return NextResponse.json({ status: 201, user: createUser })

    return NextResponse.json({ status: 400 })
  } catch (error) {
    console.log('ERROR', error)
    // Return proper error response instead of undefined
    return NextResponse.json({ 
      status: 500, 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error : 'Database connection failed'
    })
  }
}
//! CHANGED FOR DEPLOYMENT