import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoutes = createRouteMatcher(['/dashboard(.*)','/api/payment','/payment(.*)']);
export default clerkMiddleware(async(auth,req) => {
    if (isProtectedRoutes(req)) {
        //! auth().protect() old one
        await auth.protect() //? suraj did this
    }
})


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};

//? 01:01:30
//? 01:51:02