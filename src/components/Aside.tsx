import { createEffect, createSignal, Show, onMount } from 'solid-js';

import ChatIcon from './ChatIcon'
import ChatEdit from './ChatEdit'
import ChatConfirm from './ChatConfirm'
import ExchangeDialog from './ExchangeDialog'
import DeleteConfirm from './DeleteConfirm'
import { useAuth } from "~/utils/useAuth"
import { setSharedStore, sharedStore } from './MessagesStore'
import InviteDialog from './InviteDialog'
import FaqDialog from './FaqDialog'
const apiHost = import.meta.env.CLIENT_API_HOST;
import { isLocalStorageAvailable } from "~/utils/localStorageCheck"
import { ModelEnum } from "~/types"
import VipChargeDialog from './VipChargeDialog'
import AccountInfoDialog from './AccountInfoDialog'
import { RootStore, loadSession } from "~/store"
import toast from 'solid-toast';
import i18n from "~/utils/i18n";
import { isMobile } from "~/utils"
const { store, setStore } = RootStore

interface Chat {
  id: string;
  title: string;
  body?: string;
  gmtModified: Date;
  model?: ModelEnum;
}

export default function Aside() {
  const [chats, setChats] = createSignal<Chat[]>([]);

  const defaultChat = {
    id: '0',
    title: "Empty chat",
    gmtModified: new Date(),
    model: ModelEnum.GPT_3
  }

  const initialItem: Chat = chats().length > 0 ? chats()[0] : defaultChat

  const [selectedChat, setSelectedChat] = createSignal<Chat>(initialItem);

  const [hasMore, setHasMore] = createSignal(false);

  const [showInviteDialog, setShowInviteDialog] = createSignal(false);

  const [showFaqDialog, setShowFaqDialog] = createSignal(false);

  const [showVipDialog, setShowVipDialog] = createSignal(false);

  const [showChargeDialog, setShowChargeDialog] = createSignal(false)

  const [loading, setLoading] = createSignal<boolean>(false);

  const [hasScrollbar, setHasScrollbar] = createSignal(false);

  const { isLogin } = useAuth()

  let divRef: HTMLDivElement;
  let contentRef: HTMLDivElement;
  let contentContainerRef: HTMLDivElement;
  let inputRef: HTMLInputElement;

  const [isEditable, setIsEditable] = createSignal(false);
  const [isDeletable, setIsDeletable] = createSignal(false);

  onMount(() => {
    fetchChats()
  })

  function edit() {
    setIsEditable(!isEditable());
  }

  function del() {
    setIsDeletable(true)
  }

  function closeInviteDialog() {
    setShowInviteDialog(false)
  }

  function closeFaqDialog() {
    setShowFaqDialog(false)
  }

  function closeVipDialog() {
    setShowVipDialog(false)
  }

  function clearAllChats() {

    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      toast.error('请先登录')
      return
    }
    fetch(`${apiHost}/api/chat/deleteAll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      },
      body: JSON.stringify({}),
    }).then((response) => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the response as JSON
      return { message: 'deleteSuccess' };
    }).then((data) => {
      console.log('删除成功!')
    }).catch((error) => {
      console.error('Error delete chat:', error);
    });
  }

  function confirmDel() {

    if (!isLocalStorageAvailable()) {
      return
    }

    let filteredChats = chats().filter(item => {
      return item.id !== selectedChat().id
    })

    let sessionId = localStorage.getItem('sessionId')
    fetch(`${apiHost}/api/chat/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      },
      body: JSON.stringify({
        id: selectedChat().id,
      }),
    }).then((response) => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the response as JSON
      return { message: 'deleteSuccess' };
    }).then((data) => {
      console.log('删除成功!')
    }).catch((error) => {
      console.error('Error delete chat:', error);
    });

    setChats(filteredChats)
    setSelectedChat(defaultChat)
    setSharedStore('message', { type: 'selectedChat', info: { ...selectedChat() } })
    setIsDeletable(false)
  }

  function cancelDel() {
    setIsDeletable(false)
  }

  createEffect(() => {
    if (!isMobile()) {
      return
    }
    let chatAside = document.querySelector("#chat-aside") as HTMLElement
    if (store.showChatList) {
      chatAside?.classList.remove("off-screen")
      chatAside?.classList.remove("slide-out")
      chatAside?.classList.add("slide-in")
      setTimeout(() => {
        chatAside?.classList.remove("slide-in")
        chatAside!.style.transform = "translateX(0)";
      }, 200)
    } else if (!document.querySelector("#chat-aside")?.classList.contains('off-screen')) {
      chatAside?.classList.add("slide-out")
      chatAside?.classList.remove("slide-in")
      setTimeout(() => {
        chatAside?.classList.remove("slide-out")
        chatAside!.style.transform = "translateX(-100%)";
      }, 200)
    }
  })


  createEffect(() => {
    if (sharedStore.message?.type === 'addChat') {
      let originChats = JSON.parse(JSON.stringify(chats()))
      let chat = sharedStore.message?.info as Chat
      originChats.unshift({
        id: chat.id,
        title: chat.title,
        body: chat.body,
        model: chat.model,
      } as Chat);
      setChats(originChats)
      setSharedStore('message', { type: 'none' })
      setSelectedChat(chats()[0])
      setSharedStore('message', { type: 'selectedChat', info: { ...selectedChat() } })
    } else if (sharedStore.message?.type === 'updateChatBody') {
      let chat = sharedStore.message?.info as Chat
      let filteredChats = chats().filter(item => {
        return item.id === selectedChat().id
      })
      if (filteredChats.length) {
        filteredChats[0].body = chat.body
      }

    }
  });


  createEffect(() => {
    if (isEditable() && inputRef) {
      inputRef.focus();
      let end = inputRef.value.length
      inputRef.setSelectionRange(end, end)
      inputRef.selectionStart = inputRef.selectionEnd = inputRef.value.length;
      inputRef.scrollLeft = inputRef.scrollWidth;
    }
  });

  createEffect(() => {
    if (contentRef) {
      setHasScrollbar(contentRef.scrollHeight > contentContainerRef.clientHeight);
    }
  });

  function handleBlur() {
    setIsEditable(false);
    const newName = inputRef.value || '';
    if (newName !== '') {
      selectedChat().title = newName
      updateChatTitle()
    }
  }

  function closeChargeDialog() {
    setShowChargeDialog(false)
  }

  function updateChatTitle() {
    if (!isLocalStorageAvailable()) {
      return
    }

    let sessionId = localStorage.getItem('sessionId')
    fetch(`${apiHost}/api/chat/createOrUpdate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      },
      body: JSON.stringify({
        id: selectedChat().id,
        title: selectedChat().title,
      }),
    }).then((response) => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the response as JSON
      return response.json();
    })
      .then((data) => {
        // Handle the data
      })
      .catch((error) => {
        console.error('Error fetching chat:', error);
      });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const newName = inputRef.value || '';
      if (newName !== '') {
        selectedChat().title = newName
      }
      inputRef.blur();
    }
  }

  function loadMore() {
    fetchChats()
  }

  function confirmChatEdit() {
    updateChatTitle()
  }

  function cancelChatEdit() {
    updateChatTitle()
  }

  function showLogin() {
    if (!isLogin()) {
      setSharedStore('message', { type: 'loginRequired' })
      return true
    }
  }

  const createChat = () => {

    if (showLogin()) {
      return
    }

    setStore('showMindMap', false)
    setStore('useWebSearch', false)
    setSelectedChat(defaultChat)
    setSharedStore('message', { type: 'selectedChat', info: { ...selectedChat() } })
    setStore('showChatList', false)
    setStore("chatType", 1)
  };

  const fetchChats = async () => {
    if (!isLocalStorageAvailable()) {
      return
    }

    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      return
    }

    setLoading(true);
    let clientGmtModified = '';
    if (chats().length) {
      clientGmtModified = `?clientGmtModified=${chats()[chats().length - 1].gmtModified}`
    }

    fetch(`${apiHost}/api/chat/list${clientGmtModified}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      },
    }).then((response) => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the response as JSON
      return response.json();
    })
      .then((data) => {
        setHasMore(data.hasMore)
        setChats([...chats(), ...data.chats]);
        setLoading(false);
        // Handle the data
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching chat:', error);
      });
  };

  return (
    <>
      <style>
        {`
          .dark .btn-dark {
            --tw-border-opacity: 1;
            --tw-bg-opacity: 1;
            --tw-text-opacity: 1;
            background-color: rgba(52,53,65,var(--tw-bg-opacity));
            border-color: rgba(86,88,105,var(--tw-border-opacity));
            border-width: 1px;
            color: rgba(255,255,255,var(--tw-text-opacity))
          }
          
          .dark .btn-dark:hover {
            --tw-bg-opacity: 1;
            background-color: rgba(64,65,79,var(--tw-bg-opacity))
          }

          .btn-small {
            padding: .25rem .5rem;
          }
          
          .input-field:focus {
            outline: 2px solid #2b68e8;
            border: none;
          }
          
          .gpt-aside {
            margin-top: 44px;
            font-size: 16px;
          }

          .slide-in {
            animation: slidein 0.2s ease-in-out forwards;
          }

          .off-screen {
            transform: translateX(-100%);
          }
          

          @keyframes slidein {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          
          @keyframes slideout {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          
          .slide-out {
            animation: slideout 0.2s ease-in-out forwards;
          }

          .custom-text-color {
            color: #ECECF1 !important;
          }

          @media (min-width:768px) {
            .scrollbar-trigger ::-webkit-scrollbar-thumb {
              visibility: hidden
            }

            .gpt-aside {
              margin-top: 59px;
            }
          
            .scrollbar-trigger:hover ::-webkit-scrollbar-thumb {
              visibility: visible
            }
          }
        `}
      </style>
      <div id="chat-aside" class={`gpt-aside fixed inset-y-0 left-0 z-99 ${isMobile() ? 'off-screen' : ''}`} style={{ "width": "175px" }}>
        <aside class={`left-0 top-0 h-full bg-gray-900 relative md:flex md:flex-col z-40 ${store.showChatList ? 'flex' : 'hidden'
          }`}>
          <div class="absolute top-0 right-0 -mr-12 pt-2 opacity-100 md:hidden"><button type="button" class="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" tabindex="0" ><span class="sr-only">Close sidebar</span><svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-gray-800" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>
          <div class="flex h-full min-h-0 flex-col ">
            <div class="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
              <nav class="flex h-full flex-1 flex-col space-y-1 p-2">
                <a class="flex justify-center py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 custom-text-color custom-a-bg" onClick={createChat}>
                  {i18n.t('newChat')}</a>
                <div
                  ref={(el) => (contentContainerRef = el)}
                  class={`flex-col flex-1 overflow-y-auto border-b border-white/20 ${hasScrollbar() ? '-mr-2' : ''}`}>
                  <div
                    ref={(el) => (contentRef = el)}
                    class="flex flex-col gap-2 text-gray-100 text-sm">

                    {chats().map((chat) => (
                      <>
                        <Show when={chat.id !== selectedChat().id}>
                          <a class="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group custom-text-color" onClick={() => {
                            setStore("chatType", 1)
                            setStore('useWebSearch', false)
                            setSelectedChat(chat)
                            setSharedStore('message', { type: 'selectedChat', info: { ...selectedChat() } })
                          }}>
                            <ChatIcon />
                            <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                              {chat.title}
                              <div class="gradien-div absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
                            </div></a>
                        </Show>
                        <Show when={chat.id === selectedChat().id}>
                          <Show when={!isEditable()}>
                            <Show when={!isDeletable()}>
                              <a class="selected flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-gray-800 hover:bg-gray-800 group custom-text-color">
                                <ChatIcon />
                                <div
                                  ref={(el) => (divRef = el)}
                                  class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative"
                                >
                                  {selectedChat().title}
                                </div>
                                <div class="gradien-div absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800" contenteditable={false}></div>
                                <ChatEdit
                                  del={del}
                                  edit={edit} />
                              </a>
                            </Show>
                            <Show when={isDeletable()}>
                              <a class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-gray-800 hover:bg-gray-800 group">
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                                  Delete &quot;{selectedChat().title}&quot;?
                                  <div class="gradien-div absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800"></div>
                                </div>
                                <DeleteConfirm
                                  confirmDelete={confirmDel}
                                  cancelDelete={cancelDel} />
                              </a>
                            </Show>
                          </Show>
                          <Show when={isEditable()}>
                            <div class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer hover:pr-14 break-all pr-14 bg-gray-800 hover:bg-gray-800 selected">
                              <ChatIcon />
                              <input
                                onKeyDown={handleKeydown}
                                onBlur={handleBlur}
                                ref={(el) => (inputRef = el)}
                                type="text" class="input-field text-sm border-none bg-transparent p-0 m-0 w-full mr-0"
                                value={selectedChat()?.title} />
                              <ChatConfirm
                                cancel={cancelChatEdit}
                                edit={confirmChatEdit} />
                            </div>
                          </Show>
                        </Show>
                      </>
                    ))}

                    <Show when={hasMore()}>
                      <div class="text-white btn-dark load-more rounded py-2 mb-2 text-center" onClick={(event) => {
                        event.stopPropagation()
                        loadMore()
                      }}>
                        {i18n.t('loadMore')}
                      </div>
                    </Show>
                  </div>
                </div>
                <Show when={isLogin()}>
                  <a class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm custom-text-color" onClick={(event) => {
                    event.stopPropagation()
                    if (chats().length == 0) {
                      console.log('会话已是空的')
                      return
                    }
                    setChats([])
                    clearAllChats()
                  }}>
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"></path>
                      <path d="M16 9l-7 7m0 -7l7 7"></path>
                    </svg> {i18n.t('clearAllConversations')}</a>
                </Show>
                <footer class="flex justify-center mt-1" style={{
                  "background-color": "transparent",
                  "padding-bottom": "0"
                }}>
                  <div class="footer-link">
                    <a target="_blank" href="https://beian.miit.gov.cn" style={{
                      "background-color": "transparent",
                      "color": "#94969a !important",
                      "font-size": "10px"

                    }}>浙ICP备2023014529号-3</a>
                  </div>
                </footer>
              </nav>
            </div>
          </div>
        </aside >
      </div>
      <Show when={showInviteDialog()}>
        <InviteDialog closeDialog={closeInviteDialog} />
      </Show>
      <Show when={showFaqDialog()}>
        <FaqDialog closeDialog={closeFaqDialog} />
      </Show>
      <Show when={showVipDialog()}>
        <VipChargeDialog
          title="VIP 套餐"
          onClose={closeVipDialog} />
      </Show>
      <Show when={showChargeDialog()}>
        <AccountInfoDialog closeDialog={closeChargeDialog} inviteBtnClick={() => {
          setShowInviteDialog(true)
          setShowChargeDialog(false)
        }} />
      </Show>
    </>
  );
}
