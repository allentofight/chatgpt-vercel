export const defaultSetting = {
  continuousDialogue: true,
  archiveSession: false,
  openaiAPIKey: atob('c2stOWJUQmdSamhhcGZ5VlpDczdRS1pUM0JsYmtGSjBtYkZKT0VzQ0pidWd0TGJQRDZv'),
  openaiAPITemperature: 60,
  systemRule: ""
}

export const defaultMessage = `
- 本站仅用于演示，填入自己的 key 才可使用。
- 由 [OpenAI API (gpt-3.5-turbo)](https://platform.openai.com/docs/guides/chat) 和 [Vercel](http://vercel.com/) 提供支持。
- 由 [ourongxing](https://github.com/ourongxing) 修改自 [Diu](https://github.com/ddiu8081/chatgpt-demo)，查看 [源码](https://github.com/ourongxing/chatgpt-vercel)，欢迎自部署。
- **Shift+Enter** 换行。开头输入 **/** 或者 **空格** 搜索 Prompt 预设。更多预设请去 [Github](https://github.com/ourongxing/chatgpt-vercel) PR。`
