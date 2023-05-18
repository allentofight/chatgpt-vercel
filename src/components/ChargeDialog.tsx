import { createEffect, createSignal, Show, onMount } from 'solid-js';
import dateformat from 'dateformat';
const apiHost = import.meta.env.CLIENT_API_HOST;

import { isLocalStorageAvailable } from "~/utils/localStorageCheck"

interface ChargeDialogProps {
  closeDialog: () => void;
}

const ChargeDialog = (props: ChargeDialogProps) => {

  if (!isLocalStorageAvailable()) {
    return
  }

  let expireDate = localStorage.getItem('expireDay')
  let date = null
  if (expireDate) {
    date = new Date(parseInt(expireDate))
  }

  const [endDate, setEndDate] = createSignal<Date | null>(date);

  const [isExpired, setIsExpired] = createSignal(false);

  const [isUrgent, setIsUrgent] = createSignal(false);

  function isLessThanFiveDays(date1: Date, date2: Date) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
    const differenceInDays = differenceInMilliseconds / millisecondsPerDay;
    return differenceInDays < 5;
  }

  onMount(() => {
    let sessionId = localStorage.getItem('sessionId')
    fetch(`${apiHost}/api/auth/getUserInfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`
      },
    }).then((response) => {
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the response as JSON
      return response.json();
    }).then((data) => {
      localStorage.setItem('expireDay', data.gpt3ExpireDay.toString())
      setEndDate(new Date(data.gpt3ExpireDay))
      if (endDate()! < new Date()) {
        setIsExpired(true)
      } else {
        if (isLessThanFiveDays(endDate()!, new Date())) {
          console.log('urgent...')
          setIsUrgent(true)
        }
      }
    }).catch((error) => {
      console.error('Error delete chat:', error);
    });
  })

  return (
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" onClick={props.closeDialog}></div>
      <div class="bg-white w-[30rem] py-8 px-6 rounded-lg relative">
        <button class="absolute top-2 right-2 p-1" onClick={props.closeDialog}>
          <CloseIcon />
        </button>
        <div class="flex items-center justify-center mb-6">
          <img
            src="http://7niu.kaokao.mobi/ai_pro_icon@2x.png"
            alt="VIP icon"
            class="w-7 h-4.5 mr-3"
          />
          <Show when={isExpired()}>
            <span class="text-lg text-red-500">VIP已到期!</span>
          </Show>

          <Show when={!isExpired()}>
            <span class="text-lg">VIP 到期时间：</span>
            <Show when={endDate() != null}>
              <span class="text-lg font-bold text-indigo-600">{dateformat(endDate()!, 'yyyy-mm-dd HH:MM')}</span>
            </Show>
          </Show>

        </div>
        <div class="mb-6 px-6">
          <Show when={!isExpired()}>
            <Show when={isUrgent()}>
              <p class="text-gray-600">
                尊敬的VIP会员，您的VIP服务即将到期，请扫码及时续费，以免影响使用体验。
              </p>
            </Show>
            <Show when={!isUrgent()}>
              <p class="text-gray-600">
                尊敬的VIP会员，提前续费可享受不间断特权。扫描下方二维码，感谢您的支持！
              </p>
            </Show>
          </Show>
          <Show when={isExpired()}>
            <p class="text-gray-600">
              尊敬的VIP会员，您的VIP服务已到期，请扫码及时续费哦
            </p>
          </Show>
        </div>

        <div class="flex flex-col items-center mt-6">
          <img
            style={{ width: "100%", height: "auto" }}
            src="https://i.imgtg.com/2023/05/04/CkYCM.png"
            alt="QR code"
          />
          <p class="text-gray-600 mt-2">
            请扫码添加后续费哦
          </p>
        </div>
      </div>
    </div >
  );
};

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default ChargeDialog;
