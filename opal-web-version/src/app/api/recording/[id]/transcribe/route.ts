import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        //WIRE UP AI AGENT
        const body = await req.json()
        const { id } = params

        const content = JSON.parse(body.content)

        console.log('🎯 Processing transcription for user:', id)
        console.log('📝 Title:', content.title)
        console.log('📝 Summary:', content.summary)

        // Import prisma dynamically to avoid build-time issues
        const { default: prisma } = await import('@/lib/prisma')

        const transcribed = await prisma.video.update({
            where: {
                userId: id,
                source: body.filename,
            },
            data: {
                title: content.title,
                description: content.summary,
                summery: body.transcript,
            },
        })

        if (transcribed) {
            console.log('🟢 Transcribed')
            const options = {
                method: 'POST',
                url: process.env.VOICEFLOW_KNOWLEDGE_BASE_API,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: process.env.VOICEFLOW_API_KEY,
                },
                data: {
                    data: {
                        schema: {
                            searchableFields: ['title', 'transcript'],
                            metadataFields: ['title', 'transcript'],
                        },
                        name: content.title,
                        items: [
                            {
                                title: content.title,
                                transcript: body.transcript,
                            },
                        ],
                    },
                },
            }

            const updateKB = await axios.request(options)

            if (updateKB.status === 200 || updateKB.status !== 200) {
                console.log(updateKB.data)
                return NextResponse.json({ status: 200 })
            }
        }

        console.log('🔴 Transcription went wrong')
        return NextResponse.json({ status: 400 })

    } catch (error) {
        console.error('❌ Transcription error:', error)
        return NextResponse.json(
            { error: 'Failed to process transcription' },
            { status: 500 }
        )
    }
}

//! CHANGED FOR DEPLOYMENT
