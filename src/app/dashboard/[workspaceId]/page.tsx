
import CreateWorkspace from '@/components/global/create-workspace'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Folders from '@/components/global/folders'
import React from 'react'
import CreateFolders from '@/components/global/create-folders'

type Props = {
  params: Promise<{ workspaceId: string }>
}

const page = async ({ params }: Props) => {
  const { workspaceId } = await params

  return (
    <div>
      <Tabs defaultValue='videos' className='mt-6'>
        <div className='flex w-full justify-between items-center'>
          <TabsList className='bg-transparent gap-2 pl-0'>
            <TabsTrigger className='p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]' value='videos'>Videos</TabsTrigger>
            <TabsTrigger className='p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]' value='archive'>Archive</TabsTrigger>
          </TabsList>
          <div className='flex gap-x-3'>
            <CreateWorkspace />
            <CreateFolders workspaceId={workspaceId} />
          </div>
        </div>

        <section className='py-9'>
          <TabsContent value='videos'>
            <Folders workspaceId={workspaceId} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page

//! suraj did many changes in this file

//? 04:49:36 