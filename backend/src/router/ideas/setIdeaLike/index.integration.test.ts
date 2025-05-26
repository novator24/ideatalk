import { appContext, createIdeaWithAuthor, createUser, getTrpcCaller } from '../../../test/integration'

describe('setIdeaLike', () => {
  it('create like', async () => {
    const { idea } = await createIdeaWithAuthor({ number: 1 })
    const liker = await createUser({ number: 2 })
    const trpcCallerForLiker = getTrpcCaller(liker)
    const result = await trpcCallerForLiker.setIdeaLike({
      ideaId: idea.id,
      isLikedByMe: true,
    })
    expect(result).toMatchObject({
      idea: {
        isLikedByMe: true,
        likesCount: 1,
      },
    })
    const ideaLikes = await appContext.prisma.ideaLike.findMany()
    expect(ideaLikes).toHaveLength(1)
    expect(ideaLikes[0]).toMatchObject({
      ideaId: idea.id,
      userId: liker.id,
    })
  })

  it('remove like', async () => {
    const { idea } = await createIdeaWithAuthor({ number: 1 })
    const liker = await createUser({ number: 2 })
    const trpcCallerForLiker = getTrpcCaller(liker)
    const result1 = await trpcCallerForLiker.setIdeaLike({
      ideaId: idea.id,
      isLikedByMe: true,
    })
    expect(result1).toMatchObject({
      idea: {
        isLikedByMe: true,
        likesCount: 1,
      },
    })
    const result2 = await trpcCallerForLiker.setIdeaLike({
      ideaId: idea.id,
      isLikedByMe: false,
    })
    expect(result2).toMatchObject({
      idea: {
        isLikedByMe: false,
        likesCount: 0,
      },
    })
    const ideaLikes = await appContext.prisma.ideaLike.findMany()
    expect(ideaLikes).toHaveLength(0)
  })
})
