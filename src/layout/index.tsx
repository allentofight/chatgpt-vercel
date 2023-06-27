import Header from "~/components/Header"
import type { JSXElement } from "solid-js"

import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore

export default function ({ children }: { children: JSXElement }) {
  return (
    <div id="root" class="w-full h-full overflow-y-auto" onClick={() => {
      setStore('showChatList', false)
    }}>
      {/* <Header /> */}
      {children}
    </div>
  )
}
