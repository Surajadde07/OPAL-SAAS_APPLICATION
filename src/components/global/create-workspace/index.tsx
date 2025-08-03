"use client" //! suraj did this it was not there before

import { getWorkSpaces } from '@/app/actions/workspace';
import { useQueryData } from '@/hooks/useQueryData'
import React from 'react'
import Modal from '../modal';
import { Button } from '@/components/ui/button';
import { FolderPlusIcon } from 'lucide-react';
import WorkspaceForm from '../../forms/workspace-form';

type Props = {}

const CreateWorkspace = (props: Props) => {

    const { data, isPending } = useQueryData(['use-workspaces'], getWorkSpaces);

    // Handle loading state and undefined data
    if (isPending || !data) {
        return (
            <Button className='bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl' disabled>
                <FolderPlusIcon />
                Loading...
            </Button>
        )
    }

    const { data: plan } = data as {
        status: number
        data: {
            subscription: {
                plan: 'PRO' | 'FREE'
            } | null
        }
    }

    // Check if plan data exists and has the expected structure
    if (!plan) {
        return null; // or some error state
    }

    if (plan.subscription?.plan === 'FREE') {
        return <></>
    }

    if (plan.subscription?.plan === 'PRO') {
        return (
            <Modal title='Create Workspace' description='This action cannot be undone.This will permanently delete your account and remove your data from our server'
                trigger={<Button className='bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl'>
                    <FolderPlusIcon />
                </Button>}>
                <WorkspaceForm />
            </Modal>
        )
    }
}

export default CreateWorkspace