import { Image } from '@/Domains/Image'

type GenerateImageInput = {
  prompt: string
  draw: string
}

export class ImageUsecase {
  async generateImage(data: GenerateImageInput): Promise<Image> {
    let condition = true
    let response: Response | undefined = undefined
    const generateImageURL = process.env.NEXT_PUBLIC_GENERATE_IMAGE_URL!

    const prompt = await this.generatePrompt(data.draw, data.prompt)

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

    if (!response) return new Image('', '', '', '')

    const json = await response.json()
    const buffer = Buffer.from(json.images[0].buffer.data)
    return new Image(
      '',
      data.draw,
      data.prompt,
      'data:image/png;base64,' + buffer.toString('base64')
    )
  }

  async generatePrompt(draw: string, prompt: string): Promise<string> {
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

    if (!response) return 'Error'

    const json = await response.json()
    return json.content
  }
}
