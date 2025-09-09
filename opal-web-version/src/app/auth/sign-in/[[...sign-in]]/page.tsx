import React from 'react'
import { SignIn } from '@clerk/nextjs'

type Props = {}

const SignInPage = async (props: Props) => {
  // Do not server-redirect when a user session exists.
  // Let Clerk's widget handle post-auth navigation to avoid redirect loops
  // when /auth/callback encounters an error.
  return <SignIn redirectUrl="/auth/callback" fallbackRedirectUrl="/auth/callback" />
}

export default SignInPage
