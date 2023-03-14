import type { APIRoute } from "astro"

export const post: APIRoute = async ({ request }) => {
  const { message, key } = (await request.json()) ?? {}
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
