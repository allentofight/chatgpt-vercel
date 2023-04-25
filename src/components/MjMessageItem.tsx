import { type Setter, For, Show, createEffect, onCleanup, createSignal } from "solid-js"
import type { MjChatMessage } from "../types"
import "../styles/message.css"
import "../styles/clipboard.css"
import { queryPromptStatus } from "~/utils/api"

import ImageWithSpinner from "./ImageWithSpinner"

interface Props {
  message: MjChatMessage
  hiddenAction: boolean
  index?: number
  sendMessage?: (messageId?: string, command?: string) => void
  delChat: () => void
  setInputContent?: Setter<string>
  setMessageList?: Setter<MjChatMessage[]>
}

export default (props: Props) => {

  let intervalId: number;

  let assistant = "bg-gradient-to-r from-yellow-300 to-red-700 "
  const roleClass = {
    error: "bg-gradient-to-r from-red-400 to-red-700",
    prompt: "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300",
    user: "bg-gradient-to-r from-red-300 to-blue-700 ",
    hint: assistant,
    variation: assistant,
    help: assistant
  }

  const [imageUrl, setImageUrl] = createSignal('https://api-node.makechat.help/api/image/fetch');

  const fetchData = async (messageId: string) => {
    try {
      const response = await queryPromptStatus(messageId)
      if (response.status) {
        window.clearInterval(intervalId);
        setImageUrl(response.imageUrl)
      }
      console.log('Fetched data:', response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  createEffect(() => {
    if (props.message.messageId) {
      // Set up an interval to fetch data every 3 seconds (3000 milliseconds)
      intervalId = window.setInterval(() => fetchData(props.message.messageId), 3000);
      // Clean up the interval when the component is unmounted or the effect is re-run
      onCleanup(() => {
        clearInterval(intervalId);
      });
    }
  })

  const buttonLabels = {
    prompt: ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"],
    variation: ["U1"],
  }[props.message.type]

  function clickButton(command: string) {
    props.sendMessage?.(command, props.message.buttonMessageId)
  }

  return (
    <div
      class="group flex gap-3 px-4 mx--4 rounded-lg transition-colors sm:hover:bg-slate/6 dark:sm:hover:bg-slate/5 relative message-item"
    >
      <div
        class={`shrink-0 w-7 h-7 mt-4 rounded-full op-80 flex items-center justify-center cursor-pointer ${roleClass[props.message.role]
          }`}
      >
      </div>
      <div
        class="message prose prose-slate dark:prose-invert dark:text-slate mt-4 break-words overflow-hidden">
        <label class="mt-4">{props.message.content}</label>
        <Show when={props.message.role !== 'hint'}>
          <ImageWithSpinner
            src={`${imageUrl()}`}
            className="image-container bg-gray-500 rounded-md"
          />
          <Show when={buttonLabels?.length && buttonLabels.length > 1}>
            <div class="grid mt-2 grid-cols-5 gap-x-2 gap-y-1 w-[350px]">
              <For each={buttonLabels}>
                {(label, index) => (
                  <button class="w-[64px] py-1 bg-[#4e5058] text-white rounded-sm" onClick={() => clickButton(label)}>
                    {index() === 4 ? (
                      <img
                        src="https://i.loli.wiki/public/230419/redo.svg"
                        alt=""
                        width="19"
                        height="19"
                        class="mx-auto"
                      />
                    ) : (
                      label
                    )}
                  </button>
                )}
              </For>
            </div>
          </Show>
          <Show when={buttonLabels?.length === 1}>
            <button class="w-[152px] h-[32px] py-0.5 px-4 mt-1 mb-1 mr-2 bg-[#4e5058] text-white rounded-sm flex justify-center items-center">
              <img class="w-5 h-5 mr-2" src="https://i.loli.wiki/public/230419/variation.svg" alt="Variation Icon" width="22" height="22" />
              <div class="w-[97px] h-[16px] flex items-center whitespace-nowrap text-sm">Make variation</div>
            </button>
          </Show>
        </Show>
      </div>
    </div >
  )
}
