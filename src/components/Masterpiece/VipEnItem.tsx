import { createSignal, Show } from 'solid-js';
import i18n from '~/utils/i18n';
import toast, { Toaster } from 'solid-toast';
import { paypalCreate } from '~/utils/api';
const apiHost = import.meta.env.CLIENT_API_HOST;

enum VipType {
    MONTH = 1,
    SEASON = 2,
    YEAR = 3,
}

export default function VipEnItem(props: { type: VipType }) {
    const [isLoading, setLoading] = createSignal(false);

    let vipInfo = {
        [VipType.MONTH]: {
            title: i18n.t('monthlyMembership'),
            prices: {
                GPT: 8,
                Midjourney: 10,
                mergeALL: 16,
            },
            gpt4Desc: i18n.t('monthGPT4TotalCnt'),
            imgbg: '/svg/vip-ordinary-bg.svg',
            btnClass: 'button-ordinary',
            divFontColorClass: 'ordinary',
            logoClass: 'ordinary_logo',
            logoImg: '/images/vip-ordinary.png',
            unit: i18n.t('monthUnit'),
        },
        [VipType.YEAR]: {
            title: i18n.t('annualMembership'),
            prices: {
                GPT: 84,
                Midjourney: 103,
                mergeALL: 180,
            },
            gpt4Desc: i18n.t('yearGPT4TotalCnt'),
            imgbg: '/svg/vip-annual-bg.svg',
            btnClass: 'button-annual',
            divFontColorClass: 'annual',
            logoClass: 'annual_logo',
            logoImg: '/images/vip-annual.png',
            unit: i18n.t('yearUnit'),
        },
        [VipType.SEASON]: {
            title: i18n.t('quarterlyMembership'),
            prices: {
                GPT: 22,
                Midjourney: 27,
                mergeALL: 45,
            },
            gpt4Desc: i18n.t('seasonGPT4TotalCnt'),
            imgbg: '/svg/vip-monthly-bg.svg',
            btnClass: 'button-monthly',
            divFontColorClass: 'monthly',
            logoClass: 'monthly_logo',
            logoImg: '/images/vip-monthly.png',
            unit: i18n.t('quarterUnit'),
        },
    };

    const [checkedServices, setCheckedServices] = createSignal({
        GPT: true,
        Midjourney: false,
    });

    const handleCheckboxChange = (service: 'GPT' | 'Midjourney') => {
        setCheckedServices({
            ...checkedServices(),
            [service]: !checkedServices()[service],
        });
    };

    const calculatePrice = () => {
        const services = checkedServices();
        const option = vipInfo[props.type];
        if (services.GPT && services.Midjourney) {
            const saved =
                option.prices.GPT +
                option.prices.Midjourney -
                option.prices.mergeALL;
            return { price: option.prices.mergeALL, itemsCnt: 2, saved };
        } else if (services.GPT) {
            return { price: option.prices.GPT, itemsCnt: 1, saved: 0 };
        } else if (services.Midjourney) {
            return { price: option.prices.Midjourney, itemsCnt: 1, saved: 0 };
        }
        return { price: 0, saved: 0, itemsCnt: 0 };
    };

    const submitOptions = () => {
        let options = {};
        if (checkedServices().GPT) {
            options = {
                GPT3: true,
                GPT4: true,
            };
        }

        if (checkedServices().Midjourney) {
            options = {
                ...options,
                Midjourney: true,
            };
        }
        return options;
    };

    const createOrder = async () => {
        try {
            let inviteCode = localStorage.getItem('inviteCode');

            if (isLoading()) {
                return;
            }

            if (!checkedServices().Midjourney && !checkedServices().GPT) {
                toast.error('Please select GPT or Midjourney');
                return;
            }

            setLoading(true);

            let data = await paypalCreate(
                JSON.stringify({
                    productId: props.type,
                    options: JSON.stringify(submitOptions()),
                    inviteCode,
                })
            );

            setLoading(false);

            // Redirect the user to the PayPal payment page
            window.location.href = `https://www.paypal.com/checkoutnow?token=${data.id}`;
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <>
            <style>
                {`
        .dot {
          display: inline-block;
          animation-name: blink;
          animation-duration: 1.4s;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }
        
        .dot1 {
          animation-delay: 0.2s;
        }
        
        .dot2 {
          animation-delay: 0.4s;
        }
        
        .dot3 {
          animation-delay: 0.6s;
        }
        
        @keyframes blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}
            </style>
            <div
                class={`vip-item h-full rounded-xl overflow-hidden ${
                    vipInfo[props.type].divFontColorClass
                }`}
            >
                <div class="relative">
                    <img class="w-full" src={vipInfo[props.type].imgbg} />
                    <div class="h-full absolute right-2 top-0 flex items-center">
                        <img
                            class={`w-24 ${vipInfo[props.type].logoClass}`}
                            src={vipInfo[props.type].logoImg}
                        />
                    </div>
                    <div class="h-full absolute left-0 top-0 z-10 w-full pl-4 flex flex-col justify-center">
                        <div class="text0 text-2xl">
                            {vipInfo[props.type].title}
                        </div>
                        <div class="text0 text-sm pt-2">
                            {i18n.t('enjoyUnlimitedQA')}
                        </div>
                    </div>
                </div>
                <div class="p-6 text text-xs flex items-end">
                    <span class="text1 text-3xl flex">
                        $<div>{calculatePrice().price}</div>
                    </span>
                    <span class="pb-1"> &nbsp;/{vipInfo[props.type].unit}</span>
                    <Show when={calculatePrice().itemsCnt > 1}>
                        <span class="text-sm text-red-500 ml-2 font-bold">
                            {i18n.t('saved')} $
                            {calculatePrice().saved.toFixed(1)}
                        </span>
                    </Show>
                </div>
                <div class="mt-2 ml-6 mb-3 text-white">
                    <label class="inline-flex items-center w-full">
                        <input
                            type="checkbox"
                            class="form-checkbox w-4 h-4"
                            checked={checkedServices().GPT}
                            onChange={() => handleCheckboxChange('GPT')}
                        />
                        <span class="ml-2">
                            GPT-4o-mini & GPT-4o &nbsp;&nbsp;$
                            {vipInfo[props.type].prices.GPT}
                        </span>
                    </label>
                    <label class="inline-flex items-center w-full">
                        <input
                            type="checkbox"
                            class="form-checkbox w-4 h-4"
                            checked={checkedServices().Midjourney}
                            onChange={() => handleCheckboxChange('Midjourney')}
                        />
                        <span class="ml-2">
                            Midjourney&nbsp;&nbsp;&nbsp;$
                            {vipInfo[props.type].prices.Midjourney}
                        </span>
                    </label>
                </div>
                <div
                    class={`${vipInfo[props.type].btnClass}`}
                    onClick={() => {
                        createOrder();
                    }}
                >
                    {isLoading() ? (
                        <span>
                            Subscribe<span class="dot dot1">.</span>
                            <span class="dot dot2">.</span>
                            <span class="dot dot3">.</span>
                        </span>
                    ) : (
                        i18n.t('subscribeNow')
                    )}
                </div>
                <div class="py-2">
                    <div class="flex cell justify-between">
                        <div class="text">4o mini</div>
                        <div class="text flex-1 text-right">
                            {i18n.t('unLimitedTimes')}
                        </div>
                    </div>
                    <div class="flex cell justify-between">
                        <div class="text">GPT4</div>
                        <div class="text flex-1 text-right">
                            {vipInfo[props.type].gpt4Desc}
                        </div>
                    </div>
                    <div class="flex cell justify-between">
                        <div class="text">Midjourney</div>
                        <div class="text flex-1 text-right">
                            {i18n.t('unLimitedTimes')}/{i18n.t('monthUnit')}
                        </div>
                    </div>
                </div>
                <Toaster position="top-center" />
            </div>
        </>
    );
}
