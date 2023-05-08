import { createSignal, Show } from 'solid-js';

import CloseIcon from './CloseIcon'

interface VipOption {
  title: string;
  desc: string[];
  currentPrice: string;
  originalPrice: string;
}

interface Props {
  title: string,
  onClose: () => void;
}

const VipChargeDialog = (props: Props) => {

  const vipOptions = [
    {
      id: 1,
      title: '月度会员',
      desc: ['不限字数', '专属 AI 进阶社群'],
      currentPrice: '¥49.9',
      originalPrice: '¥139',
    },
    {
      id: 2,
      title: '季度会员',
      desc: ['不限字数', '专属 AI 进阶社群'],
      currentPrice: '¥119',
      originalPrice: '¥299',
    },
    {
      id: 3,
      title: '年度会员',
      desc: ['不限字数', '专属 AI 进阶社群', '专属 AI 绘画体验'],
      currentPrice: '¥449',
      originalPrice: '¥1190',
    },
  ];

  const [selectedOptionIndex, setSelectedOptionIndex] = createSignal(0);

  const handleBuy = () => {
    let options = vipOptions[selectedOptionIndex()]
    window.location.href = `/payment?id=${options['id']}`
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-99">
      <div class="bg-white p-6 rounded-lg flex flex-col items-center gap-4 z-10 w-11/12 sm:w-3/4 max-w-xl relative">
        <button class="absolute top-4 right-4" onClick={props.onClose}>
          <CloseIcon />
        </button>
        <h2 class="text-2xl font-semibold mb-4">{props.title}</h2>
        <div class="grid grid-cols-1 md:flex gap-2">
          {vipOptions.map((option, index) => (
            <div
              class={`relative bg-gray-200 px-4 pb-6 pt-4 w-full md:w-44 rounded-lg text-center border-4 ${selectedOptionIndex() === index ? 'border-blue-500' : 'border-transparent'
                }`}
              onClick={() => setSelectedOptionIndex(index)}
            >
              <div class="text-lg font-bold">{option.title}</div>
              <div class="text-sm text-gray-600 mt-2 text-left h-15">
                {option.desc.map((item, idx) => (
                  <div class="flex items-baseline">
                    <span class="mr-1">{idx + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Show when={index == 1}>
                <div class="absolute bottom-1 left-0 right-0 mx-auto bold text-sm text-red-500">90%用户选择此套餐</div>
              </Show>
              <div class="mt-4">
                <span class="text-lg font-bold text-blue-500">{option.currentPrice}</span>
                <span class="text-sm text-gray-600 ml-2 line-through">{option.originalPrice}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          class="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold mt-4 hover:bg-blue-700"
          onClick={handleBuy}
        >
          立即购买
        </button>
      </div>
    </div>
  );
};

export default VipChargeDialog;
