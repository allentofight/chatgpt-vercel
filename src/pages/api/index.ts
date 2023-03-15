import type { APIRoute } from "astro"
import {
  createParser,
  ParsedEvent,
  ReconnectInterval
} from "eventsource-parser"

import type { ChatMessage } from "~/types"

import GPT3Tokenizer from "gpt3-tokenizer"
const tokenizer = new GPT3Tokenizer({ type: "gpt3" })
const apiKeys = (
  import.meta.env.OPENAI_API_KEY ||
  process.env.OPENAI_API_KEY ||
  ""
)
  .split(/\s*\|\s*/)
  .filter(Boolean)

const baseURL = (
  import.meta.env.OPENAI_API_BASE_URL ||
  process.env.OPENAI_API_BASE_URL ||
  "api.openai.com"
).replace(/^https?:\/\//, "")

const maxTokens = Number(
  import.meta.env.MAX_INPUT_TOKENS || process.env.MAX_INPUT_TOKENS
)

export const post: APIRoute = async context => {
  const body = await context.request.json()
  const apiKey = apiKeys.length
    ? apiKeys[Math.floor(Math.random() * apiKeys.length)]
    : ""
  let {
    messages,
    key = apiKey,
    temperature = 0.6,
    isTrialUser, 
    isTrialAvail
  } = body as {
    messages?: ChatMessage[]
    key?: string
    temperature?: number
    isTrialUser? : boolean
    isTrialAvail? : boolean
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const url = 'https://s2.loli.net/2023/03/14/wjdqIlGUogztABN.png'
  let warningHint = `没有填写 OpenAI API key，请扫码获取体验码<img width="300" src='${url}' />`
  if (isTrialUser) {
    if (!isTrialAvail) {
      warningHint = '今天体验次数已用完，如需永久体验，请添加微信: geekoftaste 获取 apiKey 哦'
    } else {
      key = atob('c2stT2g1amhZcVNoWnQ3VEV1djFnb250M0JsbmtGSkw1QW9TVTlTc2ttZ2hJWVhiMk8=')
    }
  }

  if (!key.startsWith("sk-")) key = apiKey
  if (!key) {
    return new Response(warningHint)
  }
  if (!messages) {
    return new Response("没有输入任何文字。")
  }

  const tokens = messages.reduce((acc, cur) => {
    const tokens = tokenizer.encode(cur.content).bpe.length
    return acc + tokens
  }, 0)

  if (tokens > (Number.isInteger(maxTokens) ? maxTokens : 3072)) {
    if (messages.length > 1)
      return new Response(
        `由于开启了连续对话选项，导致本次对话过长，请清除部分内容后重试，或者关闭连续对话选项。`
      )
    else return new Response("太长了，缩短一点吧。")
  }

  const completion = await fetch(`https://${baseURL}/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature,
      // max_tokens: 4096 - tokens,
      stream: true
    })
  })

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data
          if (data === "[DONE]") {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }
      const parser = createParser(streamParser)
      for await (const chunk of completion.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    }
  })

  return new Response(stream)
}
