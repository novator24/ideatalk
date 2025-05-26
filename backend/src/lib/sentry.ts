import { env } from './env'
import path from 'path'
import { RewriteFrames } from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import { type LoggerMetaData } from './logger'

const isSentryEnabled = env.BACKEND_SENTRY_DSN

export const initSentry = () => {
  if (isSentryEnabled) {
    Sentry.init({
      dsn: env.BACKEND_SENTRY_DSN,
      environment: env.HOST_ENV,
      release: env.SOURCE_VERSION,
      normalizeDepth: 10,
      integrations: [
        new RewriteFrames({
          root: path.resolve(__dirname, '../../..'),
        }),
      ],
    })
  }
}

export const sentryCaptureException = (error: Error, prettifiedMetaData?: LoggerMetaData) => {
  if (isSentryEnabled) {
    Sentry.captureException(error, prettifiedMetaData)
  }
}
