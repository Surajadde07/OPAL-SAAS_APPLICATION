'use client'

import { getAllUserVideos } from '@/app/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { cn } from '@/lib/utils'
import { VideosProps } from '@/types/index.type'
import { VideoIcon } from 'lucide-react'
import React from 'react'
import VideoCard from './video-card'

type Props = {
    folderId: string
    videoKey: string
    workspaceId: string
}

const video = {
    User: {
        firstname: 'John',
        lastname: 'Doe',
        image: "https://example.com/image.jpg"
    },
    id: 'video123',
    processing: false,
    Folder: {
        id: 'folder456',
        name: 'Marketing Videos'
    },
    createdAt: new Date('2023-10-01T12:00:00Z'),
    title: 'Sample Video',
    source: 'https://example.com/video.mp4'
}
const Videos = ({ folderId, videoKey, workspaceId }: Props) => {

    const { data: videoData } = useQueryData([videoKey], () => getAllUserVideos(folderId))

    //! WIP: Add videos logic
    const { status: videosStatus, data: videos } = videoData as VideosProps
    return (
        <div className='flex flex-col gap-4 mt-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <VideoIcon />
                    <h2 className='text-[#BDBDBD] text-xl'>Videos</h2>
                </div>
            </div>
            <section className={cn(videosStatus !== 200 ? 'p-5' : 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5')}>
                {videosStatus === 200 ? videos.map((video) => <VideoCard key={video.id} workspaceId={workspaceId} {...video} />) : <p className='text-[#BDBDBD]'>No videos in workspace</p>}
            </section>
        </div>
    )
}

export default Videos

//? 06:24:38