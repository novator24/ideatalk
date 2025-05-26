import { env } from './env'
import { promises as fs } from 'fs'
import path from 'path'
import { parsePublicEnv } from '@ideanick/webapp/src/lib/parsePublicEnv'
import express, { type Express } from 'express'
import { logger } from './logger'

const checkFileExists = async (filePath: string) => {
  return await fs
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

const findWebappDistDir = async (dir: string): Promise<string | null> => {
  const maybeWebappDistDir = path.resolve(dir, 'webapp/dist')
  if (await checkFileExists(maybeWebappDistDir)) {
    return maybeWebappDistDir
  }
  if (dir === '/') {
    return null
  }
  return await findWebappDistDir(path.dirname(dir))
}

export const applyServeWebApp = async (expressApp: Express) => {
  const webappDistDir = await findWebappDistDir(__dirname)
  if (!webappDistDir) {
    if (env.HOST_ENV === 'production') {
      throw new Error('Webapp dist dir not found')
    } else {
      logger.error('webapp-serve', 'Webapp dist dir not found')
      return
    }
  }

  const htmlSource = await fs.readFile(path.resolve(webappDistDir, 'index.html'), 'utf8')
  // eslint-disable-next-line node/no-process-env
  const publicEnv = parsePublicEnv(process.env)
  const htmlSourceWithEnv = htmlSource.replace('{ replaceMeWithPublicEnv: true }', JSON.stringify(publicEnv, null, 2))

  expressApp.use(express.static(webappDistDir, { index: false }))
  expressApp.get('/*', (req, res) => {
    res.send(htmlSourceWithEnv)
  })
}
