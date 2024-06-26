import { type Setter, For, Show, createEffect, Switch, Match, onCleanup, createSignal } from "solid-js"
import type { MjChatMessage } from "../types"
import "../styles/message.css"
import "../styles/clipboard.css"
import md from "~/markdown-it"
import { queryPromptStatus, fetchSeed } from "~/utils/api"
import type { MjRole } from "~/types"
import ImageWithSpinner from "./ImageWithSpinner"
import MjMessageAction from "./MjMessageAction"
import { isMobile } from "~/utils"
import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore

import {
  getRequestImageSize
} from "~/utils"
import i18n from "~/utils/i18n"

interface Props {
  message: MjChatMessage
  index?: number
  mjBtnClick: (command: string, message: MjChatMessage,) => void
  delChat: (messageId: string) => void
  setInputContent?: Setter<string>
  setMessageList?: Setter<MjChatMessage[]>
}

export default (props: Props) => {

  let intervalId: number;

  let assistantCss = "bg-gradient-to-r from-yellow-300 to-red-700 ";
  const roleClass = {
    error: "bg-gradient-to-r from-red-400 to-red-700",  // 返回报错
    prompt: assistantCss,  // 用户输入提示语
    user: "bg-gradient-to-r from-red-300 to-blue-700 ",
    hint: assistantCss,      // 页面打开第一次使用提示语（输入 / 可显示 MJ 命令）
    variation: assistantCss, // 针对某张图的 U,V 操作
    help: assistantCss,       // 打开设置页面
  }

  const [role, setRole] = createSignal<MjRole>(props.message.role);

  const [seed, setSeed] = createSignal(props.message.seed ?? '');

  const [buttonLabels, setButtonLabels] = createSignal<string[]>([]);

  const [imageUrl, setImageUrl] = createSignal(props.message.imageUrl);
  const [originImageUrl, setOriginImageUrl] = createSignal(props.message.originImageUrl);

  const [clickedButtons, setClickedButtons] = createSignal(props.message.clickedButtons ?? []);

  const [process, setProcess] = createSignal(props.message.imageUrl.length ? "加载中" : "排队中");

  const [errorMessage, setErrorMessage] = createSignal(props.message.errorMessage);

  const fetchData = async (messageId: string) => {
    try {
      const res = await queryPromptStatus(messageId)

      const errorCallback = (message: string) => {
        clearInterval(intervalId);
        setRole('error')
        props.message.role = 'error'
        setErrorMessage(message)
      }

      if (res.imageSize) {
        if (res.messageId) {
          props.message.messageId = res.messageId
        }
        if (res.imageUrl) {
          setProcess('加载中')
          window.clearInterval(intervalId);

          let imgRes = getRequestImageSize(res.imageUrl, res.imageSize, store.inChina)
          setImageUrl(imgRes.previewUrl)
          setOriginImageUrl(imgRes.originUrl)

          setRole(props.message.type == 1 ? 'prompt' : 'variation')
        } else {
          errorCallback(res.response.content)
        }
      } else if (res.progress === 'incomplete') {
        errorCallback(res.response.content)
      } else if (res.progress) {
        setProcess(res.progress)
      } else if (res.status === 'midjourney-blocked-by-ai-moderation') {
        errorCallback('触发敏感词，请换一个关键词再画')
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function del() {
    if (props.setMessageList) {
      props.setMessageList(messages => {
        return messages.filter((_, i) => i !== props.index)
      })
      props.delChat(props.message.messageId)
    }
  }

  createEffect(() => {
    if (props.message.messageId && !imageUrl()?.length) {
      // Set up an interval to fetch data every 3 seconds (3000 milliseconds)
      fetchData(props.message.messageId)
      intervalId = window.setInterval(() => fetchData(props.message.messageId), 6000);
      // Clean up the interval when the component is unmounted or the effect is re-run
      onCleanup(() => {
        clearInterval(intervalId);
      });
    }
  })

  type ButtonInfo = {
    [key in MjRole]: string[];
  };

  createEffect(() => {
    let buttonInfo: ButtonInfo = {
      prompt: ["U1", "U2", "U3", "U4", "V1", "V2", "V3", "V4"],
      variation: [
        '🪄 Make Variations',
      ],
      hint: [],
      help: [],
      error: [],
    }
    let buttons = buttonInfo[role()]
    if (buttons.length == 10 && seed().length) {
      buttons = buttons.slice(0, -1)
    }
    setButtonLabels(buttons)
  })

  async function clickButton(command: string, event: MouseEvent) {

    if (command === 'seed') {
      const button = event.target as HTMLButtonElement;
      button.disabled = true;
      button.classList.add('bg-opacity-50');
      let result = await fetchSeed(props.message.messageId)
      if (result.seed) {
        setSeed(result.seed)
      } else {
        button.disabled = false;
        button.classList.remove('bg-opacity-50');
      }
      return
    }
    props.mjBtnClick(command, props.message)
    setClickedButtons([command, ...clickedButtons()]);
  }

  return (
    <>
      <style>
        {`
            .first-container {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-template-rows: auto;
              grid-gap: 2px;
              margin-bottom: 2px;
            }
            .second-container {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-template-rows: auto;
              grid-gap: 2px;
            }
            .button {
              width: 64px;
              height: 32px;
              padding: 0 2px;
              margin: 1px 0;
            }
            .first-container > .button:not(:nth-child(3n)) {
              margin-right: 2px;
            }
        `}
      </style>
      <div
        class="group flex gap-3 px-4 mx--4 rounded-lg transition-colors sm:hover:bg-slate/6 dark:sm:hover:bg-slate/5 relative message-item"
      >
        <div
          class={`shrink-0 w-[30px] h-[30px] mt-4 rounded-full op-80 flex items-center justify-center cursor-pointer ${roleClass[role()]
            }`}
        >
          <img src="https://b1.beisheng.com/common/starchain_self_image/2305/08/WKsSQPOjlHMZwYe.png" class="border-1 rounded border-gray-500" />
        </div>

        <Switch fallback={
          <div
            class="message prose prose-slate dark:prose-invert dark:text-slate mt-4 break-words overflow-hidden">
            <label class="mt-4">{props.message.content}</label>
            <ImageWithSpinner
              originSrc={originImageUrl()}
              src={`${imageUrl()}`}
              process={process()}
              className="rounded-md"
            />
            <Show when={buttonLabels().length >= 4}>
              <Show when={!isMobile()}>
                <div
                  class={`grid mt-2 grid-cols-5 gap-x-2 gap-y-1 w-[350px] ${!imageUrl()?.length ? 'opacity-50' : ''}`}
                >
                  <For each={buttonLabels()}>
                    {(label, index) => (
                      <button
                        class={`w-[64px] py-1 ${clickedButtons()?.includes(label) ? 'bg-[#5164ED]' : 'bg-[#4e5058]'} text-white rounded-sm`}
                        onClick={(e) => clickButton(label, e)}
                        disabled={!imageUrl()?.length}>
                        {label}
                      </button>
                    )}
                  </For>
                </div>
              </Show>
              <Show when={isMobile()}>
                <div class="mt-2" style="width: 216px;">
                  <div class="first-container">
                    <For each={buttonLabels().slice(0, 4)}>
                      {(label, index) => (
                        <button
                          class={`button ${clickedButtons()?.includes(label) ? 'bg-[#5164ED]' : 'bg-[#4e5058]'} text-white rounded-sm`}
                          onClick={(e) => clickButton(label, e)}
                          disabled={!imageUrl()?.length}
                        >
                          {index() === 4 ? (
                            <img
                              src="https://i.loli.wiki/public/230419/redo.svg"
                              alt=""
                              width="19"
                              height="19"
                              class="mx-auto"
                            />
                          ) : (label)}
                        </button>
                      )}
                    </For>
                  </div>
                  <div class="second-container">
                    <For each={buttonLabels().slice(4)}>
                      {(label, index) => (
                        <button
                          class={`button ${clickedButtons()?.includes(label) ? 'bg-[#5164ED]' : 'bg-[#4e5058]'} text-white rounded-sm`}
                          onClick={(e) => clickButton(label, e)}
                          disabled={!imageUrl()?.length}
                        >
                          {label}
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
              <Show when={seed().length}>
                <p class="mt-1 mb-0 text-blue-500 font-bold">Seed: {seed()}</p>
              </Show>

            </Show>
            <Show when={buttonLabels().length === 1 && false}>
              <div
                class={`grid mt-2 grid-cols-2 gap-x-2 gap-y-1 w-[350px] ${!imageUrl()?.length ? 'opacity-50' : ''}`}
              >
                <For each={buttonLabels()}>
                  {(label, index) => (
                    <button
                      class={`py-1 ${clickedButtons().includes(label) ? 'bg-[#048149]' : 'bg-[#4e5058]'} text-white rounded-sm text-sm`}
                      onClick={(e) => clickButton(label, e)}
                      disabled={!imageUrl()?.length}>
                      {label}
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        }>
          <Match when={role() === 'hint'}>
            <div
              class="message prose prose-slate dark:prose-invert dark:text-slate break-words overflow-hidden"
              innerHTML={md
                .render(props.message.content)
              }
            />
          </Match>
          <Match when={role() === 'error'}>
            <div
              class="message prose prose-slate dark:prose-invert dark:text-slate break-words overflow-hidden"
              innerHTML={md
                .render(props.message.content + `<br/><span class="text-xl text-red-500">报错：${errorMessage()}，${i18n.t('retryHint')}</span>`)
              }
            />
          </Match>
        </Switch>
        <MjMessageAction
          hidden={false}
          del={del}
        />
      </div >
    </>
  )
}
