import { createResizeObserver } from "@solid-primitives/resize-observer"
import { batch, createEffect, Show, createSignal, onMount, onCleanup } from "solid-js"
import { useSearchParams } from "solid-start"
import { RootStore, loadSession } from "~/store"
import { LocalStorageKey, type ChatMessage, ModelEnum, Model } from "~/types"
import { setSession, isMobile } from "~/utils"
import MessageContainer from "./MessageContainer"
import InputBox, { defaultInputBoxHeight } from "./InputBox"
import VipChargeDialog from '../VipChargeDialog'
import { type FakeRoleUnion, setActionState } from "./SettingAction"
import LoginGuideDialog from '../LoginGuideDialog'
import ExchangeDialog from '../ExchangeDialog'
import NotifyDialog from '../NotifyDialog'
import { useAuth } from "~/utils/useAuth"
import { setSharedStore, sharedStore } from '../MessagesStore'
import toast, { Toaster } from 'solid-toast';
import { isLocalStorageAvailable } from "~/utils/localStorageCheck"
import { fetchUserInfo, incrGPT4Cnt } from "~/utils/api"
const SearchParamKey = "q"
const apiHost = import.meta.env.CLIENT_API_HOST;
import Login from "~/components/Login"

let modelMap = {
  [ModelEnum.GPT_3]: "gpt-3.5-turbo-16k" as Model,
  [ModelEnum.GPT_4]: "gpt-4" as Model,
  [ModelEnum.GPT_New_Bing]: "new-bing" as Model,
  [ModelEnum.MJ]: "mj" as Model,
}

export default function () {
  let containerRef: HTMLDivElement
  let controller: AbortController | undefined = undefined
  const [containerWidth, setContainerWidth] = createSignal("init")
  const [inputBoxHeight, setInputBoxHeight] = createSignal(
    defaultInputBoxHeight
  )
  const [showLoginDirectDialog, setShowLoginDirectDialog] = createSignal(false)
  const [showVipDialog, setShowVipDialog] = createSignal(false);
  const [showNotifyDialog, setShowNotifyDialog] = createSignal(false);
  const [showExchangeDialog, setShowExchangeDialog] = createSignal(false)
  const [loginGuideTitle, setLoginGuideTitle] = createSignal("请登录以解锁更多功能")
  const [currentChat, setCurrentChat] = createSignal({ id: '0', title: '', body: '', model: ModelEnum.GPT_3 })
  const [showBindTelDialog, setShowBindTelDialog] = createSignal(false)

  const [searchParams] = useSearchParams()
  const q = searchParams[SearchParamKey]
  const { store, setStore } = RootStore
  onMount(() => {
    fetchUserInfoAsync()

    if (window.location.href.includes('codesea')) {
      setShowNotifyDialog(true)
    } else if (window.location.href.includes('nextaibots')) {
      const queryParams = new URLSearchParams(window.location.search);
      let sid = queryParams.get('sid')
      if (sid) {
        localStorage.setItem('sessionId', sid)
        window.location.href = 'https://www.nextaibots.com'
      }
    }

    const eventListenerFunction = function (e: CustomEvent) {
      if (e.detail.index < ModelEnum.MJ) {
        currentChat().model = e.detail.index
        setStore(
          "sessionSettings",
          "APIModel",
          modelMap[e.detail.index as ModelEnum]
        )
      }
    };

    (window as any).addEventListener('optionSelected', eventListenerFunction);

    onCleanup(() => {
      (window as any).removeEventListener('optionSelected', eventListenerFunction);
    });

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
      let chat = sharedStore.message?.info as { id: string, title: string, body: string, model?: ModelEnum }
      let chatWithModel: { id: string, title: string, body: string, model: ModelEnum } = {
        ...chat,
        model: chat.model ?? ModelEnum.GPT_3
      };
      setCurrentChat(chatWithModel)
      if (!parseInt(chat.id)) {
        setStore("messageList", [])
      } else {
        setStore("messageList", JSON.parse(chat.body))
      }
    } else if (sharedStore.message?.type === 'delChat') {
      uploadChatList()
    }
  })

  createEffect(() => {
    const event = new CustomEvent('selectOption', {
      detail: {
        index: currentChat().model ?? ModelEnum.GPT_3,
        disabled: parseInt(currentChat().id) > 0
      }
    });
    window.dispatchEvent(event);
  })

  function closeVipDialog() {
    setShowVipDialog(false)
  }

  async function fetchUserInfoAsync() {
    try {
      await fetchUserInfo();

      const { isLogin } = useAuth()
      if (isLogin() && !localStorage.getItem('isTelBinded')) {
        setShowBindTelDialog(true)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error('Error fetching user info:', error);
      } else {
        console.error(error);
      }
    }
  }

  interface IResponse {
    conversationSignature: string;
    conversationId: string;
    clientId: string;
    invocationId: string;
  }
  function archiveCurrentMessage(response: IResponse | null = null) {
    let extractInfo = {}
    if (response) {
      extractInfo = {
        conversationSignature: response.conversationSignature,
        conversationId: response.conversationId,
        clientId: response.clientId,
        invocationId: response.invocationId,
      }
    }
    if (store.currentAssistantMessage) {
      batch(() => {
        setStore("messageList", k => [
          ...k,
          {
            role: "assistant",
            content: store.currentAssistantMessage.trim(),
            ...extractInfo
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

  function prepareForUpload(chatMessages: ChatMessage[]): Partial<ChatMessage>[] {
    // Find the most recent message with a conversationId, from the end
    let lastConversationIdIndex = -1;
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].hasOwnProperty('conversationId')) {
        lastConversationIdIndex = i;
        break;
      }
    }

    // Map the messages to a new format
    return chatMessages.map((msg, index) => {
      const newMsg: Partial<ChatMessage> = {
        role: msg.role,
        content: msg.content,
      };
      // If this message is the one with the most recent conversationId, keep that property
      if (index === lastConversationIdIndex) {
        newMsg.conversationId = msg.conversationId;
        newMsg.conversationSignature = msg.conversationSignature;
        newMsg.clientId = msg.clientId;
        newMsg.invocationId = msg.invocationId
      }
      return newMsg;
    });
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

    if (currentChat().model === ModelEnum.GPT_New_Bing) {
      result = prepareForUpload(result) as ChatMessage[];
    }

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

    const { showLogin, isExpired, isLogin, isGPT4Expired } = useAuth()

    if (showLogin()) {
      setShowLoginDirectDialog(true)
      return
    }

    if (isLogin() && isExpired() && currentChat().model === ModelEnum.GPT_3) {
      toast.error('GPT3.5 会员已过期，请及时充值或观看广告兑换 VIP 权限哦');
      setShowExchangeDialog(true)
      return
    }

    fetchUserInfoAsync()

    const inputValue = value ?? store.inputContent
    if (!inputValue) return

    if (!isLocalStorageAvailable()) {
      return
    }

    if (currentChat().model === ModelEnum.GPT_New_Bing) {
      // 付费用户才能使用 GPT4!
      toast.error('new bing 暂不开放哦')
      return
    }

    if (isGPT4Expired() && currentChat().model === ModelEnum.GPT_4) {
      // 付费用户才能使用 GPT4!
      setShowVipDialog(true)
      return
    }

    let isGPT4Using = !isGPT4Expired() && currentChat().model === ModelEnum.GPT_4

    if (isGPT4Using) {
      let isQualifyFor4 = localStorage.getItem('isQualifyFor4')
      if (!isQualifyFor4) {
        toast.error(`GPT4当天已体验完，请明天再试哦`)
        return
      }
    }

    if (!isLogin()) {
      let storageKey = 'cnt_of_experience'
      const currentValue = parseInt(localStorage.getItem(storageKey) || '0') + 1;
      localStorage.setItem(storageKey, currentValue.toString())
    }
    setStore("inputContent", "")
    let result;
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
      setStore("loading", true)
      controller = new AbortController()
      // 在关闭连续对话时，有效上下文只包含了锁定的对话。
      result = await fetchGPT(
        store.sessionSettings.continuousDialogue
          ? store.validContext
          : [
            ...store.validContext,
            {
              role: "user",
              content: inputValue
            }
          ],
        inputValue
      )
      if (isGPT4Using) {
        incrGPT4Cnt()
      }
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

    archiveCurrentMessage(result)
  }

  async function fetchGPT(messages: ChatMessage[], inputVal: string) {
    let isModelGPT = [ModelEnum.GPT_3, ModelEnum.GPT_4].includes(currentChat().model)
    let response;
    let isGPT4 = currentChat().model === ModelEnum.GPT_4
    if (isModelGPT) {
      let sessionId = localStorage.getItem('sessionId')
      let url = `/api${isGPT4 ? '/gpt4' : ''}`
      response = await fetch('/api', {
        method: "POST",
        body: JSON.stringify({
          messages,
          key: undefined,
          temperature: store.sessionSettings.APITemperature,
          password: store.globalSettings.password,
          model: modelMap[currentChat().model],
          sessionId,
        }),
        signal: controller?.signal
      })
    } else {
      let index = -1;
      const roleToFind = 'assistant';
      // 寻找上一条 asssistant 消息
      for (let i = store.messageList.length - 1; i >= 0; i--) {
        if (store.messageList[i].role === roleToFind) {
          index = i;
          break;
        }
      }
      let initial

      if (index > -1) {
        let messageItem = store.messageList[index]
        initial = {
          conversationSignature: messageItem.conversationSignature,
          conversationId: messageItem.conversationId,
          clientId: messageItem.clientId,
          invocationId: messageItem.invocationId,
          message: inputVal,
        }
      } else {
        initial = {
          message: inputVal,
        }
      }

      // 如果是 NewBing
      response = await fetch("/api/bing", {
        method: "POST",
        body: JSON.stringify(initial),
        signal: controller?.signal
      })
    }

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
        let char = decoder.decode(value)
        if (char === "\n" && store.currentAssistantMessage.endsWith("\n")) {
          continue
        }
        if (char) {
          if (!isModelGPT) {
            if (char.startsWith("{\"conversationId")) {
              let result = JSON.parse(char)
              let response = result.response
              setStore("currentAssistantMessage", response)
              return result
            } else {
              setStore("currentAssistantMessage", k => k + char)
            }
          } else {
            setStore("currentAssistantMessage", k => k + char)
          }
        }
      }
      done = readerDone
    }
  }

  return (
    <main ref={containerRef!} id="mainContainer" class="mt-4 w-full flex justify-center" style={{ "max-width": "72ch", "font-size": "16px" }}>
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
      <Show when={showExchangeDialog()}>
        <ExchangeDialog
          successClick={() => {
            window.location.href = '/'
          }}
          showTitle={true}
          showChargeBtn={true}
          chargeBtnClick={() => {
            setShowExchangeDialog(false)
            setShowVipDialog(true)
          }}
          onClick={() => setShowExchangeDialog(false)} />
      </Show>
      <Show when={showVipDialog()}>
        <VipChargeDialog
          title="付费用户才能使用GPT4哦"
          onClose={closeVipDialog} />
      </Show>
      <Show when={showBindTelDialog()}>
        <Login title="请绑定手机号"
          buttonTitle="绑定"
          showBindSuccess={true}
          successCallback={() => {
            setShowBindTelDialog(false)
          }}
        />
      </Show>
      <Show when={showNotifyDialog()}>
        <NotifyDialog />
      </Show>
      <Toaster position="top-center" />
    </main>
  )
}
