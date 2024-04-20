import { createResizeObserver } from '@solid-primitives/resize-observer';
import {
    batch,
    createEffect,
    Show,
    createSignal,
    onMount,
    onCleanup,
} from 'solid-js';
import { useSearchParams } from 'solid-start';
import { RootStore, loadSession } from '~/store';
const { store, setStore } = RootStore;
import { LocalStorageKey, type ChatMessage, ModelEnum, Model } from '~/types';
import { setSession, isMobile } from '~/utils';
import MessageContainer from './MessageContainer';
import InputBox from './InputBox';
import VipChargeDialog from '../VipChargeDialog';
import { type FakeRoleUnion, setActionState } from './SettingAction';
import LoginGuideDialog from '../LoginGuideDialog';
import ExchangeDialog from '../ExchangeDialog';
import NotifyDialog from '../NotifyDialog';
import ChatNav from './ChatNav';
import { useAuth } from '~/utils/useAuth';
import PromptSelection from './PromptSelection';
import PromptCategory from './PromptCategory';
import PromptCategoryEn from './PromptCategoryEn';
import { setSharedStore, sharedStore } from '../MessagesStore';
import toast, { Toaster } from 'solid-toast';
import { isLocalStorageAvailable } from '~/utils/localStorageCheck';
import { fetchUserInfo, incrGPT4Cnt } from '~/utils/api';
const SearchParamKey = 'q';
const apiHost = import.meta.env.CLIENT_API_HOST;
const gptHost = import.meta.env.CLIENT_GPT_HOST;
import MarkmapView from '../MarkmapView';
import { detectIp } from '~/utils/api';
import i18n from '~/utils/i18n';

let modelMap = {
    [ModelEnum.GPT_3]: 'gpt-3.5-turbo-16k' as Model,
    [ModelEnum.GPT_4]: 'gpt-4-32k' as Model,
    [ModelEnum.GPT_New_Bing]: 'new-bing' as Model,
    [ModelEnum.MJ]: 'mj' as Model,
};

export default function () {
    let containerRef: HTMLDivElement;
    let controller: AbortController | undefined = undefined;
    const [containerWidth, setContainerWidth] = createSignal('init');
    const [inputBoxHeight, setInputBoxHeight] = createSignal(
        store.defaultInputBoxHeight
    );
    const [showLoginDirectDialog, setShowLoginDirectDialog] =
        createSignal(false);
    const [showPromptList, setShowPromptList] = createSignal(false);
    const [showVipDialog, setShowVipDialog] = createSignal(false);
    const [showNotifyDialog, setShowNotifyDialog] = createSignal(false);
    const [showExchangeDialog, setShowExchangeDialog] = createSignal(false);
    const [showPromptCategory, setShowPromptCategory] = createSignal(false);
    const [loginGuideTitle, setLoginGuideTitle] =
        createSignal('请登录以解锁更多功能');
    const [currentChat, setCurrentChat] = createSignal({
        id: '0',
        title: '',
        body: '',
        model: ModelEnum.GPT_3,
    });

    const [searchParams] = useSearchParams();
    const q = searchParams[SearchParamKey];

    onMount(async () => {
        fetchUserInfoAsync();

        if (localStorage.getItem('phone')) {
            localStorage.setItem('isInChina', '1');
            setStore('inChina', true);
        }

        let inChina = localStorage.getItem('isInChina');
        if (!inChina) {
            let res = await detectIp();
            localStorage.setItem('isInChina', res.isChina ? '1' : '2');
            setStore('inChina', res.isChina);
        } else {
            setStore('inChina', inChina === '1');
        }

        if (window.location.href.includes('nextaibots.com')) {
            setShowNotifyDialog(true);
        } else if (window.location.href.includes('nextaibots')) {
            const queryParams = new URLSearchParams(window.location.search);
            let sid = queryParams.get('sid');
            if (sid) {
                localStorage.setItem('sessionId', sid);
                window.location.href = `https://${window.location.host}`;
            }
        }

        const eventListenerFunction = function (e: CustomEvent) {
            if (e.detail.index < ModelEnum.MJ) {
                currentChat().model = e.detail.index;
                setStore(
                    'sessionSettings',
                    'APIModel',
                    modelMap[e.detail.index as ModelEnum]
                );
                setStore('useWebSearch', false);
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

        createResizeObserver(containerRef, ({ width }, el) => {
            if (el === containerRef) setContainerWidth(`${width + 8}px`);
        });

        if (q) sendMessage(q);
    });

    createEffect(() => {
        if (store.curPrompt.length) {
            setCurrentChat({
                id: '0',
                title: 'Empty chat',
                body: '',
                gmtModified: new Date(),
                model: ModelEnum.GPT_3,
            });

            setStore('messageList', []);
            setShowPromptCategory(false);
            setStore('chatType', 1);
            sendMessage(store.curPrompt);
            setStore('curPrompt', '');
        }
    });

    createEffect(() => {
        localStorage.setItem(
            LocalStorageKey.GLOBALSETTINGS,
            JSON.stringify(store.globalSettings)
        );
    });

    createEffect(() => {
        if (sharedStore.message?.type === 'loginRequired') {
            setShowLoginDirectDialog(true);
            setLoginGuideTitle('登录后可拥有保存会话功能');
        } else if (sharedStore.message?.type === 'selectedChat') {
            let chat = sharedStore.message?.info as {
                id: string;
                title: string;
                body: string;
                model?: ModelEnum;
            };
            let chatWithModel: {
                id: string;
                title: string;
                body: string;
                model: ModelEnum;
            } = {
                ...chat,
                model: chat.model ?? ModelEnum.GPT_3,
            };
            setCurrentChat(chatWithModel);

            setStore(
                'sessionSettings',
                'APIModel',
                modelMap[chatWithModel.model]
            );

            setStore('useWebSearch', false);

            if (!parseInt(chat.id)) {
                setStore('messageList', []);
            } else {
                setStore('messageList', JSON.parse(chat.body));
            }
            setShowPromptCategory(false);
        } else if (sharedStore.message?.type === 'delChat') {
            uploadChatList();
        }
    });

    createEffect(() => {
        const event = new CustomEvent('selectOption', {
            detail: {
                index: currentChat().model ?? ModelEnum.GPT_3,
                disabled: parseInt(currentChat().id) > 0,
            },
        });
        window.dispatchEvent(event);
    });

    function closeVipDialog() {
        setShowVipDialog(false);
    }

    async function fetchUserInfoAsync() {
        try {
            await fetchUserInfo();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
                console.error('Error fetching user info:', error);
            } else {
                console.error(error);
            }
        }
    }

    function archiveCurrentMessage() {
        let extractInfo = {};
        if (store.currentAssistantMessage) {
            batch(() => {
                setStore('messageList', (k) => [
                    ...k,
                    {
                        role: 'assistant',
                        content: store.currentAssistantMessage.trim(),
                        ...extractInfo,
                    },
                ]);
                setStore('currentAssistantMessage', '');
                setStore('loading', false);
            });
            controller = undefined;
        }
        !isMobile() && store.inputRef?.focus();
        uploadChatList();
    }

    function uploadChatList() {
        if (!isLocalStorageAvailable()) {
            return;
        }

        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            return;
        }
        let result = store.messageList.filter((k) => k.role !== 'error');

        let isCreatingChat = currentChat().id.length < 3;
        let postChat = {
            id: currentChat().id,
            title: isCreatingChat
                ? store.messageList[0].content.slice(0, 10)
                : currentChat().title,
            body: JSON.stringify(result),
            model: currentChat().model,
        };
        fetch(`${apiHost}/api/chat/createOrUpdate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionId}`,
            },
            body: JSON.stringify(postChat),
        })
            .then((response) => {
                // Check if the response status is OK (200)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Parse the response as JSON
                return response.json();
            })
            .then((data) => {
                if (isCreatingChat) {
                    setCurrentChat({ ...postChat, id: data.id });
                    setSharedStore('message', {
                        type: 'addChat',
                        info: currentChat(),
                    });
                } else {
                    setSharedStore('message', {
                        type: 'updateChatBody',
                        info: { body: postChat.body },
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching chat:', error);
            });
    }

    function stopStreamFetch() {
        if (controller) {
            controller?.abort();
            archiveCurrentMessage();
        }
    }

    async function sendMessage(value?: string, fakeRole?: FakeRoleUnion) {
        const { showLogin, isExpired, isLogin, isGPT4Expired } = useAuth();

        if (showLogin()) {
            window.location.href = '/login';
            return;
        }

        if (
            isLogin() &&
            isExpired() &&
            currentChat().model === ModelEnum.GPT_3
        ) {
            toast.error(i18n.t('gptExpireHint'));
            return;
        }

        fetchUserInfoAsync();

        let inputValue = value ?? store.inputContent;
        if (!inputValue) return;

        if (store.showMindMap) {
            setStore('messageList', []);
            inputValue = `你是一个思维导图专家，请根据我提供的如下内容:${inputValue}
        做一个思维导图，要求高质量,详细,多层级,多分支,清晰,直接生成用中文回复markdown格式的思维导图，每一行都必须以 # 开头，非 # 开头的不要输出以下是输出案例:

        # 西湖半日游思维导图
        ## I. 准备阶段
          ### A. 选择出行日期
          ### B. 查看天气预报
          ### C. 准备舒适的服装和鞋履

        不要有 \`\`\`markdown 这样的开头，
        `;
        }

        if (!isLocalStorageAvailable()) {
            return;
        }

        if (currentChat().model === ModelEnum.GPT_New_Bing) {
            // 付费用户才能使用 GPT4!
            toast.error('new bing 暂不开放哦');
            return;
        }

        if (isGPT4Expired() && currentChat().model === ModelEnum.GPT_4) {
            // 付费用户才能使用 GPT4!
            toast.error('GPT4 会员已过期，请先到「会员中心」续费哦');
            return;
        }

        let isGPT4Using =
            !isGPT4Expired() && currentChat().model === ModelEnum.GPT_4;

        if (isGPT4Using) {
            if (store.leftGPT4Cnt <= 0) {
                toast.error(`GPT4次数已用尽，请及时续费哦`);
                return;
            }
        }

        if (!isLogin()) {
            let storageKey = 'cnt_of_experience';
            const currentValue =
                parseInt(localStorage.getItem(storageKey) || '0') + 1;
            localStorage.setItem(storageKey, currentValue.toString());
        }
        setStore('inputContent', '');
        let result;
        try {
            setStore('messageList', (k) => [
                ...k,
                {
                    role: 'user',
                    content: inputValue,
                },
            ]);

            if (store.remainingToken < 0) {
                throw new Error(
                    store.sessionSettings.continuousDialogue
                        ? '本次对话过长，请清除之前部分对话或者缩短当前提问。'
                        : '提问太长了，请缩短。'
                );
            }
            setStore('loading', true);

            if (!parseInt(currentChat().id)) {
                const event = new CustomEvent('selectOption', {
                    detail: {
                        index: currentChat().model ?? ModelEnum.GPT_3,
                        disabled: true,
                    },
                });
                window.dispatchEvent(event);
            }

            controller = new AbortController();
            // 在关闭连续对话时，有效上下文只包含了锁定的对话。
            await fetchGPT(
                store.sessionSettings.continuousDialogue
                    ? store.validContext
                    : [
                          ...store.validContext,
                          {
                              role: 'user',
                              content: inputValue,
                          },
                      ],
                inputValue
            );
            if (isGPT4Using) {
                incrGPT4Cnt();
                setStore('leftGPT4Cnt', store.leftGPT4Cnt - 1);
            }
        } catch (error: any) {
            setStore('loading', false);
            controller = undefined;
            if (!error.message.includes('abort')) {
                setStore('messageList', (k) => [
                    ...k,
                    {
                        role: 'error',
                        content: error.message.replace(/(sk-\w{5})\w+/g, '$1'),
                    },
                ]);
            }
        }

        if (!store.showMindMap) {
            archiveCurrentMessage();
        } else {
            setStore('messageList', []);
            setStore('loading', false);
            setStore('currentAssistantMessage', '');
        }
    }

    async function fetchGPT(messages: ChatMessage[], inputVal: string) {
        const messagesCopy = [...messages]; // Make a copy of the array
        if (store.useWebSearch) {
            const messageCopy = { ...messagesCopy[messagesCopy.length - 1] }; // Make a copy of the last object
            const url = `https://search.qiuweiai.cn/?search_term=${encodeURIComponent(
                messageCopy.content
            )}`;
            let searchResult = await fetch(url);
            let result = await searchResult.json();
            console.log('result = ', result.message);
            if (result.message) {
                messageCopy.content = `你需要优先根据以下背景信息来回答我的问题
          背景信息: ${result.message}
          我的问题是:${messageCopy.content}
        `;
                messagesCopy[messagesCopy.length - 1] = messageCopy; // Replace the last item in the copied array
            }
        }

        let sessionId = localStorage.getItem('sessionId');
        let response = await fetch(`${gptHost}/api/openai`, {
            method: 'POST',
            body: JSON.stringify({
                messages: messagesCopy,
                key: undefined,
                temperature: store.sessionSettings.APITemperature,
                password: store.globalSettings.password,
                model: modelMap[currentChat().model],
                sessionId,
            }),
            signal: controller?.signal,
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error('由于 Openai 官网崩溃，GPT4 暂不可用，请稍后再试');
            //throw new Error(res.error?.message ?? '当前请求繁忙，请稍后再试')
        }
        const data = response.body;
        if (!data) {
            throw new Error('没有返回数据');
        }
        const reader = data.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            if (value) {
                let char = decoder.decode(value);
                if (
                    char === '\n' &&
                    store.currentAssistantMessage.endsWith('\n')
                ) {
                    continue;
                }

                if (char) {
                    char = char.replace('null', '');
                    setStore('currentAssistantMessage', (k) => k + char);
                }
            }
            done = readerDone;
        }
    }

    return (
        <>
            <ChatNav
                clickSearch={() => {
                    setShowPromptList(true);
                }}
                clickChat={() => {
                    setShowPromptCategory(false);
                }}
                clickPromptCategory={() => {
                    setShowPromptCategory(true);
                }}
            />
            <div
                class="bg-mask absolute left-195px right-20px bottom-20px bg-white rounded-lg"
                style="top: 64px;"
            ></div>
            <main
                ref={containerRef!}
                id="mainContainer"
                class={`mt-4 w-full ${
                    !store.showMindMap ? 'h-full' : ''
                } flex justify-center overflow-y-auto z-99`}
                style={{
                    'max-width': '72ch',
                    'font-size': '16px',
                    'margin-top': '64px',
                    display: !showPromptCategory() ? 'block' : 'none',
                }}
            >
                <Show when={!store.showMindMap}>
                    <MessageContainer
                        sendMessage={sendMessage}
                        inputBoxHeight={inputBoxHeight}
                    />
                </Show>
                <Show when={showLoginDirectDialog()}>
                    <LoginGuideDialog title={loginGuideTitle()} />
                </Show>
                <Show when={showExchangeDialog()}>
                    <ExchangeDialog
                        successClick={() => {
                            window.location.href = '/';
                        }}
                        showTitle={true}
                        showChargeBtn={true}
                        chargeBtnClick={() => {
                            setShowExchangeDialog(false);
                            setShowVipDialog(true);
                        }}
                        onClick={() => setShowExchangeDialog(false)}
                    />
                </Show>
                <Show when={showVipDialog()}>
                    <VipChargeDialog
                        title="付费用户才能使用GPT4哦"
                        onClose={closeVipDialog}
                    />
                </Show>
                <Show when={showNotifyDialog()}>
                    <NotifyDialog />
                </Show>
                <Toaster position="top-center" />
            </main>
            <InputBox
                height={inputBoxHeight}
                width={containerWidth}
                setHeight={setInputBoxHeight}
                sendMessage={sendMessage}
                stopStreamFetch={stopStreamFetch}
            />
            <Show when={store.showMindMap}>
                <MarkmapView />
            </Show>
            <Show when={showPromptCategory()}>
                <Show when={store.inChina}>
                    <PromptCategory
                        clickPrompt={() => {
                            setShowPromptCategory(false);
                        }}
                    />
                </Show>
                <Show when={!store.inChina}>
                    <PromptCategoryEn
                        clickPrompt={() => {
                            setShowPromptCategory(false);
                        }}
                    />
                </Show>
            </Show>
            <Show when={showPromptList()}>
                <PromptSelection
                    bgClick={() => {
                        setShowPromptList(false);
                    }}
                />
            </Show>
        </>
    );
}
