'use client'

import { getFolderInfo } from '@/app/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import { FolderProps } from '@/types/index.type'
import React from 'react'


type Props = {
    folderId: string
}

const FolderInfo = ({folderId}: Props) => {
    const { data } = useQueryData(['folder-info'], () => getFolderInfo(folderId))

    const { data: folder } = data as FolderProps
    return (
        <div className='flex items-center'>
            <div className='text-[#BDBDBD] text-2xl'>
                {folder.name}
            </div>
        </div>
    )
}

export default FolderInfo

//? 06:17:29