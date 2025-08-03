'use client'

import { cn } from '@/lib/utils'
import { ArrowRightIcon, Folder as Fold } from 'lucide-react'
import React from 'react'
import Folder from './folder'
import { useQueryData } from '@/hooks/useQueryData'
import { getWorkspaceFolders } from '@/app/actions/workspace'
import { useMutationDataState } from '@/hooks/useMutationData'

type Props = {
    workspaceId: string
}

export type FolderProps ={
    status: number
    data: ({
        _count:{
            videos: number
        }
    } & {
        id: string
        name: string
        createdAt: Date
        workSpaceId: string | null
    })[]
}

const Folders = ({ workspaceId }: Props) => {

    // get the folders
    const { data , isFetched} = useQueryData(['workspace-folders'],() => getWorkspaceFolders(workspaceId))

    const { latestVariales} = useMutationDataState(['create-folder'])

    const { status, data: folders } = data as FolderProps

    if(isFetched && folders){

    }
    //! WIP: add the classnames for the folder based on success response
    return (
        <div className='flex flex-col gap-y-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Fold color='#BDBDBD' fill='#BDBDBD' size={20}/>
                    <h2 className='text-[#BDBDBD]'>Folders</h2>
                </div>
                <div className='flex items-center gap-2'>
                    <p className='text-[#BDBDBD]'>See all</p>
                    <ArrowRightIcon color='#707070' />
                </div>
            </div>
            <section className={cn('flex items-center gap-4 overflow-x-auto w-full')}>
                <Folder name='Folder title' />
            </section>
        </div>
    )
}

export default Folders

//? 05:31:10