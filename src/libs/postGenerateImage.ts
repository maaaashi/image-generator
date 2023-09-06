import { Binary } from '@/app/page'

const generatePrompt = async (
  prompt: string,
  draw: string
): Promise<string | undefined> => {
  let condition = true
  let response: Response | undefined = undefined

  while (condition) {
    try {
      const res = await fetch('/api/generate-prompt', {
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
  return json.prompt
}

const generateImage = async (prompt: string) => {
  let condition = true
  let response: Response | undefined = undefined

  while (condition) {
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
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
  return buffer.toString('base64')
}

export const postGenerateImageAPI = async (
  prompt: string,
  draw: string
): Promise<Binary | undefined> => {
  const generatedPrompt = await generatePrompt(prompt, draw)

  if (!generatedPrompt) return

  const base64 = await generateImage(generatedPrompt)

  return {
    prompt,
    data: 'data:image/png;base64,' + base64,
  }
}
