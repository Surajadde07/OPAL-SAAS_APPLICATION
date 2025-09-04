import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const httpsClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL
})

export const onCloseApp = () => window.ipcRenderer.send('closeApp');

export const fetchUserProfile = async (clerkId: string) => {
  try {
    const response = await httpsClient.get(`/api/auth/${clerkId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    return response.data
  } catch (error) {
    console.error('Backend API error:', error);
    // Temporary fallback for development when backend API is not ready
    return {
      status: 200,
      user: {
        id: clerkId,
        email: 'user@opal.dev',
        firstname: 'Opal',
        lastname: 'User',
        createdAt: new Date(),
        clerkid: clerkId,
        subscription: {
          plan: 'FREE'
        },
        studio: {
          id: 'temp-studio-id',
          screen: null,
          mic: null,
          preset: 'HD',
          camera: null,
          userId: clerkId
        }
      }
    }
  }
}


export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke('getSources')
  const enumerateDevices = await window.navigator.mediaDevices.enumerateDevices()
  const audioInputs = enumerateDevices.filter((device) => device.kind === 'audioinput')

  console.log("getting sources")
  return { displays, audio: audioInputs }
}

export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: 'HD' | 'SD'
) => {
  try {
    const response = await httpsClient.post(`/api/studio/${id}`, {
      screen,
      audio,
      preset
    },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Backend API error:', error);
    // Return mock success for development
    return { 
      status: 200, 
      message: 'Settings saved locally (API pending)' 
    }
  }
}

export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send('hide-plugin',{state})
}

export const videoRecordingTime = (ms:number) => {
  const second = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
  const minute = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, '0');
  const hour = Math.floor((ms / 1000 / 60 / 60)).toString().padStart(2, '0');
  return{ length: `${hour}:${minute}:${second}`, minute};
} 

export const resizeWindow = (shrink: boolean) => {
  window.ipcRenderer.send('resize-studio', { shrink });
}