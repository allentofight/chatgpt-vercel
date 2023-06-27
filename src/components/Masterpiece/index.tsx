import '../../styles/masterpiece.css';
import PageNav from './PageNav';
import Draw from './Draw'
import MyWorks from './MyWorks'
import MemberCenter from './MemberCenter'
import Layout from "~/layout"
import MjTemplate from './MjTemplate'
import Chat from "~/components/Chat"
import { createSignal, Switch, Match, createEffect } from 'solid-js'
import Aside from "~/components/Aside";
import { RootStore, loadSession } from "~/store"

export default function MasterPiece() {

  const [title, setTitle] = createSignal('AI聊天');
  const { store, setStore } = RootStore

  const [chatListVisible, setChatListVisible] = createSignal(false);

  createEffect(() => {
    if (store.pageIndex === -1) {
      setTitle('收藏管理')
    }
  })

  return (
    <>
      <div id="page" class="flex items-center flex-col h-full w-screen" style="padding-top: constant(safe-area-inset-top); padding-bottom: constant(safe-area-inset-bottom);">
        <PageNav
          titleClicked={(title: string) => { setTitle(title) }}
          chatListClicked={(showChat: boolean) => {
            setChatListVisible(!chatListVisible())
          }}
        ></PageNav>
        <Switch>
          <Match when={title() === 'AI聊天'}>
            <Layout>
              <div class="flex items-center flex-col">
                <Chat />
                <Aside />
              </div>
            </Layout >
          </Match>
          <Match when={title() === 'AI绘画'}>
            <Draw showMoreClick={() => {
              setStore('pageIndex', -1)
              setTitle('收藏管理')
            }} />
          </Match>
          <Match when={title() === 'AI广场'}>
            <MjTemplate />
          </Match>
          <Match when={title() === '会员中心'}>
            <MemberCenter />
          </Match>
          <Match when={title() === '收藏管理'}>
            <MyWorks />
          </Match>
        </Switch>
      </div>
    </>
  );
}