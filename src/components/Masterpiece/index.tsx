import '../../styles/masterpiece.css';
import PageNav from './PageNav';
import Draw from './Draw'
import MyWorks from './MyWorks'
import MemberCenter from './MemberCenter'
import MemberEnCenter from './MemberEnCenter'
import AccountInfo from "./AccountInfo"
import Layout from "~/layout"
import MjTemplate from './MjTemplate'
import Chat from "~/components/Chat"
import { createSignal, Show, createEffect, onMount } from 'solid-js'
import Aside from "~/components/Aside";
import { RootStore, loadSession } from "~/store"
import i18n from '~/utils/i18n';

export default function MasterPiece() {

  const [title, setTitle] = createSignal('AI聊天');
  const { store, setStore } = RootStore

  const [chatListVisible, setChatListVisible] = createSignal(false);

  createEffect(() => {
    if (store.menuTitle === i18n.t('aidraw')) {
      setStore('hasAiDrawClicked', true)
    }
  })

  return (
    <>
      <style>
        {`
            .custom-padding-bottom {
              padding-bottom: 123px;
            }
        `}
      </style>
      <div id="page" class="flex items-center flex-col h-full w-screen" style="padding-top: constant(safe-area-inset-top); padding-bottom: constant(safe-area-inset-bottom);">
        <PageNav
          chatListClicked={(showChat: boolean) => {
            setChatListVisible(!chatListVisible())
          }}
        ></PageNav>
        <Layout>

          <div class={`flex items-center flex-col h-full ${store.chatType == 1 ? 'custom-padding-bottom' : ''}`}>
            <Chat />
            <Aside />
          </div>
        </Layout>
        <Show when={store.hasAiDrawClicked}>
          <Draw showMoreClick={() => {
            setStore('menuTitle', i18n.t('collectionManage'))
          }} />
        </Show>
        <Show when={store.menuTitle === i18n.t('aisquare')}>
          <MjTemplate />
        </Show>
        <Show when={store.menuTitle === i18n.t('memberCenter')}>
          <Show when={store.inChina}>
            <MemberCenter />
          </Show>
          <Show when={!store.inChina}>
            <MemberEnCenter />
          </Show>
        </Show>
        <Show when={store.menuTitle === i18n.t('collectionManage')}>
          <MyWorks />
        </Show>
        <Show when={store.menuTitle === i18n.t('profile')}>
          <AccountInfo />
        </Show>
      </div>
    </>
  );
}