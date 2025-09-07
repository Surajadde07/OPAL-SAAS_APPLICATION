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
    // Add database connection check
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured')
      return NextResponse.json({ 
        status: 500, 
        error: 'Database not configured' 
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
    console.error('Auth API Error:', error)
    // Return more detailed error information for debugging
    return NextResponse.json({ 
      status: 500, 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? String(error) : 'Authentication failed'
    })
  }
}

//! CHANGED FOR DEPLOYMENT