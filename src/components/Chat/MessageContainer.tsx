import {
  type Accessor,
  For,
  Show,
  createEffect,
  createSignal,
  createMemo
} from "solid-js"
import { RootStore, defaultMessage } from "~/store"
import { scrollToBottom } from "~/utils"
import MessageItem from "./MessageItem"
import { defaultInputBoxHeight } from "./InputBox"

export default function ({
  sendMessage,
  inputBoxHeight
}: {
  sendMessage(value?: string): void
  inputBoxHeight: Accessor<number>
}) {
  const { store } = RootStore
  // 防止重新设置高度时页面跳动
  const paddingBottom = createMemo(
    k =>
      inputBoxHeight() === defaultInputBoxHeight - 1 ? k : inputBoxHeight(),
    defaultInputBoxHeight
  )

  createEffect((prev: number | undefined) => {
    if (prev !== undefined && store.messageList.length > prev) {
      scrollToBottom()
    }
    return store.messageList.length
  })

  createEffect(prev => {
    if (store.currentAssistantMessage) scrollToBottom()
  })

  createEffect(prev => {
    inputBoxHeight()
    if (prev && paddingBottom() !== defaultInputBoxHeight) {
      scrollToBottom()
    }
    return true
  })

  return (
    <div
      class="px-1em w-full"
      id="message-container"
      style={{
        "margin-bottom": `calc(6em + ${paddingBottom() + "px"})`
      }}
    >
      <div id="message-container-img" class="px-1em">
        <Show when={!store.messageList.length}>
          <MessageItem hiddenAction={true} message={defaultMessage} />
        </Show>
        <For each={store.messageList}>
          {(message, index) => (
            <MessageItem
              message={message}
              hiddenAction={store.loading}
              index={index()}
              sendMessage={sendMessage}
            />
          )}
        </For>
        <Show when={store.currentAssistantMessage}>
          <MessageItem
            hiddenAction={true}
            message={{
              role: "assistant",
              content: store.currentAssistantMessage,
              type: "temporary"
            }}
          />
        </Show>
      </div>
      <Show
        when={!store.loading && store.sessionSettings.APIModel === 'gpt-4'}
      >
        <div class="flex items-center px-1em text-0.8em">
          <hr class="flex-1 border-slate/40" />
          <Show
            when={store.inputContentToken}
            fallback={
              <span class="mx-1 text-slate/50">
                {`剩余次数 : ${store.leftGPT4Cnt} ${store.leftGPT4Cnt > 0 ? ',截止至 ' + store.gpt4ExpireDate : ''}`}
              </span>
            }
          >
            <span class="mx-1 text-slate/50">
              {`剩余次数 : ${store.leftGPT4Cnt} ${store.leftGPT4Cnt > 0 ? ',截止至 ' + store.gpt4ExpireDate : ''}`}
            </span>
          </Show>
          <hr class="flex-1  border-slate/30" />
        </div>
      </Show>
    </div>
  )
}
