// src/components/Dialog.tsx
import { createSignal, Show } from 'solid-js';

import CloseIcon from './CloseIcon'
const apiHost = import.meta.env.PUBLIC_API_HOST;

import toast, { Toaster } from 'solid-toast';

export default function ExchangeDialog(props: {
  showTitle: boolean,
  onClick: () => void
  successClick: () => void
}) {

  const [exchangeCode, setExchangeCode] = createSignal('');

  const [showSuccess, setShowSuccess] = createSignal(false);

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  async function sendExchangeCode() {
    setIsSubmitting(true)
    let sessionId = localStorage.getItem('sessionId')
    let res = await fetch(`${apiHost}/api/chat/exchange`, {
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
      toast.success('兑换成功，恭喜获得 VIP 使用期一天，每天领取后可24小时内享有 VIP 权限哦', {
        duration: 3000
      })
      localStorage.setItem('expireDay', res.expiredDay.toString())
      setShowSuccess(true)
    }
  }

  return (
    <div class="fixed inset-0 z-10 flex items-center justify-center">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl max-w-lg w-full z-100 relative">
        <button class="absolute top-2 right-2 p-1" onClick={props.onClick}>
          <CloseIcon />
        </button>
        <Show when={!showSuccess()}>
          <Show when={props.showTitle}>
            <h2 class="text-2xl text-center mb-3 text-red-500">VIP 已过期!</h2>
          </Show>
          <div class="text-xl text-center mb-4">每天领取兑换码可获取 24 小时的 VIP 资格哦</div>
          <div class="max-h-96 overflow-y-auto border border-gray-300 rounded p-2 shadow-md">
            <div>
              <h3 class="text-lg">步骤一: 使用微信扫码打开小程序</h3>
              <img src="https://s2.loli.net/2023/04/25/q6PVYIphus8jgxw.jpg" alt="QR Code" class="w-3/4 object-cover rounded-md mt-4 mx-auto" />
            </div>
            <div class="mt-8">
              <h3 class="text-lg">步骤二: 点击第三个tab，点击图中所示按钮</h3>
              <img src="https://s2.loli.net/2023/04/25/nkO21bGV3KHyFhg.png" alt="Third Tab" class="w-3/4 object-cover rounded-md mt-4 mx-auto" />
            </div>
            <div class="mt-8">
              <h3 class="text-lg">步骤三: 稍等片刻之后，点击复制，即可拿到兑换码</h3>
              <img src="https://s2.loli.net/2023/04/25/8q2cJNmhYOronZs.jpg" alt="Third Tab" class="w-3/4 object-cover rounded-md mt-4 mx-auto" />
            </div>
          </div>
          <div class="mt-4 flex flex-col items-center">
            <input
              type="text"
              value={exchangeCode()}
              onInput={(e: Event) => setExchangeCode((e.target as HTMLInputElement).value)}
              class="border border-gray-300 p-2 rounded mb-4 w-2/3"
              placeholder="输入兑换码，立即获得 24 小时 VIP 资格"
            />
            <button
              class={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting() ? 'opacity-50' : ''}`}
              disabled={isSubmitting()}
              onClick={sendExchangeCode}>
              提交
            </button>
          </div>
        </Show>

        <Show when={showSuccess()}>
          <h2 class="text-2xl text-center mb-3 text-blue-500">恭喜你已获取 24小时 VIP 使用权限!</h2>
          <div class="text-xl text-center mb-4">每天领取兑换码可获取 24 小时的 VIP 资格哦</div>

          <div class="mt-4 flex justify-center">
            <button class="bg-blue-500 text-white px-4 py-2 rounded" onClick={props.successClick}>
              我知道了
            </button>
          </div>
        </Show>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
