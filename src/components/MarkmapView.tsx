import { createSignal, onMount, createEffect } from 'solid-js';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { toPng } from 'html-to-image';

import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore

const transformer = new Transformer();
const initValue = `# 西湖一日游思维导图

## I. 准备阶段
   ### A. 选择出行日期
   ### B. 查看天气预报
   ### C. 准备舒适的服装和鞋履

## II. 路线规划
   ### A. 确定游览起点
   ### B. 制定游览顺序
      #### 1. 西湖主景区
      #### 2. 周边名胜古迹
   ### C. 考虑用餐地点

## III. 必备物品
   ### A. 相机及备用电池
   ### B. 地图或导航工具
   ### C. 水和小吃
   ### D. 伞和防晒用品

## IV. 游览注意事项
   ### A. 注意景区规定和安全须知
   ### B. 保持环境整洁，文明游览
   ### C. 注意个人财物安全

## V. 休闲娱乐选择
   ### A. 考虑游船或自行车租赁
   ### B. 欣赏周边文艺表演
   ### C. 寻找品味独特小店

## VI. 用餐安排
   ### A. 选择当地特色餐厅
   ### B. 确保用餐时间不冲突
   ### C. 预订如有需要

## VII. 回程安排
   ### A. 确定结束游玩时间
   ### B. 考虑交通工具及预约需求
   ### C. 确保离开前检查个人物品
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
        <>
            <div class="h-full relative sm:px-12 dark:bg-[#2E2F39] dark:text-[#ffffff] light:bg-white light:text-[#333333]" style={{
                width: "calc(100% - 48px)"
            }}>
                <svg class="flex-1 w-full h-full" ref={el => { svg = el; }} />
                <div class="absolute left-1/2 transform -translate-x-1/2 bottom-4" onClick={downloadPng}>
                    <i class="iconfont icon-download-one icon text-4xl cursor-pointer">
                    </i>
                </div>
            </div >
        </>

    );
}

