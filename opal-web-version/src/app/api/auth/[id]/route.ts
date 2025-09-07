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
    // Import these dynamically to avoid build-time issues
    const { prisma } = await import('@/lib/prisma')
    const { clerkClient } = await import('@clerk/nextjs/server')

    const userProfile = await prisma.user.findUnique({
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

    if (userProfile) {
      return NextResponse.json({ status: 200, user: userProfile })
    }

    // User doesn't exist, create new user
    const clerkUserInstance = await clerkClient.users.getUser(id)
    const createUser = await prisma.user.create({
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

    if (createUser) {
      return NextResponse.json({ status: 201, user: createUser })
    }

    return NextResponse.json({ status: 400 })
  } catch (error) {
    console.log('ERROR', error)
    return NextResponse.json({ 
      status: 500, 
      error: 'Internal server error'
    })
  }
}


//! CHANGED FOR DEPLOYMENT