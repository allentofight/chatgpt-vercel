import logo from "/assets/logo.svg?raw"
import ThemeToggle from "./ThemeToggle"
import OptionSelector from "./OptionSelector"
import { RootStore, loadSession } from "~/store"
import { Show, createEffect, createMemo } from "solid-js"
import { useNavigate } from "solid-start"
import { createSignal, onMount } from "solid-js";
import { ModelEnum } from "~/types"

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

  const [model, setModel] = createSignal(ModelEnum.GPT_3);
  const { store } = RootStore
  const navigate = useNavigate()
  const iconTitle = createMemo(() => splitEmoji(store.sessionSettings.title))
  const [path, setPath] = createSignal('');
  const [title, setTitle] = createSignal('');
  onMount(() => {
    setPath(window.location.pathname);

    window.addEventListener('optionSelected', function (e: CustomEvent) {
      setModel(e.detail.index as ModelEnum)
    } as EventListener);
  });

  createEffect(() => {
    setTitle(model() == ModelEnum.MJ ? 'Midjourney' : 'ChatGPT')
  })

  return (
    <>
      <header class="z-10 flex justify-center items-center">
        <OptionSelector />
      </header>
    </>
  )
}
