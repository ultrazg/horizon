import { imageType } from '@/types/image'

type stickerType = {
  description: string
  id: string
  image: imageType
  issuer: string
  name: string
  number: string
  ownedAt: string
  package: {
    image: imageType
  }
  scale: number
}

export type { stickerType }
