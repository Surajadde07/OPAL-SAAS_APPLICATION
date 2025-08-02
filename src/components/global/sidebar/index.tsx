'use client'

import { getNotifications, getWorkSpaces } from '@/app/actions/workspace'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { userQueryData } from '@/hooks/userQueryData'
import { NotificationsProps, WorkspaceProps } from '@/types/index.type'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import Modal from '../modal'
import { PlusCircle } from 'lucide-react'
import Search from '../search'
import { MENU_ITEMS } from '@/constants'
import SidebarItem from './sidebar-item'
import WorkspacePlaceholder from './workspace-placeholder'

type Props = {
    activeWorkspaceId: string
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
    const router = useRouter();
    const pathName = usePathname()

    const { data, isFetched } = userQueryData(['user-workspaces'], getWorkSpaces);
    const menuItems = MENU_ITEMS(activeWorkspaceId);

    const { data: notifications } = userQueryData(['user-notifications'], getNotifications)
    const { data: workspace } = data as WorkspaceProps
    const { data: count } = notifications as NotificationsProps

    const onChangeActiveWorkspace = (value: string) => {
        router.push(`/dashboard/${value}`)
    }

    const currentWorkspace = workspace.workspace.find(
        (s) => s.id === activeWorkspaceId
    )



    return (
        <div className='bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden'>
            <div className='bg-[#111111] flex p-4 gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0'>
                <Image
                    src="/opal-logo.svg"
                    width={40}
                    height={40}
                    alt='logo'
                />
                <p className='text-2xl'>Opal</p>
            </div>
            <Select
                defaultValue={activeWorkspaceId}
                onValueChange={onChangeActiveWorkspace}>
                <SelectTrigger className='mt-16 text-neutral-400 bg-transparent'>
                    <SelectValue placeholder="Select a workspace"></SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#111111] backdrop-blur-xl">
                    <SelectGroup>Workspaces</SelectGroup>
                    <Separator />
                    {workspace.workspace.map((workspace) => (
                        <SelectItem
                            key={workspace.id}
                            value={workspace.id}
                        >
                            {workspace.name}
                        </SelectItem>
                    ))}
                    {workspace.members.length > 0 && workspace.members.map(
                        (workspace) =>
                            workspace.Workspace && (
                                <SelectItem
                                    key={workspace.Workspace.id}
                                    value={workspace.Workspace.id}
                                >
                                    {workspace.Workspace.name}
                                </SelectItem>
                            )
                    )}
                </SelectContent>
            </Select>
            {currentWorkspace?.type == 'PUBLIC' && workspace.subscription?.plan == 'PRO' && (
                <Modal
                    trigger={
                        <span className='text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2'>
                            <PlusCircle
                                size={15}
                                className='text-neutral-800/90 fill-neutral-500'
                            />
                            <span className='text-neutral-400 font-semibold text-xs'>
                                Invite to Workspace
                            </span>
                        </span>
                    }
                    title="Invite To Workspace"
                    description='Invite other users to your workspace'
                >
                    <Search workspaceId={activeWorkspaceId} />
                </Modal>)}
            <p className='w-full text-[#9D9D9D] font-bold mt-4'>Menu</p>
            <nav className='w-full'>
                <ul>
                    {menuItems.map((item) => (
                        <SidebarItem
                            href={item.href}
                            icon={item.icon}
                            title={item.title}
                            selected={pathName === item.href}
                            key={item.title}
                            notifications={
                                (item.title === 'Notifications' && count._count && count._count.notifications) || 0
                            }
                        />
                    ))}
                </ul>
                <Separator className='w-4/5' />
                <p className='w-full text-[#9D9D9D] font-bold mt-4'>Workspaces</p>
                <nav className='w-full'>
                    <ul className='h-[150px] overflow-auto overflow-x-hidden fade-layer'>
                        {workspace.workspace.length > 0 &&
                            workspace.workspace.map((item) => (
                                item.type !== 'PERSONAL' && (
                                    <SidebarItem
                                        href={`/dashboard/${item.id}`}
                                        selected={pathName === `/dashboard/${item.id}`}
                                        title={item.name}
                                        notifications={0}
                                        key={item.name}
                                        icon={<WorkspacePlaceholder>
                                            {item.name.charAt(0)}
                                        </WorkspacePlaceholder>}
                                    />
                                )
                            ))}
                            {
                                workspace.members.length > 0 && 
                                workspace.members.map((item) => (
                                    <SidebarItem
                                        href={`/dashboard/${item.Workspace.id}`}
                                        selected={pathName === `/dashboard/${item.Workspace.id}`}
                                        title={item.Workspace.name}
                                        notifications={0}
                                        key={item.Workspace.name}
                                        icon={<WorkspacePlaceholder>
                                            {item.Workspace.name.charAt(0)}
                                        </WorkspacePlaceholder>}
                                    />
                                ))
                            }
                    </ul>
                </nav>
            </nav>
        </div>
    )
}

export default Sidebar

//? 02:25:39
//? 03:22:18
//? 03:48:05