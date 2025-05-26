import { type User } from '@prisma/client'
import { type Request } from 'express'

export type ExpressRequest = Request & {
  user: User | undefined
}
