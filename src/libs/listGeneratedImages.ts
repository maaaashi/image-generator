import { list } from '@vercel/blob'

export const listGeneratedImages = async () => {
  const images = await list()

  console.log(images)
}