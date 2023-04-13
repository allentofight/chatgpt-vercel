import { createEffect, createSignal, For, onMount, Show } from "solid-js"
import { createResizeObserver } from "@solid-primitives/resize-observer"
import MessageItem from "./MessageItem"
import ChargeDialog from "./ChargeDialog"
import type { ChatMessage, PromptItem } from "~/types"
import SettingAction from "./SettingAction"
import PromptList from "./PromptList"
import { Fzf } from "fzf"
import throttle from "just-throttle"
import { isMobile } from "~/utils"
import type { Setting } from "~/system"
import { makeEventListener } from "@solid-primitives/event-listener"
import LoginGuideDialog from './LoginGuideDialog'
import { useAuth } from "~/utils/useAuth"
import { setSharedStore, sharedStore } from './store'
import toast, { Toaster } from 'solid-toast';

import { isLocalStorageAvailable } from "~/utils/localStorageCheck"

const apiHost = import.meta.env.PUBLIC_API_HOST;

export default function (props: {
  prompts: PromptItem[]
  env: {
    setting: Setting
    message: string
    resetContinuousDialogue: boolean
  }
  question?: string
}) {
  let inputRef: HTMLTextAreaElement
  let containerRef: HTMLDivElement

  const {
    message: _message,
    setting: _setting,
    resetContinuousDialogue: _resetContinuousDialogue
  } = props.env
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([])
  const [inputContent, setInputContent] = createSignal("")
  const [currentChat, setCurrentChat] = createSignal({ id: '0', title: '', body: '' })
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal("")
  const [loading, setLoading] = createSignal(false)
  const [controller, setController] = createSignal<AbortController>()
  const [setting, setSetting] = createSignal(_setting)
  const [compatiblePrompt, setCompatiblePrompt] = createSignal<PromptItem[]>([])
  const [containerWidth, setContainerWidth] = createSignal("init")
  const [showLoginDirectDialog, setShowLoginDirectDialog] = createSignal(false)
  const [showChargeDialog, setShowChargeDialog] = createSignal(false)
  const [loginGuideTitle, setLoginGuideTitle] = createSignal("您的体验次数已结束，请登录以解锁更多功能")
  const defaultMessage: ChatMessage = {
    role: "assistant",
    content: _message,
    special: "default"
  }
  const fzf = new Fzf(props.prompts, {
    selector: k => `${k.desc}||${k.prompt}`
  })
  const [height, setHeight] = createSignal("48px")
  const [compositionend, setCompositionend] = createSignal(true)

  const scrollToBottom = throttle(
    () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
    },
    250,
    { leading: false, trailing: true }
  )

  onMount(() => {
    const { isLogin } = useAuth()
    if (isLogin()) {
      fetchUserInfo()
    }
    makeEventListener(
      inputRef,
      "compositionend",
      () => {
        setCompositionend(true)
        handleInput()
      },
      { passive: true }
    )
    makeEventListener(
      inputRef,
      "compositionstart",
      () => {
        setCompositionend(false)
      },
      { passive: true }
    )
    document.querySelector("main")?.classList.remove("before")
    document.querySelector("main")?.classList.add("after")
    createResizeObserver(containerRef, ({ width, height }, el) => {
      if (el === containerRef) setContainerWidth(`${width}px`)
    })
    const setting = localStorage.getItem("setting")
    const session = localStorage.getItem("session")
    try {
      let archiveSession = false
      if (setting) {
        const parsed = JSON.parse(setting)
        archiveSession = parsed.archiveSession
        setSetting({
          ..._setting,
          ...parsed,
          ...(_resetContinuousDialogue ? { continuousDialogue: false } : {})
        })
      }
      if (props.question) {
        window.history.replaceState(undefined, "ChatGPT", "/")
        sendMessage(props.question)
      } else {
        if (session && archiveSession) {
          const parsed = JSON.parse(session) as ChatMessage[]
          if (parsed.length === 1 && parsed[0].special === "default") {
            setMessageList([defaultMessage])
          } else setMessageList(parsed)
        } else setMessageList([defaultMessage])
      }
    } catch {
      console.log("Setting parse error")
    }
  })

  createEffect(() => {
    if (sharedStore.message?.type === 'loginRequired') {
      setShowLoginDirectDialog(true)
      setLoginGuideTitle('登录后可拥有保存会话功能')
      console.log(`Message: ${JSON.stringify(sharedStore.message)}`);
    } else if (sharedStore.message?.type === 'selectedChat') {
      let chat = sharedStore.message?.info as { id: string, title: string, body: string }
      setCurrentChat(chat)
      if (!parseInt(chat.id)) {
        setMessageList([])
      } else {
        setMessageList(JSON.parse(chat.body))
      }
    } else if (sharedStore.message?.type === 'showCharge') {
      setShowChargeDialog(true)
    }
  })

  function delChat() {
    const fn = throttle(() => {
      uploadChatList()
    }, 1000);
    fn()
  }

  function closeChargeDialog() {
    setShowChargeDialog(false)
  }

  createEffect((prev: number | undefined) => {
    if (prev !== undefined && messageList().length > prev) {
      scrollToBottom()
    }
    return messageList().length
  })

  createEffect(() => {
    if (currentAssistantMessage()) scrollToBottom()
  })

  createEffect(prev => {
    messageList()
    if (prev) {
      if (messageList().length === 0) {
        setMessageList([defaultMessage])
      } else if (
        messageList().length > 1 &&
        messageList()[0].special === "default"
      ) {
        setMessageList(messageList().slice(1))
      } else if (setting().archiveSession) {
        localStorage.setItem("session", JSON.stringify(messageList()))
      }
    }
    return true
  })

  createEffect(() => {
    localStorage.setItem("setting", JSON.stringify(setting()))
  })

  createEffect(prev => {
    inputContent()
    if (prev) {
      setHeight("48px")
      if (inputContent() === "") {
        setCompatiblePrompt([])
      } else {
        const scrollHeight = inputRef?.scrollHeight
        if (scrollHeight)
          setHeight(
            `${scrollHeight > window.innerHeight - 64
              ? window.innerHeight - 64
              : scrollHeight
            }px`
          )
      }
      inputRef.focus()
    }
    return true
  })

  function archiveCurrentMessage() {

    if (currentAssistantMessage()) {
      setMessageList([
        ...messageList(),
        {
          role: "assistant",
          content: currentAssistantMessage().trim(),
          id: Date.now()
        }
      ])

      setCurrentAssistantMessage("")
      setLoading(false)
      setController()
      !isMobile() && inputRef.focus()
      uploadChatList()
    }
  }

  function uploadChatList() {
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return
    }

    let result = messageList().filter(
      k => k.role !== "error"
    )

    let isCreatingChat = currentChat().id.length < 3
    let postChat = {
      id: currentChat().id,
      title: isCreatingChat ? messageList()[0].content.slice(0, 10) : currentChat().title,
      body: JSON.stringify(result)
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
    })
      .then((data) => {
        // Handle the data
        if (isCreatingChat) {
          setCurrentChat({ ...postChat, id: data.id })
          setSharedStore('message', { type: 'addChat', info: currentChat() })
        }
      })
      .catch((error) => {
        console.error('Error fetching chat:', error);
      });
  }

  function fetchUserInfo() {
    if (isLocalStorageAvailable()) {
      let sessionId = localStorage.getItem('sessionId')
      fetch(`${apiHost}/api/auth/getUserInfo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
      })
        .then((response) => {
          // Check if the response status is OK (200)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Parse the response as JSON
          return response.json();
        })
        .then((data) => {
          localStorage.setItem('expireDay', data.expiredDay.toString());
          localStorage.setItem('inviteCode', data.inviteCode);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    } else {
      console.error('LocalStorage is not available.');
    }
  }

  async function sendMessage(value?: string) {

    const { showLogin, isExpired, isLogin } = useAuth()

    if (showLogin()) {
      setShowLoginDirectDialog(true)
      return
    }

    if (isLogin() && isExpired()) {
      toast.error('VIP 会员已过期，请及时充值哦');
      setShowChargeDialog(true)
      return
    }

    const inputValue = value ?? inputContent()
    if (!inputValue) {
      return
    }

    let storageKey = 'cnt_of_experience'
    const currentValue = parseInt(localStorage.getItem(storageKey) || '0') + 1;
    localStorage.setItem(storageKey, currentValue.toString())

    // @ts-ignore
    if (window?.umami) umami.trackEvent("chat_generate")
    setInputContent("")
    if (
      !value ||
      value !==
      messageList()
        .filter(k => k.role === "user")
        .at(-1)?.content
    ) {
      setMessageList([
        ...messageList(),
        {
          role: "user",
          content: inputValue,
          id: Date.now()
        }
      ])
    }
    try {
      await fetchGPT(getPassedMessageList(inputValue))
    } catch (error: any) {
      setLoading(false)
      setController()
      if (!error.message.includes("abort"))
        setMessageList([
          ...messageList(),
          {
            role: "error",
            content: error.message.replace(/(sk-\w{5})\w+/g, "$1"),
            id: Date.now()
          }
        ])
    }
    archiveCurrentMessage()
  }

  function getPassedMessageList(inputValue: string) {
    const systemRule = setting().systemRule.trim()
    const message = {
      role: "user",
      content: inputValue
    }
    if (systemRule) {
      message.content += "。\n\n" + systemRule
    }

    return setting().continuousDialogue
      ? [...messageList().slice(0, -1), message].filter(
        k => k.role !== "error"
      )
      : [...messageList().filter(k => k.special === "locked"), message]
  }

  type Message = { role: string; content: string };
  async function fetchGPT(messages: Message[]) {
    setLoading(true)
    const controller = new AbortController()
    setController(controller)

    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        messages,
        key: setting().openaiAPIKey || undefined,
        temperature: setting().openaiAPITemperature / 100,
        password: setting().password,
        model: setting().model
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      const res = await response.json()
      let imgHint = '请微信扫码重新获取 API KEY <img width="300" src="https://s2.loli.net/2023/03/28/MRG9Ni1twsLOlva.png" />'
      if (res.error.type === 'insufficient_quota') {
        let img = `额度已用尽，${imgHint}`
        throw new Error(img)
      } else if (res.error.type === 'invalid_request_error') {
        let img = `${res.error.message}，${imgHint}`
        throw new Error(img)
      } else {
        if (res.error.message === 'The operation was aborted') {
          throw new Error('官方请求繁忙，请稍后重试')
        } else {
          let img = `${res.error.message}，${imgHint}`
          throw new Error(img)
        }
      }
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
        if (char === "\n" && currentAssistantMessage().endsWith("\n")) {
          continue
        }
        if (char) {
          setCurrentAssistantMessage(currentAssistantMessage() + char)
        }
      }
      done = readerDone
    }
  }

  function clearSession() {
    setMessageList(messages => messages.filter(k => k.special === "locked"))
    setCurrentAssistantMessage("")
  }

  function stopStreamFetch() {
    if (controller()) {
      controller()?.abort()
      archiveCurrentMessage()
    }
  }

  function selectPrompt(prompt: string) {
    setInputContent(prompt)
    setCompatiblePrompt([])

    const scrollHeight = inputRef?.scrollHeight
    if (scrollHeight)
      setHeight(
        `${scrollHeight > window.innerHeight - 64
          ? window.innerHeight - 64
          : scrollHeight
        }px`
      )
    inputRef.focus()
  }

  const findPrompts = throttle(
    (value: string) => {
      if (value === "/" || value === " ")
        return setCompatiblePrompt(props.prompts)
      const query = value.replace(/^[\/ ](.*)/, "$1")
      if (query !== value)
        setCompatiblePrompt(
          fzf.find(query).map(k => ({
            ...k.item,
            positions: k.positions
          }))
        )
    },
    250,
    {
      trailing: false,
      leading: true
    }
  )

  async function handleInput() {
    setHeight("48px")
    const scrollHeight = inputRef?.scrollHeight
    if (scrollHeight)
      setHeight(
        `${scrollHeight > window.innerHeight - 64
          ? window.innerHeight - 64
          : scrollHeight
        }px`
      )
    if (!compositionend()) return
    const { value } = inputRef
    setInputContent(value)
    findPrompts(value)
  }

  return (
    <div ref={containerRef!} class="mt-4">
      <div class="px-1em mb-6em">
        <div
          id="message-container"
          class="px-1em"
          style={{
            "background-color": "var(--c-bg)"
          }}
        >
          <For each={messageList()}>
            {(message, index) => (
              <MessageItem
                delChat={delChat}
                message={message}
                hiddenAction={loading() || message.special === "default"}
                index={index()}
                setInputContent={setInputContent}
                sendMessage={sendMessage}
                setMessageList={setMessageList}
              />
            )}
          </For>
          {currentAssistantMessage() && (
            <MessageItem
              delChat={delChat}
              hiddenAction={true}
              message={{
                role: "assistant",
                content: currentAssistantMessage(),
                special: "temporary"
              }}
            />
          )}
        </div>
      </div>
      <div
        class="pb-2em px-2em fixed bottom-0 z-10"
        style={{
          "background-color": "var(--c-bg)",
          width: containerWidth() === "init" ? "100%" : containerWidth()
        }}
      >
        <div
          style={{
            transition: "opacity 1s ease-in-out",
            opacity: containerWidth() === "init" ? 0 : 100
          }}
        >
          <Show
            when={
              !loading() && !compatiblePrompt().length && height() === "48px"
            }
          >
            <SettingAction
              setting={setting}
              setSetting={setSetting}
              clear={clearSession}
              messaages={messageList()}
            />
          </Show>
          <Show
            when={!loading()}
            fallback={() => (
              <div class="h-12 flex items-center justify-center bg-slate bg-op-15 text-slate rounded">
                <span>AI 正在思考...</span>
                <div
                  class="ml-1em px-2 py-0.5 border border-slate text-slate rounded-md text-sm op-70 cursor-pointer hover:bg-slate/10"
                  onClick={stopStreamFetch}
                >
                  不需要了
                </div>
              </div>
            )}
          >
            <Show when={compatiblePrompt().length}>
              <PromptList
                prompts={compatiblePrompt()}
                select={selectPrompt}
              ></PromptList>
            </Show>
            <div class="flex items-end">
              <textarea
                ref={inputRef!}
                id="input"
                placeholder="与 ta 对话吧"
                autocomplete="off"
                value={inputContent()}
                autofocus
                onClick={scrollToBottom}
                onKeyDown={e => {
                  if (e.isComposing) return
                  if (compatiblePrompt().length) {
                    if (
                      e.key === "ArrowUp" ||
                      e.key === "ArrowDown" ||
                      e.keyCode === 13
                    ) {
                      e.preventDefault()
                    }
                  } else if (e.keyCode === 13) {
                    if (!e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  } else if (e.key === "ArrowUp") {
                    const userMessages = messageList()
                      .filter(k => k.role === "user")
                      .map(k => k.content)
                    const content = userMessages.at(-1)
                    if (content && !inputContent()) {
                      e.preventDefault()
                      setInputContent(content)
                    }
                  }
                }}
                onInput={handleInput}
                style={{
                  height: height(),
                  "border-bottom-right-radius": 0,
                  "border-top-right-radius":
                    height() === "48px" ? 0 : "0.25rem",
                  "border-top-left-radius":
                    compatiblePrompt().length === 0 ? "0.25rem" : 0
                }}
                class="self-end py-3 resize-none w-full px-3 text-slate-7 dark:text-slate bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none placeholder:text-slate-400 placeholder:text-slate-400 placeholder:op-40"
                rounded-l
              />
              <Show when={inputContent()}>
                <button
                  class="i-carbon:add-filled absolute right-5em bottom-3em rotate-45 text-op-20! hover:text-op-80! text-slate-7 dark:text-slate"
                  onClick={() => {
                    setInputContent("")
                    inputRef.focus()
                  }}
                />
              </Show>
              <div
                class="flex text-slate-7 dark:text-slate bg-slate bg-op-15 text-op-80! hover:text-op-100! h-3em items-center rounded-r"
                style={{
                  "border-top-right-radius":
                    compatiblePrompt().length === 0 ? "0.25rem" : 0
                }}
              >
                <button
                  title="发送"
                  onClick={() => sendMessage()}
                  class="i-carbon:send-filled text-5 mx-3"
                />
              </div>
            </div>
          </Show>
        </div>
      </div>
      <Show when={showLoginDirectDialog()}>
        <LoginGuideDialog title={loginGuideTitle()} />
      </Show>
      <Show when={showChargeDialog()}>
        <ChargeDialog closeDialog={closeChargeDialog} />
      </Show>
      <Toaster position="top-center" />
    </div>
  )
}
