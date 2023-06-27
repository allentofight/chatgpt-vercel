import { createSignal, onCleanup, onMount, Show } from "solid-js";

declare global {
  interface WindowEventMap {
    selectOption: CustomEvent<{ index: number, disabled: boolean }>;
  }
}

const options = [
  { title: 'GPT-3.5', description: 'GPT-3.5，仅对充值用户提供。此模型支持 4k token（大约 2000 字）的上下文会话' },
  { title: 'New Bing', description: 'New Bing 是微软最新推出的搜索引擎，底层基于 OpenAI ChatGPT 4 模型，可以让你和它进行智能对话，获取网上最新信息' },
  { title: 'GPT-4', description: '当今世界最强人工智能模型，此模型支持 8k token（大约 4000 字）的上下文会话' },
  { title: 'Midjourney', description: '世界知名 AI 绘画工具' },
];

function OptionSelector() {


  const [isGPT4, setGPT4] = createSignal(false);

  const [modelConfirmed, setModelConfirmed] = createSignal(false);

  function handleHover(isHover: boolean, index: number) {
    if (index == 1) {
      const target = document.querySelector('.gpt3-svg-target svg');
      if (target) {
        if (isHover) {
          target.classList.add('text-brand-green');
        } else if (isGPT4()) {
          target.classList.remove('text-brand-green');
        }
      }
    } else if (index == 2) {
      const target = document.querySelector('.gpt4-svg-target svg');
      if (target) {
        if (isHover) {
          target.classList.add('text-brand-purple');
        } else if (!isGPT4()) {
          target.classList.remove('text-brand-purple');
        }
      }
    }
  }

  onMount(() => {
    const selectOptionHandler = (event: CustomEvent<{ index: number, disabled: boolean }>) => {
      const index = event.detail.index;
      if (index == 1) {
        setGPT4(false)
      } else if (index == 3) {
        setGPT4(true)
      }
      console.log('index = ', index)
      setModelConfirmed(event.detail.disabled)
    };
    window.addEventListener("selectOption", selectOptionHandler);
    return () => {
      window.removeEventListener("selectOption", selectOptionHandler);
    };
  })

  return (
    <>
      <style>
        {`
        .transition-colors {
          transition-duration: .15s;
          transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
          transition-timing-function: cubic-bezier(.4,0,.2,1);
        }
        .text-brand-green {
          color: #19C37D;
        }
        .text-brand-purple {
          color: #AB68FF;
        }
      `}
      </style>
      <div class="w-full px-2 relative flex flex-col items-stretch justify-center gap-2 sm:items-center">
        <div class="relative flex rounded-xl bg-gray-100 p-1 text-gray-900 dark:bg-gray-900">
          <ul class="flex w-full list-none gap-1 sm:w-auto">
            <Show when={!modelConfirmed() || !isGPT4()}>
              <li class="group/toggle w-full"
                onMouseOver={() => handleHover(true, 1)}
                onMouseOut={() => handleHover(false, 1)}
                onClick={() => {
                  setGPT4(false)
                  const optionSelectedEvent = new CustomEvent("optionSelected", {
                    detail: {
                      index: 1,
                    },
                  });
                  window.dispatchEvent(optionSelectedEvent);
                }}
              ><button type="button" id="radix-:rd:" aria-haspopup="menu" aria-expanded="false" data-state="closed" class="w-full">
                  <div class={`group/button relative flex w-full items-center justify-center gap-1 rounded-lg py-3 outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5 border-black/10 text-gray-500 hover:!opacity-100 ${!isGPT4() ? 'border bg-white dark:border-[#4E4F60] dark:bg-gray-700 dark:text-gray-100 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)]' : 'hover:text-gray-800 hover:dark:text-gray-100'} gpt3-svg-target`}>
                    <span class="relative max-[370px]:hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" class={`h-4 w-4 transition-colors  ${!isGPT4() ? 'text-brand-green' : ''}`} width="16" height="16" stroke-width="2">
                        <path d="M9.586 1.526A.6.6 0 0 0 8.553 1l-6.8 7.6a.6.6 0 0 0 .447 1h5.258l-1.044 4.874A.6.6 0 0 0 7.447 15l6.8-7.6a.6.6 0 0 0-.447-1H8.542l1.044-4.874Z" fill="currentColor"></path>
                      </svg></span>
                    <span class="truncate text-sm font-medium md:pr-1.5 pr-1.5">GPT-3.5</span>
                  </div></button></li>
            </Show>
            <Show when={!modelConfirmed() || isGPT4()}>
              <li class="w-full hover-target"
                onMouseOver={() => handleHover(true, 2)}
                onMouseOut={() => handleHover(false, 2)}
                onClick={() => {
                  setGPT4(true)
                  const optionSelectedEvent = new CustomEvent("optionSelected", {
                    detail: {
                      index: 3,
                    },
                  });
                  window.dispatchEvent(optionSelectedEvent);
                }}
              >
                <button type="button" id="radix-:rf:" aria-haspopup="menu" aria-expanded="false" data-state="closed" class="w-full">
                  <div class={`relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 outline-none transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5 border-transparent text-gray-500 ${isGPT4() ? 'bg-white dark:border-[#4E4F60] border dark:bg-gray-700 dark:text-gray-100 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)]' : 'hover:text-gray-800 hover:dark:text-gray-100'}  gpt4-svg-target`}>
                    <span class="relative max-[370px]:hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" class={`h-4 w-4 transition-colors ${isGPT4() ? 'text-brand-purple' : ''}`} width="16" height="16" stroke-width="2">
                        <path d="M12.784 1.442a.8.8 0 0 0-1.569 0l-.191.953a.8.8 0 0 1-.628.628l-.953.19a.8.8 0 0 0 0 1.57l.953.19a.8.8 0 0 1 .628.629l.19.953a.8.8 0 0 0 1.57 0l.19-.953a.8.8 0 0 1 .629-.628l.953-.19a.8.8 0 0 0 0-1.57l-.953-.19a.8.8 0 0 1-.628-.629l-.19-.953h-.002ZM5.559 4.546a.8.8 0 0 0-1.519 0l-.546 1.64a.8.8 0 0 1-.507.507l-1.64.546a.8.8 0 0 0 0 1.519l1.64.547a.8.8 0 0 1 .507.505l.546 1.641a.8.8 0 0 0 1.519 0l.546-1.64a.8.8 0 0 1 .506-.507l1.641-.546a.8.8 0 0 0 0-1.519l-1.64-.546a.8.8 0 0 1-.507-.506L5.56 4.546Zm5.6 6.4a.8.8 0 0 0-1.519 0l-.147.44a.8.8 0 0 1-.505.507l-.441.146a.8.8 0 0 0 0 1.519l.44.146a.8.8 0 0 1 .507.506l.146.441a.8.8 0 0 0 1.519 0l.147-.44a.8.8 0 0 1 .506-.507l.44-.146a.8.8 0 0 0 0-1.519l-.44-.147a.8.8 0 0 1-.507-.505l-.146-.441Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    <span class="truncate text-sm font-medium md:pr-1.5">GPT-4</span>
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 md:hidden" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    </svg>
                  </div></button></li>
            </Show>
          </ul>
        </div>
      </div>
    </>

  );
}

export default OptionSelector;
