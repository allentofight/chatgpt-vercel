import { createSignal, Show } from 'solid-js';

enum VipType {
  MONTH = 1,
  SEASON = 2,
  YEAR = 3,

}


export default function VipItem(props: {
  type: VipType
}) {

  let vipInfo = {
    [VipType.MONTH]: {
      title: '月度会员',
      prices: {
        GPT3: 39.9,
        GPT4: 49.9,
        Midjourney: 49.9,
        mergeGPT3MJ: 69,
        mergeGPT3And4: 69,
        mergeGPT4MJ: 74,
        mergeALL: 97
      },
      gpt4Desc: '每月300次',
      imgbg: '/svg/vip-ordinary-bg.svg',
      btnClass: 'button-ordinary',
      divFontColorClass: 'ordinary',
      logoClass: 'ordinary_logo',
      logoImg: '/images/vip-ordinary.png',
      unit: '月'
    },
    [VipType.YEAR]: {
      title: '年度会员',
      prices: {
        GPT3: 399,
        GPT4: 499,
        Midjourney: 499,
        mergeGPT3MJ: 672,
        mergeGPT3And4: 672,
        mergeGPT4MJ: 748,
        mergeALL: 950
      },
      gpt4Desc: '每年3600次',
      imgbg: '/svg/vip-annual-bg.svg',
      btnClass: 'button-annual',
      divFontColorClass: 'annual',
      logoClass: 'annual_logo',
      logoImg: '/images/vip-annual.png',
      unit: '年'
    },
    [VipType.SEASON]: {
      title: '季度会员',
      prices: {
        GPT3: 106,
        GPT4: 135,
        Midjourney: 135,
        mergeGPT3MJ: 190,
        mergeGPT3And4: 190,
        mergeGPT4MJ: 200,
        mergeALL: 260
      },
      gpt4Desc: '每季度900次',
      imgbg: '/svg/vip-monthly-bg.svg',
      btnClass: 'button-monthly',
      divFontColorClass: 'monthly',
      logoClass: 'monthly_logo',
      logoImg: '/images/vip-monthly.png',
      unit: '季度',
    }
  }

  const [checkedServices, setCheckedServices] = createSignal({ GPT3: true, GPT4: true, Midjourney: false });


  const handleCheckboxChange = (service: 'GPT3' | 'GPT4' | 'Midjourney') => {
    setCheckedServices({
      ...checkedServices(),
      [service]: !checkedServices()[service]
    });
  };

  const calculatePrice = () => {

    const services = checkedServices()
    const option = vipInfo[props.type];
    if (services.GPT3 && services.GPT4 && services.Midjourney) {
      const saved = option.prices.GPT3 + option.prices.GPT4 + option.prices.Midjourney - option.prices.mergeALL;
      return { price: option.prices.mergeALL, itemsCnt: 3, saved };
    } else if (services.GPT3 && services.Midjourney) {
      const saved = option.prices.GPT3 + option.prices.Midjourney - option.prices.mergeGPT3MJ;
      return { price: option.prices.mergeGPT3MJ, itemsCnt: 2, saved };
    } else if (services.GPT4 && services.Midjourney) {
      const saved = option.prices.GPT4 + option.prices.Midjourney - option.prices.mergeGPT4MJ;
      return { price: option.prices.mergeGPT4MJ, itemsCnt: 2, saved };
    } else if (services.GPT3 && services.GPT4) {
      const saved = option.prices.GPT3 + option.prices.GPT4 - option.prices.mergeGPT3And4;
      return { price: option.prices.mergeGPT3And4, itemsCnt: 2, saved };
    } else if (services.GPT3) {
      return { price: option.prices.GPT3, itemsCnt: 1, saved: 0 };
    } else if (services.GPT4) {
      return { price: option.prices.GPT4, itemsCnt: 1, saved: 0 };
    } else if (services.Midjourney) {
      return { price: option.prices.Midjourney, itemsCnt: 1, saved: 0 };
    }
    return { price: 0, saved: 0, itemsCnt: 0 };
  };


  const handleBuy = () => {
    let selectedItems = JSON.stringify(checkedServices())
    let inviteCode = localStorage.getItem('inviteCode')
    window.location.href = `/payment?id=${props.type}&options=${selectedItems}&inviteCode=${inviteCode}`
  };

  return (
    <div class={`vip-item h-full rounded-xl overflow-hidden ${vipInfo[props.type].divFontColorClass}`}>
      <div class="relative">
        <img class="w-full" src={vipInfo[props.type].imgbg} />
        <div class="h-full absolute right-2 top-0 flex items-center">
          <img class={`w-24 ${vipInfo[props.type].logoClass}`} src={vipInfo[props.type].logoImg} />
        </div>
        <div class="h-full absolute left-0 top-0 z-10 w-full pl-4 flex flex-col justify-center">
          <div class="text0 text-2xl">
            {vipInfo[props.type].title}
          </div>
          <div class="text0 text-sm pt-2">
            享受无限次问答权益和无限张绘画
          </div>
        </div>
      </div>
      <div class="p-6 text text-xs flex items-end">
        <span class="text1 text-3xl flex">&yen;
          <div >
            &nbsp;{calculatePrice().price}
          </div></span>
        <span class="pb-1"> &nbsp;/{vipInfo[props.type].unit}</span>
        <Show when={calculatePrice().itemsCnt > 1}>
          <span class="text-sm text-red-500 ml-2 font-bold">已省 ¥{calculatePrice().saved.toFixed(1)}</span>
        </Show>
      </div>
      <div class="mt-2 ml-6 mb-3 text-white">
        <label class="inline-flex items-center w-full"><input type="checkbox" class="form-checkbox w-4 h-4" checked={checkedServices().GPT3} onChange={() => handleCheckboxChange('GPT3')} /><span class="ml-2">AI聊天&nbsp;&nbsp;&nbsp;&yen;
          {vipInfo[props.type].prices.GPT3}
        </span></label>
        <label class="inline-flex items-center w-full"><input type="checkbox" class="form-checkbox w-4 h-4" checked={checkedServices().GPT4} onChange={() => handleCheckboxChange('GPT4')} /><span class="ml-2">GPT4&nbsp;&nbsp;&nbsp;&yen;
          {vipInfo[props.type].prices.GPT4}
        </span></label>
        <label class="inline-flex items-center w-full"><input type="checkbox" class="form-checkbox w-4 h-4" checked={checkedServices().Midjourney} onChange={() => handleCheckboxChange('Midjourney')} /><span class="ml-2">AI绘画&nbsp;&nbsp;&nbsp;&yen;
          {vipInfo[props.type].prices.Midjourney}
        </span></label>
      </div>
      <div class={`${vipInfo[props.type].btnClass}`} onClick={() => {
        handleBuy()
      }}>
        立即开通
      </div>
      <div class="py-2">
        <div class="flex cell justify-between">
          <div class="text">
            超级问答
          </div>
          <div class="text flex-1 text-right">
            无限次
          </div>
        </div>
        <div class="flex cell justify-between">
          <div class="text">
            GPT4问答
          </div>
          <div class="text flex-1 text-right">
            {vipInfo[props.type].gpt4Desc}
          </div>
        </div>
        <div class="flex cell justify-between">
          <div class="text">
            创意绘画模式
          </div>
          <div class="text flex-1 text-right">
            无限/月
          </div>
        </div>
        <div class="flex cell justify-between">
          <div class="text">
            直推收益奖励
          </div>
          <div class="text flex-1 text-right">
            10%
          </div>
        </div>
        <div class="flex cell justify-between">
          <div class="text">
            人工智能2.0必修课
          </div>
          <div class="text flex-1 text-right">
            9折
          </div>
        </div>
      </div>
    </div>
  )
}