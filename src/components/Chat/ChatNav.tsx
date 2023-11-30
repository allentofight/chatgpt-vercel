import '../../styles/chat-nav.css';

import { RootStore } from "~/store"
import OptionSelector from "./OptionSelector"
const { store, setStore } = RootStore
import i18n from "~/utils/i18n";
import { isMobile } from '~/utils';

export default function (props: {
  clickSearch: () => void,
  clickChat: () => void,
  clickPromptCategory: () => void,
}) {
  return (
    <>
      <div class="w-full fixed z-99 grid grid-cols-2 md:grid-cols-3">
        <div class="chat-nav-left">
          <div class="chat-nav-left-item" onClick={(event) => {
            setStore("showChatList", !store.showChatList)
            setStore('showMindMap', false)
            event.stopPropagation()
          }}>
            {i18n.t('history')}
          </div>
        </div>
        <div class="flex items-center">
          <OptionSelector />
        </div>
        <div class="hidden md:flex items-center justify-end" style={{ "margin-right": isMobile() ? '0' : '90px' }}>
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
