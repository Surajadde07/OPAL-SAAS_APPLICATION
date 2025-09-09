import { Button } from '@/components/ui/button'
import { Menu, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import React from 'react'

type Props = {}

const LandingPageNavBar = (props: Props) => {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-3xl font-semibold gap-x-3">
                <Menu className="w-8 h-8" />
                <Image
                    alt="logo"
                    src="/opal-logo.svg"
                    width={40}
                    height={40}
                />
                Opal
            </div>
            <div className="items-center hidden gap-x-10 lg:flex">
                <Link
                    href="/"
                    className="bg-[#7320DD] py-2 px-5 font-semibold text-lg rounded-full hover:bg-[#7320DD]/80"
                >
                    Home
                </Link>
                <Link href="/">Pricing</Link>
                <Link href="/">Contact</Link>
            </div>
            <Link href="/auth/sign-in">
                <Button className="flex text-base gap-x-2">
                    <User fill="#000" />
                    Login
                </Button>
            </Link>
        </div>
    )
}

export default LandingPageNavBar
