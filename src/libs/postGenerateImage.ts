import { Binary } from '@/app/page'

export const postGenerateImage = async (
  prompt: string,
  draw: string
): Promise<Binary | undefined> => {
  let condition = true
  let response: Response | undefined = undefined

  while (condition) {
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          draw,
        }),
      })
      if (res.status === 200) {
        response = res
        condition = false
      }
    } catch (error) {
      console.log('error')
    }
  }

  if (!response) return

  const json = await response.json()
  const buffer = Buffer.from(json.images[0].buffer.data)
  const base64 = buffer.toString('base64')

  return {
    prompt,
    data: 'data:image/png;base64,' + base64,
  }
}
