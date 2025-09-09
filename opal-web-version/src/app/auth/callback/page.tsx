import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const AuthCallbackPage = async () => {
  try {
    // First check if user is authenticated with Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      console.log('No Clerk user found, redirecting to sign-in')
      return redirect('/auth/sign-in')
    }

    console.log('Clerk user found:', clerkUser.id)
    
    // Authenticate and sync with our database
    const auth = await onAuthenticateUser()
    console.log('Auth result:', auth)
    
    if (auth.status === 200 || auth.status === 201) {
      if (auth.user?.workspace && auth.user.workspace.length > 0) {
        return redirect(`/dashboard/${auth.user.workspace[0].id}`)
      } else {
        // Create a default workspace if none exists
        console.log('No workspace found, creating default...')
        return redirect('/dashboard')
      }
    }

    if (auth.status === 500) {
      console.error('Authentication failed:', auth)
      return (
        <main className="flex items-center justify-center px-6 text-center text-white min-h-dvh">
          <div>
            <h1 className="text-xl font-semibold">Server configuration required</h1>
            <p className="mt-3 text-sm opacity-80">
              The server could not authenticate you. Ensure environment variables like
              <code className="mx-1">DATABASE_URL</code> are configured and migrations are applied.
            </p>
            <p className="mt-4 text-sm opacity-80">After fixing, refresh this page.</p>
          </div>
        </main>
      )
    }

    if (auth.status === 403 || auth.status === 400) {
      console.error('Authentication failed:', auth)
      return redirect('/auth/sign-in')
    }
    
    // Fallback redirect
    return redirect('/auth/sign-in')
    
  } catch (error) {
    console.error('Auth callback error:', error)
    return redirect('/auth/sign-in')
  }
}

export default AuthCallbackPage
