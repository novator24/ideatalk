import { createPrismaClient } from './prisma'

export const createAppContext = () => {
  const prisma = createPrismaClient()
  return {
    prisma,
    stop: async () => {
      await prisma.$disconnect()
    },
  }
}

export type AppContext = ReturnType<typeof createAppContext>
