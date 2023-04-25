import * as md from "../../prompts.md"

import * as mjmd from "../../mjprompts.md"

export function parsePrompts(type: string) {

  let content = ''
  if (type === 'gpt') {
    content = md
      .rawContent()
  } else {
    content = mjmd
      .rawContent()
  }

  return content
    .split(/^## (.+)$/m)
    .filter(k => k.trim())
    .reduce(
      (acc, cur, i) => {
        if (i % 2 === 0)
          acc.push({
            desc: cur.trim(),
            prompt: ""
          })
        else acc[acc.length - 1].prompt = cur.trim()
        return acc
      },
      [] as {
        desc: string
        prompt: string
      }[]
    )
}
