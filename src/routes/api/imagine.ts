// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from "midjourney";
import { ResponseError } from "../../interfaces";
export const config = {
  runtime: "edge",
};

const handler = async (req: Request) => {
  const { prompt } = await req.json();
  console.log("imagine.handler", prompt);
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
      console.log("imagine.start", prompt);
      client
        .Imagine(prompt, (uri: string, progress: string) => {
          console.log("imagine.loading", uri);
          controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
        })
        .then((msg) => {
          console.log("imagine.done", msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          controller.close();
        })
        .catch((err: ResponseError) => {
          console.log("imagine.error", err);
          controller.close();
        });
    },
  });
  return new Response(readable, {});
};
export default handler;
