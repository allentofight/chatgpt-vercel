import '../../styles/chat-nav.css';
import type { Option } from "~/types"
import { createSignal, onMount, For, batch, Show } from 'solid-js';
import { makeEventListener } from "@solid-primitives/event-listener"
export default function (props: {
  option: Option,
  cancelClick: () => void,
  confirmClick: (inputText: string) => void,
}) {

  let inputRef: HTMLTextAreaElement;

  const [compositionend, setCompositionend] = createSignal(true)

  const [textWordCnt, setTextWordCnt] = createSignal(0)

  onMount(() => {
    setTimeout(() => {
      document.querySelector("#edit-enter-container")?.classList.remove("up-enter-active")
    }, 200)
    inputRef.value = props.option.desc
    setTextWordCnt(inputRef.value.length)
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

  async function handleInput() {
    // 重新设置高度，让输入框可以自适应高度，-1 是为了标记不是初始状态
    batch(() => {
      if (!compositionend()) return
      const value = inputRef?.value
      if (value.length > 500) {
        inputRef.value = value.slice(0, 500);
      }
      setTextWordCnt(inputRef.value.length)
    })
  }

  return (
    <div id="edit-enter-container" class="mask up-enter-active" onClick={e => {
      e.stopPropagation()
    }}>
      <div class="mask-info">
        <div class="mask-content">
          <div class="mask-top">
            <div class="mask-top-icon" style="background: rgba(59, 130, 246, 0.2);">
              <i class={`iconfont ${props.option.icon} icon`} style={`color: ${props.option.color};`}></i>
            </div>
            <div class="mask-top-title">
              {props.option.title}
            </div>
            <div class="mask-top-prompts"></div>
          </div>
          <div class="mask-putcell">
            <div class="mask-putcell-input textarea">
              <div class="el-textarea input">
                <textarea class="prompt-edit el-textarea__inner" maxlength="500" placeholder-class="placeholder" rows="6" tabindex="0"
                  ref={el => inputRef = el}
                  onInput={handleInput}
                  autocomplete="off" placeholder="请输入您的提示标题" id="el-id-6584-11" style="resize: none; min-height: 41px;"></textarea>
              </div>
              <div class="textarea-span">
                {textWordCnt()}/500
              </div>
            </div>
          </div>
          <div class="mask-buttons">
            <div class="cancel custom-button" onClick={props.cancelClick}>
              取消
            </div>
            <div class="confirm custom-button" onClick={() => props.confirmClick(inputRef.value)}>
              应用
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}