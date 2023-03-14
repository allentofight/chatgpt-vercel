import type { APIRoute } from "astro"
import {
  createParser,
  ParsedEvent,
  ReconnectInterval
} from "eventsource-parser"

import { defaultSetting } from "~/default"

import moment from 'moment'


const localEnv = import.meta.env.OPENAI_API_KEY
const vercelEnv = process.env.OPENAI_API_KEY

const apiKeys = ((localEnv || vercelEnv)?.split(/\s*\|\s*/) ?? []).filter(
  Boolean
)

export const post: APIRoute = async context => {
  const body = await context.request.json()
  const apiKey = apiKeys.length
    ? apiKeys[Math.floor(Math.random() * apiKeys.length)]
    : ""
  let { messages, key = apiKey, temperature = 0.6, isTrialUser } = body

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()


  const url = 'https://s2.loli.net/2023/03/14/wjdqIlGUogztABN.png'
  let warningHint = `没有填写 OpenAI API key，请扫码获取体验码<img width="300" src='${url}' />`
  if (isTrialUser) {
    const day = moment(new Date()).format('YYYY-MM-DD')
    let cacheKey = `trialCnt1_${day}`
    let trialCnt = localStorage.getItem(cacheKey)
    trialCnt++
    localStorage.setItem(cacheKey, trialCnt)
    if (trialCnt < 4) {
      key = defaultSetting.openaiAPIKey
    } else {
      warningHint = '今天体验次数已用完，如需永久体验，请添加微信: geekoftate 获取 apiKey 哦'
    }
    console.log('trialCnt = ', trialCnt)
  }

  if (!key.startsWith("sk-")) key = apiKey
  if (!key) {
    return new Response(warningHint)
  }
  if (!messages) {
    return new Response("没有输入任何文字")
  }

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature,
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
            // response = {
            //   id: 'chatcmpl-6pULPSegWhFgi0XQ1DtgA3zTa1WR6',
            //   object: 'chat.completion.chunk',
            //   created: 1677729391,
            //   model: 'gpt-3.5-turbo-0301',
            //   choices: [
            //     { delta: { content: '你' }, index: 0, finish_reason: null }
            //   ],
            // }
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
