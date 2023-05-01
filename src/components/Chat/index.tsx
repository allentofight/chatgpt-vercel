import { createResizeObserver } from "@solid-primitives/resize-observer"
import { batch, createEffect, Show, createSignal, onMount } from "solid-js"
import { useSearchParams } from "solid-start"
import { RootStore, loadSession } from "~/store"
import { LocalStorageKey, type ChatMessage, Model } from "~/types"
import { setSession, isMobile } from "~/utils"
import MessageContainer from "./MessageContainer"
import InputBox, { defaultInputBoxHeight } from "./InputBox"
import { type FakeRoleUnion, setActionState } from "./SettingAction"
import LoginGuideDialog from '../LoginGuideDialog'
import ExchangeDialog from '../ExchangeDialog'
import ChargeDialog from '../ChargeDialog'
import { useAuth } from "~/utils/useAuth"
import { setSharedStore, sharedStore } from '../MessagesStore'
import toast, { Toaster } from 'solid-toast';
import { isLocalStorageAvailable } from "~/utils/localStorageCheck"
import { fetchUserInfo } from "~/utils/api"
const SearchParamKey = "q"
const apiHost = import.meta.env.CLIENT_API_HOST;

export default function () {
  let containerRef: HTMLDivElement
  let controller: AbortController | undefined = undefined
  const [containerWidth, setContainerWidth] = createSignal("init")
  const [inputBoxHeight, setInputBoxHeight] = createSignal(
    defaultInputBoxHeight
  )
  const [showLoginDirectDialog, setShowLoginDirectDialog] = createSignal(false)
  const [showChargeDialog, setShowChargeDialog] = createSignal(false)
  const [showExchangeDialog, setShowExchangeDialog] = createSignal(false)
  const [loginGuideTitle, setLoginGuideTitle] = createSignal("您的体验次数已结束，请登录以解锁更多功能")
  const [currentChat, setCurrentChat] = createSignal({ id: '0', title: '', body: '', model: Model.GPT_3 })

  const [searchParams] = useSearchParams()
  const q = searchParams[SearchParamKey]
  const { store, setStore } = RootStore
  onMount(() => {
    fetchUserInfoAsync()
    window.addEventListener('optionSelected', function (e: CustomEvent) {
      currentChat().model = e.detail.index
    } as EventListener);

    createResizeObserver(containerRef, ({ width }, el) => {
      if (el === containerRef) setContainerWidth(`${width}px`)
    })
    setTimeout(() => {
      document.querySelector("#root")?.classList.remove("before")
    })
    document.querySelector("#root")?.classList.add("after")
    if (q) sendMessage(q)
  })

  createEffect(() => {
    localStorage.setItem(
      LocalStorageKey.GLOBALSETTINGS,
      JSON.stringify(store.globalSettings)
    )
  })

  createEffect(() => {
    if (sharedStore.message?.type === 'loginRequired') {
      setShowLoginDirectDialog(true)
      setLoginGuideTitle('登录后可拥有保存会话功能')
    } else if (sharedStore.message?.type === 'selectedChat') {
      let chat = sharedStore.message?.info as { id: string, title: string, body: string, model?: Model }
      let chatWithModel: { id: string, title: string, body: string, model: Model } = {
        ...chat,
        model: chat.model ?? Model.GPT_3
      };
      setCurrentChat(chatWithModel)
      if (!parseInt(chat.id)) {
        setStore("messageList", [])
      } else {
        setStore("messageList", JSON.parse(chat.body))
      }
    } else if (sharedStore.message?.type === 'showCharge') {
      setShowChargeDialog(true)
    }
  })

  createEffect(() => {
    const event = new CustomEvent('selectOption', {
      detail: {
        index: currentChat().model ?? Model.GPT_3,
        disabled: parseInt(currentChat().id) > 0
      }
    });
    window.dispatchEvent(event);
  })

  async function fetchUserInfoAsync() {
    try {
      await fetchUserInfo();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error('Error fetching user info:', error);
      } else {
        console.error(error);
      }
    }
  }

  function closeChargeDialog() {
    setShowChargeDialog(false)
  }

  function archiveCurrentMessage() {
    if (store.currentAssistantMessage) {
      batch(() => {
        setStore("messageList", k => [
          ...k,
          {
            role: "assistant",
            content: store.currentAssistantMessage.trim()
          }
        ])
        setStore("currentAssistantMessage", "")
        setStore("loading", false)
      })
      controller = undefined
    }
    !isMobile() && store.inputRef?.focus()
    uploadChatList()
  }

  function uploadChatList() {

    if (!isLocalStorageAvailable()) {
      return
    }

    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return
    }
    let result = store.messageList.filter(
      k => k.role !== "error"
    )

    let isCreatingChat = currentChat().id.length < 3
    let postChat = {
      id: currentChat().id,
      title: isCreatingChat ? store.messageList[0].content.slice(0, 10) : currentChat().title,
      body: JSON.stringify(result),
      model: currentChat().model
    }
    fetch(`${apiHost}/api/chat/createOrUpdate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      },
      body: JSON.stringify(postChat),
    }).then((response) => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the response as JSON
      return response.json();
    }).then((data) => {

      if (isCreatingChat) {
        setCurrentChat({ ...postChat, id: data.id })
        setSharedStore('message', { type: 'addChat', info: currentChat() })
      } else {
        setSharedStore('message', { type: 'updateChatBody', info: { body: postChat.body } })
      }
    }).catch((error) => {
      console.error('Error fetching chat:', error);
    });
  }

  function stopStreamFetch() {
    if (controller) {
      controller?.abort()
      archiveCurrentMessage()
    }
  }

  async function sendMessage(value?: string, fakeRole?: FakeRoleUnion) {

    const { showLogin, isExpired, isLogin } = useAuth()

    if (showLogin()) {
      setShowLoginDirectDialog(true)
      return
    }

    if (isLogin() && isExpired()) {
      toast.error('VIP 会员已过期，请及时充值或观看广告兑换 VIP 权限哦');
      setShowExchangeDialog(true)
      return
    }

    fetchUserInfoAsync()

    const inputValue = value ?? store.inputContent
    if (!inputValue) return

    if (!isLocalStorageAvailable()) {
      return
    }

    if (!isLogin()) {
      let storageKey = 'cnt_of_experience'
      const currentValue = parseInt(localStorage.getItem(storageKey) || '0') + 1;
      localStorage.setItem(storageKey, currentValue.toString())
    }
    console.log('before...')
    setStore("inputContent", "")
    try {
      setStore("messageList", k => [
        ...k,
        {
          role: "user",
          content: inputValue
        }
      ])
      if (store.remainingToken < 0) {
        throw new Error(
          store.sessionSettings.continuousDialogue
            ? "本次对话过长，请清除之前部分对话或者缩短当前提问。"
            : "提问太长了，请缩短。"
        )
      }
      console.log('msgList = ', JSON.stringify(store.messageList))
      setStore("loading", true)
      controller = new AbortController()
      // 在关闭连续对话时，有效上下文只包含了锁定的对话。
      await fetchGPT(
        store.sessionSettings.continuousDialogue
          ? store.validContext
          : [
            ...store.validContext,
            {
              role: "user",
              content: inputValue
            }
          ]
      )
    } catch (error: any) {
      setStore("loading", false)
      controller = undefined
      if (!error.message.includes("abort")) {
        setStore("messageList", k => [
          ...k,
          {
            role: "error",
            content: error.message.replace(/(sk-\w{5})\w+/g, "$1")
          }
        ])
      }
    }

    archiveCurrentMessage()
  }

  async function fetchGPT(messages: ChatMessage[]) {
    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        messages,
        key: undefined,
        temperature: store.sessionSettings.APITemperature,
        password: store.globalSettings.password,
        model: store.sessionSettings.APIModel
      }),
      signal: controller?.signal
    })
    if (!response.ok) {
      const res = await response.json()
      throw new Error(res.error.message)
    }
    const data = response.body
    if (!data) {
      throw new Error("没有返回数据")
    }
    const reader = data.getReader()
    const decoder = new TextDecoder("utf-8")
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      if (value) {
        const char = decoder.decode(value)
        if (char === "\n" && store.currentAssistantMessage.endsWith("\n")) {
          continue
        }
        if (char) {
          setStore("currentAssistantMessage", k => k + char)
        }
      }
      done = readerDone
    }
  }

  return (
    <main ref={containerRef!} class="mt-4">
      <MessageContainer
        sendMessage={sendMessage}
        inputBoxHeight={inputBoxHeight}
      />
      <InputBox
        height={inputBoxHeight}
        width={containerWidth}
        setHeight={setInputBoxHeight}
        sendMessage={sendMessage}
        stopStreamFetch={stopStreamFetch}
      />
      <Show when={showLoginDirectDialog()}>
        <LoginGuideDialog title={loginGuideTitle()} />
      </Show>
      <Show when={showChargeDialog()}>
        <ChargeDialog closeDialog={closeChargeDialog} />
      </Show>
      <Show when={showExchangeDialog()}>
        <ExchangeDialog
          successClick={() => {
            window.location.href = '/'
          }}
          showTitle={true}
          onClick={() => setShowExchangeDialog(false)} />
      </Show>
      <Toaster position="top-center" />
    </main>
  )
}
