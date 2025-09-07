import React from 'react'
import { SignIn } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

type Props = {}

const SignInPage = async (props: Props) => {
  // Check if user is already signed in
  const user = await currentUser()
  
  if (user) {
    // User is already signed in, redirect to callback to handle dashboard redirect
    redirect('/auth/callback')
  }

  return <SignIn afterSignInUrl="/auth/callback" />
}

export default SignInPage
