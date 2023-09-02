import { Show, onMount, For, createSignal, batch, createEffect } from "solid-js"
import { makeEventListener } from "@solid-primitives/event-listener"
import i18n from '~/utils/i18n';
import '../../styles/prompt-dialog.css';
import toast, { Toaster } from 'solid-toast';
import { Spinner, SpinnerType } from 'solid-spinner';

import {
    createOrUpdatePrompt
} from "~/utils/api"

export default function (props: {
    cancelClick: () => void,
    confirmClick: () => void,
}) {

    let inputRef: HTMLTextAreaElement;

    const [compositionend, setCompositionend] = createSignal(true)

    const [textWordCnt, setTextWordCnt] = createSignal(0)

    const [isHovered, setIsHovered] = createSignal(false);

    const [isLoading, setIsLoading] = createSignal(false);

    const [isGeneratingPrompt, setIsGeneratingPrompt] = createSignal(false);

    const [selectedIcon, setSelectedIcon] = createSignal('icon-a-7');

    const [title, setTitle] = createSignal('');

    const [promptText, setPromptText] = createSignal('');

    onMount(() => {
        setTimeout(() => {
            document.querySelector("#edit-enter-container")?.classList.remove("up-enter-active")
        }, 200)
        if (inputRef) {
            makeEventListener(
                inputRef,
                "compositionend",
                () => {
                    setCompositionend(true)
                    handleInput()
                },
                { passive: true }
            )
            makeEventListener(
                inputRef,
                "compositionstart",
                () => {
                    setCompositionend(false)
                },
                { passive: true }
            )
        }
    })

    createEffect(() => {
        if (promptText().length) {
            inputRef.value = promptText();
            inputRef.scrollTo({
                top: inputRef.scrollHeight,
                behavior: 'smooth'
            });
        }

    })

    async function generatePrompt() {
        if (isGeneratingPrompt()) {
            return false
        }
        if (!title().length) {
            toast.error('角色不能为空!')
            return
        }
        let data = { prompt: title() };

        setIsGeneratingPrompt(true)
        fetch('https://allentofight.us-3.evennode.com/api/role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.body) {
                    setIsGeneratingPrompt(false)
                    throw new Error("No response body found");
                }

                const reader = response.body.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                        function readNextChunk() {
                            reader.read().then(({ done, value }) => {
                                if (done) {
                                    setPromptText('')
                                    setIsGeneratingPrompt(false)
                                    controller.close();
                                } else {
                                    controller.enqueue(value);
                                    let decodedText = new TextDecoder("utf-8").decode(value)
                                    setPromptText(promptText() + decodedText)
                                    console.log();
                                    readNextChunk();
                                }
                            }).catch(error => {
                                console.error('Error:', error);
                                controller.error(error);
                            });
                        }

                        readNextChunk();
                    }
                });
            })
            .catch((error: Error) => {
                console.error('Error:', error);
            });


    }

    async function handleInput() {
        // 重新设置高度，让输入框可以自适应高度，-1 是为了标记不是初始状态
        batch(() => {
            if (!compositionend()) return
            const value = inputRef?.value
            if (value.length > 500) {
                inputRef.value = value.slice(0, 500);
            }
            setTextWordCnt(inputRef.value.length)
        })
    }

    const [isDropdownVisible, setDropdownVisible] = createSignal(false);
    const [selectedColor, setSelectedColor] = createSignal("");

    let colorOptions = [{
        background: "rgb(244, 63, 94)",
        text: "#F43F5E"
    },
    {
        background: "rgb(236, 72, 152)",
        text: "#EC4898"
    },
    {
        background: "rgb(217, 70, 239)",
        text: "#D946EF"
    },
    {
        background: "rgb(139, 92, 246)",
        text: "#8B5CF6"
    },
    {
        background: "rgb(98, 102, 241)",
        text: "#6266F1"
    },
    {
        background: "rgb(59, 130, 246)",
        text: "#3B82F6"
    },
    {
        background: "rgb(14, 165, 233)",
        text: "#0EA5E9"
    },
    {
        background: "rgb(5, 182, 212)",
        text: "#05B6D4"
    },
    {
        background: "rgb(19, 184, 166)",
        text: "#13B8A6"
    },
    {
        background: "rgb(34, 197, 94)",
        text: "#22C55E"
    },
    {
        background: "rgb(132, 204, 22)",
        text: "#84CC16"
    },
    {
        background: "rgb(234, 179, 8)",
        text: "#EAB308"
    },
    {
        background: "rgb(239, 68, 68)",
        text: "#EF4444"
    },
    {
        background: "rgb(168, 85, 247)",
        text: "#A855F7"
    },
    {
        background: "rgb(245, 158, 11)",
        text: "#F59E0B"
    },
    {
        background: "rgb(16, 185, 129)",
        text: "#10B981"
    }]

    let icons = [
        'icon-a-5', 'icon-a-3', 'icon-a-4', 'icon-a-6',
        'icon-a-8', 'icon-a-9', 'icon-a-1',
        'icon-a-10', 'icon-a-111', 'icon-a-2', 'icon-a-7']

    onMount(() => {
        setTimeout(() => {
            document.querySelector("#create-prompt-container")?.classList.remove("up-enter-active")
        }, 200)
    })

    let confirmClick = async () => {

        if (isLoading()) {
            return
        }

        if (!title().length || !selectedColor().length) {
            toast.error(i18n.t('colorTitleMust'))
            return
        }

        if (!inputRef.value.length) {
            toast.error('prompt必填')
            return
        }


        setIsLoading(true)

        let result = await createOrUpdatePrompt(JSON.stringify({
            title: title(),
            icon: selectedIcon(),
            prompt: inputRef.value,
            color: selectedColor(),
        }))

        setIsLoading(false)
        console.log('result = ', result)

        document.querySelector("#create-prompt-container")?.classList.add("up-leave-active")
        setTimeout(() => {
            props.confirmClick()
        }, 200)
    }


    return (
        <div id="create-prompt-container" class="mask up-enter-active">
            <div class="mask-info">
                <div class="mask-content">
                    <div class="mask-title">
                        {i18n.t('createNewTip')}
                    </div>
                    <div class="mask-subtitle">
                        {i18n.t('enterRoleCreation')}
                    </div>
                    <div class="mask-putcell">
                        <div class="mask-putcell-label">
                            {i18n.t('role')}：
                        </div>
                        <div class="mask-putcell-input">
                            <div class="el-input el-input--suffix input">
                                <div class="el-input__wrapper">
                                    <input class="el-input__inner" value={title()}
                                        onInput={(event) => setTitle(event.target.value)}
                                        placeholder-class="placeholder" type="text" autocomplete="off" tabindex="0" placeholder={`${i18n.t('enterRoleYouWant')}`} id="el-id-4506-11" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mask-putcell hidden md:block">
                        <div class="mask-putcell-label">
                            {i18n.t('icon')}：
                        </div>
                        <div class="relative inline-block z-99"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div>
                                <i
                                    class={`iconfont ${selectedIcon()} icon cursor-pointer`}
                                    style="color: rgb(236, 72, 152);font-size:30px;"
                                ></i>
                            </div>
                            <div class="absolute grid-cols-3 gap-2 bg-white shadow-lg p-2 min-w-max rounded cursor-pointer"
                                style={{ display: isHovered() ? 'grid' : 'none' }}
                            >

                                <For each={icons}>
                                    {(icon) => (
                                        <i
                                            class={`iconfont ${icon} icon cursor-pointer text-4xl`}
                                            style="color: rgb(236, 72, 152);"
                                            onClick={() => {
                                                setIsHovered(false)
                                                setSelectedIcon(icon)
                                            }}
                                        ></i>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                    <div class="mask-putcell">
                        <div class="flex justify-between">
                            <div class="mask-putcell-label">
                                {i18n.t('customHint')}：
                            </div>
                            <div class="flex items-center" style="padding-top: 14px;">
                                <Show when={isGeneratingPrompt()}>
                                    <div class="chatloader"></div>
                                </Show>
                                <Show when={!isGeneratingPrompt()}>
                                    <div class="mask-putcell-label mask-putcell-btn" onClick={() => {
                                        generatePrompt()
                                    }}>
                                        {i18n.t('clickToGenerate')}
                                    </div>
                                </Show>

                            </div>
                        </div>

                        <div class="mask-putcell-input textarea">
                            <div class="el-textarea input">
                                <textarea class="el-textarea__inner"
                                    ref={el => inputRef = el}
                                    onInput={handleInput}
                                    maxlength="500" placeholder-class="placeholder" rows="3" tabindex="0" autocomplete="off" placeholder={`${i18n.t('enterYourHint')}`} id="el-id-4506-13" style="resize: none; min-height: 41px;"></textarea>
                            </div>
                            <div class="textarea-span">
                                {textWordCnt()}/500
                            </div>
                        </div>
                    </div>
                    <div class="mask-putcell">
                        <div class="mask-putcell-label">
                            {i18n.t('color')}：
                        </div>
                        <div class="mask-putcell-input">
                            <div class="el-select input">
                                <div class="select-trigger el-tooltip__trigger el-tooltip__trigger">
                                    <div class="el-input el-input--suffix">
                                        <div class="el-input__wrapper" onClick={() => setDropdownVisible(!isDropdownVisible())}>
                                            <input class="el-input__inner" value={selectedColor()} type="text" autocomplete="off" tabindex="0" placeholder={`${i18n.t('chooseYourColor')}`} id="el-id-4506-14" readOnly />
                                            <span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-icon el-select__caret el-select__icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                                                    <path fill="currentColor" d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"></path>
                                                </svg></i></span></span>
                                            {isDropdownVisible() &&
                                                <ul class="dropdown">
                                                    <For each={colorOptions} fallback={<li>Loading...</li>}>
                                                        {(color) => <li onClick={() => {
                                                            setSelectedColor(color.text);
                                                            setDropdownVisible(false);
                                                        }}>
                                                            <div class="option">
                                                                <div class="option-rect" style={{ background: color.background }}></div>
                                                                <div class="option-text">
                                                                    {color.text}
                                                                </div>
                                                            </div></li>}
                                                    </For>
                                                </ul>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mask-buttons">
                        <div class="cancel bottom-button" onClick={props.cancelClick}>
                            {i18n.t('cancel')}
                        </div>
                        <div class="confirm bottom-button" onClick={confirmClick}>
                            {i18n.t('done')}
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" />
            <Show when={isLoading()}>
                <Spinner class="w-1/3 absolute" type={SpinnerType.tailSpin} width="20%" height="20%" color="#bd69ff" />
            </Show>

        </div>
    )
}