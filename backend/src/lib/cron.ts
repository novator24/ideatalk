import { CronJob } from 'cron'
import { notifyAboutMostLikedIdeas } from '../scripts/notifyAboutMostLikedIdeas'
import { type AppContext } from './ctx'
import { logger } from './logger'

export const applyCron = (ctx: AppContext) => {
  new CronJob(
    '0 10 1 * *', // At 10:00 on day-of-month 1
    () => {
      notifyAboutMostLikedIdeas({ ctx }).catch((error) => {
        logger.error('cron', error)
      })
    },
    null, // onComplete
    true // start right now
  )
}
