import type { ParsedEvent, ReconnectInterval } from "eventsource-parser"
import { createParser } from "eventsource-parser"
import type { ChatMessage, Model } from "~/types"
import type { APIEvent } from "solid-start/api"

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

export let localKey = process.env.OPENAI_API_KEY || "";
let baseURL = process.env.OPENAI_API_BASE_URL!.replace(/^https?:\/\//, "");

export async function POST({ request }: APIEvent) {
    try {
        const body: {
            messages?: ChatMessage[];
            key?: string;
            temperature: number;
            password?: string;
            model: Model;
            sessionId: string;
        } = await request.json();

        if (body.model.includes('gpt-4')) {
            // 当模型包含 'gpt-4' 时，尝试两种不同的模型变体
            const modelVariants = ['gpt-4-all', 'gpt-4-32k', 'gpt-4-32k'];
            for (const [index, modelVariant] of modelVariants.entries()) {
                body.model = modelVariant as Model;
                const response = await sendRequest(body, index);
                if (response.ok) {
                    return response; // 如果请求成功，直接返回结果
                }
            }
        } else {
            const modelVariants = ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo-16k', 'gpt-3.5-turbo-16k'];
            for (const [index, modelVariant] of modelVariants.entries()) {
                body.model = modelVariant as Model;
                const response = await sendRequest(body, index);
                if (response.ok) {
                    return response; // 如果请求成功，直接返回结果
                }
            }
            // 对于其他模型，使用原始逻辑
        }

        throw new Error("无法成功处理请求。");
    } catch (err: any) {
        return errorResponse(err.message);
    }
}

// 辅助函数：用于发送请求并处理响应
async function sendRequest(body: any, index: number) {
    const { messages, key = localKey, temperature, model } = body;

    if (!messages?.length) {
        throw new Error("没有输入任何文字。");
    }

    let apiKey = key;

    if (model.includes('gpt-4')) {
        apiKey = process.env.OPENAI_GPT4_LG_API_KEY!
        baseURL = process.env.OPENAI_GPT4_LG_API_HOST!
        if (index == 2) {
            apiKey = process.env.OPENAI_GPT4_LG_API_KEY1!
            baseURL = process.env.OPENAI_GPT4_LG_API_HOST1!
        }

    } else if (model.includes('gpt-3.5')) {
        if (index == 1) {
            apiKey = process.env.OPENAI_API_KEY_BAK!
            baseURL = process.env.OPENAI_API_BASE_URL_BAK!
        } else if (index == 2) {
            apiKey = process.env.OPENAI_API_KEY_BAK2!
            baseURL = process.env.OPENAI_API_BASE_URL_BAK2!
        }
    }

    try {
        console.log('apiKey = ', apiKey)
        console.log('baseURL = ', baseURL)
        const rawRes = await fetch(`https://${baseURL}/v1/chat/completions`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            method: "POST",
            body: JSON.stringify({
                model: model,
                messages: messages.map(k => ({ role: k.role, content: k.content })),
                temperature,
                stream: true
            })
        });

        if (!rawRes.ok) {
            throw new Error(rawRes.statusText);
        }

        return createStreamResponse(rawRes);
    } catch (error: any) {
        console.log('err  = ', error, 'mode = ', model)
        return errorResponse(error.message);
    }
}

// 辅助函数：创建错误响应
function errorResponse(message: string) {
    return new Response(
        JSON.stringify({
            error: { message }
        }), { status: 400 }
    );
}

// 辅助函数：创建流响应
function createStreamResponse(rawRes: Response) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
        async start(controller) {
            const streamParser = createStreamParser(controller, encoder);
            const parser = createParser(streamParser);
            for await (const chunk of rawRes.body as any) {
                parser.feed(decoder.decode(chunk));
            }
        }
    });

    return new Response(stream);
}

// 辅助函数：创建流解析器
function createStreamParser(controller: ReadableStreamDefaultController, encoder: TextEncoder) {
    return (event: ParsedEvent | ReconnectInterval) => {
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
    };
}
