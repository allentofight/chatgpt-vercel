export interface ChatMessage {
  role: Role
  content: string
  special?: "default" | "locked" | "temporary",
  conversationSignature?: string,
  conversationId?: string,
  clientId?: string,
  invocationId?: string,
  model?: Model
}

export interface MjChatMessage {
  role: MjRole,
  prompt?: string,
  content: string,
  buttonMessageId: string,
  messageId: string,
  type: number,
  clickedButtons?: Array<string>
  imageUrl: string,
}

export type Role = "system" | "user" | "assistant" | "error"

export type MjRole = "hint" | "prompt" | "variation" | "help" | "error"

export enum Model {
  GPT_3 = 1,
  GPT_New_Bing = 2,
}

export interface PromptItem {
  desc: string
  prompt: string
  positions?: Set<number>
}
