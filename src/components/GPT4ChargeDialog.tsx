import { For } from 'solid-js';

import CloseIcon from './CloseIcon'
import { isMobile } from "~/utils"

interface Props {
  title: string,
  onClose: () => void;
}

const GPT4ChargeDialog = (props: Props) => {

  let chargeInfos = [{
    cash: '1',
    point: '1'
  }, {
    cash: '9',
    point: '10'
  }, {
    cash: '29',
    point: '30'
  }, {
    cash: '49',
    point: '50'
  }, {
    cash: '99',
    point: '100'
  }, {
    cash: '459',
    point: '500'
  }]

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-101">
      <div class="bg-[#E5E7EB] px-6 py-4 rounded-lg flex flex-col gap-4 z-10 w-11/12 sm:w-3/4 max-w-4xl relative overflow-y-auto h-4/5">
        <button class="absolute top-4 right-4" onClick={props.onClose}>
          <CloseIcon />
        </button>
        <div class="flex justify-center">
          <h2 class="text-2xl font-semibold mb-1">{props.title}</h2>
        </div>
        
        <h3 class="h3 font-bold text-gray-700  my-5">单价：</h3>
        <span >每 1000 个 <code class="text-blue-700 font-mono font-bold">token</code> 消耗 0.3 点数（提示词）或者消耗 0.6 点数（生成的内容） </span>
        <h3 class="h3 font-bold text-gray-700  my-5">费用计算：</h3>
        <span class="text-sm"> 求未科技使用 Open AI 的 API 进行计算，模型为 <code class="text-blue-700 font-mono font-bold ">GPT-4</code> 。用户输入的内容以及模型推断内容都会被计入点数消耗，计算单位是文字编码后的 <code class="text-blue-700 font-mono font-bold ">token</code> 数量。<br />通常来说，100 <code class="text-blue-700 font-mono font-bold ">token</code> 能编码 40 - 50 个汉字，或者 70 - 75 个英文单词。<br />实际模型处理的 <code class="text-blue-700 font-mono font-bold ">token</code> 数量以 OpenAI 服务器返回结果为准。</span>
        <h3 class="h3 font-bold text-gray-700  my-5">点数充值</h3>
        <ul class="px-10">

          <For each={chargeInfos}>
            {(chargeInfo, index) => (
              <li class="my-5">
                <button class="h-16 w-full rounded-xl border-2 border-blue-400  py-2 md:hover:border-yellow-500 hover:bg-yellow-50 transition-transform shadow-sm duration-500 ease-in-out transform md:hover:-translate-y-1 md:hover:scale-105 md:hover:text-yellow-600  items-center justify-center flex flex-col" 
                  onClick={() => {
                    let selectedItems = JSON.stringify({gpt4Price: chargeInfo.cash})
                    let inviteCode = localStorage.getItem('inviteCode')
                    window.location.href = `/payment?id=4&options=${selectedItems}&inviteCode=${inviteCode}`
                  }}>
                  <div class="">
                  <div class="text-sm">
                    充值金额 ￥
                    <span class="">{chargeInfo.cash}</span> 元
                  </div>
                  <div>
                    获得点数 
                    <span class="text-red-500 font-mono font-bold">{chargeInfo.point}</span> 点
                  </div>
                  </div>
                </button>
              </li>
            )}
          </For>
        </ul>
      </div >
    </div >
  );
};

export default GPT4ChargeDialog;