import React from 'react'
import { Spinner } from '@/components/global/loader/spinner'

type Props = {}

const AuthLoading = (props: Props) => {
    return (
        <div className='flex items-center justify-center h-screen w-full'>
            <Spinner />
        </div>
    )
}

export default AuthLoading

//? 01:44:09