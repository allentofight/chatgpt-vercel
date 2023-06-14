import Header from "~/components/Header"
import type { JSXElement } from "solid-js"

export default function ({ children }: { children: JSXElement }) {
  return (
    <div id="root" class="sm:pt-3 py-3 w-full h-full overflow-y-auto before">
      <Header />
      {children}
    </div>
  )
}
