'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
    const { isLoaded, isSignedIn } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded) {
            if (isSignedIn) {
                // If user is already logged in, redirect to dashboard
                router.push('/dashboard')
            } else {
                // If not logged in, redirect to sign-in page
                router.push('/auth/sign-in')
            }
        }
    }, [isLoaded, isSignedIn, router])

    // Show loading state while checking authentication
    return (
        <main className="flex items-center justify-center min-h-screen">
            <div className="text-white">Loading...</div>
        </main>
    )
}
