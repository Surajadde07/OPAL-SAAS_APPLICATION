import React from 'react'

type Props = {
    videoId: string
    currentFolder?: string
    currentWorkspace?: string
    currentFolderName?: string
}

const ChangeVideoLocation = ({ videoId, currentFolder, currentWorkspace, currentFolderName }: Props) => {
    return (
        <form className='flex flex-col gap-y-3'>
            <div className='border-[1px] rounded-xl p-5'>
                <h2 className='text-sx mb-5 text-[#a4a4a4]'>Current</h2>
                <p className='text-[#a4a4a4]'>
                    Workspace
                </p>
                <p className='text-[#a4a4a4] text-sm'>This video has no folder</p>
            </div>
        </form>
    )
}

export default ChangeVideoLocation