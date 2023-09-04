import { NextRequest, NextResponse } from 'next/server'
import { generateAsync } from 'stability-client'
import { Configuration, OpenAIApi } from 'openai'

const postGPT = async (prompt: string, draw: string) => {
  const apiKey = process.env.NEXT_PUBLIC_GPT_API_KEY
  const configuration = new Configuration({
    apiKey,
  })
  const openai = new OpenAIApi(configuration)
  const model = 'gpt-4'

  const content = `画像生成AIを使って、${draw}に「${prompt}」を書くための英語のプロンプトを考えてください。`

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
    const con = response.data.choices[0].message?.content!

    console.log(
      draw +
        '風: ' +
        prompt +
        ' is ' +
        response.data.choices[0].message?.content!
    )
    // @ts-ignore
    const { images } = await generateAsync({
      prompt: con,
      apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      outDir: 'public/',
      noStore: true,
      steps: 10,
    })

    return NextResponse.json({ images })
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
