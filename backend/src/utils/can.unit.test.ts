import { canEditIdea, hasPermission } from './can'

describe('can', () => {
  it('hasPermission return true for user with this permission', () => {
    expect(hasPermission({ permissions: ['BLOCK_IDEAS'], id: 'x' }, 'BLOCK_IDEAS')).toBe(true)
  })

  it('hasPermission return false for user without this permission', () => {
    expect(hasPermission({ permissions: [], id: 'x' }, 'BLOCK_IDEAS')).toBe(false)
  })

  it('hasPermission return true for user with "ALL" permission', () => {
    expect(hasPermission({ permissions: ['ALL'], id: 'x' }, 'BLOCK_IDEAS')).toBe(true)
  })

  it('only author can edit his idea', () => {
    expect(canEditIdea({ permissions: [], id: 'x' }, { authorId: 'x' })).toBe(true)
    expect(canEditIdea({ permissions: [], id: 'hacker' }, { authorId: 'x' })).toBe(false)
  })
})
