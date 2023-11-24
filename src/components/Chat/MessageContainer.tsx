import {
  type Accessor,
  For,
  Show,
  createEffect,
  createSignal,
  createMemo,
  onMount,
  onCleanup
} from "solid-js"
import { RootStore, defaultMessage } from "~/store"
import { scrollToBottom } from "~/utils"
import MessageItem from "./MessageItem"
import { defaultInputBoxHeight } from "./InputBox"
import i18n from "~/utils/i18n"

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
    if (prev !== undefined && store.messageList.length > prev && autoScroll()) {
      scrollToBottom()
    }
    return store.messageList.length
  })


  const [autoScroll, setAutoScroll] = createSignal(true)

  let touchStartY = 0;

  const handleWheel = (event: WheelEvent) => {
    if (event.deltaY > 0) {
      // console.log('滚动方向：向下');
    } else {
      // console.log('滚动方向：向上');
      setAutoScroll(false)
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY = event.touches[0].clientY;
  };

  const handleTouchMove = (event: TouchEvent) => {
    const touchEndY = event.touches[0].clientY;
    if (touchEndY > touchStartY) {
      // console.log('滚动方向：向上');
      setAutoScroll(false)
    } else if (touchEndY < touchStartY) {
      // console.log('滚动方向：向下');
    }
  };

  createEffect(() => {
    setAutoScroll(store.loading)
  })

  onMount(() => {
    const container = document.getElementById('root');
    if (container) {
      container.addEventListener('wheel', handleWheel);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);

      onCleanup(() => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      });
    }
  })

  createEffect(prev => {
    if (store.currentAssistantMessage && autoScroll()) scrollToBottom()
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
        when={!store.loading && (store.sessionSettings.APIModel === 'gpt-4' || store.sessionSettings.APIModel === 'gpt-4-32k')}
      >
        <div class="flex items-center px-1em text-0.8em">
          <hr class="flex-1 border-slate/40" />
          <Show
            when={store.inputContentToken}
            fallback={
              <span class="mx-1 text-slate/50">
                {`${i18n.t('leftCnt')} : ${store.leftGPT4Cnt} ${store.leftGPT4Cnt > 0 ? '，' + store.gpt4ExpireDate + ' ' + i18n.t('expireText') : ''}`}
              </span>
            }
          >
            <span class="mx-1 text-slate/50">
              {`${i18n.t('leftCnt')} : ${store.leftGPT4Cnt} ${store.leftGPT4Cnt > 0 ? '，' + store.gpt4ExpireDate + ' ' + i18n.t('expireText') : ''}`}
            </span>
          </Show>
          <hr class="flex-1  border-slate/30" />
        </div>
      </Show>
    </div>
  )
}
