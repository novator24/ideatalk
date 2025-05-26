import { type sendEmail } from './utils'

jest.mock('./utils', () => {
  const original = jest.requireActual('./utils')
  const mockedSendEmail: typeof sendEmail = jest.fn(async () => {
    return {
      ok: true,
    }
  })
  return {
    ...original,
    sendEmail: mockedSendEmail,
  }
})
