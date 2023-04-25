import { createEffect, createSignal, For, onMount, Show } from "solid-js"
import { createResizeObserver } from "@solid-primitives/resize-observer"
import MjMessageItem from "./MjMessageItem"
import ChargeDialog from "./ChargeDialog"
import type { MjChatMessage, PromptItem } from "~/types"
import MjPromptList from "./MjPromptList"
import { Fzf } from "fzf"
import throttle from "just-throttle"
import { isMobile } from "~/utils"
import type { Setting } from "~/system"
import { makeEventListener } from "@solid-primitives/event-listener"
import LoginGuideDialog from './LoginGuideDialog'
import { useAuth } from "~/utils/useAuth"
import { setSharedStore, sharedStore } from './store'
import toast, { Toaster } from 'solid-toast'

import { isLocalStorageAvailable } from "~/utils/localStorageCheck"

const apiHost = import.meta.env.PUBLIC_API_HOST;

import { sendMjPrompt } from "~/utils/api"

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

  const [messageList, setMessageList] = createSignal<MjChatMessage[]>([])
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
  const defaultMessage: MjChatMessage = {
    role: 'hint',
    content: _message,
    type: '',
    buttonMessageId: '',
    imageUrl: '',
    messageId: ''
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
        setMessageList([defaultMessage])
      }
    } catch {
      console.log("Setting parse error")
    }
  })

  createEffect(() => {
    if (sharedStore.message?.type === 'loginRequired') {
      setShowLoginDirectDialog(true)
      setLoginGuideTitle('登录后可拥有保存会话等功能')
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
          role: "hint",
          content: currentAssistantMessage().trim(),
          id: Date.now()
        }
      ])

      setCurrentAssistantMessage("")
      setLoading(false)
      setController()
      !isMobile() && inputRef.focus()
      //uploadChatList()
    }
  }

  function uploadChatList() {

    if (!isLocalStorageAvailable()) {
      return
    }

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

  function getPrompt(input?: string) {
    let commands = props.prompts.map(item => item.desc)

    for (let index = 0; index < commands.length; index++) {

      let command = commands[index] + ' '
      if (input?.startsWith(command)) {
        return input.replace(command, '')
      }
    }
    return ''
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

    let prompt = getPrompt(inputValue)
    if (!prompt.length) {
      toast.error("Midjourney 绘画命令有误，请输入'/'来选择正确的命令");
      return
    }

    if (!isLocalStorageAvailable()) {
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
          content: prompt,
          id: Date.now()
        }
      ])
    }

    try {
      let res = await sendMjPrompt(prompt)
      console.log(res.messageId)

      // Assuming res contains the messageId for the last message
      if (res.messageId) {
        // Update the last item in messageList with the new messageId
        setMessageList((prevMessageList) => {
          const updatedMessageList = [...prevMessageList];
          updatedMessageList[updatedMessageList.length - 1] = {
            ...updatedMessageList[updatedMessageList.length - 1],
            messageId: res.messageId,
          };
          return updatedMessageList;
        });
      }

    } catch (error: any) {
      setLoading(false)
    }
    //archiveCurrentMessage()
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
              <MjMessageItem
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
            <MjMessageItem
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

          <Show when={compatiblePrompt().length}>
            <MjPromptList
              prompts={compatiblePrompt()}
              select={selectPrompt}
            ></MjPromptList>
          </Show>
          <div class="flex items-end">
            <textarea
              ref={inputRef!}
              id="input"
              placeholder="请输入'/'开始绘画吧"
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