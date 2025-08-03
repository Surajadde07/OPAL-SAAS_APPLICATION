import { cn } from '@/lib/utils'
import { ArrowRightIcon, Folder as Fold } from 'lucide-react'
import React from 'react'
import Folder from './folder'

type Props = {
    workspaceId: string
}

const Folders = ({ workspaceId }: Props) => {
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
                {/* <Folder /> */}
            </section>
        </div>
    )
}

export default Folders