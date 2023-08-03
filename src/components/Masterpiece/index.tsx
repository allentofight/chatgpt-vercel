import '../../styles/masterpiece.css';
import PageNav from './PageNav';
import Draw from './Draw'
import MyWorks from './MyWorks'
import MemberCenter from './MemberCenter'
import AccountInfo from "./AccountInfo"
import Layout from "~/layout"
import MjTemplate from './MjTemplate'
import Chat from "~/components/Chat"
import { createSignal, Show, createEffect } from 'solid-js'
import Aside from "~/components/Aside";
import { RootStore, loadSession } from "~/store"

export default function MasterPiece() {

  const [title, setTitle] = createSignal('AI聊天');
  const { store, setStore } = RootStore

  const [chatListVisible, setChatListVisible] = createSignal(false);

  createEffect(() => {
    if (store.menuTitle === 'AI绘画') {
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
          <div class="flex items-center flex-col h-full custom-padding-bottom">
            <Chat />
            <Aside />
          </div>
        </Layout>
        <Show when={store.hasAiDrawClicked}>
          <Draw showMoreClick={() => {
            setStore('menuTitle', '收藏管理')
          }} />
        </Show>
        <Show when={store.menuTitle === 'AI广场'}>
          <MjTemplate />
        </Show>
        <Show when={store.menuTitle === '会员中心'}>
          <MemberCenter />
        </Show>
        <Show when={store.menuTitle === '收藏管理'}>
          <MyWorks />
        </Show>
        <Show when={store.menuTitle === '个人中心'}>
          <AccountInfo />
        </Show>
      </div>
    </>
  );
}