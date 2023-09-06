import { Handler } from 'aws-lambda'
import { Configuration, OpenAIApi } from 'openai'

const postGPT = async (prompt: string, draw: string) => {
  const apiKey = process.env.DREAM_STUDIO_APIKEY
  const configuration = new Configuration({
    apiKey,
  })
  const openai = new OpenAIApi(configuration)
  const model = 'gpt-4'

  const content = `画像生成AIを使って、${draw}「${prompt}」を書くための英語のプロンプトを考えてください。`

  return await openai.createChatCompletion({
    model,
    temperature: 2,
    messages: [
      {
        role: 'system',
        content,
      },
    ],
  })
}

type Input = {
  prompt: string,
  draw: string
}

export const handler: Handler<Input, string> = async (req) => {
  const { prompt, draw } = req

  try {
    const response = await postGPT(prompt, draw)
    const content = response.data.choices[0].message?.content!
    console.log(`${draw}「${prompt}」 is ${content}`)

    return JSON.stringify({
      content
    });
  } catch (e) {
    console.log(e)
    return JSON.stringify({
      content: 'ERROR'
    });
  }
}