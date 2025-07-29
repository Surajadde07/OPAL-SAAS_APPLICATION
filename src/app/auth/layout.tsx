import React from 'react'

type Props = {
    children: React.ReactNode;
}

function layout({ children }: Props) {
    return (
        <div className='container h-screen flex justify-center items-center'>{children}</div>
    )
}

export default layout