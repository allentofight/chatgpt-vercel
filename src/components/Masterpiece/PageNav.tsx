import '../../styles/pageNav.css';
import { onMount, createSignal, For, Show, Setter, Accessor, onCleanup, createEffect } from 'solid-js';
import { RootStore, loadSession } from "~/store"
import { isMobile } from "~/utils"
import CourseDialog from "./CourseDialog"
import { setSharedStore, sharedStore } from '../MessagesStore'

export default function PageNav(props: {
  titleClicked: (title: string) => void,
  chatListClicked: (showChat: boolean) => void,
}) {

  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [showCourse, setShowCourse] = createSignal(false);

  const [showMenu, setShowMenu] = createSignal(false);

  const [showChatList, setShowChatList] = createSignal(false);

  const { store, setStore } = RootStore

  let optionTitles = isMobile() ? ['AI聊天', 'AI绘画', '收藏管理'] : ['AI聊天', 'AI绘画']

  function clickOption(index: number) {
    setSelectedIndex(index)
    props.titleClicked(optionTitles[index])
    setShowMenu(false)
    if (optionTitles[index] === '收藏管理') {
      setStore('pageIndex', -1)
    } else {
      setStore('pageIndex', index)
    }
  }

  createEffect(() => {
    setShowChatList(store.showChatList)
  })

  return (
    <div class="_pages_nav h-14 w-full flex items-center justify-between relative">
      <Show when={showMenu()}>
        <div class="mobile-nav absolute w-full z-50">
          <For each={optionTitles}>
            {(title, index) => {
              return (
                <div class={`text w-full text-center cursor-pointer font-medium ${selectedIndex() === index() ? 'active' : ''}`} onClick={() => clickOption(index())}>
                  {title}
                </div>
              )
            }}
          </For>
        </div>
      </Show>

      <div class="flex items-center">
        <div class={`mobile mobile-inner-header-icon ${!showMenu() ? 'mobile-inner-header-icon-out' : 'mobile-inner-header-icon-click'}`} onClick={() => {
          setShowMenu(!showMenu())
          if (showChatList() && showMenu()) {
            setStore("showChatList", false)
          }
        }}>
          <span ></span>
          <span ></span>
        </div>
        <div class="pc ml-4 w-36 flex items-center cursor-pointer">
          <img alt="" class="w-full" src="/images/logo.png" />
        </div>
        <div class="pc flex items-center relative h-10">
          <Show when={store.pageIndex > -1}>
            <div class="line absolute h-full flex items-end justify-center" style={`left: ${selectedIndex() * 96}px;`}>
              <div class="line-line w-9"></div>
            </div>
          </Show>

          <For each={optionTitles}>
            {(title, index) => {
              return (
                <div class={`text text-center cursor-pointer ${selectedIndex() === index() && store.pageIndex > -1 ? 'active' : ''}`} onClick={() => clickOption(index())}>
                  {title}
                </div>
              )
            }}
          </For>
        </div>
      </div>
      <Show when={store.pageIndex == 0}>
        <div class="flex items-center text-white md:hidden flex items-center" onClick={() => {
          setShowChatList(!showChatList())
          props.chatListClicked(showChatList())
          setStore("showChatList", showChatList())
          if (showMenu() && showChatList()) {
            setShowMenu(false)
          }

        }}>
          会话列表
          <i class={`iconfont icon-xiangxia keywords-icon text-sm ${showChatList() ? '' : 'expansion_icon'} `}></i>
        </div>
      </Show>
      <div class="flex items-center">
        <div class="pc collect flex items-center justify-center text-sm px-3 mr-4 rounded-xl cursor-pointer" onClick={() => {
          setStore('pageIndex', -1)
        }}>
          <i class="iconfont  icon-guanjiancixinxi-shoucang text-sm mr-1"></i>
          <span >收藏管理</span>
        </div>
        <div class="w-8 mr-6 cursor-pointer" style="display:none">
          <i class="iconfont  icon-rijian1 icon mr-1"></i>
        </div>
        <div class="login">
          <div class="el-dropdown">
            <div id="el-id-7412-0" role="button" tabindex="0" class="el-tooltip__trigger" aria-controls="el-id-7412-1" aria-expanded="false" aria-haspopup="menu">
              <img alt="" class="w-10" src="https://b1.beisheng.com/common/starchain_self_image/2306/13/3x_1682755768971.png" />
            </div>
          </div>
        </div>
      </div>
      <Show when={showCourse()}>
        <CourseDialog closeBtnClicked={() => {
          setShowCourse(false)
        }} />
      </Show>

    </div >
  )
}