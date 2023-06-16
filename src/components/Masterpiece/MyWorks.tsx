import '../../styles/draw-mylist.css';
import '../../styles/preview.css';
import { onMount, createSignal, For, Show, createEffect, onCleanup } from 'solid-js';
import {
  fetchMjMessageList,
} from "~/utils/api"
import toast, { Toaster } from 'solid-toast';
import type { MjChatMessage } from "~/types"

import {
  getRequestImageSize
} from "~/utils"

interface Item {
  id: string;
  imageUrl: string;
  originUrl: string;
  prompt: string;
  gmtCreate: string;
}

function getExtensionFromQueryUrl(url: string): string {
  const urlObject = new URL(url);
  const imageUrl = urlObject.searchParams.get('img');
  if (imageUrl) {
    const imagePath = new URL(imageUrl).pathname;
    const extension = imagePath.substring(imagePath.lastIndexOf('.'), imagePath.length);
    return extension;
  } else {
    throw new Error('Image URL not found in query parameters');
  }
}

export default function MyWorks() {
  const [messageList, setMessageList] = createSignal<Item[]>([])
  let [hasMore, setHasMore] = createSignal(true);
  let [showImgPreview, setShowImgPreview] = createSignal(false);
  let [curIndex, setCurIndex] = createSignal(0);
  let [isLoadingMore, setIsLoadingMore] = createSignal(false);
  const [viewportWidth, setViewportWidth] = createSignal(window.innerWidth);
  const [chunks, setChunks] = createSignal<Item[][]>([]);

  let [currentImage, setCurrentImage] = createSignal('');
  let [nextImage, setNextImage] = createSignal('');
  let [isLoading, setIsLoading] = createSignal(false);
  let [shouldAnimate, setShouldAnimate] = createSignal(false);

  function downloadImage(): void {
    let url = messageList()[curIndex()].originUrl
    let filename = 'download' + getExtensionFromQueryUrl(url)
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const element = document.createElement('a');
        element.href = blobUrl;
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error(err));
  }

  const showPreview = (id: string) => {
    setShowImgPreview(true)
    for (let index = 0; index < messageList().length; index++) {
      const item = messageList()[index];
      if (item.id === id) {
        setCurIndex(index)
        setCurrentImage(messageList()[curIndex()].originUrl);
      }
    }
  };

  createEffect(() => {
    if (shouldAnimate()) {
      let timeout = setTimeout(() => {
        setShouldAnimate(false);
      }, 500);

      onCleanup(() => clearTimeout(timeout));
    }
  });


  let scrollContainer: HTMLDivElement;

  createEffect(() => {
    if (messageList().length) {
      const chunkSize = viewportWidth() > 768 ? 4 : 2;
      const chunksArray: Item[][] = Array(chunkSize).fill(0).map(() => []);

      messageList().forEach((item, index) => {
        const chunkIndex = index % chunkSize;
        chunksArray[chunkIndex].push(item);
      });

      setChunks(chunksArray);
    }
  });

  onMount(() => {
    // Run once on mount
    fetchMessageList()

    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      scrollContainer.removeEventListener('scroll', handleScroll);
    }
  });

  const handleScroll = () => {
    if (!hasMore() || isLoadingMore()) {
      return
    }
    const offset = 20; // offset from bottom to trigger loading more
    if (scrollContainer.scrollHeight - scrollContainer.scrollTop > scrollContainer.clientHeight + offset) {
      return;
    }


    setIsLoadingMore(true);
    fetchMessageList(() => {
      setIsLoadingMore(false);
    });
    console.log('begin scroll....')
  };

  function fetchMessageList(onComplete?: () => void) {
    let earliestGmtCreate = messageList().length > 0 ? messageList()[messageList().length - 1].gmtCreate : ""
    fetchMjMessageList(earliestGmtCreate).then((data) => {
      data.list.sort((a: MjChatMessage, b: MjChatMessage) => new Date(b.gmtCreate!).getTime() - new Date(a.gmtCreate!).getTime());
      let result = data.list.map(item => {
        let imageSizeRes = getRequestImageSize(item.imageUrl, '300x300')
        return {
          id: item._id,
          prompt: item.prompt,
          imageUrl: imageSizeRes.previewUrl,
          originUrl: imageSizeRes.originUrl,
          gmtCreate: item.gmtCreate,
        } as Item
      }).filter(item => {
        return item.imageUrl?.length > 0
      })

      setHasMore(data.hasMore)

      setMessageList([...messageList(), ...result])

      if (onComplete) {
        onComplete();
      }
    }).catch(error => {
      if (onComplete) {
        onComplete();
      }
      console.log('error.message = ', error.message)
      console.error('fetch messageList error:', error)
    })
  }


  return (
    <div class="flex flex-col flex-1 overflow-hidden w-full">
      <div class="py-6 w-full">
        <div class="text-3xl text-center pb-4">
          <span class="logo"> 您的创作记录以及收藏都在这里啦 </span>
        </div>
        <div class="flex items-center justify-center">
          <div class="nav flex rounded-xl cursor-pointer">
            <div class="nav-text inline-block text-sm py-2 px-6 text-center font-medium active">
              创作记录
            </div>
            <div class="nav-hr h-auto w-px"></div>
            <div class="nav-text inline-block text-sm py-2 px-6 text-center font-medium" onClick={() => {
              toast.success('此功能即将上线，敬请期待!')
            }}>
              收藏记录
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mx-auto max-w-screen-xl h-12 header flex items-center justify-between px-10 pb-4">
        <div class="text text-xs">
          全部作品
        </div>
        <div >
          <div class="w-6 h-6 rounded bor flex items-center justify-center cursor-pointer">
            <i class="iconfont  icon-huihuajilu-xuanze span text-xl"></i>
          </div>
        </div>
      </div>
      <div class="list flex-1 overflow-y-auto flex justify-center" ref={(el) => (scrollContainer = el)}>
        <div class="md w-full max-w-screen-xl px-8 h-fit min-h-full flex flex-col">
          <Show when={chunks().length}>
            <div class="flex flex-wrap">
              <For each={chunks()}>
                {chunk => (
                  <div class="container flex-1">
                    <For each={chunk}>
                      {item => (
                        <div class="item" onClick={() => showPreview(item.id)}>
                          <div class="w-full rounded-2xl overflow-hidden relative">
                            <img alt="" class="w-full cursor-pointer" src={item.imageUrl} />
                            <div class="absolute bottom-0 left-0 w-full p-2">
                              <div class="hover w-full rounded-2xl py-3 px-4">
                                <div class="text text-base">{item.prompt}</div>
                                <div class="flex items-center justify-between pt-4">
                                  <div class="btn h-9 w-24 rounded-full text-sm leading-9 text-center cursor-pointer">
                                    画同款
                                  </div>
                                  <div class="flex items-center">
                                    <div class="icon rounded-xl w-9 h-9 flex items-center justify-center mr-3 cursor-pointer" title="下载">
                                      <i class="iconfont  icon-guanjiancixinxi-xiazai i text-xl"></i>
                                    </div>
                                    <div class="icon rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer" title="收藏">
                                      <i class="iconfont  icon-guanjiancixinxi-shoucang i text-xl"></i>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </For>
            </div>
          </Show>
          <Show when={!messageList().length}>
            <div class="flex flex-1 h-full items-center flex-col justify-center">
              <img alt="" class="img w-40" src="/images/draw-left-empty.png" />
              <img alt="" class="img1 w-40" src="/images/draw-left-empty1.png" />
              <div class="text1 text-xs pt-3">
                还没有绘画记录哦
              </div>
            </div>
            <div class="flex flex-1 h-full items-center flex-col justify-center" style="display: none;">
              <img alt="" class="w-52" src="https://jchd-chat.oss-cn-hangzhou.aliyuncs.com/images/draw-center-empty.png" />
              <div class="text1 text-xs pt-3">
                您还没有收藏哦！
              </div>
            </div>
          </Show>
        </div>
      </div>
      <Show when={showImgPreview()}>
        <div class="preview_bg">
          <div class="preview">
            <div class="close" onClick={() => {
              setShowImgPreview(false)
            }}>
              <i class="iconfont  icon-guanbi icon"></i>
            </div>
            <Show when={curIndex() > 0}>
              <div class="prev" onClick={() => {
                setCurIndex(curIndex() - 1)
                setNextImage(messageList()[curIndex()].originUrl)
                console.log('next = ', nextImage())
                // After a brief delay, make the next image the current image
                setIsLoading(true);
                setTimeout(() => {
                  setCurrentImage('');
                  setTimeout(() => {
                    setCurrentImage(nextImage());
                    setNextImage("");
                  }, 0)

                  setIsLoading(false);
                }, 300); // 500ms = 0.5s
              }}>
                <i class="iconfont  icon-shangyiyehoutuifanhui icon"></i>
              </div>
            </Show>

            <Show when={curIndex() < messageList().length - 1}>
              <div class="next" onClick={() => {
                setCurIndex(curIndex() + 1)
                setNextImage(messageList()[curIndex()].originUrl)
                console.log('next = ', nextImage())
                // After a brief delay, make the next image the current image
                setIsLoading(true);
                setTimeout(() => {
                  setCurrentImage('');
                  setTimeout(() => {
                    setCurrentImage(nextImage());
                    setNextImage("");
                  }, 0)

                  setIsLoading(false);
                }, 300); // 500ms = 0.5s
              }}>
                <i class="iconfont  icon-xiayiyeqianjinchakangengduo icon"></i>
              </div>
            </Show>
            <div class="preview_view">
              <img alt="" src={currentImage()} class={`preview-img ${isLoading() ? "list-leave-active list-leave-to" : ""}`} />
              <Show when={isLoading()}>
                <img alt="" src={nextImage()} class="preview-img list-enter-active list-enter-to" />
              </Show>
            </div>
            <div class="buttons">
              <div class="buttons_view">
                <div class="download-container" onClick={() => {
                  downloadImage()
                }}>
                  <i class="iconfont  icon-download-one icon" title="下载"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
      <Toaster position="top-center" />
    </div>
  )
}