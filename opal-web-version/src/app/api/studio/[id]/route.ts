import prisma  from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('CALLED')
  const { id } = params
  const body = await req.json()

  // Check if the ID is a Clerk ID (starts with 'user_') or database ID
  const whereClause = id.startsWith('user_') 
    ? { clerkid: id }  // It's a Clerk ID
    : { id }           // It's a database ID

  const studio = await prisma.user.update({
    where: whereClause,
    data: {
      studio: {
        update: {
          screen: body.screen,
          mic: body.audio,
          preset: body.preset,
        },
      },
    },
  })

  if (studio)
    return NextResponse.json({ status: 200, message: 'Studio updated!' })

  return NextResponse.json({
    status: '400',
    message: 'Oops! something went wrong',
  })
}

//? 13:16:31

//! CHANGED FOR DEPLOYMENT