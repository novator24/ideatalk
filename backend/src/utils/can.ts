import type { Idea, User, UserPermission } from '@prisma/client'

type MaybeUser = Pick<User, 'permissions' | 'id'> | null
type MaybeIdea = Pick<Idea, 'authorId'> | null

export const hasPermission = (user: MaybeUser, permission: UserPermission) => {
  return user?.permissions.includes(permission) || user?.permissions.includes('ALL') || false
}

export const canBlockIdeas = (user: MaybeUser) => {
  return hasPermission(user, 'BLOCK_IDEAS')
}

export const canEditIdea = (user: MaybeUser, idea: MaybeIdea) => {
  return !!user && !!idea && user?.id === idea?.authorId
}
