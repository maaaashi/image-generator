import { NextRequest, NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const postGPT = async (prompt: string, draw: string) => {
  const apiKey = process.env.NEXT_PUBLIC_GPT_API_KEY
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

export const POST = async (req: NextRequest) => {
  const { prompt, draw } = await req.json()

  try {
    const response = await postGPT(prompt, draw)
    const content = response.data.choices[0].message?.content!
    console.log(`${draw}「${prompt}」 is ${content}`)

    return NextResponse.json({ prompt: content })
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
