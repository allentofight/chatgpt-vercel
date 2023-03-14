export const defaultSetting = {
  continuousDialogue: true,
  openAiDrawing: true,
  archiveSession: false,
  openaiAPIKey: atob('c2stOWJUQmdSamhhcGZ5VlpDczdRS1pUM0JsYmtGSjBtYkZKT0VzQ0pidWd0TGJQRDZv'),
  openaiAPITemperature: 60,
  systemRule: ""
}

const url = 'https://s2.loli.net/2023/03/14/wjdqIlGUogztABN.png'

export const defaultMessage = `
- 本站需填入自己的 apikey 才可使用，如果没有请扫码获取体验码<img width="300" src='${url}' />
- **Shift+Enter** 换行。开头输入 **/** 或者 **空格** 搜索 Prompt 预设。`
