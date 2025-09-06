import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const AuthCallbackPage = async () => {
  const auth = await onAuthenticateUser()
  console.log(auth)
  if (auth.status === 200 || auth.status === 201)
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`)

  if (auth.status === 403 || auth.status === 400 || auth.status === 500)
    return redirect('/auth/sign-in')
}

export default AuthCallbackPage
