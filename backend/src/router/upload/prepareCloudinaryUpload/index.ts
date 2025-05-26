import { cloudinaryUploadTypes } from '@ideanick/shared/src/cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import { env } from '../../../lib/env'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zPrepareCloudinaryUploadTrpcInput } from './input'

export const prepareCloudinaryUploadTrpcRoute = trpcLoggedProcedure
  .input(zPrepareCloudinaryUploadTrpcInput)
  .mutation(async ({ input }) => {
    if (!env.CLOUDINARY_API_SECRET) {
      throw new Error('CLOUDINARY_API_SECRET is missing')
    }
    if (!env.CLOUDINARY_API_KEY) {
      throw new Error('CLOUDINARY_API_KEY is missing')
    }

    const uploadType = cloudinaryUploadTypes[input.type]

    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = uploadType.folder
    const transformation = uploadType.transformation
    const eager = Object.values(uploadType.presets).join('|')

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        transformation,
        eager,
      },
      env.CLOUDINARY_API_SECRET
    )

    return {
      preparedData: {
        timestamp: `${timestamp}`,
        folder,
        transformation,
        eager,
        signature,
        apiKey: env.CLOUDINARY_API_KEY,
        url: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      },
    }
  })
