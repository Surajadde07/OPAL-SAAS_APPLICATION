const express = require('express')
const app = express()
const { Server } = require('socket.io')
const fs = require('fs')
const cors = require('cors')
const http = require('http')
const { default: axios } = require('axios')
const { v2: cloudinary } = require('cloudinary')
const OpenAI = require('openai')
const dotenv = require('dotenv')
dotenv.config()

app.use(cors())
const server = http.createServer(app)

// Configure OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
})

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const io = new Server(server, {
    cors: {
        origin: process.env.ELECTRON_HOST,
        methods: ["GET", "POST"]
    },
})

let recordedChunks = [];

io.on('connection', (socket) => {
    console.log('🟢 Socket Is Connected')
    
    socket.on('video-chunks', async (data) => {
        console.log('🟢 Video Chunks sent')
        recordedChunks.push(data.chunks)
        console.log('🟢 Chunks Saved')
    })
    
    socket.on('process-video', async (data) => {
        console.log('🟡 Processing Video...')
        
        try {
            // Create the video file from all recorded chunks
            console.log('📝 Creating video file from', recordedChunks.length, 'chunks')
            const videoBlob = new Blob(recordedChunks, {
                type: 'video/webm; codecs=vp9',
            })
            const buffer = Buffer.from(await videoBlob.arrayBuffer())
            
            // Ensure temp_upload directory exists
            if (!fs.existsSync('temp_upload')) {
                fs.mkdirSync('temp_upload')
            }
            
            // Write the complete file
            fs.writeFileSync(`temp_upload/${data.filename}`, buffer)
            
            // Check file was created successfully
            const stats = fs.statSync(`temp_upload/${data.filename}`)
            console.log('📊 File created successfully, size:', stats.size, 'bytes')
            
            if (stats.size === 0) {
                console.log('🔴 Error: File is empty after creation')
                return
            }
            
            // Clear the chunks array
            recordedChunks = []

            // Upload to Cloudinary
            console.log('📤 Starting Cloudinary upload...')
            const uploadResult = await cloudinary.uploader.upload(
                `temp_upload/${data.filename}`,
                {
                    resource_type: "video",
                    public_id: data.filename.replace('.webm', ''),
                    folder: "opal-recordings",
                    quality: "auto",
                }
            )

            // Start processing in your Next.js API with Cloudinary URL
            const processing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/processing`, {
                filename: data.filename,
                cloudinaryUrl: uploadResult.secure_url // Send the Cloudinary URL
            })

            if (uploadResult.secure_url) {
                console.log('🟢 Video Uploaded To Cloudinary')
                console.log('📹 Video URL:', uploadResult.secure_url)
                console.log('� Public ID:', uploadResult.public_id)

                // Handle AI transcription for PRO users (skip if quota exceeded)
                if (processing.data && processing.data.plan === 'PRO') {
                    fs.stat('temp_upload/' + data.filename, async (err, stat) => {
                        if (!err && stat.size < 25000000) {
                            try {
                                const transcription = await openai.audio.transcriptions.create({
                                    file: fs.createReadStream(`temp_upload/${data.filename}`),
                                    model: 'whisper-1',
                                    response_format: 'text'
                                })

                                if (transcription) {
                                    const completion = await openai.chat.completions.create({
                                        model: 'gpt-3.5-turbo',
                                        response_format: { type: 'json_object' },
                                        messages: [
                                            {
                                                role: 'system',
                                                content: `You are going to generate a title and a nice description using the speech to text transcription provided: transcription(${transcription}) and then return it in json format as {"title": <the title you gave>, "summary": <the summary you created>}`,
                                            }
                                        ]
                                    })

                                    const titleAndSummaryGenerated = await axios.post(
                                        `${process.env.NEXT_API_HOST}recording/${data.userId}/transcribe`,
                                        {
                                            filename: data.filename,
                                            content: completion.choices[0].message.content,
                                            transcript: transcription,
                                        }
                                    )
                                    
                                    if (titleAndSummaryGenerated.data.status !== 200) {
                                        console.log('🔴 Error: Something went wrong when creating the title and description')
                                    }
                                }
                            } catch (transcriptionError) {
                                console.error('🔴 Transcription Error:', transcriptionError.message || transcriptionError)
                                // If it's a quota error, log it but don't fail the upload
                                if (transcriptionError.code === 'insufficient_quota') {
                                    console.log('⚠️ OpenAI quota exceeded - skipping transcription for this video')
                                } else {
                                    console.log('⚠️ Transcription failed - continuing without AI features')
                                }
                            }
                        }
                    })
                }

                // Complete the processing with Cloudinary info
                const stopProcessing = await axios.post(
                    `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
                    {
                        filename: data.filename,
                        videoUrl: uploadResult.secure_url,
                        publicId: uploadResult.public_id,
                        duration: uploadResult.duration,
                        size: uploadResult.bytes,
                        format: uploadResult.format
                    }
                )
                
                if (stopProcessing.data.status !== 200) {
                    console.log('🔴 Error: Something went wrong when stopping the processing and try to complete the processing stage.')
                } else {
                    console.log('✅ Video processing completed successfully!')
                    // Clean up temporary file
                    fs.unlink('temp_upload/' + data.filename, (err) => {
                        if (!err) {
                            console.log(data.filename + ' ' + '🟢 deleted successfully')
                        }
                    })
                }
            } else {
                console.log('🔴 Error: Cloudinary Upload Failed!')
            }
        } catch (error) {
            console.error('🔴 Error processing video:', error)
        }
    })
    
    socket.on('disconnect', async (data) => {
        console.log('🔴 Socket.id Is Disconnected', socket.id)
    })
})

server.listen(5001, () => {
    console.log('🟢 Listening to port 5001')
    console.log('📹 Using Cloudinary for video storage and processing')
})


//? 13:58:16
//? 14:09:39
//? 14:25:59
//? 14:35:59 -> for credentials env
//? 15:11:10