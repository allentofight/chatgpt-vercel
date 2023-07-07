import { Show, createSignal, For, onMount } from 'solid-js';
import PromptEdit from './PromptEdit'
import CreatePromptDialog from './CreatePromptDialog'
import { parsePrompts } from "~/utils"
import type { Option } from "~/types"
import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore
import {
  listPrompt,
} from "~/utils/api"

function hexToRGBA(hex: string, alpha = 0.2) {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function PromptCategory(props: {
  clickPrompt: () => void
}) {

  const [showPromptEdit, setShowPromptEdit] = createSignal(false)

  const [showCreatePrompt, setShowCreatePrompt] = createSignal(false)

  let promptOptions = parsePrompts().map(
    k => ({ title: k.desc, desc: k.detail } as Option)
  )

  const [selectedOption, setSelectedOption] = createSignal(promptOptions[0])

  const [myPrompt, setMyPrompt] = createSignal([])

  let promptsList = [{
    title: '提高生产率',
    subtitle: '通过这些提示增强您的创造力',
    icons: [{
      title: '视频脚本',
      iconClass: 'icon-a-5',
      backgroundColor: 'background: rgba(234, 179, 8, 0.2)',
      iconClassColor: 'rgb(234, 179, 8)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(234, 179, 8)'
    }, {
      title: '总结文本',
      iconClass: 'icon-a-3',
      backgroundColor: 'background: rgba(217, 70, 239, 0.2)',
      iconClassColor: 'rgb(217, 70, 239)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(217, 70, 239)'
    }, {
      title: '小红书写作',
      iconClass: 'icon-a-111',
      backgroundColor: 'background: rgba(244, 63, 94, 0.2)',
      iconClassColor: 'rgb(244, 63, 94)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(244, 63, 94)'
    }, {
      title: '写作助理',
      iconClass: 'icon-a-4',
      backgroundColor: 'background: rgba(98, 102, 241, 0.2)',
      iconClassColor: 'rgb(98, 102, 241)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(98, 102, 241)'
    }, {
      title: '周报生成器',
      iconClass: 'icon-a-6',
      backgroundColor: 'background: rgba(19, 184, 166, 0.2)',
      iconClassColor: 'rgb(19, 184, 166)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(19, 184, 166)'
    }]
  }, {
    title: '充当',
    subtitle: '直接与您的演员交谈和讨论',
    icons: [{
      title: '佛祖',
      iconClass: 'icon-a-8',
      backgroundColor: 'background: rgba(0, 182, 212, 0.2)',
      iconClassColor: 'rgb(132, 204, 22)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(132, 204, 22)'
    }, {
      title: '人事主管',
      iconClass: 'icon-a-10',
      backgroundColor: 'background: rgba(236, 72, 152, 0.2)',
      iconClassColor: 'rgb(236, 72, 152)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(236, 72, 152)'
    }, {
      title: '面试官',
      iconClass: 'icon-a-9',
      backgroundColor: 'background: rgba(59, 130, 246, 0.2)',
      iconClassColor: 'rgb(59, 130, 246)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(59, 130, 246)'
    }, {
      title: '占星师',
      iconClass: 'icon-a-5',
      backgroundColor: 'background: rgba(5, 182, 212, 0.2)',
      iconClassColor: 'rgb(5, 182, 212)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(5, 182, 212)'
    }, {
      title: '私人厨师',
      iconClass: 'icon-a-6',
      backgroundColor: 'background: rgba(59, 130, 246, 0.2)',
      iconClassColor: 'rgb(59, 130, 246)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(59, 130, 246)'
    }]
  }, {
    title: '商业',
    subtitle: '',
    icons: [{
      title: '社交媒体影响者',
      iconClass: 'icon-a-9',
      backgroundColor: 'background: rgba(245, 158, 11, 0.2)',
      iconClassColor: 'rgb(245, 158, 11)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(245, 158, 11)'
    }, {
      title: '智囊团',
      iconClass: 'icon-a-1',
      backgroundColor: 'background: rgba(16, 185, 129, 0.2)',
      iconClassColor: 'rgb(16, 185, 129)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(16, 185, 129)'
    }, {
      title: '商业计划书',
      iconClass: 'icon-a-10',
      backgroundColor: 'background: rgba(234, 179, 8, 0.2)',
      iconClassColor: 'rgb(234, 179, 8)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(234, 179, 8)'
    }, {
      title: '会计师',
      iconClass: 'icon-a-111',
      backgroundColor: 'background: rgba(98, 102, 241, 0.2)',
      iconClassColor: 'rgb(98, 102, 241)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(98, 102, 241)'
    }]
  }, {
    title: '自学',
    subtitle: '想象一下你有最好的老师......',
    icons: [{
      title: '数学老师',
      iconClass: 'icon-a-2',
      backgroundColor: 'background: rgba(168, 85, 247, 0.2)',
      iconClassColor: 'rgb(168, 85, 247)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(168, 85, 247)'
    }, {
      title: '英语对话练习',
      iconClass: 'icon-a-7',
      backgroundColor: 'background: rgba(217, 70, 239, 0.2)',
      iconClassColor: 'rgb(217, 70, 239)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(217, 70, 239)'
    }, {
      title: '费曼学习法教练',
      iconClass: 'icon-a-9',
      backgroundColor: 'background: rgba(239, 68, 68, 0.2)',
      iconClassColor: 'rgb(239, 68, 68)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(239, 68, 68)'
    }, {
      title: '中学满分作文',
      iconClass: 'icon-a-8',
      backgroundColor: 'background: rgba(34, 197, 94, 0.2)',
      iconClassColor: 'rgb(34, 197, 94)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(34, 197, 94)'
    }]
  }, {
    title: '健身与锻炼',
    subtitle: '塑造你身体的东西',
    icons: [{
      title: '获取瑜伽姿势',
      iconClass: 'icon-a-3',
      backgroundColor: 'background: rgba(139, 92, 246, 0.2)',
      iconClassColor: 'rgb(139, 92, 246)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(139, 92, 246)'
    }, {
      title: '健身教练',
      iconClass: 'icon-a-4',
      backgroundColor: 'background: rgba(244, 63, 94, 0.2)',
      iconClassColor: 'rgb(244, 63, 94)',
      collectClass: 'icon-a-13',
      collectIconColor: 'color: rgb(244, 63, 94)'
    }]
  }]

  onMount(() => {
    fetchMyPrompts()
  })

  let fetchMyPrompts = () => {
    listPrompt().then(data => {
      setMyPrompt(data.prompts)
      console.log('myPrompts = ', myPrompt())
    })
  }

  return (
    <div class="chat w-full">
      < div class="chat-info" style={{ "margin-top": "64px" }} >
        <div class="chat-tips">
          <div class="chat-tips-width">
            <div class="chat-tips-info">
              <div style="display: none;">
                <div class="chat-tips-title">
                  <div class="text">
                    我最喜欢的
                  </div>
                  <div class="text1">
                    您的收藏夹提示您已点赞
                  </div>
                </div>
                <div class="chat-tips-list">
                  <div id="tipScroll" class="scroll-to-div"></div>
                </div>
              </div>
              <Show when={myPrompt().length > 0}>
                <div class="chat-tips-title">
                  <div class="text">
                    我的提示
                  </div>
                  <div class="text1">
                    您自己创建的提示
                  </div>
                </div>
                <div class="chat-tips-list">
                  <For each={myPrompt()}>
                    {(prompt, index) => (
                      <div class="chat-tips-list-item" style={`background:${hexToRGBA(prompt.color)};`} onClick={() => {
                        setSelectedOption({
                          id: prompt.id,
                          title: prompt.title,
                          desc: prompt.prompt,
                          icon: prompt.icon,
                          color: prompt.color,
                        } as Option)
                        setShowPromptEdit(true)
                      }}>
                        <div class="mask"></div>
                        <div class="icons">
                          <i class={`iconfont ${prompt.icon} icon`} style={`color: ${prompt.color};`}></i>
                          <i class="iconfont  icon-a-13 icon1" style={`color:${prompt.color};`}></i>
                        </div>
                        <div class="chat-tips-text" style={`color:${prompt.color};`}>
                          {prompt.title}
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>

              <For each={promptsList}>
                {(prompt, index) => (
                  <>
                    <div class="chat-tips-title">
                      <div class="text">
                        {prompt.title}
                      </div>
                      <div class="text1">
                        {prompt.subtitle}
                      </div>
                    </div>
                    <div class="chat-tips-list">
                      <For each={prompt.icons}>
                        {(iconInfo, index) => (
                          <div class="chat-tips-list-item" style={`${iconInfo.backgroundColor};`} onClick={() => {
                            let filteredItems = promptOptions.filter(item => {
                              return item.title === iconInfo.title
                            })
                            console.log('promptOptions = ', promptOptions, 'iconInfo = ', iconInfo)
                            setSelectedOption({
                              title: iconInfo.title,
                              desc: filteredItems[0].desc,
                              icon: iconInfo.iconClass,
                              color: iconInfo.iconClassColor,
                            } as Option)
                            setShowPromptEdit(true)
                          }}>
                            <div class="mask"></div>
                            <div class="icons">
                              <i class={`iconfont ${iconInfo.iconClass} icon`} style={`color: ${iconInfo.iconClassColor};`}></i>
                              <i class="iconfont  icon-a-13 icon1" style={`${iconInfo.collectIconColor};`}></i>
                            </div>
                            <div class="chat-tips-text" style={`${iconInfo.collectIconColor};`}>
                              {iconInfo.title}
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </>
                )}
              </For>
            </div>
          </div>
        </div>
        <div class="chat-tips-button" onClick={() => {
          setShowCreatePrompt(true)
        }}><i class="iconfont  icon-add add-img"></i></div>
      </div >
      <Show when={showPromptEdit()}>
        <PromptEdit option={selectedOption()} cancelClick={() => {
          document.querySelector("#edit-enter-container")?.classList.add("up-leave-active")
          setTimeout(() => {
            setShowPromptEdit(false)
          }, 200)
          fetchMyPrompts()
        }} confirmClick={(inputText: string) => {
          setShowPromptEdit(false)
          setStore("chatType", 1)
          props.clickPrompt()
          setStore("curPrompt", inputText)

        }} />
      </Show>
      <Show when={showCreatePrompt()}>
        <CreatePromptDialog cancelClick={() => {
          document.querySelector("#create-prompt-container")?.classList.add("up-leave-active")
          setTimeout(() => {
            setShowCreatePrompt(false)
          }, 200)
        }} confirmClick={() => {
          fetchMyPrompts()
          setShowCreatePrompt(false)
        }} />
      </Show>
    </div>
  )
}