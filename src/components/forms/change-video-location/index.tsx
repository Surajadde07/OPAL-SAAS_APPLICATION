import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useMoveVideos } from '@/hooks/useFolders'
import React from 'react'

type Props = {
    videoId: string
    currentFolder?: string
    currentWorkSpace?: string
    currentFolderName?: string
}

const ChangeVideoLocation = ({ videoId, currentFolder, currentWorkSpace, currentFolderName }: Props) => {

    const {
        register,
        isPending,
        onFormSubmit,
        folders,
        workspaces,
        isFetching,
        isFolders,
    } = useMoveVideos(videoId, currentWorkSpace!)

    const folder = folders.find((f) => f.id === currentFolder)
    const workspace = workspaces.find((w) => w.id === currentWorkSpace)
    return (
        <form className='flex flex-col gap-y-3'>
            <div className='border-[1px] rounded-xl p-5'>
                <h2 className='text-sx mb-5 text-[#a4a4a4]'>Current</h2>
                {workspace && <p className='text-[#a4a4a4]'>{workspace.name}</p>}
                <p className='text-[#a4a4a4] text-sm'>This video has no folder</p>
            </div>
            <Separator orientation='horizontal' />
            <div className='flex flex-col gap-y-5 p-5 border-[1px] rounded-xl'>
                <h2 className='text-xs text-[#a4a4a4]'>To</h2>
                <Label className='flex-col items-start gap-y-2 flex'>
                    <p className='text-xs'>Workspace</p>
                    <select className='rounded-xl text-base bg-transparent'>
                        <option className='text-[#a4a4a4]' value={'something'}>
                            workspace
                        </option>
                    </select>
                </Label>
            </div>
        </form>
    )
}

export default ChangeVideoLocation