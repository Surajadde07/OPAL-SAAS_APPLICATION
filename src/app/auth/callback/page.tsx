import { redirect } from 'next/navigation'
import { onAuthticateUser } from '@/app/actions/user'

const AuthCallbackPage = async () => {
    // Authentication
    const auth = await onAuthticateUser()
    if (auth.status == 200 || auth.status == 201) {
        return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }

    if (auth.status == 403 || auth.status == 500 || auth.status == 400) {
        return redirect('/auth/sign-in')
    }
}

export default AuthCallbackPage