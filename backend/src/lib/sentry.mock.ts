jest.mock('./sentry', () => {
  return jest.createMockFromModule('./sentry')
})
