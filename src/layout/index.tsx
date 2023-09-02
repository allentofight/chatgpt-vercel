import type { JSXElement } from "solid-js"

import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore
import i18n from "~/utils/i18n";
import { createEffect, createSignal } from 'solid-js';

export default function ({ children }: { children: JSXElement }) {
  const [className, setClassName] = createSignal('');

  createEffect(() => {
    setClassName(store.menuTitle === i18n.t('aitalk') ? '' : 'hidden')
  })

  return (
    <div id="root" class={`w-full h-full overflow-y-auto ${className()}`} onClick={() => {
      setStore('showChatList', false)
    }}>
      {children}
    </div>
  )
}
