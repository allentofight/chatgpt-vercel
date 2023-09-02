// src/components/Dialog.tsx
import { createSignal, Show } from 'solid-js';

import CloseIcon from './CloseIcon'
const apiHost = import.meta.env.CLIENT_API_HOST;

import toast, { Toaster } from 'solid-toast';

export default function ExchangeDialog(props: {
  showTitle: boolean,
  onClick: () => void,
  successClick: () => void,
  showChargeBtn: boolean,
  chargeBtnClick?: () => void,
}) {

  const [exchangeCode, setExchangeCode] = createSignal('');

  const [showSuccess, setShowSuccess] = createSignal(false);

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const [dayRights, setDayRights] = createSignal(false);

  async function sendExchangeCode() {
    setIsSubmitting(true)
    let sessionId = localStorage.getItem('sessionId')
    let res = await fetch(`${apiHost}/api/mj/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      },
      body: JSON.stringify({
        exchangeCode: exchangeCode()
      }),
    }).then(async (response) => {
      // Check if the response status is OK (200) 
      if (!response.ok) {
        let error = await response.json()
        throw new Error(error.message);
      }
      // Parse the response as JSON
      return response.json();
    }).catch((error) => {
      console.log('Error fetching chat:', error);
      return { errorMessage: error.message }
    });

    setIsSubmitting(false)
    if (res.errorMessage) {
      toast.error(res.errorMessage)
    } else {
      setDayRights(res.oneDay)
      toast.success(`兑换成功，恭喜获得 ${dayRights() ? '1天' : '1个月'} MJ 权益`, {
        duration: 3000
      })
      localStorage.setItem('midjourneyExpireDay', res.expiredDay.toString())
      setShowSuccess(true)
    }
  }

  return (
    <>
      <style>
        {`
          
          @keyframes zoom {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
          
          .zoom-btn {
            animation: zoom 2s infinite;
          }

          
        `}
      </style>
      <div class="fixed inset-0 z-10 flex items-center justify-center">
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="bg-white rounded-lg mx-1 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl max-w-lg w-full z-100 relative">
          <button class="absolute top-2 right-2 p-1" onClick={props.onClick}>
            <CloseIcon />
          </button>
          <Show when={!showSuccess()}>
            <div class="text-xl text-center mb-2">输入兑换码可获得1个月MJ使用权益</div>
            <div class="mt-4 flex flex-col items-center">
              <input
                type="text"
                value={exchangeCode()}
                onInput={(e: Event) => setExchangeCode((e.target as HTMLInputElement).value)}
                class="border border-gray-300 p-2 rounded mb-4 w-2/3"
                placeholder="输入兑换码，立即获得1个月MJ使用权益"
              />
              <button
                class={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting() ? 'opacity-50' : ''}`}
                disabled={isSubmitting()}
                onClick={sendExchangeCode}>
                提交
              </button>

              <Show when={props.showChargeBtn}>
                <button
                  class="zoom-btn bg-green-500 text-white px-4 py-2 rounded mt-4"
                  disabled={isSubmitting()}
                  onClick={props.chargeBtnClick}>
                  充会员免兑换码
                </button>
              </Show>
            </div>
          </Show>

          <Show when={showSuccess()}>
            <h2 class="text-2xl text-center mb-3 text-blue-500">恭喜你已获取{dayRights() ? '一天' : '一个月'} MJ权益!</h2>
            <div class="mt-4 flex justify-center">
              <button class="bg-blue-500 text-white px-4 py-2 rounded" onClick={props.successClick}>
                我知道了
              </button>
            </div>
          </Show>
        </div>
        <Toaster position="top-center" />
      </div>
    </>
  );
}
