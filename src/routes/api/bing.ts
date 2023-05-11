import type { APIEvent } from "solid-start/api"
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser"
import { createParser } from "eventsource-parser"
import { fetchWithTimeout } from "~/utils"

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


export const baseURL = process.env.NEW_BING_HOST

const timeout = Number(import.meta.env.TIMEOUT)


export async function POST({ request }: APIEvent) {
  try {
    const body: {
      message: string,
      conversationSignature: string,
      conversationId: string,
      clientId: string,
      invocationId: string,
    } = await request.json()

    const {
      message,
      conversationSignature,
      conversationId,
      clientId,
      invocationId,
    } = body

    if (!message?.length) {
      throw new Error("没有输入任何文字。")
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const rawRes = await fetchWithTimeout(
      `http://${baseURL}/conversation`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: !timeout || Number.isNaN(timeout) ? 30000 : timeout,
        method: "POST",
        body: JSON.stringify({
          message,
          conversationSignature,
          conversationId,
          clientId,
          invocationId,
          toneStyle: 'creative',
          stream: true
        })
      }
    ).catch(err => {
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
          if (event.type === "event") {
            const data = event.data
            if (data === "[DONE]") {
              controller.close()
              return
            }
            try {
              const queue = encoder.encode(data.includes('conversationId') ? data : JSON.parse(data))
              controller.enqueue(queue)
            } catch (e) {
              controller.error(e)
            }
          }
        }
        const parser = createParser(streamParser)
        for await (const chunk of rawRes.body as any) {
          parser.feed(decoder.decode(chunk))
        }
      }
    })

    return new Response(stream, {
      headers: {
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err: any) {
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