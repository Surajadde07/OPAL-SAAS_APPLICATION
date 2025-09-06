import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Safe Prisma client that handles build-time scenarios
function createPrismaClient() {
  // Skip Prisma client creation during build time
  if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.DATABASE_URL) {
    return null as any; // Return null during build
  }
  return new PrismaClient()
}

export const client = globalThis.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production' && client) {
  globalThis.prisma = client
}


//! CHANGED FOR DEPLOYMENT