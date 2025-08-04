'use client'

import { getFolderInfo } from '@/app/actions/workspace'
import { useQueryData } from '@/hooks/useQueryData'
import React from 'react'
import { FoldersProps } from '.'

type Props = {
    folderId: string
}

const FolderInfo = ({folderId}: Props) => {
    const { data } = useQueryData(['folder-info'], () => getFolderInfo(folderId))

    const { data: folder } = data as FoldersProps
    return (
        <div>FolderInfo</div>
    )
}

export default FolderInfo