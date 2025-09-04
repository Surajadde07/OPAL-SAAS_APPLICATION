import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react"
import Loader from "../Loader";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/lib/utils";
import { useMediaSources } from "@/hooks/useMediaSources";
import MediaConfiguration from "../MediaConfiguration";


const Widget = () => {
    const [profile, setProfile] = useState<{
        status: number
        user: | ({
            subscription: {
                plan: 'PRO' | 'FREE'
            } | null
            studio: {
                id: string
                screen: string | null
                mic: string | null
                preset: 'HD' | 'SD'
                camera: string | null
                userId: string | null
            } | null
        } & {
            id: string
            email: string
            firstname: string | null
            lastname: string | null
            createdAt: Date
            clerkid: string
        })
        | null
    } | null>(null)

    const { user } = useUser();
    const {state, fetchMediaResources} = useMediaSources()
    console.log('Media sources state:', state);

    useEffect(() => {
        if(user && user.id) {
            console.log('Fetching user profile for:', user.id);
            fetchUserProfile(user.id)
                .then((p) => {
                    console.log('User profile response:', p);
                    setProfile(p)
                })
                .catch((error) => {
                    console.error('Failed to fetch user profile:', error);
                })
        }
    }, [user])

    useEffect(() => {
        fetchMediaResources();
    }, [])
    return (
        <div className="p-5">
            <ClerkLoading>
                <div className="h-full flex justify-center items-center">
                    <Loader />
                </div>
            </ClerkLoading>
            <SignedIn >
                {
                    profile ?
                        (
                            <MediaConfiguration state={state} user={profile?.user} />
                        )
                    : <div className="w-full h-full flex justify-center items-center">
                        <Loader color="#fff" /> 
                    </div>
                }
            </SignedIn>
        </div>
    )
}

export default Widget
