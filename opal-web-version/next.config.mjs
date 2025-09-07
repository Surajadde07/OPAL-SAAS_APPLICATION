/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // Skip build-time data collection for API routes
        skipTrailingSlashRedirect: true,
    },
    // Skip static generation for API routes during build
    generateBuildId: async () => {
        return 'build-' + Date.now()
    },
    // Ensure all API routes are dynamic
    async redirects() {
        return []
    },
}

export default nextConfig;
