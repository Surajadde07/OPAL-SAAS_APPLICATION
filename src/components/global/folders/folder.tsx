'use client'

import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    name: string
    id: string
    optimistic? : boolean
    count?: number
}

const Folder = ({name, id, optimistic, count}: Props) => {
    const pathName = usePathname()
    const router = useRouter()
    return (
        <div className={cn('flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-6 px-4 rounded-lg border-[1px]')}>
            Folder Title
        </div>
    )
    
}

export default Folder

//? 05:00:24