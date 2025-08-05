import React from 'react'
import Modal from '../modal'
import { Move } from 'lucide-react'
import ChangeVideoLocation from '@/components/forms/change-video-location'

type Props = {
    videoId: string
    currentWorkspace?: string
    currentFolder?: string
    currentFolderName?: string
}

const CardMenu = ({ videoId, currentWorkspace, currentFolder, currentFolderName }: Props) => {
    return (
        <Modal className='flex items-center cursor-pointer gap-x-2'
            title='Move to new Workspace/Folder' description='This action cannot be undone. This will permanently move delete your account and remove your data from our servers.' trigger={
                <Move size={20} fill='#a4a4a4' className='text-[#a4a4a4]' />
            } >
            <ChangeVideoLocation currentFolder={currentFolder} currentFolderName={currentFolderName} videoId={videoId} currentWorkSpace={currentWorkspace} />
        </Modal>
    )
}

export default CardMenu

//? 06:29:34