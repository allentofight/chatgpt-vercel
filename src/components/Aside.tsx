import { createEffect, createSignal, Show, onCleanup } from 'solid-js';

import ChatIcon from './ChatIcon'
import ChatEdit from './ChatEdit'
import ChatConfirm from './ChatConfirm'
import DeleteConfirm from './DeleteConfirm'
import { useAuth } from "~/utils/useAuth"
import { setSharedStore } from './store'

interface Chat {
  id: number;
  name: string;
}

export default function ChatContainer() {
  const [chats, setChats] = createSignal<Chat[]>([
    { id: 1, name: 'Div shows last characters.' },
    { id: 2, name: 'Chat 1' },
    { id: 3, name: 'Chat 2' },
  ]);

  const initialItem: Chat = chats().length > 0 ? chats()[0] : { id: 0, name: "Empty chat" }

  const [selectedChat, setSelectedChat] = createSignal<Chat>(initialItem);

  const [page, setPage] = createSignal<number>(1);
  const [loading, setLoading] = createSignal<boolean>(false);

  const [hasScrollbar, setHasScrollbar] = createSignal(false);


  let divRef: HTMLDivElement;
  let contentRef: HTMLDivElement;
  let contentContainerRef: HTMLDivElement;
  let inputRef: HTMLInputElement;

  const [isEditable, setIsEditable] = createSignal(false);
  const [isDeletable, setIsDeletable] = createSignal(false);

  function edit() {
    setIsEditable(!isEditable());
  }

  function del() {
    // setSelectedChat({ id: 0, name: "Empty chat" })
    setIsDeletable(true)
  }

  function confirmDel() {
    let filteredChats = chats().filter(item => {
      return item.id !== selectedChat().id
    })
    setChats(filteredChats)
    setSelectedChat({ id: 0, name: "Empty chat" })
    setIsDeletable(false)
  }

  function cancelDel() {
    setIsDeletable(false)
  }


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
      selectedChat().name = newName
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const newName = inputRef.value || '';
      if (newName !== '') {
        selectedChat().name = newName
      }
      inputRef.blur();
    }
  }

  function confirmChatEdit() {
    console.log('confirmChatEdit....')
  }

  function cancelChatEdit() {
    console.log('cancelChatEdit....')
  }

  const createChat = () => {

    const { isLogin } = useAuth()

    if (!isLogin()) {
      setSharedStore('message', { type: 'loginRequired' })
      return
    }

    setSelectedChat({ id: 0, name: "Empty chat" })

    setSharedStore('message', { type: 'newChat' })

    // setHasScrollbar(contentRef.scrollHeight > contentContainerRef.clientHeight);
  };

  const fetchChats = async (pageNum: number) => {
    setLoading(true);
    // Replace this with your actual API call
    const response = await new Promise<{ data: Chat[] }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            data: Array.from({ length: 10 }, (_, i) => ({
              id: i + 1 + (pageNum - 1) * 10,
              name: `Chat ${i + 1 + (pageNum - 1) * 10}`,
            })),
          }),
        500
      )
    );

    setChats([...chats(), ...response.data]);
    setLoading(false);
  };

  const loadMoreChats = () => {
    setPage(page() + 1);
  };


  /**
  createEffect(() => {
    fetchChats(page());
  });
  */

  return (
    <>
      <style>
        {`
          .btn-dark {
            --tw-border-opacity: 1;
            --tw-bg-opacity: 1;
            --tw-text-opacity: 1;
            background-color: rgba(52,53,65,var(--tw-bg-opacity));
            border-color: rgba(86,88,105,var(--tw-border-opacity));
            border-width: 1px;
            color: rgba(255,255,255,var(--tw-text-opacity))
          }
          
          .btn-dark:hover {
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
          


          @media (min-width:768px) {
            .scrollbar-trigger ::-webkit-scrollbar-thumb {
              visibility: hidden
            }
          
            .scrollbar-trigger:hover ::-webkit-scrollbar-thumb {
              visibility: visible
            }
          }
        `}
      </style>
      <aside class="dark left-0 top-0 h-full hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col">
        <div class="flex h-full min-h-0 flex-col ">
          <div class="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
            <nav class="flex h-full flex-1 flex-col space-y-1 p-2">
              <a class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20" onClick={createChat}>
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>New chat</a>
              <div
                ref={(el) => (contentContainerRef = el)}
                class={`flex-col flex-1 overflow-y-auto border-b border-white/20 ${hasScrollbar() ? '-mr-2' : ''}`}>
                <div
                  ref={(el) => (contentRef = el)}
                  class="flex flex-col gap-2 text-gray-100 text-sm">

                  {chats().map((chat) => (
                    <>
                      <Show when={chat.id !== selectedChat().id}>
                        <a class="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group" onClick={() => {
                          let selectedChats = chats().filter(item => item.id === chat.id)
                          setSelectedChat(selectedChats[0])
                        }}>
                          <ChatIcon />
                          <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                            {chat.name}
                            <div class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
                          </div></a>
                      </Show>
                      <Show when={chat.id === selectedChat().id}>
                        <Show when={!isEditable()}>
                          <Show when={!isDeletable()}>
                            <a class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-gray-800 hover:bg-gray-800 group">
                              <ChatIcon />
                              <div
                                ref={(el) => (divRef = el)}
                                class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative"
                              >
                                {selectedChat().name}
                              </div>
                              <div class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800" contenteditable={false}></div>
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
                                Delete &quot;{selectedChat().name}&quot;?
                                <div class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800"></div>
                              </div>
                              <DeleteConfirm
                                confirmDelete={confirmDel}
                                cancelDelete={cancelDel} />
                            </a>
                          </Show>
                        </Show>
                        <Show when={isEditable()}>
                          <div class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer hover:pr-14 break-all pr-14 bg-gray-800 hover:bg-gray-800">
                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 flex-shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <input
                              onKeyDown={handleKeydown}
                              onBlur={handleBlur}
                              ref={(el) => (inputRef = el)}
                              type="text" class="input-field text-sm border-none bg-transparent p-0 m-0 w-full mr-0"
                              value={selectedChat()?.name} />
                            <ChatConfirm
                              cancel={cancelChatEdit}
                              edit={confirmChatEdit} />
                          </div>
                        </Show>
                      </Show>
                    </>
                  ))}

                  <Show when={hasScrollbar()}>
                    <button class="btn relative btn-dark btn-small m-auto mb-2">
                      <div class="flex w-full items-center justify-center gap-2">
                        Show more
                      </div></button>
                  </Show>
                </div>
              </div>
              <a class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>Clear conversations</a>
              <a class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>Dark mode</a>
              <a class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>My account</a>
              <a href="https://help.openai.com/en/collections/3742473-chatgpt" target="_blank" class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>Updates &amp; FAQ</a>
              <a class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>Log out</a>
            </nav>
          </div>
        </div>
      </aside >
    </>
  );
}
