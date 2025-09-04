import React, { useEffect, useRef } from 'react'


const WebCam = () => {
    const camElement = useRef<HTMLVideoElement | null>(null)
    const streamWebCam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })

        if(camElement.current){
            camElement.current.srcObject = stream
            await camElement.current.play();
        }
    }

    useEffect(() => {
        streamWebCam()
    }, [])

    return (
        <video 
            ref={camElement} 
            className='h-50 w-50 draggable object-cover rounded-full border-2 relative border-white'
        >
        </video>
    )
}

export default WebCam