import React from 'react'
import Loader from '../loader'
import CardMenu from './video-card-menu'
import ChangeVideoLocation from '@/components/forms/change-video-location'

type Props = {
    User:{
        firstname: string | null
        lastname: string | null
        image: string | null
    } | null
    id: string
    Folder:{
        id: string
        name: string
    } | null
    createdAt: Date
    title: string | null
    source: string
    processing: boolean
    workspaceId: string
}

const VideoCard = ({ User, id, Folder, createdAt, title, source, processing, workspaceId }: Props) => {
    //! WIP: write up date
    return (
        <Loader state={false}>
            {/* <div className='overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl'>
                <div className='absolute top-3 right-3 z-50 flex flex-col gap-y-3'>
                    <CardMenu currentFolderName={Folder?.name} videoId={id} currentWorkspace={workspaceId} currentFolder={Folder?.id} />
                </div>
            </div> */}
            <ChangeVideoLocation currentFolder={Folder?.name} currentFolderName={Folder?.id} videoId={id} currentWorkSpace={workspaceId} />
        </Loader>
    )
}

export default VideoCard