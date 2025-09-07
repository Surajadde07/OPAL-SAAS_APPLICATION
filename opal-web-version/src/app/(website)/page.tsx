import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function HomePage() {
  try {
    // Check if user is authenticated on server side
    const user = await currentUser()
    
    if (user) {
      // If user is signed in, redirect to auth callback to handle dashboard routing
      redirect('/auth/callback')
    } else {
      // If not signed in, redirect to sign-in page  
      redirect('/auth/sign-in')
    }
  } catch (error) {
    console.error('Error in home page:', error)
    // On error, redirect to sign-in as fallback
    redirect('/auth/sign-in')
  }

  // This return should never be reached due to redirects above
  return null
}
