import { type sendEmailThroughBrevo } from './brevo'

jest.mock('./brevo', () => {
  const original = jest.requireActual('./brevo')
  const mockedSendEmailThroughBrevo: typeof sendEmailThroughBrevo = jest.fn(async () => {
    return {
      loggableResponse: {
        status: 200,
        statusText: 'OK',
        data: { message: 'Mocked' },
      },
    }
  })
  return {
    ...original,
    sendEmailThroughBrevo: mockedSendEmailThroughBrevo,
  }
})
