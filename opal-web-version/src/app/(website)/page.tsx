import Navbar from './_components/navbar'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
	const user = await currentUser()
	const debug = typeof searchParams?.debug === 'string' ? searchParams?.debug : Array.isArray(searchParams?.debug) ? searchParams?.debug?.[0] : undefined
	if (user && debug !== '1') {
		return redirect('/auth/callback')
	}

	return (
		<main className="text-gray-900 bg-white min-h-dvh">
			<Navbar />
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold">Welcome to OPAL</h1>
				<p className="mt-4 text-gray-600">Your collaborative video workspace.</p>
				{debug === '1' && (
					<p className="mt-6 text-sm text-gray-500">Debug mode active: redirects disabled on home.</p>
				)}
			</section>
		</main>
	)
}
