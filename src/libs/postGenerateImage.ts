import { Binary } from '@/app/page'

const generatePrompt = async (
  prompt: string,
  draw: string
): Promise<string | undefined> => {
  let condition = true
  let response: Response | undefined = undefined

  const generatePromptURL = process.env.NEXT_PUBLIC_GENERATE_PROMPT_URL!

  while (condition) {
    try {
      const res = await fetch(generatePromptURL, {
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
  const generateImageURL = process.env.NEXT_PUBLIC_GENERATE_IMAGE_URL!

  while (condition) {
    try {
      const res = await fetch(generateImageURL, {
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

  console.log(generatedPrompt)
  if (!generatedPrompt) return

  const base64 = await generateImage(generatedPrompt)

  return {
    prompt,
    data: 'data:image/png;base64,' + base64,
  }
}
