import logo from "/assets/logo.svg?raw"
import ThemeToggle from "./ThemeToggle"
import OptionSelector from "./OptionSelector"
import { RootStore, loadSession } from "~/store"
import { Show, createEffect, createMemo } from "solid-js"
import { useNavigate } from "solid-start"
import { createSignal, onMount } from "solid-js";

function splitEmoji(text: string) {
  const [icon, title] = text
    .split(
      /^([\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}])\s*(.+)$/u
    )
    .filter(Boolean)
  if (title)
    return {
      icon,
      title
    }
  return {
    icon: undefined,
    title: icon
  }
}

function scrollTo(selector: string, yOffset = 0) {
  const el = document.querySelector(selector) as HTMLElement
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
  window.scrollTo({ top: y, behavior: "smooth" })
}

export default function Header() {
  const { store } = RootStore
  const navigate = useNavigate()
  const iconTitle = createMemo(() => splitEmoji(store.sessionSettings.title))
  const [path, setPath] = createSignal('');
  const [title, setTitle] = createSignal('');
  onMount(() => {
    setPath(window.location.pathname);
  });

  createEffect(() => {
    setTitle(path().includes('mj') ? 'Midjourney' : 'ChatGPT')
  })

  return (
    <>
      <div
        id="logo"
        class="pl-1em cursor-pointer inline-block"
        onClick={() => {
          navigate("/", { replace: true })
          loadSession("index")
        }}
      >
        <Show
          when={iconTitle().icon}
          fallback={<div class="w-8em h-8em" innerHTML={logo} />}
        >
          <div class="text-7em h-1em mb-8">{iconTitle().icon}</div>
        </Show>
      </div>
      <header class="px-4 py-2 sticky top-0 z-10 flex justify-between items-center">
        <div
          class="flex items-center text-2xl cursor-pointer"
          onClick={() => {
            scrollTo("main", -48)
          }}
        >
          <span class="text-transparent font-extrabold bg-clip-text bg-gradient-to-r dark:from-yellow-300 from-yellow-600 dark:to-red-700 to-red-700 mr-1">
            {title()}
          </span>
        </div>
        <Show when={!path().includes('mj')}>
          <div class="flex-none">
            <OptionSelector />
          </div>
        </Show>

        <ThemeToggle />
      </header>
    </>
  )
}
