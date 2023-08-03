import { createSignal, onMount, createEffect } from 'solid-js';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { toPng } from 'html-to-image';

import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore

const transformer = new Transformer();
const initValue = `# 与AI对话生成思维导图
## 笔记总结
## 日程安排
## 项目管理
## 头脑风暴
## 框架梳理
## 一键演示
`;

export default function MarkmapView() {
    const [value, setValue] = createSignal(initValue);
    let svg: SVGSVGElement;
    let mm: Markmap;

    onMount(() => {
        mm = Markmap.create(svg);
        updateSvg();
    });

    createEffect(() => {
        updateSvg();
    });

    createEffect(() => {
        if (store.currentAssistantMessage) {
            setValue(store.currentAssistantMessage)
        }
    })

    createEffect(() => {
        if (!store.showMindMap) {
            setValue(initValue)
        }
    })

    function updateSvg() {
        const { root } = transformer.transform(value());
        mm.setData(root);
        mm.fit();
    }

    function downloadPng() {
        toPng(svg)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'mindmap.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error('Error generating PNG', error);
            });
    }

    return (
        <div class="w-full h-full relative sm:px-12">
            <svg class="flex-1 w-full h-full text-white" ref={el => { svg = el; }} />
            <div class="absolute left-1/2 transform -translate-x-1/2 bottom-4 text-white" onClick={downloadPng}>
                <i class="iconfont icon-download-one icon text-4xl cursor-pointer">
                </i>
            </div>
        </div >
    );
}

