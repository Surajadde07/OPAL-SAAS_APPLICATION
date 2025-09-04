const express = require('express')
const app = express()
const { Server } = require('socket.io')
const fs = require('fs')
const cors = require('cors')
const http = require('http')
const { Readable } = require('stream')
const { default: axios } = require('axios')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const OpenAI = require('openai')
const dotenv = require('dotenv')
dotenv.config()
app.use(cors())
const server = http.createServer(app)

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
})

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
    region: process.env.BUCKET_REGION
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
        const writestream = fs.createWriteStream('temp_upload/' + data.filename)
        recordedChunks.push(data.chunks)
        const videoBlob = new Blob(recordedChunks, {
            type: 'video/webm; codecs=vp9',
        })
        const buffer = Buffer.from(await videoBlob.arrayBuffer())
        const readStream = Readable.from(buffer)
        readStream.pipe(writestream).on('finish', () => {
            console.log('🟢 Chunks Saved')
        })
    })
    socket.on('process-video', async (data) => {
        console.log('🟡 Processing Video...')
        recordedChunks = []
        fs.readFile('temp_upload/' + data.filename, async (err, file) => {
            const processing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,{
                filename: data.filename
            })
            if (processing.data.status !== 200) {
                return console.log('🔴 Error: Something went wrong with creating the processing file')
            }
            const Key = data.filename
            const Bucket = process.env.BUCKET_NAME
            const ContentType = 'video/webm'
            const command = new PutObjectCommand({
                Key,
                Bucket,
                ContentType,
                Body: file,
            })

            const fileStatus = await s3.send(command)

            if (fileStatus['$metadata'].httpStatusCode === 200) {
                console.log('🟢 Video Uploaded To AWS')

                if (processing.data.plan === 'PRO') {
                    fs.stat('temp_upload/' + data.filename, async (err, stat) => {
                        if (!err) {

                            if (stat.size < 25000000) {
                                const transcription = await openai.audio.transcriptions.create({
                                    file: fs.createReadStream(`temp_upload/${data.filename}`),
                                    model: 'whisper-1',
                                    response_format: 'text'
                                })

                                if (transcription) {
                                    const completion = await openai.chat.completions.create({
                                        model: 'gpt-3.5-turbo',
                                        response_format: { type: 'json_object' },
                                        message: [
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
                                            transcript: transcription
                                        }
                                    )
                                    if (titleAndSummaryGenerated.data.status !== 200){
                                        console.log('🔴 Error: Something went wrong when creating the title and description')
                                    }
                                }
                            }
                        }
                    })
                }
                const stopProcessing = await axios.post(
                    `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,{
                        filename: data.filename
                    }
                )
                if(stopProcessing.data.status !== 200){
                    console.log('🔴 Error: Something went wrong when stopping the processing and try to complete the processing stage.')
                }
                if(stopProcessing.data.status === 200){
                    fs.unlink('temp_upload/' + data.filename, (err) => {
                        if(!err){
                            console.log(data.filename + ' ' + '🟢 deleted successfully')
                        }
                    })
                }
            }
            else{
                console.log('🔴 Error: Upload Failed! process aborted')
            }
        })
    })
    socket.on('disconnect', async (data) => {
        console.log('🔴 Socket.id Is Disconnected', socket.id)
    })
})

server.listen(5000, () => {
    console.log('🟢 Listening to port 5000')
})


//? 13:58:16
//? 14:09:39
//? 14:25:59
//? 14:35:59 -> for credentials env
//? 15:11:10