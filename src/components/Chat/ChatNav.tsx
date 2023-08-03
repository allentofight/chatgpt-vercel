import '../../styles/chat-nav.css';

import { RootStore } from "~/store"
import OptionSelector from "./OptionSelector"
const { store, setStore } = RootStore

export default function (props: {
  clickSearch: () => void,
  clickChat: () => void,
  clickPromptCategory: () => void,
}) {
  return (
    <>
      <div class="w-full fixed z-99 grid grid-cols-2 md:grid-cols-3">
        <div class="chat-nav-left">
          <div class={`chat-nav-left-item ${store.chatType == 1 ? 'active' : ''}`} onClick={() => {
            props.clickChat()
            setStore("chatType", 1)
            setStore('showMindMap', false)
          }}>
            聊天
          </div>
          <div class={`chat-nav-left-item ${store.chatType == 2 ? 'active' : ''}`} onClick={() => {
            props.clickPromptCategory()
            setStore("chatType", 2)
            setStore('showMindMap', false)
          }}>
            提示
          </div>
          <div class="chat-nav-left-item" onClick={(event) => {
            setStore("showChatList", !store.showChatList)
            setStore('showMindMap', false)
            event.stopPropagation()
          }}>
            记录
          </div>
        </div>
        <div class="flex items-center">
          <OptionSelector />
        </div>
        <div class="hidden md:flex items-center justify-end">
          <div class="flex items-center mr-3">
            <div class="right-icon" onClick={props.clickSearch}>
              <img alt="" class="icon" src="/images/search.png" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
