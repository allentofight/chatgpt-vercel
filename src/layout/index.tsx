import type { JSXElement } from "solid-js"

import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore

import { createEffect, createSignal } from 'solid-js';

export default function ({ children }: { children: JSXElement }) {
  const [className, setClassName] = createSignal('');

  createEffect(() => {
    setClassName(store.menuTitle === 'AI聊天' ? '' : 'hidden')
  })

  return (
    <div id="root" class={`w-full h-full overflow-y-auto ${className()}`} onClick={() => {
      setStore('showChatList', false)
    }}>
      {children}
    </div>
  )
}
