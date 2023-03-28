import type { APIRoute } from "astro"

export const localKey = "sk-g5J8FQXKH2MrQtyI1" + import.meta.env.OPENAI_API_KEY

export const baseURL = import.meta.env.NOGFW
  ? "api.openai.com"
  : (import.meta.env.OPENAI_API_BASE_URL || "api.openai.com").replace(
      /^https?:\/\//,
      ""
    )

export const post: APIRoute = async context => {
  const body = await context.request.json()
  const { message, key = localKey } = body as {
    message?: string
    key?: string
  }

  if (!message) {
    return {
      body: JSON.stringify({
        success: false,
        message: "message is required"
      })
    }
  }

  if (!key) {
    return {
      body: JSON.stringify({
        success: false,
        message: "openapi key is required"
      })
    }
  }

  const response = await fetch(`https://${baseURL}/v1/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: "image-alpha-001",
      prompt: message,
      size: "256x256",
      num_images: 1
    })
  })

  const result = await response.json()
  if (result?.error) {
    return {
      body: JSON.stringify({
        success: false,
        message: `${result.error?.message}`
      })
    }
  }
  return {
    body: `<img src='${result.data[0].url}' />`
  }
}
