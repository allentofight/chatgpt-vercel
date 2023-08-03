import { createSignal, onMount, For, batch, Show } from 'solid-js';
import { makeEventListener } from "@solid-primitives/event-listener"
import '../../styles/chat-nav.css';
import '../../styles/draw-animation.css';
import PromptEdit from './PromptEdit'
import { parsePrompts } from "~/utils"
import { Fzf } from "fzf"
import throttle from "just-throttle"
import type { Option } from "~/types"
import { FZFData } from "~/store"
import { RootStore, loadSession } from "~/store"

export default function (props: {
  bgClick: () => void
}) {

  const [candidateOptions, setCandidateOptions] = createSignal<Option[]>([])
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [compositionend, setCompositionend] = createSignal(true)
  const [showPromptEdit, setShowPromptEdit] = createSignal(false)
  let inputRef: HTMLInputElement;
  const { store, setStore } = RootStore

  onMount(() => {
    setTimeout(() => {
      document.querySelector("#enter-container")?.classList.remove("up-enter-active")
    }, 200)

    let icons = [
      {
        icon: 'icon-a-2',
        color: 'rgb(217, 70, 239)',
      },
      {
        icon: 'icon-a-3',
        color: 'rgb(217, 70, 239)',
      },
      {
        icon: 'icon-a-5',
        color: 'rgb(234, 179, 8)',
      },
      {
        icon: 'icon-a-8',
        color: 'rgb(132, 204, 22)',
      },
      {
        icon: 'icon-a-3',
        color: 'rgb(139, 92, 246)',
      },
      {
        icon: 'icon-a-2',
        color: 'rgb(168, 85, 247)',
      },
      {
        icon: 'icon-a-9',
        color: 'rgb(245, 158, 11)',
      },
      {
        icon: 'icon-a-1',
        color: 'rgb(16, 185, 129)',
      },
      {
        icon: 'icon-a-4',
        color: 'rgb(98, 102, 241)',
      },
      {
        icon: 'icon-a-111',
        color: 'rgb(244, 63, 94)',
      },
      {
        icon: 'icon-a-10',
        color: 'rgb(236, 72, 152)',
      },
      {
        icon: 'icon-a-4',
        color: 'rgb(244, 63, 94)',
      },
      {
        icon: 'icon-a-7',
        color: 'rgb(217, 70, 239)',
      },
      {
        icon: 'icon-a-9',
        color: 'rgb(59, 130, 246)',
      },
      {
        icon: 'icon-a-6',
        color: 'rgb(19, 184, 166)',
      },
      {
        icon: 'icon-a-8',
        color: 'rgb(34, 197, 94)',
      },
      {
        icon: 'icon-a-10',
        color: 'rgb(234, 179, 8)',
      },
      {
        icon: 'icon-a-111',
        color: 'rgb(98, 102, 241)',
      },
      {
        icon: 'icon-a-5',
        color: 'rgb(5, 182, 212)',
      },
      {
        icon: 'icon-a-9',
        color: 'rgb(239, 68, 68)',
      },
      {
        icon: 'icon-a-11',
        color: 'rgb(217, 70, 239)'
      }]

    FZFData.promptOptions = parsePrompts().map(
      k => ({ title: k.desc, desc: k.detail } as Option)
    )

    for (let index = 0; index < FZFData.promptOptions.length; index++) {
      const element = FZFData.promptOptions[index];
      element.icon = icons[index].icon
      element.color = icons[index].color

    }

    FZFData.fzfPrompts = new Fzf(FZFData.promptOptions, {
      selector: k => `${k.title}\n${k.desc}`
    })
    setCandidateOptions(FZFData.promptOptions)

    if (inputRef) {
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
    }
  })

  const searchOptions = throttle(
    (value: string) => {
      let options = FZFData.fzfPrompts!.find(value).map(k => ({
        ...k.item,
        positions: k.positions
      }))
      setCandidateOptions(
        options
      )
    },
    100,
    {
      trailing: false,
      leading: true
    }
  )

  async function handleInput() {
    // 重新设置高度，让输入框可以自适应高度，-1 是为了标记不是初始状态
    batch(() => {
      if (!compositionend()) return
      const value = inputRef?.value
      if (value) {
        searchOptions(value)
      } else {
        setCandidateOptions(FZFData.promptOptions)
      }
    })
  }

  return (
    <>
      <div id="enter-container" class="mask up-enter-active" onClick={() => {
        document.querySelector("#enter-container")?.classList.add("up-leave-active")
        setTimeout(() => {
          props.bgClick()
        }, 200)
      }}>
        <div class="mask-info">
          <div class="mask-content">
            <div class="mask-putcell">
              <div class="mask-putcell-input">
                <div class="el-input el-input--suffix input">
                  <div class="el-input__wrapper" onClick={e => {
                    e.stopPropagation()
                  }}>
                    <input class="el-input__inner"
                      ref={(el) => (inputRef = el)}
                      onInput={handleInput}
                      placeholder-class="placeholder"
                      type="text"
                      autocomplete="off"
                      tabindex="0" placeholder="请输入您的提示标题" />
                  </div>
                </div>
                <div class="mask-putcell-input-search">
                  <i class="iconfont  icon-a-Group78909 img"></i>
                </div>
              </div>
            </div>
            <div class="mask-hr"></div>
            <div class="mask-scroll">
              <For each={candidateOptions()}>
                {(option, index) => (
                  <div class="mask-scroll-item" onClick={e => {
                    if (option.title === '思维导图') {
                      setStore('showMindMap', true)
                      return
                    }
                    setStore('showMindMap', false)

                    setSelectedIndex(index)
                    setShowPromptEdit(true)
                    e.stopPropagation()
                  }}>
                    <div class="left" style="background: rgba(217, 70, 239, 0.2);">
                      <i class={`iconfont ${option.icon} icon`} style={`color: ${option.color}`}></i>
                    </div>
                    <div class="detail-right">
                      <div class="text">
                        {option.title}
                      </div>
                      <div class="text1">
                        {option.desc}
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
        <Show when={showPromptEdit()}>
          <PromptEdit option={candidateOptions()[selectedIndex()]} cancelClick={() => {
            document.querySelector("#edit-enter-container")?.classList.add("up-leave-active")
            setTimeout(() => {
              setShowPromptEdit(false)
            }, 200)
          }} confirmClick={(inputText: string) => {
            setShowPromptEdit(false)
            props.bgClick()
            setStore("curPrompt", inputText)
          }} />
        </Show>
      </div>
    </>
  )
}
