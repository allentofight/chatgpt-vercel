import { makeEventListener } from '@solid-primitives/event-listener';
import { ModelEnum } from '~/types';
import { Fzf } from 'fzf';
import throttle from 'just-throttle';
import {
    type Accessor,
    type Setter,
    Show,
    createEffect,
    createSignal,
    onCleanup,
    onMount,
    batch,
} from 'solid-js';
import { FZFData, RootStore, loadSession } from '~/store';
const { store, setStore } = RootStore;
import type { Option } from '~/types';
import { parsePrompts, scrollToBottom } from '~/utils';
import SettingAction, {
    actionState,
    type FakeRoleUnion,
} from './SettingAction';
import { useNavigate } from 'solid-start';
import i18n from '~/utils/i18n';
import UploadBtn from './UploadBtn';
import UploadedFile from './UploadedFile';

const FILE_KEY = import.meta.env.CLIENT_FILE_KEY;

// 3em
export const defaultInputBoxHeight = 48;
export default function ({
    width,
    height,
    setHeight,
    sendMessage,
    stopStreamFetch,
}: {
    width: Accessor<string>;
    height: Accessor<number>;
    setHeight: Setter<number>;
    sendMessage(content?: string, fakeRole?: FakeRoleUnion): void;
    stopStreamFetch(): void;
}) {
    const [candidateOptions, setCandidateOptions] = createSignal<Option[]>([]);
    const [compositionend, setCompositionend] = createSignal(true);

    const [uploadedFileUrl, setUploadedFileUrl] = createSignal('');

    const [fileName, setFileName] = createSignal('');

    const [uploadingProgress, setUploadingProgress] = createSignal(0);

    const navgiate = useNavigate();
    const { store, setStore } = RootStore;
    onMount(() => {
        setTimeout(() => {
            FZFData.promptOptions = parsePrompts('gpt').map(
                (k) => ({ title: k.desc, desc: k.detail } as Option)
            );
            FZFData.fzfPrompts = new Fzf(FZFData.promptOptions, {
                selector: (k) => `${k.title}\n${k.desc}`,
            });
        }, 500);
        if (store.inputRef) {
            makeEventListener(
                store.inputRef,
                'compositionend',
                () => {
                    setCompositionend(true);
                    handleInput();
                },
                { passive: true }
            );
            makeEventListener(
                store.inputRef,
                'compositionstart',
                () => {
                    setCompositionend(false);
                },
                { passive: true }
            );
        }

        const eventListenerFunction = function (e: CustomEvent) {
            if (e.detail.index === ModelEnum.GPT_3) {
                setStore('defaultInputBoxHeight', 48);
            } else if (e.detail.index === ModelEnum.GPT_4) {
                if (fileName().length > 0) {
                    setStore('defaultInputBoxHeight', 102);
                }
            }
        };

        (window as any).addEventListener(
            'optionSelected',
            eventListenerFunction
        );

        onCleanup(() => {
            (window as any).removeEventListener(
                'optionSelected',
                eventListenerFunction
            );
        });
    });

    function setSuitableheight() {
        const scrollHeight = store.inputRef?.scrollHeight;
        if (scrollHeight)
            setHeight(
                scrollHeight > window.innerHeight - 80
                    ? window.innerHeight - 80
                    : scrollHeight
            );
    }

    createEffect((prev) => {
        store.inputContent;
        if (prev) {
            batch(() => {
                setHeight(store.defaultInputBoxHeight);
                if (store.inputContent === '') {
                    setCandidateOptions([]);
                } else {
                    setSuitableheight();
                }
            });
        }
        return true;
    });

    createEffect(() => {
        if (store.defaultInputBoxHeight) {
            setHeight(store.defaultInputBoxHeight);
            if (store.inputContent !== '') {
                setSuitableheight();
            }
        }
    });

    const searchOptions = throttle(
        (value: string) => {
            if (/^\s{2,}$|^\/{2,}$/.test(value))
                return setCandidateOptions(FZFData.sessionOptions);
            if (value === '/' || value === ' ')
                return setCandidateOptions(FZFData.promptOptions);

            const sessionQuery = value.replace(
                /^\s{2,}(.*)\s*$|^\/{2,}(.*)\s*$/,
                '$1$2'
            );
            const promptQuery = value.replace(
                /^\s(.*)\s*$|^\/(.*)\s*$/,
                '$1$2'
            );
            if (sessionQuery !== value) {
                setCandidateOptions(
                    FZFData.fzfSessions!.find(sessionQuery).map((k) => ({
                        ...k.item,
                        positions: k.positions,
                    }))
                );
            } else if (promptQuery !== value) {
                setCandidateOptions(
                    FZFData.fzfPrompts!.find(promptQuery).map((k) => ({
                        ...k.item,
                        positions: k.positions,
                    }))
                );
            }
        },
        100,
        {
            trailing: false,
            leading: true,
        }
    );

    async function handleInput() {
        // 重新设置高度，让输入框可以自适应高度，-1 是为了标记不是初始状态
        setHeight(store.defaultInputBoxHeight - 1);
        batch(() => {
            setSuitableheight();
            if (!compositionend()) return;
            const value = store.inputRef?.value;
            if (value) {
                setStore('inputContent', value);
                searchOptions(value);
            } else {
                setStore('inputContent', '');
                setCandidateOptions([]);
            }
        });
    }

    const customPadding = () => {
        if (store.defaultInputBoxHeight === 102) {
            if (fileName().length > 0) {
                return 'pb-3 pt-70px pl-3';
            } else {
                return 'pb-3 pt-70px pl-2.2em';
            }
        }
        if (store.sessionSettings.APIModel.includes('gpt-4')) {
            return 'py-3 pr-3 pl-2.2em';
        } else {
            return 'p-3';
        }
    };

    const [placeHolder, setPlaceHolder] = createSignal('Send a message');
    createEffect(() => {
        setPlaceHolder(
            store.showMindMap
                ? '输入创建思维导图所需信息：如「西湖一日游」'
                : i18n.t('sendMessage')
        );
    });

    const [fileInput, setFileInput] = createSignal<HTMLInputElement | null>(
        null
    );

    // 打开文件选择对话框
    const triggerFileSelect = () => {
        fileInput()?.click();
    };

    // 当文件被选中时触发
    const handleFileChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            uploadFile(input.files[0]);
        }
    };

    // 上传文件
    const uploadFile = async (file: File) => {
        setStore('defaultInputBoxHeight', 102);
        const formData = new FormData();
        formData.append('file', file);

        setFileName(file.name);

        // 创建 XMLHttpRequest 对象
        const xhr = new XMLHttpRequest();

        // 进度事件
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setUploadingProgress(percentComplete);
                console.log(`Uploaded ${percentComplete}%`);
            }
        };

        // 请求完成后的处理
        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                setUploadedFileUrl(response.data.url);
                console.log('File uploaded successfully');
            } else {
                setStore('defaultInputBoxHeight', 48);
                setUploadingProgress(0);
                console.error('Upload failed');
            }
        };

        // 处理网络错误
        xhr.onerror = function () {
            console.error('Error during upload');
        };

        // 设置请求并发送数据
        xhr.open('POST', 'https://api.gptgod.online/v1/file', true);
        xhr.setRequestHeader('Authorization', `Bearer ${FILE_KEY}`);
        xhr.send(formData);
    };

    const getMessage = () => {
        let message = undefined;
        if (
            store.sessionSettings.APIModel.includes('gpt-4') &&
            uploadedFileUrl().length > 0
        ) {
            message = uploadedFileUrl();
            if (store.inputContent) {
                message = `${message} ${store.inputContent}`;
                clearFileInfo();
            }
        }
        return message;
    };

    const clearFileInfo = () => {
        setUploadedFileUrl('');
        setStore('defaultInputBoxHeight', 48);
        setUploadingProgress(0);
        setFileName('');
    };

    return (
        <div
            class="input-box-pos pb-2em px-2em fixed bottom-0 z-99"
            style={{
                'background-color': 'var(--main-bg)',
                width: width() === 'init' ? '100%' : width(),
            }}
        >
            <div
                style={{
                    transition: 'opacity 1s ease-in-out',
                    opacity: width() === 'init' ? 0 : 100,
                }}
            >
                <Show
                    when={!store.loading}
                    fallback={
                        <div
                            class="animate-gradient-border cursor-pointer dark:bg-#292B31/90 bg-#E7EBF0/80 h-3em flex items-center justify-center"
                            onClick={stopStreamFetch}
                        >
                            <span class="dark:text-slate text-slate-7">
                                AI 正在思考
                            </span>
                        </div>
                    }
                >
                    <div class="flex items-end relative">
                        <Show
                            when={store.sessionSettings.APIModel.includes(
                                'gpt-4'
                            )}
                        >
                            <Show when={fileName().length == 0}>
                                <div
                                    class="absolute bottom-5px left-0.5rem"
                                    onClick={triggerFileSelect}
                                >
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        class="hidden"
                                        ref={setFileInput}
                                    />
                                    <UploadBtn />
                                </div>
                            </Show>

                            <Show when={fileName().length > 0}>
                                <div class="absolute top-2 left-2">
                                    <div>
                                        <UploadedFile
                                            fileName={fileName()}
                                            value={20}
                                            size={uploadingProgress}
                                            close={() => {
                                                clearFileInfo();
                                            }}
                                        />
                                    </div>
                                </div>
                            </Show>
                        </Show>
                        <textarea
                            ref={(el) => setStore('inputRef', el)}
                            id="input"
                            placeholder={`${placeHolder()}`}
                            autocomplete="off"
                            value={store.inputContent}
                            autofocus
                            onClick={scrollToBottom}
                            onKeyDown={(e) => {
                                if (e.isComposing) return;
                                if (candidateOptions().length) {
                                    if (
                                        e.key === 'ArrowUp' ||
                                        e.key === 'ArrowDown' ||
                                        e.keyCode === 13
                                    ) {
                                        e.preventDefault();
                                    }
                                } else if (e.keyCode === 13) {
                                    if (
                                        !e.shiftKey &&
                                        store.globalSettings.enterToSend
                                    ) {
                                        e.preventDefault();

                                        sendMessage(
                                            getMessage(),
                                            actionState.fakeRole
                                        );
                                    }
                                } else if (e.key === 'ArrowUp') {
                                    const userMessages = store.messageList
                                        .filter((k) => k.role === 'user')
                                        .map((k) => k.content);
                                    const content = userMessages.at(-1);
                                    if (content && !store.inputContent) {
                                        e.preventDefault();
                                        setStore('inputContent', content);
                                    }
                                }
                            }}
                            onInput={handleInput}
                            style={{
                                height: height() + 'px',
                            }}
                            class={`self-end ${customPadding()} pr-2.2em resize-none w-full text-slate-7 dark:text-slate bg-slate bg-op-15 focus:(bg-op-20 ring-0 outline-none) placeholder:(text-slate-800 dark:text-slate-400 op-40)`}
                            classList={{
                                'rounded-t': candidateOptions().length === 0,
                                'rounded-b': true,
                            }}
                        />
                        <Show when={store.inputContent}>
                            <div
                                class="absolute flex text-1em items-center"
                                classList={{
                                    'right-2.5em bottom-1em':
                                        height() ===
                                        store.defaultInputBoxHeight,
                                    'right-0.8em top-0.8em':
                                        height() !==
                                        store.defaultInputBoxHeight,
                                }}
                            >
                                <button
                                    class="i-carbon:add-filled rotate-45 text-slate-7 dark:text-slate text-op-20! hover:text-op-60!"
                                    onClick={() => {
                                        setStore('inputContent', '');
                                        store.inputRef?.focus();
                                    }}
                                />
                            </div>
                        </Show>
                        <div class="absolute right-0.5em bottom-0.8em flex items-center">
                            <button
                                title="发送"
                                onClick={() =>
                                    sendMessage(
                                        getMessage(),
                                        actionState.fakeRole
                                    )
                                }
                                class="i-carbon:send-filled text-1.5em text-slate-7 dark:text-slate text-op-80! hover:text-op-100!"
                            />
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
}
