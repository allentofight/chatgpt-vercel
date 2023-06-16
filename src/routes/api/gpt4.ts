import type { ParsedEvent, ReconnectInterval } from "eventsource-parser"
import { createParser } from "eventsource-parser"
import type { ChatMessage, Model } from "~/types"
import { splitKeys, randomKey, fetchWithTimeout } from "~/utils"
import { defaultEnv } from "~/env"
import type { APIEvent } from "solid-start/api"
import { gpt4Check } from "~/utils/api"

export const config = {
  runtime: "edge",
  /**
   * https://vercel.com/docs/concepts/edge-network/regions#region-list
   * disable hongkong
   * only for vercel
   */
  regions: [
    "arn1",
    "bom1",
    "bru1",
    "cdg1",
    "cle1",
    "cpt1a",
    "dub1",
    "fra1",
    "gru1",
    "hnd1",
    "iad1",
    "icn1",
    "kix1",
    "lhr1",
    "pdx1",
    "sfo1",
    "sin1",
    "syd1"
  ]
}


export const baseURL = process.env.GPT4_API_BASE_URL!.replace(/^https?:\/\//, "")

// + 作用是将字符串转换为数字
const timeout = isNaN(+process.env.TIMEOUT!)
  ? defaultEnv.TIMEOUT
  : +process.env.TIMEOUT!


async function isGPT4Qualify(sessionId: string) {
  try {
    let gpt4Verify = await gpt4Check(sessionId)
    return gpt4Verify.success
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetch qualify info:', error);
    } else {
      console.error(error);
    }
    return false
  }
}

type DataType = {
  prompt: string;
  model: string;
  messages?: string;
};

function generatePrompt(messages: ChatMessage[]): string {
  let prompt = '';
  const questions: string[] = [];
  const answers: string[] = [];

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "user") {
      questions.push(messages[i].content);
    } else if (messages[i].role === "assistant") {
      answers.push(messages[i].content);
    }
  }

  const num = Math.min(questions.length, answers.length);
  for (let i = 0; i < num; i++) {
    prompt += "\n Q : " + questions[i];
    prompt += "\n A : " + answers[i];
  }

  if (questions.length > num) {
    prompt += "\n Q : " + questions[num] + "\n A : ";
  }

  return prompt;
}

export async function POST({ request }: APIEvent) {
  try {
    const body: {
      messages: ChatMessage[]
      sessionId: string
    } = await request.json()


    let gp4Qualify = await isGPT4Qualify(body.sessionId)
    if (!gp4Qualify) {
      throw new Error("GPT4当天已体验完，请明天再试哦")
    }


    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    let prompt = body.messages[body.messages.length - 1].content

    let data: DataType = {
      prompt,
      model: 'forefront',
    };
    /**
        if (body.messages.length > 1) {
          data = {
            prompt: generatePrompt(body.messages),
            model: 'forefront',
          };
        }
    */

    const url = `https://${baseURL}/ask?` + new URLSearchParams(data);
    console.log('url = ', url)
    const rawRes = await fetchWithTimeout(url, {
      method: 'GET',
      timeout: 10000,
    }).catch((err: { message: any }) => {
      return new Response(
        JSON.stringify({
          error: {
            message: err.message
          }
        }),
        { status: 500 }
      )
    })

    if (!rawRes.ok) {
      return new Response(rawRes.body, {
        status: rawRes.status,
        statusText: rawRes.statusText
      })
    }

    const stream = new ReadableStream({
      async start(controller) {
        const streamParser = (event: ParsedEvent | ReconnectInterval) => {
          console.log('event = ', event)
          if (event.type === "event") {
            if (event.event === "done") {
              controller.close()
              return
            }
            const data = event.data
            try {
              const queue = encoder.encode(JSON.parse(data))
              controller.enqueue(queue)
            } catch (e) {
              console.log('result error = ', e)
              controller.error(e)
            }
          } else if (event.type === 'error') {
            throw new Error('请一分钟后再试')
          }
        }
        const parser = createParser(streamParser)
        for await (const chunk of rawRes.body as any) {
          parser.feed(decoder.decode(chunk))
        }
      }
    })

    return new Response(stream)
  } catch (err: any) {
    console.log('err = ', err)
    return new Response(
      JSON.stringify({
        error: {
          message: err.message
        }
      }),
      { status: 400 }
    )
  }
}
