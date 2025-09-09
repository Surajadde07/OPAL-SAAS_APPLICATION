import Navbar from './_components/navbar'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
	const user = await currentUser()
	if (user) {
		return redirect('/auth/callback')
	}

	return (
		<main className="text-gray-900 bg-white min-h-dvh">
			<Navbar />
			<section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold">Welcome to OPAL</h1>
				<p className="mt-4 text-gray-600">Your collaborative video workspace.</p>
			</section>
		</main>
	)
}
