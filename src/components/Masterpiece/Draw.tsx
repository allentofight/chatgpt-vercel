import '../../styles/masterpiece.css';

import { onMount, createSignal, For, Show, createEffect, onCleanup } from 'solid-js';
import type { MjChatMessage } from "~/types"
import { RootStore } from "~/store"
import {
  getRequestImageSize
} from "~/utils"
import { Spinner, SpinnerType } from 'solid-spinner';
import { picOptions, keyWords } from "./types"
import { copyToClipboard } from "~/utils"
import toast, { Toaster } from 'solid-toast';
import LoginGuideDialog from '../LoginGuideDialog'
import VipChargeDialog from '../VipChargeDialog'
import ImageViewer from './ImageViewer'
import { fetchUserInfo, queryPromptStatus } from "~/utils/api"
import { sendMjTranslate } from "~/utils/api"

import {
  delMjMessage,
  updateMjMessage,
  fetchMjMessageList,
  sendMjPrompt,
} from "~/utils/api"
import { isMobile } from "~/utils"
import { useAuth } from "~/utils/useAuth"

export default function Draw(props: {
  showMoreClick: () => void
}) {
  const [imageContainerRef, setImageContainerRef] = createSignal<HTMLDivElement>();

  const [largeImageRef, setLargeImageRef] = createSignal<HTMLDivElement>();
  const [drawingProgress, setDrawingProgress] = createSignal('0%');
  const [uploadedImageUrls, setUploadedImageUrls] = createSignal<string[]>([]);
  const [activeIndex, setActiveIndex] = createSignal(-1);

  // 英文关键词显示 copy
  const [showEnPromptCopy, setShowEnPromptCopy] = createSignal(true);
  const [isOptimizePrompt, setIsOptimizePrompt] = createSignal(false);
  const [isUploading, setIsUploading] = createSignal(false);
  const [inputText, setInputText] = createSignal('');
  const [showLoginDirectDialog, setShowLoginDirectDialog] = createSignal(false)
  const [showErrorHint, setShowErrorHint] = createSignal(false)


  const [showImageViewer, setShowImageViewer] = createSignal(false)

  // 默认为 1，放大，变体皆可用，2 为已放大后的图片
  const [type, setType] = createSignal(1);

  // U, V 按钮
  const [command, setCommand] = createSignal('');
  const [showVipDialog, setShowVipDialog] = createSignal(false);

  let [isLoadingMore, setIsLoadingMore] = createSignal(false);

  const { store, setStore } = RootStore

  // mj 正在汇制图片
  const [isMjWorking, setIsMjWorking] = createSignal(false);
  const [mjWorkingPrompt, setMjWorkingPrompt] = createSignal('');

  // 原始关键词显示 copy
  const [showOriginPromptCopy, setShowOriginPromptCopy] = createSignal(true);

  // 比例选择
  const [picRatioIndex, setPicRatioIndex] = createSignal(0);
  const [keywordsIndex, setKeywordsIndex] = createSignal(0);
  const [messageList, setMessageList] = createSignal<MjChatMessage[]>([])
  let [hasMore, setHasMore] = createSignal(true);
  const [originImageUrl, setOriginImageUrl] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(true);
  const [assistantHintIndex, setAssistantHintIndex] = createSignal(0);

  let intervalId: number;

  let assistantHints = [
    '选择了右侧关键词推荐后，再优化一次关键词，会有意想不到的收获哦~',
    '输入框的关键词描述能让你的指令更加完善哦~',
    '想画自己的专属头像，记得右上角垫上自己的自拍照哦~',
    '记得可以上传多张垫图哦~',
    '关键词越多，描述内容越复杂，生成时间会越久哦~',
    '广场资源多多，去找找你喜欢的一键生成同款吧！',
    '遇到喜欢的图片，记得一键收藏哦～',
    '创作记录都在左侧哦，点击即可出现相关信息',
  ]

  // 查询绘图进度次数
  let processQueryCount = 0

  let previousIndex = -1;
  let [isAssistantHintVisible, setIsAssistantHintVisible] = createSignal(false);
  createEffect(() => {
    if (isMjWorking() && activeIndex() === -1) {
      if (previousIndex === -1) {
        setIsAssistantHintVisible(true)
      }
      intervalId = window.setInterval(() => {
        let index = assistantHintIndex() + 1;
        if (index > assistantHints.length - 1) {
          index = 0
        }
        setIsAssistantHintVisible(false);
        setTimeout(() => {
          previousIndex = assistantHintIndex();
          setAssistantHintIndex(index);
          setIsAssistantHintVisible(true);
        }, 200);
      }, 6000);
    } else {
      clearInterval(intervalId)
      previousIndex = -1
    }

    onCleanup(() => {
      clearInterval(intervalId)
    })
  })

  createEffect(() => {
    if (!messageList().length || activeIndex() === -1) {
      return
    }
    setIsLoading(true)
    handleResize()
  })

  createEffect(() => {
    if (messageList().length > 0 && previewListRef()) {
      previewListRef()!.addEventListener('scroll', handleScroll);
      onCleanup(() => {
        previewListRef()!.removeEventListener('scroll', handleScroll);
      });
    }
  });

  createEffect(() => {

    let ratioInfos = ['1:1', '1:2', '3:4', '4:3', '9:16']

    if (picRatioIndex() > -1) {
      let regex = /(--ar )(\d+:\d+)/;
      let prompt = textareaRef()!.value
      let match = prompt.match(regex);
      if (match) {
        if (picRatioIndex() < 5) {
          textareaRef()!.value = prompt.replace(match[2], ratioInfos[picRatioIndex()])
        } else {
          ratioInputChange()
        }
        console.log(match[0]);  // Prints: "9:16"
      } else if (textareaRef()!.value) {
        if (picRatioIndex() < 5) {
          textareaRef()!.value = prompt + ' --ar ' + ratioInfos[picRatioIndex()]
        } else {
          ratioInputChange()
        }
        console.log('No aspect ratio found');
      }
    }
  })

  const handleResize = () => {

    if (!imageContainerRef()) {
      return
    }

    if (activeIndex() === -1) {
      return
    }

    let containerWidth = imageContainerRef()!.offsetWidth
    let containerHeight = imageContainerRef()!.offsetHeight
    let imageSize = messageList()[activeIndex()].imageSize
    if (imageSize) {
      let [width, height] = imageSize.split('x').map(Number);
      // Limits
      const targetAspectRatio = containerWidth / containerHeight;

      // Determine the image's aspect ratio
      const imageAspectRatio = width / height;

      // Calculate new dimensions based on aspect ratios
      let newWidth, newHeight;
      if (imageAspectRatio > targetAspectRatio) {
        // If image aspect ratio is greater than target, limit by width
        newWidth = containerWidth;
        newHeight = Math.round(newWidth / imageAspectRatio);
      } else {
        // If image aspect ratio is less than target, limit by height
        newHeight = containerHeight;
        newWidth = Math.round(newHeight * imageAspectRatio);
      }

      let imageRef = largeImageRef()
      if (imageRef) {
        imageRef.style.maxWidth = `${newWidth}px`;
        imageRef.style.maxHeight = `${newHeight}px`;
      }
      setOriginImageUrl(messageList()[activeIndex()].originImageUrl)
    }
  }

  function closeVipDialog() {
    setShowVipDialog(false)
  }

  function deleteMj() {
    let messageId = messageList()[activeIndex()].messageId
    delMjMessage(messageId)

    let updatedList = [...messageList()] // Create a copy of the current list
    updatedList.splice(activeIndex(), 1) // Remove the item from the copied list
    setMessageList(updatedList) // Update the signal with the new list

    setActiveIndex(-1)
  }

  function containsChineseCharacters(str: string) {
    const regex = /[\u4E00-\u9FFF]/;
    return regex.test(str);
  }

  const scrollToTop = (element: HTMLDivElement, time = 50) => {
    const scrollDuration = time;
    const scrollHeight = element.scrollTop;
    const scrollStep = Math.PI / (scrollDuration / 15);
    const cosParameter = scrollHeight / 2;
    let scrollCount = 0,
      scrollMargin,
      scrollInterval: number;

    scrollInterval = window.setInterval(function () {
      if (!element) return clearInterval(scrollInterval);
      if (element.scrollTop != 0) {
        scrollCount = scrollCount + 1;
        scrollMargin =
          cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
        element.scrollTop = scrollHeight - scrollMargin;
      } else clearInterval(scrollInterval);
    }, 15);
  };

  interface MjSendBody {
    prompt?: string,
    messageId?: string,
    button?: string,
  }

  async function beginDrawing() {

    if (!checkQualification()) {
      return
    }

    let prompt = textareaRef()?.value
    if (!prompt) {
      return
    }

    if (isMjWorking()) {
      return
    }

    // prompt 智能生成可能会有 {}
    prompt = prompt.replace('{', '')
    prompt = prompt.replace('}', '')
    prompt = uploadedImageUrls().join(' ') + ' ' + prompt


    try {
      prompt = rearrangePrompt(prompt);
      console.log(prompt);
    } catch (error) {
      console.log('error = ', error)
      return
    }

    if (!isPromptValid(prompt)) {
      return
    }


    setIsMjWorking(true)
    setActiveIndex(-1)
    textareaRef()!.value = ''
    autoResize()
    if (previewListRef()) {
      scrollToTop(previewListRef()!)
    }

    prompt = prompt.replace(/--seed \d+\s+/g, '');
    prompt = `${prompt} --seed ${generateSeed()}`
    setMjWorkingPrompt(prompt)
    let body: MjSendBody = {
      prompt
    }
    sendPrompt(body)
  }

  function generateSeed() {
    let min = 0;
    let max = 100000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function upscaling(command: string) {
    if (!checkQualification()) {
      return
    }
    let message = messageList()[activeIndex()]
    if (message.clickedButtons?.includes(command)) {
      toast.error(`${command}已点击过，不可重复点击哦`)
      return
    }
    let body: MjSendBody = {
      messageId: message.messageId,
      button: command,
      prompt: message.prompt,
    }
    updateMjMessage({
      messageId: message.messageId,
      clickedEvent: JSON.stringify([command]),
    })
    message.clickedButtons?.push(command)
    setCommand(command)
    setIsMjWorking(true)
    setActiveIndex(-1)
    setMjWorkingPrompt(message.prompt!)
    sendPrompt(body)
  }

  function checkQualification() {
    const { isMjExpired, isLogin } = useAuth()

    if (!isLogin()) {
      setShowLoginDirectDialog(true)
      return false
    }

    fetchUserInfo()

    let storageKey = 'mj_try_cnt'
    let mjCnt = parseInt(localStorage.getItem(storageKey) || '0');
    if (isMjExpired() && mjCnt > 5) {
      toast.error('VIP 会员已过期，请及时充值哦');
      setShowVipDialog(true)
      return false
    }
    mjCnt++
    localStorage.setItem(storageKey, mjCnt.toString())
    return true
  }

  function isPromptValid(prompt: string) {
    // Define the regular expression for each parameter with their arguments included
    const aspectRegex = /--(aspect|ar) \d+:\d+/;
    const chaosRegex = /--chaos \d{1,3}/;
    const noRegex = /--no [a-zA-Z]+/;
    const qualityRegex = /--(quality|q) (0?\.25|0\.5|1)/;
    const repeatRegex = /--(repeat|r) [1-9]\d?|40/;
    const seedRegex = /--seed \d{1,10}/;
    const stopRegex = /--stop [1-9]\d?|100/;
    const stylizeRegex = /--(stylize|s) \d+/;
    const tileRegex = /--tile/;
    const versionRegex = /--(v|version) (1|2|3|4|5|5\.1|5\.2)/;
    const nijiRegex = /--niji( (4|5))?/;
    const iwRegex = /--iw\s+(-?\d+(\.\d+)?)/

    const allParametersRegex = [aspectRegex, chaosRegex, noRegex, qualityRegex, repeatRegex, seedRegex, stopRegex, stylizeRegex, tileRegex, versionRegex, nijiRegex, iwRegex];

    let replacedPrompt = allParametersRegex.reduce((currentPrompt, regex) => {
      return currentPrompt.replace(regex, '');
    }, prompt);

    // Additional cleanup for any remaining "--no " 
    replacedPrompt = replacedPrompt.replace(/--no /g, '');

    // Trim leading and trailing spaces, then check if there are still any '--' left in the replacedPrompt, which indicates invalid parameters
    const trimmedReplacedPrompt = replacedPrompt.trim();
    if (trimmedReplacedPrompt.includes('--')) {
      toast.error('参数错误，请修改后再试')
      return false;
    }

    // Now we check the mutual exclusion of --seed and --repeat
    const seedMatch = seedRegex.test(prompt);
    const repeatMatch = repeatRegex.test(prompt);

    if (seedMatch && repeatMatch) {
      toast.error('--seed 不能与 --repeat 一起用')
      return false;
    } else {
      return true;
    }
  }

  type PromptParams = {
    [param: string]: RegExp;
  }

  const rearrangePrompt = (prompt: string): string => {
    // Define parameters that should have values
    const paramsWithValue: string[] = ['--aspect', '--ar', '--chaos', '--quality', '--q', '--repeat', '--r', '--seed', '--stop', '--stylize', '--s', '--v', '--version', '--no', '--niji'];

    // Define valid values for the parameters
    const validValues: PromptParams = {
      '--aspect': /^(?:\d+:\d+)$/,
      '--ar': /^(?:\d+:\d+)$/,
      '--chaos': /^(?:\d+)$/,
      '--quality': /^(?:.25|0.5|1)$/,
      '--q': /^(?:.25|0.5|1)$/,
      '--repeat': /^(?:[1-9]|[1-3][0-9]|40)$/,
      '--r': /^(?:[1-9]|[1-3][0-9]|40)$/,
      '--seed': /^(?:[0-9]+)$/,
      '--stop': /^(?:[1-9][0-9]|100)$/,
      '--stylize': /^(?:[0-9]+)$/,
      '--s': /^(?:[0-9]+)$/,
      '--v': /^(?:1|2|3|4|5|5.1|5.2)$/,
      '--niji': /^(?:4|5)$/,
      '--version': /^(?:1|2|3|4|5|5.1|5.2)$/,
      '--no': /^(?:\w+)$/
    };

    // Split prompt into an array of words
    let words: string[] = prompt.split(' ');

    let params: string[] = [];
    let nonParams: string[] = [];

    // Iterate over words to find parameters
    for (let i = 0; i < words.length; i++) {
      if (words[i].startsWith('--')) {
        // If word is a parameter, add it and its value (if it exists and is valid) to params
        let parameter = words[i].split(',')[0]; // separate parameter from any text following a comma
        params.push(parameter);
        if (i + 1 < words.length && !words[i + 1].startsWith('--') && paramsWithValue.includes(parameter)) {
          let nextWords: string[] = words[i + 1].split(',');
          if (validValues[parameter].test(nextWords[0])) {
            params.push(nextWords.shift() as string);
            words[i + 1] = nextWords.join(',');
          }
        }
      } else {
        // If word is not a parameter, add it to nonParams
        nonParams.push(words[i]);
      }
    }

    // Create a new array where parameters are moved to the end
    let rearrangedWords: string[] = [...nonParams, ...params];

    // Convert array back into a string
    let rearrangedPrompt: string = rearrangedWords.join(' ');

    rearrangedPrompt = rearrangedPrompt.trim().replace(/\s\s+/g, ' ');
    return rearrangedPrompt;
  }


  const queryDrawingProcess = async (messageId: string) => {
    try {
      const res = await queryPromptStatus(messageId)
      processQueryCount++

      if (res?.status !== 'SUCCESS') {
        let fiveMinutes = 5 * 60 * 1000
        if (processQueryCount * 5000 > fiveMinutes) {
          res.status = 'FAILURE'
          res.failReason = '任务超时，请重试'
        }
      }

      if (res?.status === 'SUCCESS') {
        processQueryCount = 0
        clearInterval(queryIntervalId)
        let imageSizeRes = getRequestImageSize(res.imageUrl, '358x358')
        let isUpscaling = command().startsWith('U')
        setMessageList((prev) => [
          {
            role: isUpscaling ? 'variation' : 'prompt',
            content: res.prompt,
            prompt: res.prompt,
            messageId: res.id,
            buttonMessageId: '',
            clickedButtons: [],
            type: isUpscaling ? 2 : 1,
            imageSize: res.imageSize,
            imageUrl: imageSizeRes.previewUrl,
            originImageUrl: imageSizeRes.originUrl,
          } as MjChatMessage,
          ...prev,
        ]);

        setIsMjWorking(false)
        if (activeIndex() === -1) {
          setActiveIndex(0)
        }
        setType(isUpscaling ? 2 : 1)
        setShowErrorHint(false)
      } else if (res?.status === 'FAILURE') {
        setIsMjWorking(false)
        processQueryCount = 0
        clearInterval(queryIntervalId)

        setMessageList((prev) => [
          {
            role: 'error',
            content: res.prompt,
            prompt: res.prompt,
            messageId: res.id,
            imageUrl: '',
            errorMessage: res.failReason
          } as MjChatMessage,
          ...prev,
        ]);

        setShowErrorHint(true)
        setActiveIndex(0)
      } else if (res?.status === 'IN_PROGRESS') {
        setDrawingProgress(res.progress.length > 0 ? res.progress : '0%')
      }
    } catch (error) {
      setIsMjWorking(false)
      processQueryCount = 0
      console.error('Error fetching data:', error);
    }
  };

  let queryIntervalId: number;
  async function sendPrompt(body: MjSendBody) {
    setStore('currentAssistantMessage', '')
    setDrawingProgress('0%')

    if (containsChineseCharacters(body.prompt!)) {
      let translateRes = await sendMjTranslate({ prompt: body.prompt! })
      body.prompt = translateRes.message.content
      setMjWorkingPrompt(body.prompt!)
    }

    let res = await sendMjPrompt(body)
    queryIntervalId = window.setInterval(() => queryDrawingProcess(res.messageId), 5000);

  }

  createEffect(() => {
    if (store.currentAssistantMessage) {
      if (textareaRef()) {
        textareaRef()!.value = store.currentAssistantMessage
        autoResize();
      }
    }
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift+Enter was pressed
        // Here, just let the event continue so a newline is inserted
      } else {
        // Enter was pressed
        event.preventDefault();  // Prevent the newline
        beginDrawing()
      }
    }
  };

  function getFinalPrompt(inputVal: string) {
    return `
    Act as a High Quality images generator. I will give you the context of that I want to make the prompt about and you will make the High quality image description for me. The High Quality Image is always described objectively. It describes what can be seen on the High Quality Image description, as an image.
    
    Example output:
    
    The website mockup portrays a visually stunning food advertisement featuring a regal and commanding figure mounted on a majestic white stallion. The powerful creature is depicted with flowing mane and tail whipping in the breeze, while the rider exudes confidence and determination, holding a staff of great importance in one hand and expertly guiding the steed with the other. The breathtaking landscape surrounding them is a vista of rolling hills, verdant forests, and sparkling waterways under a vibrant and captivating sky, painted with soft pastels to deep, rich hues. The intricate details and lifelike qualities of the horse, rider, and environment are expertly captured through digital illustration with warm, inviting tones, evoking a sense of wonder and awe that is sure to leave a lasting impression --ar 9:16
    
    Basic Parameters:
    * Aspect Ratio: use --aspect or --ar followed by the ratio to change the aspect ratio of the image, such as --aspect 1:1 for a square image.
    * Chaos: use --chaos followed by a number from 0 to 100 to adjust how varied the results will be, with 0 being less varied and 100 being more varied.
    * No: use --no followed by the element to remove it from the image, such as --no plants to remove plants from the image.
    * Quality: use --quality or --q followed by a number, the number can only be selected from .25 or 0.5 or 1 to set the rendering quality to a lower or higher level, such as --quality .5.
    * Repeat: use --repeat or --r followed by a number from 1 to 40 to create multiple jobs from a single prompt, such as --repeat 3 to create three jobs.
    * Seed: use --seed followed by an integer between 0 and 4294967295 to set the seed number for generating the initial image grids, such as --seed 12345.
    * Stop: use --stop followed by an integer between 10 and 100 to finish a job partway through the process, such as --stop 30.
    * Stylize: use --stylize or --s followed by a number to apply Midjourney's default aesthetic style to the image more strongly, such as --stylize 500.
    * Tile: use --tile to generate images that can be used as repeating tiles to create seamless patterns.
    * Uplight: use --uplight to use an alternative "light" upscaler when selecting the U buttons.
    * Upbeta: use --upbeta to use an alternative beta upscaler when selecting the U buttons.
    
    You answer only with this syntax:
    
    {High Quality Website Mockups description in one paragraph} {parameters}
    
    Context: ${inputVal} `

  }

  async function fetchPrompt() {

    let inputVal = textareaRef()?.value as string;
    let response = await fetch('/api/prompt', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: getFinalPrompt(inputVal),
        }],
        temperature: 0.6,
        password: '',
        model: 'gpt-3.5-turbo-16k'
      }),
    })

    if (!response.ok) {
      const res = await response.json()
      throw new Error(res.error.message)
    }
    const data = response.body
    if (!data) {
      throw new Error("没有返回数据")
    }
    const reader = data.getReader()
    const decoder = new TextDecoder("utf-8")
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      if (value) {
        let char = decoder.decode(value)
        if (char) {
          setStore("currentAssistantMessage", k => k + char)
        }
      }
      done = readerDone
    }
    setPicRatioIndex(-1)
    setIsOptimizePrompt(false)
    setStore("currentAssistantMessage", '')
  }

  function fetchMessageList(onComplete?: () => void) {
    let earliestGmtCreate = messageList().length > 0 ? messageList()[messageList().length - 1].gmtCreate : ""
    fetchMjMessageList(earliestGmtCreate).then((data) => {
      let result = data.list.map(item => {
        let imageSizeRes = getRequestImageSize(item.imageUrl, '600x600')
        return {
          role: item.errorMessage?.length ? 'error' : (item.type == 1 ? 'prompt' : 'variation'),
          prompt: item.prompt,
          gmtCreate: item.gmtCreate,
          seed: item.seed,
          content: item.prompt + (item.ref ?? ''),
          buttonMessageId: item.buttonMessageId,
          messageId: item.messageId,
          clickedButtons: item.clickedEvent ? JSON.parse(item.clickedEvent) : [],
          type: item.type,
          errorMessage: item.errorMessage,
          imageUrl: imageSizeRes.previewUrl,
          imageSize: item.imageSize,
          originImageUrl: imageSizeRes.originUrl,
        } as MjChatMessage
      })

      setHasMore(data.hasMore)

      setMessageList([...messageList(), ...result])

      if (activeIndex() === -1 && messageList().length) {
        setActiveIndex(0)
        setType(messageList()[0].type)
        let errorMessage = messageList()[0].errorMessage?.length ?? 0
        setShowErrorHint(errorMessage > 0)
      }
      if (onComplete) {
        onComplete();
      }
    }).catch(error => {
      if (onComplete) {
        onComplete();
      }
      console.log('error.message = ', error.message)
      if (error.message.includes('401')) {
        setShowLoginDirectDialog(true)
      }
      console.error('fetch messageList error:', error)
    })
  }

  onMount(() => {
    // Run once on mount
    fetchMessageList()
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  });

  const handleScroll = () => {
    if (!hasMore() || isLoadingMore()) {
      return
    }
    const offset = 100; // offset from bottom to trigger loading more
    if (isMobile()) {
      if (previewListRef()!.scrollLeft + previewListRef()!.clientWidth < previewListRef()!.scrollWidth - offset) {
        return
      }
    } else if (previewListRef()!.scrollHeight - previewListRef()!.scrollTop > previewListRef()!.clientHeight + offset) {
      return;
    }

    setIsLoadingMore(true);
    fetchMessageList(() => {
      setIsLoadingMore(false);
    });
    console.log('begin scroll....')
  };



  const [textareaRef, setTextareaRef] = createSignal<HTMLTextAreaElement>();

  // 自定义宽
  const [ratioWidthRef, setRatioWidthRef] = createSignal<HTMLInputElement>();
  // 自定义高
  const [ratioHeightRef, setRatioHeightRef] = createSignal<HTMLInputElement>();

  const [previewListRef, setPreviewListRef] = createSignal<HTMLDivElement>();
  const initialHeight = 49; // initial height of the textarea

  const autoResize = () => {
    const textarea = textareaRef();
    if (!textarea) return;
    textarea.style.height = '49px';
    if (textarea.scrollHeight > textarea.clientHeight) {
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  createEffect(() => {
    const textarea = textareaRef();
    if (!textarea) return;

    textarea.addEventListener('input', autoResize);

    // Clean up event listener when the effect ends
    onCleanup(() => {
      textarea.removeEventListener('input', autoResize);
      setStore('currentAssistantMessage', '')
    });
  });


  const ratioInputChange = () => {
    const ratioWidth = ratioWidthRef()!;
    const ratioHeight = ratioHeightRef()!;
    if (ratioWidth.value && ratioHeight.value) {
      let regex = /(--ar )(\d+:\d+)/;
      let prompt = textareaRef()!.value
      let match = prompt.match(regex);
      if (match) {
        textareaRef()!.value = prompt.replace(match[2], `${ratioWidth.value}:${ratioHeight.value}`)
      } else {
        textareaRef()!.value = prompt + ` --ar ${ratioWidth.value}:${ratioHeight.value}`
      }
    }
  };

  createEffect(() => {
    const ratioWidth = ratioWidthRef()!;
    const ratioHeight = ratioHeightRef()!;
    ratioWidth.addEventListener('input', ratioInputChange);
    ratioHeight.addEventListener('input', ratioInputChange);

    // Clean up event listener when the effect ends
    onCleanup(() => {
      ratioWidth.removeEventListener('input', ratioInputChange);
      ratioHeight.removeEventListener('input', ratioInputChange);
    });
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://api.superbed.cn/upload?token=c3eb4f0eb7404ee29885a2532c51aec2", {
      method: "POST",
      body: formData,
    });

    const res = await response.json();
    if (!res.err) {
      let url = res.url
      setUploadedImageUrls([...uploadedImageUrls(), url])
    } else {
      toast.error('上传失败成功!');
    }
    setIsUploading(false);
  };


  const handleFileChange = (event: Event) => {

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      handleImageUpload(file);
    }

    const inputElement = event.target as HTMLInputElement;
    inputElement.value = "";
  };

  return (
    <>
      <div class="_draw flex flex-1 w-full overflow-hidden">
        <div class="left-container left flex flex-col w-56">
          <div class="left-top h-14 flex items-center justify-between px-4 cursor-pointer">
            <span class="span text-sm">绘画记录</span>
            <div class="w-5 h-5 rounded bor flex items-center justify-center" title="选择删除">
              <i class="iconfont  icon-huihuajilu-xuanze span text-sm"></i>
            </div>
          </div>

          <Show when={messageList().length}>
            <div class="preview-list my-2 flex-1 overflow-y-auto" ref={setPreviewListRef}>
              <Show when={isMjWorking()}>
                <div class="px-4 py-2">
                  <div class={`noactive w-full rounded-lg ${activeIndex() == -1 ? 'active' : ''}`}>
                    <div class="w-full rounded-lg overflow-hidden flex relative cursor-pointer left-item" onClick={() => setActiveIndex(-1)}>
                      <div class="w-full flex items-center justify-center flex-col py-4">
                        <img alt="" class="w-1/3" src="/svg/loading.svg" />
                        <div class="text text-center text-xs pt-2">加载中{drawingProgress()}...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Show>

              <For each={messageList()}>
                {(message, index) => (
                  <div class="px-4 py-2">
                    <div class={`noactive w-full rounded-lg ${activeIndex() === index() ? 'active' : ''}`}>
                      <div class="w-full rounded-lg overflow-hidden flex relative cursor-pointer left-item" onClick={() => {
                        setActiveIndex(index())
                        setType(messageList()[index()].type)
                        let errorMessage = messageList()[index()].errorMessage?.length ?? 0
                        setShowErrorHint(errorMessage > 0)
                      }}>
                        <Show when={message.imageUrl?.length}>
                          <img src={message.imageUrl} class="w-full" />
                        </Show>
                        <Show when={!message.imageUrl?.length}>
                          <div class="w-full flex items-center justify-center flex-col py-4">
                            <img alt="绘制失败，请重试" class="w-1/3" src="/svg/draw-left-error.svg" />
                            <div class="text px-4 text-center text-xs pt-2 leading-relaxed">{message.errorMessage}
                            </div>
                          </div>
                        </Show>
                      </div>
                    </div>
                  </div>
                )}
              </For>
              <Show when={hasMore()}>
                <div class="w-full flex items-center justify-center">
                  <div class="loadingio-spinner-eclipse">
                    <div class="ldio-vayp4mbzah">
                      <div ></div>
                    </div>
                  </div>
                </div>
              </Show>
            </div>
          </Show>

          <Show when={!messageList().length}>
            <div class="flex-1 flex items-center justify-center flex-col">
              <div class="not-record">
                <img alt="" class="img w-1/2" src="/images/draw-left-empty.png" />
                <img alt="" class="img1 w-1/2" src="/images/draw-left-empty1.png" />
                <div class="empty-text text-xs pt-3">
                  还没有绘画记录哦
                </div>
              </div>
            </div>
          </Show>

          <div class="left-bottom h-14 flex items-center justify-between px-4 cursor-pointer" >
            <div class="w-full text-center" onClick={props.showMoreClick}>
              <span class="span text-sm">更多创作记录</span>
              <i class="iconfont  icon-xiayiyeqianjinchakangengduo span text-sm ml-2"></i>
            </div>
          </div>
        </div>
        <div class="center flex flex-1">
          <div class="center-div flex-1 rounded flex flex-col">
            <div class="info flex-1 flex items-center justify-center overflow-hidden">
              <Show when={isMjWorking() && activeIndex() === -1}>
                <div class="left flex-1 h-full justify-center flex p-6">
                  <div class="info-empty flex flex-col items-center justify-center rounded-lg w-3/4 h-3/4 relative">
                    <div class="pageLoading">
                      <img alt="" class="center-img" src="https://jchd-chat.oss-cn-hangzhou.aliyuncs.com/images/loading.gif" />
                      <div class="num text-xs">正在绘画中{drawingProgress()}...</div>
                      <div class="loding">
                        <div class="bar" style={`width: ${drawingProgress()};`}></div>
                      </div>
                    </div>
                    <div
                      class={`tips flex justify-center items-end w-full h-full absolute text-center text-base transition-opacity duration-500 ease-in-out ${isAssistantHintVisible() ? 'opacity-100' : 'opacity-0'}`}>
                      贴心小助手：{assistantHints[assistantHintIndex()]}
                    </div>
                  </div>
                  <div class="right w-1/3 max-w-lg rounded-2xl px-4 flex flex-col overflow-y-auto">
                    <div class="top flex py-4 items-end justify-between">
                      <div class="text text-lg font-semibold"> 英文关键词 <i class={`iconfont ${showEnPromptCopy() ? 'icon-fuzhi cursor-pointer' : 'icon-duihao active'} text-lg mr-1`} onClick={async () => {
                        setShowEnPromptCopy(false)
                        await copyToClipboard(
                          mjWorkingPrompt()
                        )
                        setTimeout(() => {
                          setShowEnPromptCopy(true)
                        }, 1000)

                      }}></i></div>
                      <div class="text1 text-xs font-normal py-1 px-2 rounded-full flex items-center justify-center">
                        几秒前
                      </div>
                    </div>
                    <div class="keyword w-full rounded-xl py-3 pl-3 pr-2">
                      <div class="keyword-text text-sm max-h-60 overflow-y-auto pr-1 leading-normal">
                        {mjWorkingPrompt()}
                      </div>
                    </div>
                    <div class="top flex py-4 items-end justify-between">
                      <div class="text text-lg font-semibold"> 原始关键词 <i class={`iconfont ${showOriginPromptCopy() ? 'icon-fuzhi cursor-pointer' : 'icon-duihao active'} text-lg mr-1`} onClick={async () => {
                        setShowOriginPromptCopy(false)
                        await copyToClipboard(
                          mjWorkingPrompt()
                        )
                        setTimeout(() => {
                          setShowOriginPromptCopy(true)
                        }, 1000)

                      }}></i></div>
                      <div class="text1 text-xs font-normal py-1 px-2 rounded-full flex items-center justify-center">
                        几秒前
                      </div>
                    </div>
                    <div class="keyword w-full rounded-xl py-3 pl-3 pr-2">
                      <div class="keyword-text text-sm max-h-60 overflow-y-auto pr-1 leading-normal">
                        {mjWorkingPrompt()}
                      </div>
                    </div>
                    <div class="task_id flex-1 flex flex-col items-center justify-end py-3 text-sm" style="display:none;">
                      任务ID：1110897820283572984
                    </div>
                  </div>
                </div>
              </Show>
              <Show when={activeIndex() === -1 && !isMjWorking()}>
                <div class="info-empty flex flex-col items-center justify-center rounded-lg w-3/4 h-3/4">
                  <div class="w-40">
                    <img alt="" class="w-full" src="https://jchd-chat.oss-cn-hangzhou.aliyuncs.com/images/draw-center-empty.png" />
                  </div>
                  <div class="text text-xs text-center tracking-wider pt-6">
                    <div >探索AI世界的奥秘，释放您无限的创造潜能！
                    </div>
                  </div>
                </div>
              </Show>
              <Show when={activeIndex() > -1}>
                <div class="left flex-1 h-full flex p-6">
                  <Show when={!showErrorHint()}>
                    <div ref={setImageContainerRef} class="left flex-1 rounded-2xl flex items-center justify-center overflow-hidden mr-2 relative">
                      <Show when={messageList().length}>
                        <div ref={setLargeImageRef} class="el-image rounded-xl mx-auto" onClick={() => {
                          setShowImageViewer(!showImageViewer())
                        }}>
                          <img
                            src={originImageUrl()}
                            class="w-full h-full"
                            style={{ visibility: isLoading() ? 'hidden' : 'visible' }}
                            onLoad={() => setIsLoading(false)}
                          />
                        </div>
                      </Show>
                      <Show when={messageList().length && isLoading()}>
                        <Spinner class="w-1/3 absolute" type={SpinnerType.tailSpin} width="20%" height="20%" color="#bd69ff" />
                      </Show>
                    </div>
                  </Show>
                  <Show when={showErrorHint()}>
                    <div class="left flex-1 rounded-2xl flex items-center justify-center flex-col">
                      <div class="w-20">
                        <img alt="" class="w-full" src="https://jchd-chat.oss-cn-hangzhou.aliyuncs.com/images/draw-center-error.png" />
                      </div>
                      <div class="left-error text-xs text-center">
                        <div class="pt-2">{messageList()[activeIndex()].errorMessage}，请重试</div>
                      </div>
                    </div>
                  </Show>

                  <div class="right w-1/3 max-w-lg rounded-2xl px-4 flex flex-col overflow-y-auto">
                    <div class="top flex py-4 items-end justify-between">
                      <div class="text text-lg font-semibold"> 英文关键词 <i class={`iconfont ${showEnPromptCopy() ? 'icon-fuzhi cursor-pointer' : 'icon-duihao active'} text-lg mr-1`} onClick={async () => {
                        setShowEnPromptCopy(false)
                        await copyToClipboard(
                          messageList()[activeIndex()].content
                        )
                        setTimeout(() => {
                          setShowEnPromptCopy(true)
                        }, 1000)

                      }}></i></div>
                      <div class="text1 text-xs font-normal py-1 px-2 rounded-full flex items-center justify-center">
                        2天前
                      </div>
                    </div>
                    <div class="keyword w-full rounded-xl py-3 pl-3 pr-2">
                      <div class="keyword-text text-sm max-h-60 overflow-y-auto pr-1 leading-normal">
                        {activeIndex() > -1 ? messageList()[activeIndex()].content : ''}
                      </div>
                    </div>
                    <div class="top flex py-4 items-end justify-between">
                      <div class="text text-lg font-semibold"> 原始关键词 <i class={`iconfont ${showOriginPromptCopy() ? 'icon-fuzhi cursor-pointer' : 'icon-duihao active'} text-lg mr-1`} onClick={async () => {
                        setShowOriginPromptCopy(false)
                        await copyToClipboard(
                          messageList()[activeIndex()].content
                        )
                        setTimeout(() => {
                          setShowOriginPromptCopy(true)
                        }, 1000)

                      }}></i></div>
                      <div class="text1 text-xs font-normal py-1 px-2 rounded-full flex items-center justify-center">
                        2天前
                      </div>
                    </div>
                    <div class="keyword w-full rounded-xl py-3 pl-3 pr-2">
                      <div class="keyword-text text-sm max-h-60 overflow-y-auto pr-1 leading-normal">
                        {activeIndex() > -1 ? messageList()[activeIndex()].content : ''}
                      </div>
                    </div>
                    <Show when={type() == 1}>
                      <div class="top py-4">
                        <div class="text text-lg font-semibold">
                          放大图片
                        </div>
                        <div class="text1 text-xs pt-1">
                          对左侧的其中一张图片进行放大
                        </div>
                      </div>
                      <div class="cell flex justify-between mb-4 h-10">
                        <div class="text h-10 text-base flex items-center justify-center rounded-xl cursor-pointer" onClick={() => upscaling('U1')}>
                          左上
                        </div>
                        <div class="text h-10 text-base flex items-center justify-center rounded-xl cursor-pointer" onClick={() => upscaling('U2')} >
                          右上
                        </div>
                        <div class="text h-10 text-base flex items-center justify-center rounded-xl cursor-pointer" onClick={() => upscaling('U3')} >
                          左下
                        </div>
                        <div class="text h-10 text-base flex items-center justify-center rounded-xl cursor-pointer" onClick={() => upscaling('U4')} >
                          右下
                        </div>
                      </div>
                      <div class="top py-4">
                        <div class="text text-lg font-semibold">
                          变体图片
                        </div>
                        <div class="text1 text-xs pt-1">
                          对左侧的其中一张图片进行多样化修改
                        </div>
                      </div>
                      <div class="cell flex justify-between mb-4 h-10">
                        <div class="text text-base flex items-center justify-center rounded-xl cursor-pointer h-10" onClick={() => upscaling('V1')}>
                          左上
                        </div>
                        <div class="text text-base flex items-center justify-center rounded-xl cursor-pointer h-10" onClick={() => upscaling('V1')}>
                          右上
                        </div>
                        <div class="text text-base flex items-center justify-center rounded-xl cursor-pointer h-10" onClick={() => upscaling('V1')}>
                          左下
                        </div>
                        <div class="text text-base flex items-center justify-center rounded-xl cursor-pointer h-10" onClick={() => upscaling('V1')}>
                          右下
                        </div>
                      </div>
                    </Show>
                    <Show when={type() == 2}>
                      <div class="top flex py-4 items-end justify-between">
                        <div class="text text-lg font-semibold">更多操作</div>
                      </div>
                    </Show>
                    <div class="cell flex justify-between mb-4 h-10">
                      <div class="new_text h-10 text-base flex items-center justify-center rounded-xl cursor-pointer" style="display:none;">
                        <i class="iconfont  icon-guanjiancixinxi-shuaxin span text-lg"></i>
                        <span class="span pl-1 text-base">重新生成</span>
                      </div>
                      <div class="del_text text-base flex items-center justify-center rounded-xl h-10 cursor-pointer" onClick={() => {
                        deleteMj()
                      }}>
                        <i class="iconfont  icon-guanjiancixinxi-shanchu span text-lg"></i>
                        <span class="span pl-1 text-base">删除</span>
                      </div>
                      <div class="split_text h-10 text-base flex items-center justify-center rounded-xl cursor-pointer" style="display:none;">
                        <i class="iconfont  icon-shoushudao span text-sm font-bold"></i>
                        <span class="span pl-1 text-base">一键切图</span>
                      </div>
                    </div>

                    <div class="task_id flex-1 flex flex-col items-center justify-end py-3 text-sm hidden" style="display:none;">
                      任务ID：1110897820283572984
                    </div>
                  </div>
                </div>
              </Show>
            </div >
            <div class="send px-10 pb-6">
              <div class="send-bg p-px">
                <div class="send-div flex items-center">
                  <div class="el-textarea flex-1">
                    <textarea
                      ref={setTextareaRef}
                      class="el-textarea__inner" placeholder-class="placeholder" tabindex="0" autocomplete="off" placeholder={`请输入您的绘画描述，${isMobile() ? '' : 'enter发送、shift+enter换行'}`} id="input"
                      style="resize: none; min-height: 49px; height: 49px;"
                      onKeyDown={handleKeyDown}
                    ></textarea>
                  </div>
                  <div class="send-btn h-10 w-36 rounded-full mr-2 flex items-center justify-center cursor-pointer" onClick={() => {
                    if (!textareaRef()!.value) {
                      return
                    }
                    if (!isOptimizePrompt()) {
                      setIsOptimizePrompt(true)
                      fetchPrompt()
                    }

                  }}>
                    <Show when={!isOptimizePrompt()}>
                      <>
                        <i class="iconfont  icon-huihua-youhuaguanjianci text text-base"></i>
                        <span class="text pl-2">优化关键词</span>
                      </>
                    </Show>
                    <Show when={isOptimizePrompt()}>
                      <div class="pulse-container">
                        <div class="pulse-bubble pulse-bubble-1"></div>
                        <div class="pulse-bubble pulse-bubble-2"></div>
                        <div class="pulse-bubble pulse-bubble-3"></div>
                      </div>
                    </Show>
                  </div>
                  <div class="send-btn1 h-10 w-20 rounded-full mr-2 flex items-center justify-center cursor-pointer"
                    onClick={() => beginDrawing()}>
                    <Show when={!isMjWorking()}>
                      <i class="iconfont icon-shurukuangfasong text-xl"></i>
                    </Show>
                    <Show when={isMjWorking()}>
                      <div class="chatloader"></div>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </div >
        <div class="right flex w-1/3 max-w-md">
          <div class="right-div flex-1 rounded pl-4 overflow-hidden flex flex-col">
            <div class="flex items-center py-5 pr-4">
              <div class="w-10">
                <img alt="" class="w-full" src="/svg/draw-right-logo.svg" />
              </div>
              <div class="logotext text-3xl pl-4">
                AI绘画
              </div>
            </div>
            <div class="flex-1 overflow-x-hidden overflow-y-auto flex flex-col pr-4">
              <div class="upload rounded-xl p-2 flex justify-between items-center">
                <div class="flex-1 flex overflow-x-auto py-2 mr-2" style="display: none;"></div>

                <Show when={uploadedImageUrls().length}>
                  <div class="flex-1 flex overflow-x-auto py-2 mr-2" style="">
                    <For each={uploadedImageUrls()}>
                      {(url, index) => {
                        const [isDeletable, setIsDeletable] = createSignal(false);
                        return (
                          <div class="w-16 h-16 rounded-xl relative mr-2 flex-shrink-0 cursor-pointer" onClick={() => {
                            setIsDeletable(!isDeletable())
                          }}>
                            <Show when={!isDeletable()}>
                              <div class="check rounded-md absolute w-full h-full top-0 left-0 flex items-center justify-center text-lg">
                                <i class="iconfont  icon-duihao check-icon"></i>
                              </div>
                            </Show>
                            <Show when={isDeletable()}>
                              <img class="absolute w-4 h-4 -right-0.5 -top-0.5" src="/images/del.png" onClick={() => {
                                setUploadedImageUrls([
                                  ...uploadedImageUrls().slice(0, index()),
                                  ...uploadedImageUrls().slice(index() + 1)
                                ]);
                              }} />
                            </Show>
                            <img alt="" class="w-full h-full rounded-md" src={url} />
                          </div>
                        )
                      }}
                    </For>
                  </div>
                </Show>

                <Show when={!uploadedImageUrls().length}>
                <div class="upload-empty pl-6 py-2">
                    <div class="h-16 flex flex-col justify-around">
                      <div class="text-base">
                        上传参考图(选填)
                      </div>
                      <div class="text-xs">
                        支持JPG、PNG、10M以内
                      </div>
                    </div>
                  </div>
                </Show>
                <div class="btn w-16 h-16 rounded-xl flex items-center justify-center relative cursor-pointer">
                  <Show when={!isUploading()}>
                    <i class="iconfont  icon-huihua-shangchuantupian span text-3xl cursor-pointer"></i>
                    <input type="file" accept=".jpg,.png,.gif" class="absolute w-full h-full top-0 left-0 opacity-0 z-10 cursor-pointer" id="file" onChange={handleFileChange}
                    />
                  </Show>
                  <Show when={isUploading()}>
                    <div class="loader"></div>
                  </Show>
                </div>
              </div>
              <div class="title flex pt-6 pb-4 items-end">
                <div class="text text-sm font-medium">
                  尺寸
                </div>
                <div class="text1 text-xs pl-2 pb-px font-normal">
                  可在输入框自行输入尺寸
                </div>
              </div>
              <div class="size flex flex-wrap justify-between">
                <For each={picOptions}>
                  {(option, index) => (
                    <div class={`size-item flex-shrink-0 flex flex-col items-center mb-2 rounded-lg py-2 cursor-pointer ${picRatioIndex() === index() ? 'active' : ''}`} onClick={() => {
                      setPicRatioIndex(index)
                    }}>
                      <Show when={index() < 5}>
                        <div >
                          <img alt="" class="img" src={option.img} />
                        </div>
                        <div class="text text-base font-bold py-1">
                          {option.ratio}
                        </div>
                        <div class="text1 text-xs font-normal">{option.desc}</div>
                      </Show>
                      <Show when={index() === 5}>
                        <div >
                          <img alt="" class="img" src="/svg/1-1.svg" />
                        </div>
                        <div class="flex flex-1 text items-center justify-center pb-2">
                          <input ref={setRatioWidthRef} class="input w-7 text-center appearance-none text-base" type="number" /> : <input ref={setRatioHeightRef} class="input w-7 text-center appearance-none text-base" type="number" />
                        </div>
                        <div class="text1 text-xs font-normal">自定义</div>
                      </Show>
                    </div>
                  )}
                </For>

              </div>
              <div class="title flex pt-6 pb-4 items-end">
                <div class="text text-sm font-medium">
                  关键词推荐
                </div>
                <div class="text1 text-xs pl-2 pb-px font-normal">
                  非必选
                </div>
              </div>
              <div class="keywords-nav py-1 px-2 flex rounded-lg mb-2">
                <div class="items-item flex-1 h-8 flex relative">
                  <div class="item_bg rounded-lg absolute h-full w-1/6" style={`left: ${keywordsIndex() / 6 * 100}%;`}></div>
                  <For each={keyWords}>
                    {(keyWordItem, index) => (
                      <div class="item flex-1 text-sm flex items-center justify-center cursor-pointer relative" onClick={() => {
                        setKeywordsIndex(index())
                      }}>
                        {keyWordItem.title}
                      </div>
                    )}
                  </For>
                </div>
              </div>
              <div class="list flex-1">
                <For each={keyWords[keywordsIndex()].types}>
                  {(keyWordTypeInfo, index) => {
                    // Add a local state for each container to track the expanded state
                    const [expanded, setExpanded] = createSignal(false);

                    return (
                      <>
                        <div
                          class="container title flex items-end pb-3 cursor-pointer"
                          onClick={() => setExpanded(!expanded())}
                        >
                          <i
                            class={`iconfont  icon-xiangxia keywords-icon text-sm ${expanded() ? 'expansion_icon' : ''
                              }`}
                          ></i>
                          <div class="font-medium pl-1 text-sm">
                            {keyWordTypeInfo.title}
                          </div>
                          <div class="font-medium pl-1 text-xs pb-1">
                            （{keyWordTypeInfo.selections.length}）
                          </div>
                        </div>
                        <Show when={!expanded()}>
                          <div class="flex flex-wrap text-sm cursor-pointer">
                            <For each={keyWordTypeInfo.selections}>
                              {(selection, index) => {
                                const [highlighted, setHighlighted] = createSignal(false);
                                return (
                                  <div class={`flex-shrink-0 flex mr-2 mb-3 rounded-md overflow-hidden ${highlighted() ? 'highlight' : ''}`} onClick={() => {
                                    setHighlighted(!highlighted())
                                    let prompt = textareaRef()!.value
                                    if (highlighted()) {
                                      if (prompt) {
                                        prompt = prompt.replace(`,${selection.en}`, '')
                                        textareaRef()!.value = prompt + `,${selection.en}`
                                      } else {
                                        textareaRef()!.value = `,${selection.en}`
                                      }
                                    } else {
                                      prompt = prompt.replace(`,${selection.en}`, '')
                                      textareaRef()!.value = prompt
                                    }
                                    autoResize()
                                  }}>
                                    <div class="text text-xs px-1.5 py-1 rounded-l-md">
                                      {selection.en}
                                    </div>
                                    <Show when={selection.ch}>
                                      <div class="text1 text-xs px-1.5 py-1 rounded-r-md">
                                        {selection.ch}
                                      </div>
                                    </Show>
                                  </div>
                                )
                              }}
                            </For>
                          </div>
                        </Show>
                      </>
                    );
                  }}
                </For>
              </div>
            </div>
          </div>
        </div>
        <Toaster position="top-center" />
        <Show when={showLoginDirectDialog()}>
          <LoginGuideDialog title="登录状态已过期，请重新登录哦" />
        </Show>
        <Show when={showVipDialog()}>
          <VipChargeDialog
            title="付费用户才能使用MJ哦"
            onClose={closeVipDialog} />
        </Show>
        <Show when={showImageViewer() && activeIndex() > -1}>
          <ImageViewer
            imageUrl={messageList()[activeIndex()].originImageUrl}
            closeDialog={() => {
              setShowImageViewer(false)
            }} />
        </Show>
      </div >
    </>
  );
}