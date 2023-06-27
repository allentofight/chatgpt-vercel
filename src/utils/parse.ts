import type { Prompt } from "~/types"

import rolemd from "/roleprompts.md?raw"

import mjmd from "/mjprompts.md?raw"

export function parsePrompts() {

  let content = rolemd
  return content
    .split(/^## (.+)$/m)
    .filter(k => k.trim())
    .reduce((acc, cur, i) => {
      if (i % 2 === 0)
        acc.push({
          desc: cur.trim(),
          detail: ""
        })
      else acc[acc.length - 1].detail = cur.trim()
      return acc
    }, [] as Prompt[])
}


export function parseMjPrompts() {
  return mjmd
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