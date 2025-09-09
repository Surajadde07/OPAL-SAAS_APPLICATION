/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // Allow Prisma to be used in server components
        serverComponentsExternalPackages: ['@prisma/client'],
    },
    // Webpack configuration to handle client reference manifests properly
    webpack: (config, { dev, isServer }) => {
        // Handle client reference manifest generation for route groups
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    ...config.optimization.splitChunks.cacheGroups,
                    default: false,
                    vendors: false,
                    // Create a chunk for route groups
                    routeGroups: {
                        name: 'route-groups',
                        chunks: 'all',
                        test: /[\\/]app[\\/]\([^)]+\)[\\/]/,
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                },
            }
        }
        return config
    },
    // No redirects for now
    async redirects() {
        return []
    },
}

export default nextConfig

//! CHANGED FOR DEPLOYMENT