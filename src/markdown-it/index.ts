import MarkdownIt from "markdown-it"
import mdMathJax from "markdown-it-mathjax"
import mdHighlight from "markdown-it-highlightjs"
import mdKbd from "markdown-it-kbd"
import preWrapperPlugin from "./preWrapper"

const md = MarkdownIt({
  linkify: true,
  html: true,
  breaks: true
})
  .use(mdMathJax())
  .use(mdHighlight, {
    inline: true
  })
  .use(mdKbd)
  .use(preWrapperPlugin)

export default md
