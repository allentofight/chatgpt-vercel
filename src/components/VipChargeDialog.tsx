import { createSignal, Show, createMemo } from 'solid-js';

import CloseIcon from './CloseIcon'
import { isMobile } from "~/utils"

interface Props {
  title: string,
  onClose: () => void;
}

const VipChargeDialog = (props: Props) => {

  const vipOptions = [
    {
      id: 1,
      title: '月度会员',
      desc: ['GPT3.5 不限字数，不限问题数', 'GPT4 每天提问5次，不限字数', 'Midjourney 不限作图次数'],
      prices: {
        GPT3: 39.9,
        GPT4: 39.9,
        Midjourney: 49.9,
        mergeGPT: 65,
        mergeGPTMJ: 75,
        mergeALL: 103
      },
    },
    {
      id: 2,
      title: '季度会员',
      desc: ['GPT3.5 不限字数，不限问题数', 'GPT4 每天提问5次，不限字数', 'Midjourney 不限作图次数'],
      prices: {
        GPT3: 109,
        GPT4: 109,
        Midjourney: 135,
        mergeGPT: 170,
        mergeGPTMJ: 190,
        mergeALL: 289,
      },
    },
    {
      id: 3,
      title: '年度会员',
      desc: ['GPT3.5 不限字数，不限问题数', 'GPT4 每天提问5次，不限字数', 'Midjourney 不限作图次数'],
      prices: {
        GPT3: 410,
        GPT4: 410,
        Midjourney: 510,
        mergeGPT: 650,
        mergeGPTMJ: 720,
        mergeALL: 1100,
      },
    },
  ];

  const [selectedOptionIndex, setSelectedOptionIndex] = createSignal(0);
  const [checkedServices, setCheckedServices] = createSignal(Array(vipOptions.length).fill({ GPT3: true, GPT4: true, Midjourney: true }));

  const handleBuy = () => {
    let options = vipOptions[selectedOptionIndex()]
    const services = checkedServices()[selectedOptionIndex()];
    let selectedItems = JSON.stringify(services)
    window.location.href = `/payment?id=${options['id']}&options=${selectedItems}`
  };

  const handleCheckboxChange = (sectionIndex: number, service: string) => {
    const newCheckedServices = [...checkedServices()];
    newCheckedServices[sectionIndex] = { ...newCheckedServices[sectionIndex], [service]: !newCheckedServices[sectionIndex][service] };
    setCheckedServices(newCheckedServices);
  };

  const calculatePrice = (index: number) => {
    const services = checkedServices()[index];
    const option = vipOptions[index];

    if (services.GPT3 && services.GPT4 && services.Midjourney) {
      const saved = option.prices.GPT3 + option.prices.GPT4 + option.prices.Midjourney - option.prices.mergeALL;
      return { price: option.prices.mergeALL, itemsCnt: 3, saved };
    } else if (services.GPT3 && services.Midjourney) {
      const saved = option.prices.GPT3 + option.prices.Midjourney - option.prices.mergeGPTMJ;
      return { price: option.prices.mergeGPTMJ, itemsCnt: 2, saved };
    } else if (services.GPT4 && services.Midjourney) {
      const saved = option.prices.GPT4 + option.prices.Midjourney - option.prices.mergeGPTMJ;
      return { price: option.prices.mergeGPTMJ, itemsCnt: 2, saved };
    } else if (services.GPT3 && services.GPT4) {
      const saved = option.prices.GPT3 + option.prices.GPT4 - option.prices.mergeGPT;
      return { price: option.prices.mergeGPT, itemsCnt: 2, saved };
    } else if (services.GPT3) {
      return { price: option.prices.GPT3, itemsCnt: 1, saved: 0 };
    } else if (services.GPT4) {
      return { price: option.prices.GPT4, itemsCnt: 1, saved: 0 };
    } else if (services.Midjourney) {
      return { price: option.prices.Midjourney, itemsCnt: 1, saved: 0 };
    }
    return { price: 0, saved: 0, itemsCnt: 0 };
  };

  const isBuyButtonDisabled = createMemo(() => {
    const services = checkedServices()[selectedOptionIndex()];
    return !services.GPT3 && !services.GPT4 && !services.Midjourney;
  });

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-99">
      <div class="bg-white px-6 py-4 rounded-lg flex flex-col items-center gap-4 z-10 w-11/12 sm:w-3/4 max-w-4xl relative">
        <button class="absolute top-4 right-4" onClick={props.onClose}>
          <CloseIcon />
        </button>
        <h2 class="text-2xl font-semibold mb-1">{props.title}</h2>
        <div class="overflow-y-auto max-h-[calc(100vh-10rem)]"> {/* Add this wrapper div */}
          <div class="grid grid-cols-1 md:flex gap-2">
            {vipOptions.map((option, index) => (
              <div
                class={`relative bg-gray-200 px-3 ${isMobile() ? (index == 1 ? 'pb-6' : 'pb-3') : 'pb-6'} pt-4 w-full md:w-64 rounded-lg text-center border-4 ${selectedOptionIndex() === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                onClick={() => setSelectedOptionIndex(index)}
              >
                <div class="text-lg font-bold">{option.title}</div>
                <div class="mt-2">
                  <label class="inline-flex items-center w-full">
                    <input type="checkbox" class="form-checkbox w-4 h-4" checked={checkedServices()[index].GPT3} onChange={() => handleCheckboxChange(index, 'GPT3')} />
                    <span class="ml-2">GPT3.5&nbsp;&nbsp;&nbsp;¥{option.prices.GPT3}</span>
                  </label>

                  <label class="inline-flex items-center w-full">
                    <input type="checkbox" class="form-checkbox w-4 h-4" checked={checkedServices()[index].GPT4} onChange={() => handleCheckboxChange(index, 'GPT4')} />
                    <span class="ml-2">GPT4&nbsp;&nbsp;&nbsp;¥{option.prices.GPT4}</span>
                  </label>

                  <label class="inline-flex items-center w-full">
                    <input type="checkbox" class="form-checkbox w-4 h-4" checked={checkedServices()[index].Midjourney} onChange={() => handleCheckboxChange(index, 'Midjourney')} />
                    <span class="ml-2">Midjourney&nbsp;&nbsp;&nbsp;¥{option.prices.Midjourney}</span>
                  </label>
                </div>
                <div class={`text-sm text-gray-600 mt-2 text-left ${isMobile() ? 'h-10' : 'h-12'}`}>
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
                  <span class="text-lg font-bold text-blue-500">¥{calculatePrice(index).price}</span>
                  <Show when={calculatePrice(index).itemsCnt > 1}>
                    <span class="text-sm text-red-500 ml-2">已省 ¥{calculatePrice(index).saved.toFixed(1)}</span>
                  </Show>
                </div>

              </div>
            ))}
          </div>
        </div> {/* Close the wrapper div */}

        <button
          class={`bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold mt-2 hover:bg-blue-700 ${isBuyButtonDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleBuy}
          disabled={isBuyButtonDisabled()}
        >
          立即购买
        </button>
      </div>
    </div >
  );
};

export default VipChargeDialog;