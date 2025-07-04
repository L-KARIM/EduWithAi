// app/api/*/route.tsx

import { StreamingTextResponse, LangChainStream } from "ai"
import { Cohere } from "@langchain/cohere"
import { CallbackManager } from "langchain/callbacks"

export const runtime = "edge"

export async function POST(req: Request): Promise<Response> {
  const { prompt } = await req.json()

  const { stream, handlers } = LangChainStream()

  const cohere = (modelName: string, options?: any) =>
    new Cohere({
      modelName,
      maxTokens: 500,
      temperature: 0.9,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers(handlers),
      ...options,
    })

  const llm = cohere("command-r-plus", {
    apiKey: process.env.COHERE_API_KEY ?? "J6DKVTdem0n9xxU6dAvDyonjW7DgUxiwIzYZipz5",
  })

  llm.call(prompt).catch(console.error)

  return new StreamingTextResponse(stream)
}
