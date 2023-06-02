import type { APIEvent } from "solid-start/api"
import { Midjourney } from "midjourney";

export const config = {
  runtime: "server",
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

export async function POST({ request }: APIEvent) {
  try {
    const body: {
      prompt: string,
      button: string,
      id: string,
      hash: string,
    } = await request.json()

    const client = new Midjourney({
      ServerId: '1112940597846749225',
      ChannelId: '1112940597846749228',
      SalaiToken: process.env.MJ_SALAI_TOKEN!,
      Debug: true,
    });

    const encoder = new TextEncoder();
    let streamClosed = false;

    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          let msg;
          if (body.button?.includes('U')) {
            let index = body.button.replace('U', '')
            msg = await client.Upscale(
              body.prompt,
              parseInt(index),
              body.id,
              body.hash,
              (uri: string, progress: string) => {
                console.log("upscaling", uri, "progress", progress);
                controller.enqueue(encoder.encode(JSON.stringify({ imageUrl: uri, progress })));
              }
            );
          } else if (body.button?.includes('V')) {
            let index = body.button.replace('V', '')
            msg = await client.Variation(
              body.prompt,
              parseInt(index),
              body.id,
              body.hash,
              (uri: string, progress: string) => {
                console.log("variation", uri, "progress", progress);
                controller.enqueue(encoder.encode(JSON.stringify({ imageUrl: uri, progress })));
              }
            );
          } else {
            console.log('loading....')
            msg = await client.Imagine(body.prompt, (uri: string, progress: string) => {
              console.log("loading", uri, "progress", progress);
              // This will be streamed to the client
              controller.enqueue(encoder.encode(JSON.stringify({ imageUrl: uri, progress })));
            });
          }

          console.log({ msg });
          if (!streamClosed) {
            controller.enqueue(encoder.encode(JSON.stringify({ msg })));
          }

        } catch (error) {
          console.error(error);
          if (!streamClosed) {
            controller.enqueue(encoder.encode(JSON.stringify({ error: 'An error occurred while uploading the image.' })));
          }
        } finally {
          controller.close();
        }
      },
      cancel() {
        // This will be called if the client cancels the response
        streamClosed = true;
      }
    });

    return new Response(customReadable, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
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