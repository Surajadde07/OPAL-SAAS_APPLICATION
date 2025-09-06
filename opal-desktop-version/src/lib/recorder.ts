import { hidePluginWindow } from "./utils"
import { v4 as uuid} from "uuid"
import io from 'socket.io-client'

let videoTransferFileName: string | undefined
let mediaRecorder: MediaRecorder
let userId: string

const socket = io(import.meta.env.VITE_SOCKET_URL as string)

export const StartRecording = async (onSuccess: {
    screen: string
    audio: string
    id: string
}) => {
    try {
        // Use the Electron-compatible approach
        await selectSources({
            screen: onSuccess.screen,
            audio: onSuccess.audio,
            id: onSuccess.id,
            preset: 'HD'
        }, { current: null }); // Pass null video element since we don't need preview
        
        // After sources are configured, start recording
        startRecordingWithSources();
        
    } catch (error) {
        console.error('Error starting recording:', error);
        hidePluginWindow(false);
        throw error;
    }
}

export const onStopRecording = () => mediaRecorder.stop()
const stopRecording = () => {
    hidePluginWindow(false)
    socket.emit('process-video',{
        filename: videoTransferFileName,
        userId
    })
}
export const onDataAvailable = (e:BlobEvent) => {
    socket.emit('video-chunks',{
        chunks: e.data,
        filename: videoTransferFileName
    })
}

export const selectSources = async (
    onSources: {
        screen: string
        audio: string
        id: string
        preset: 'HD' | 'SD'
    },
    videoElement?: React.RefObject<HTMLVideoElement>
) => {
    try {
        if(onSources && onSources.screen && onSources.audio && onSources.id) {
            const constraints: any = {
                audio: false,
                video:{
                    mandatory:{
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: onSources?.screen,
                        minWidth: onSources.preset === 'HD' ? 1920 : 1280,
                        maxWidth: onSources.preset === 'HD' ? 1920 : 1280,
                        minHeight: onSources.preset === 'HD' ? 1080 : 720,
                        maxHeight: onSources.preset === 'HD' ? 1080 : 720,
                        frameRate: 30
                    }
                }
            }

            userId = onSources?.id

            const stream = await navigator.mediaDevices.getUserMedia(constraints)

            const audioStream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {deviceId: {exact: onSources.audio}},
            })

            // Set video preview if element is provided
            if(videoElement && videoElement.current) {
                videoElement.current.srcObject = stream
                await videoElement.current.play();
            }

            const combineStream = new MediaStream([
                ...stream.getTracks(),
                ...audioStream.getTracks()
            ])

            mediaRecorder = new MediaRecorder(combineStream,{
                mimeType: 'video/webm; codecs=vp9',
            })

            mediaRecorder.ondataavailable = onDataAvailable
            mediaRecorder.onstop = stopRecording
        }
    } catch (error) {
        console.error('Error selecting sources:', error);
        throw error;
    }
}

export const startRecordingWithSources = () => {
    if (!mediaRecorder) {
        console.error('MediaRecorder not initialized. Please select sources first.');
        return;
    }
    
    try {
        hidePluginWindow(true);
        videoTransferFileName = `${uuid()}-recording.webm`;
        // userId is already set from onSources?.id in selectSources function
        console.log('Using authenticated user ID:', userId);
        
        mediaRecorder.start(1000);
        console.log('Recording started successfully');
        
    } catch (error) {
        console.error('Error starting recording:', error);
        hidePluginWindow(false);
        throw error;
    }
}

//? 13:42:23

//! CHANGED