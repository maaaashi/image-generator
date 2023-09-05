import { NextRequest, NextResponse } from 'next/server'
import { generateAsync } from 'stability-client'

export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json()

  try {
    // @ts-ignore
    const { images } = await generateAsync({
      prompt,
      apiKey: process.env.NEXT_PUBLIC_API_KEY!,
      outDir: 'public/',
      noStore: true,
      steps: 50,
    })

    return NextResponse.json({ images })
  } catch (e) {
    console.log(e)
    return NextResponse.json({})
  }
}
