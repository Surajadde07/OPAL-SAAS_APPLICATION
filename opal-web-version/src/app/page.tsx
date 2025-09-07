import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const user = await currentUser()
  
  if (user) {
    // User is signed in, redirect to auth callback to handle dashboard redirect
    redirect('/auth/callback')
  }

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          Welcome to OPAL
        </h1>
        <p className="text-gray-400 mb-8">
          AI-powered video sharing platform
        </p>
        <div className="space-x-4">
          <Link 
            href="/auth/sign-in" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/sign-up" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
