import { PrismaClient } from '@prisma/client'

declare global {
  // Prevent TypeScript from complaining about redeclarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Use global singleton in dev, fresh client in prod
export const prisma =
  globalThis.prisma ||
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma

//! CHANGED FOR DEPLOYMENT