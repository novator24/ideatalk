import { zStringRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zBlockIdeaTrpcInput = z.object({
  ideaId: zStringRequired,
})
