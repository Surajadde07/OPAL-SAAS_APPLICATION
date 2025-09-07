import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function Home() {
  // Check if user is authenticated on server side
  const user = await currentUser()
  
  if (user) {
    // If user is signed in, redirect to auth callback to handle dashboard routing
    redirect('/auth/callback')
  } else {
    // If not signed in, redirect to sign-in page
    redirect('/auth/sign-in')
  }

  // This return should never be reached due to redirects above
  return null
}
