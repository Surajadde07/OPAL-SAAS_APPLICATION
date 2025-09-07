/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // Allow Prisma to be used in server components
        serverComponentsExternalPackages: ['@prisma/client'],
    },
    // Optional custom build ID
    generateBuildId: async () => {
        return 'build-' + Date.now()
    },
    // No redirects for now
    async redirects() {
        return []
    },
}

export default nextConfig


//! CHANGED FOR DEPLOYMENT