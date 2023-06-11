import { createEffect, createSignal, For, onMount, Show } from "solid-js"
import { createResizeObserver } from "@solid-primitives/resize-observer"
import MjMessageItem from "./MjMessageItem"
import type { MjChatMessage, PromptItem } from "~/types"
import MjPromptList from "./MjPromptList"
import { Fzf } from "fzf"
import throttle from "just-throttle"
import { makeEventListener } from "@solid-primitives/event-listener"
import LoginGuideDialog from './LoginGuideDialog'
import UploadImageDialog from './UploadImageDialog'
import { useAuth } from "~/utils/useAuth"
import type { MjRole } from "~/types"
import toast, { Toaster } from 'solid-toast'
import VipChargeDialog from './VipChargeDialog'

import {
  getRequestImageSize
} from "~/utils"

import { isLocalStorageAvailable } from "~/utils/localStorageCheck"

const apiHost = import.meta.env.CLIENT_API_HOST;

import { sendMjPrompt, mjUpscale, updateMjMessage, delMjMessage, fetchMjMessageList } from "~/utils/api"

import MJGenerator from "./MJGenerator"

import PullTrack from './PullTrack'

export default function (props: {
  prompts: PromptItem[]
}) {
  let inputRef: HTMLTextAreaElement
  let containerRef: HTMLDivElement

  const [prompt, setPrompt] = createSignal("")
  const [messageList, setMessageList] = createSignal<MjChatMessage[]>([])
  const [inputContent, setInputContent] = createSignal("")
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal("")
  const [loading, setLoading] = createSignal(false)
  const [compatiblePrompt, setCompatiblePrompt] = createSignal<PromptItem[]>([])
  const [containerWidth, setContainerWidth] = createSignal("init")
  const [showLoginDirectDialog, setShowLoginDirectDialog] = createSignal(false)
  const [showUploadImageDialog, setShowUploadImageDialog] = createSignal(false)
  const [isRefreshing, setIsRefreshing] = createSignal(false)
  let [isLoading, setIsLoading] = createSignal(false);
  let [hasMore, setHasMore] = createSignal(true);

  const [showVipDialog, setShowVipDialog] = createSignal(false);
  const [showMJGeneratorDialog, setShowMJGeneratorDialog] = createSignal(false)
  const [loginGuideTitle, setLoginGuideTitle] = createSignal("请登录以解锁更多功能")
  const MJ_HINT = import.meta.env.CLIENT_MJ_MESSAGE

  const defaultMessage: MjChatMessage = {
    role: 'hint',
    content: MJ_HINT,
    buttonMessageId: '',
    type: 1,
    imageUrl: '',
    originImageUrl: '',
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

  async function loadMoreMessages() {
    if (isLoading() || !hasMore()) {
      return;
    }
    setIsLoading(true);
    fetchMessageList(() => {
      setIsLoading(false)
      setIsRefreshing(false)
    });
  }

  createEffect(() => {

    if (isRefreshing() && window.pageYOffset === 0) {
      loadMoreMessages();
    }
  });

  onMount(() => {
    const { isLogin } = useAuth()
    if (isLogin()) {
      fetchUserInfoAsync()
      fetchMessageList()
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

    createResizeObserver(containerRef, ({ width, height }, el) => {
      if (el === containerRef) setContainerWidth(`${width}px`)
    })

    setTimeout(() => {
      document.querySelector("#root")?.classList.remove("before")
    })
    document.querySelector("#root")?.classList.add("after")

    const setting = localStorage.getItem("setting")
    const session = localStorage.getItem("session")
    try {
      setMessageList([defaultMessage])
    } catch {
      console.log("Setting parse error")
    }
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

  function delChat(messageId: string) {
    delMjMessage(messageId)
  }


  function fetchMessageList(onComplete?: () => void) {
    let earliestGmtCreate = messageList().length > 0 ? messageList()[0].gmtCreate : ""
    fetchMjMessageList(earliestGmtCreate).then((data) => {
      let result = data.list.map(item => {
        let imageSizeRes = getRequestImageSize(item.imageUrl, item.imageSize)
        return {
          role: item.errorMessage?.length ? 'error' : (item.type == 1 ? 'prompt' : 'variation'),
          prompt: item.prompt,
          gmtCreate: item.gmtCreate,
          seed: item.seed,
          content: item.prompt + (item.ref ?? ''),
          buttonMessageId: item.buttonMessageId,
          messageId: item.messageId,
          clickedButtons: item.clickedEvent ? JSON.parse(item.clickedEvent) : [],
          type: item.type,
          errorMessage: item.errorMessage,
          imageUrl: imageSizeRes.previewUrl,
          originImageUrl: imageSizeRes.originUrl,
        } as MjChatMessage
      })

      setHasMore(data.hasMore)
      if (messageList().length == 1 && messageList()[0].content == MJ_HINT) {
        setMessageList(result)
      } else {
        setMessageList([...result, ...messageList()])
      }

      window.scrollTo({ top: 2 })

      if (onComplete) {
        onComplete();
      }
    }).catch(error => {
      if (onComplete) {
        onComplete();
      }
      console.error('fetch messageList error:', error)
    })
  }

  createEffect((prev: number | undefined) => {
    if (prev !== undefined && messageList().length > prev) {
      if (prev == 1 || messageList().length - prev == 1) {
        scrollToBottom()
      }
    }
    return messageList().length
  })

  createEffect(() => {

    if (prompt().length) {
      setInputContent('/imagine ' + prompt().trim())
      setShowMJGeneratorDialog(false)
      setPrompt('')
    }
  })

  createEffect(() => {

    if (inputContent().includes('prompt生成器')) {
      setShowMJGeneratorDialog(true)
      setInputContent('')
    } else if (inputContent().includes('/垫图')) {
      setShowUploadImageDialog(true)
      setInputContent('')
    }
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
        messageList()[0].role === "hint"
      ) {
        setMessageList(messageList().slice(1))
      }
    }
    return true
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

  function closeVipDialog() {
    setShowVipDialog(false)
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

  async function sendMJButtonCommand(command: string, message: MjChatMessage) {
    try {
      let ref = ''
      if (command.includes('U')) {
        const match = command.match(/\d+/);
        ref = match ? `- Image #${match[0]}` : '';
      }

      setMessageList((prev) => [
        ...prev,
        {
          role: command.startsWith('U') ? "variation" : "prompt",
          content: message.prompt + " " + ref,
          prompt: message.prompt,
          buttonMessageId: '',
          type: command.startsWith('U') ? 2 : 1,
          imageUrl: '',
          originImageUrl: '',
          messageId: message.messageId,
          ref,
        } as MjChatMessage,
      ]);

      let res = await sendMjPrompt({
        prompt: message.prompt,
        messageId: message.messageId,
        button: command,
        ref,
      })

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

        updateMjMessage({
          messageId: message.messageId,
          clickedEvent: JSON.stringify([command]),
        })
      }
    } catch (error: any) {
      setLoading(false)
    }
  }

  function containsChineseCharacters(str: string) {
    const regex = /[\u4E00-\u9FFF]/;
    return regex.test(str);
  }

  async function sendMessage(value?: string) {
    const { showLogin, isMjExpired } = useAuth()

    if (showLogin()) {
      setShowLoginDirectDialog(true)
      return
    }

    fetchUserInfoAsync()

    const inputValue = value ?? inputContent()
    if (!inputValue) {
      return
    }

    let prompt = getPrompt(inputValue)
    if (!prompt.length) {
      toast.error("Midjourney 绘画命令有误，请输入'/'来选择正确的命令");
      return
    }

    if (containsChineseCharacters(prompt)) {
      toast.error("绘图命令必须为英文，请输入 / 来选择唤出 prompt 生成器");
      return
    }

    if (isMjExpired()) {
      // 付费用户才能使用 MJ哦!
      setShowVipDialog(true)
      return
    }

    if (!isLocalStorageAvailable()) {
      return
    }

    // @ts-ignore
    if (window?.umami) umami.trackEvent("chat_generate")
    setInputContent("")

    setMessageList((prev) => [
      ...prev,
      {
        role: "prompt",
        content: prompt,
        prompt,
        type: 1,
        buttonMessageId: '',
        imageUrl: '',
        originImageUrl: '',
        messageId: '',
      },
    ]);

    try {
      let res = await sendMjPrompt({ prompt })
      // Assuming res contains the messageId for the last message
      let resultDict: { messageId?: string, errorMessage?: string, role?: MjRole };
      if (res.messageId) {
        resultDict = {
          messageId: res.messageId,
        }
      } else if (res.bannedWord) {
        resultDict = {
          errorMessage: `使用了违禁词${res.bannedWord}`,
          role: 'error'
        }
      }
      // Update the last item in messageList with the new messageId
      setMessageList((prevMessageList) => {
        const updatedMessageList = [...prevMessageList];
        updatedMessageList[updatedMessageList.length - 1] = {
          ...updatedMessageList[updatedMessageList.length - 1],
          ...resultDict
        };
        return updatedMessageList;
      });
    } catch (error: any) {
      console.log('error...', error)
      toast.error(error.message)
      setLoading(false)
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
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      <main ref={containerRef!} class="mt-4">
        <div class="px-1em mb-6em">
          <div
            id="message-container"
            class="px-1em"
            style={{
              "background-color": "var(--c-bg)"
            }}
          >
            {isLoading() && (
              <div class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )}
            <PullTrack setIsRefreshing={setIsRefreshing} />
            <For each={messageList()}>
              {(message, index) => (
                <MjMessageItem
                  delChat={delChat}
                  message={message}
                  index={index()}
                  setInputContent={setInputContent}
                  mjBtnClick={sendMJButtonCommand}
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
        <Show when={showVipDialog()}>
          <VipChargeDialog
            title="付费用户才能使用MJ哦"
            onClose={closeVipDialog} />
        </Show>
        <Show when={showMJGeneratorDialog()}>
          <MJGenerator
            setPrompt={setPrompt}
            handleClick={() => {
              setShowMJGeneratorDialog(false)
            }} />
        </Show>
        <Show when={showUploadImageDialog()}>
          <UploadImageDialog
            onClose={() => { setShowUploadImageDialog(false) }}
            clickToDraw={(prompt) => {
              setInputContent(prompt)
              setShowUploadImageDialog(false)
            }} />
        </Show>
        <Toaster position="top-center" />
      </main>
    </>
  )
}
