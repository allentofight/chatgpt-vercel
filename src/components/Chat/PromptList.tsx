import { createSignal, createEffect, For } from 'solid-js';
import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore


export default function (props: {
    clickPrompt: (text: string) => void
}) {

    const [prompts, setPrompts] = createSignal(['剖析一下小红书的电商种草爆款文案结构', 'AI赋能企业降本增效商业计划书', '抖音爆款短视频有什么共性', '西湖一日游思维导图', '剖析公众号爆款文章特点']);

    return (
        <div class="flex flex-wrap">
            <For each={prompts()}>
                {(prompt, i) => (
                    <div class="relative py-1 px-2 bg-[#F3F7FD] mr-4 mb-2 rounded-lg text-[#146EE9] hover:bg-[#4181FF26]" onClick={() => {
                        if (prompt.includes('思维导图')) {
                            setStore('showMindMap', true)
                            return
                        }
                        props.clickPrompt(prompt)
                    }}>
                        <div class="absolute right-0 top-0 w-3 h-3 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                        <p class="text-center">{prompt}</p>
                    </div>
                )}
            </For>
        </div>
    )
}