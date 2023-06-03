// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import { ResponseError } from "../../interfaces";
export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { content, index, msgId, msgHash } = await req.json();
  console.log("upscale.handler", content);
  const client = new Midjourney({
    ServerId: '1112940597846749225',
    ChannelId: '1112940597846749228',
    SalaiToken: process.env.MJ_SALAI_TOKEN!,
    Debug: true,
    Ws: true,
  });
  await client.init();
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log("upscale.start", content);
      client
        .Upscale(
          content,
          index,
          msgId,
          msgHash,
          (uri: string, progress: string) => {
            console.log("upscale.loading", uri);
            controller.enqueue(
              encoder.encode(JSON.stringify({ uri, progress }))
            );
          }
        )
        .then((msg) => {
          console.log("upscale.done", msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          controller.close();
        })
        .catch((err: ResponseError) => {
          console.log("upscale.error", err);
          controller.close();
        });
    },
  });
  return new Response(readable, {});
}
