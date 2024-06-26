import { type SessionSettings } from "./env"

export const enum LocalStorageKey {
  GLOBALSETTINGS = "gpt-global-settings",
  THEME = "gpt-theme",
  PREFIXSESSION = "gpt-session-"
}

export interface ChatMessage {
  role: Role
  content: string
  type?: "default" | "locked" | "temporary"
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
  originImageUrl: string,
  errorMessage?: string,
  seed?: string,
  gmtCreate?: string,
}

export type Role = "system" | "user" | "assistant" | "error"

export type MjRole = "hint" | "prompt" | "variation" | "help" | "error"

export type Model = "gpt-3.5-turbo-16k" | "gpt-4" | "gpt-4-32k"

export enum ModelEnum {
  GPT_3 = 1,
  GPT_New_Bing = 2,
  GPT_4 = 3,
  MJ = 4,
}

export interface PromptItem {
  desc: string
  prompt: string
  positions?: Set<number>
}

export interface Prompt {
  desc: string
  detail: string
}

export interface Session {
  id: string
  lastVisit: number
  messages: ChatMessage[]
  settings: SessionSettings
}

export interface Option {
  desc: string
  id?: string
  title: string
  icon?: string
  color?: string
  positions?: Set<number>
  extra?: any
}