import '../../styles/pageNav.css';
import { onMount, createSignal, For, Show, Setter, Accessor, onCleanup, createEffect } from 'solid-js';
import { RootStore, loadSession } from "~/store"
import { isMobile } from "~/utils"
import CourseDialog from "./CourseDialog"
import i18n from "~/utils/i18n";
import { createPopper } from '@popperjs/core';

export default function PageNav(props: {
  chatListClicked: (showChat: boolean) => void,
}) {

  const [selectedIndex, setSelectedIndex] = createSignal(0);
  const [showCourse, setShowCourse] = createSignal(false);

  const [showMenu, setShowMenu] = createSignal(false);

  const [showChatList, setShowChatList] = createSignal(false);

  const { store, setStore } = RootStore

  let optionTitles = isMobile() ? [i18n.t('aitalk'), i18n.t('aidraw'), i18n.t('aisquare'), i18n.t('collectionManage'), i18n.t('memberCenter'), i18n.t('AINavigation')] : [i18n.t('aitalk'), i18n.t('aidraw'), i18n.t('aisquare'), i18n.t('memberCenter'), i18n.t('AINavigation')]

  function clickOption(index: number) {

    if (optionTitles[index] === i18n.t('AINavigation')) {
      return
    }

    setSelectedIndex(index)
    setStore('menuTitle', optionTitles[index])
    setShowMenu(false)
  }

  let clickHandler = () => {
    setStore('showUserPopover', false)
  }

  onMount(() => {
    document.body.addEventListener('click', clickHandler);
  })

  onCleanup(() => {
    document.body.removeEventListener('click', clickHandler);
  });

  createEffect(() => {
    setShowChatList(store.showChatList)
  })

  createEffect(() => {
    if (!store.showUserPopover) {
      const tooltip = document.querySelector('#tooltip')!;
      tooltip.classList.add("hidden")
    }
  })

  createEffect(() => {
    setSelectedIndex(optionTitles.indexOf(store.menuTitle))
  })

  return (
    <div class="_pages_nav h-14 w-full flex items-center justify-between relative">
      <Show when={showMenu()}>
        <div class="mobile-nav absolute w-full z-100">
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
          <img alt="" class="w-full" src={`/images/${i18n.t('logopng')}`} />
        </div>
        <div class="pc flex items-center relative h-10">
          <Show when={!isMobile() && selectedIndex() > -1}>
            <div class="line absolute h-full flex items-end justify-center" style={`left: ${selectedIndex() * 96}px;`}>
              <div class="line-line w-9"></div>
            </div>
          </Show>

          <For each={optionTitles}>
            {(title, index) => {
              return (
                <div class={`text text-center cursor-pointer ${selectedIndex() === index() ? 'active' : ''}`} onClick={() => clickOption(index())}>
                  <Show when={title === i18n.t('AINavigation')}>
                    <a href="https://ainavtech.com/" target="_blank" style={{ "background": 'transparent', 'color': 'white' }}>
                      {title}
                    </a>
                  </Show>
                  <Show when={title !== i18n.t('AINavigation')}>
                    {title}
                  </Show>
                </div>
              )
            }}
          </For>
        </div>
      </div >
      <div class="flex items-center">
        <div class="pc collect flex items-center justify-center text-sm px-3 mr-4 rounded-xl cursor-pointer" onClick={() => {
          setStore('menuTitle', i18n.t('collectionManage'))
        }}>
          <i class="iconfont  icon-guanjiancixinxi-shoucang text-sm mr-1"></i>
          <span >{i18n.t('collectionManage')}</span>
        </div>
        <div class="w-8 mr-6 cursor-pointer" style="display:none">
          <i class="iconfont  icon-rijian1 icon mr-1"></i>
        </div>
        <div class="login">
          <div>
            <img id="button" alt="" class="w-10" src="https://b1.beisheng.com/common/starchain_self_image/2310/28/09_33_26/ai-logo.png" onClick={() => {
              setStore('showUserPopover', !store.showUserPopover)
              const tooltip = document.querySelector('#tooltip')!;
              if (store.showUserPopover) {
                const button = document.querySelector('#button')!;
                tooltip.classList.remove("hidden")

                // create a popper instance
                const popperInstance = createPopper(button, tooltip, {
                  placement: 'bottom',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [-5, 8],
                      },
                    },
                  ],
                });
                // update popper instance
                popperInstance.update();
              } else {
                tooltip.classList.add("hidden")
              }


            }} />
          </div>
          <div class="hidden z-100" id="tooltip" role="tooltip">
            <div class="el-scrollbar">
              <div class="el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
                <div class="el-scrollbar__view el-dropdown__list" style="">
                  <ul data-v-b22f1d6d="" class="el-dropdown-menu overflow-hidden" tabindex="-1" role="menu" aria-labelledby="el-id-512-0" id="el-id-512-1" style="outline: none;">
                    <li data-el-collection-item="" aria-disabled="false" class="el-dropdown-menu__item" tabindex="-1" role="menuitem" onClick={() => {
                      const tooltip = document.querySelector('#tooltip')!;
                      tooltip.classList.add("hidden")
                      setStore('showUserPopover', false)
                      setStore('menuTitle', i18n.t('profile'))
                    }}>
                      {i18n.t('profile')}</li>
                    <li role="separator" class="el-dropdown-menu__item--divided"></li>
                    <li data-el-collection-item="" aria-disabled="false" class="el-dropdown-menu__item" tabindex="-1" role="menuitem" onClick={() => {
                      localStorage.clear();
                      window.location.href = '/login'
                    }}>
                      {i18n.t('logout')} </li>
                  </ul>
                </div>
              </div>
            </div>
            <div id="arrow" data-popper-arrow></div>
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