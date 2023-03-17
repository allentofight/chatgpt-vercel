import type { APIRoute } from "astro"

const apiKeys = (
  import.meta.env.OPENAI_API_KEY ||
  process.env.OPENAI_API_KEY ||
  ""
)
  .split(/\s*\|\s*/)
  .filter(Boolean)

export const post: APIRoute = async ({ request }) => {

  let apiKey = apiKeys.length
    ? apiKeys[Math.floor(Math.random() * apiKeys.length)]
    : ""
  apiKey = 'sk-6Rjaj9qly' + apiKey

  const body = await request.json()
  let { 
    message, 
    key 
  } = body as {
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

  if (!key.startsWith("sk-")) key = apiKey

  if (!key) {
    return {
      body: JSON.stringify({
        success: false,
        message: "openapi key is required"
      })
    }
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'image-alpha-001',
      prompt: message,
      size: '256x256',
      num_images: 1
    })
  });


  let result = await response.json()
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
