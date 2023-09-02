import { createEffect, createSignal, Show, onMount } from 'solid-js';
import dateformat from 'dateformat';
const apiHost = import.meta.env.CLIENT_API_HOST;

import { isLocalStorageAvailable } from "~/utils/localStorageCheck"
import i18n from '~/utils/i18n';

interface ChargeDialogProps {
  closeDialog: () => void,
  inviteBtnClick: () => void,
}

const AccountInfoDialog = (props: ChargeDialogProps) => {

  if (!isLocalStorageAvailable()) {
    return
  }

  const [endDate, setEndDate] = createSignal<Date | null>(null);
  const [gpt4EndDate, setGpt4EndDate] = createSignal<Date | null>(null);
  const [mjEndDate, setMjEndDate] = createSignal<Date | null>(null);

  const [isGPT3Expired, setIsGPT3Expired] = createSignal(false);
  const [isGPT4Expired, setIsGPT4Expired] = createSignal(false);
  const [isMJExpired, setIsMJExpired] = createSignal(false);

  const [balance, setBalance] = createSignal("0");

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
      localStorage.setItem('gpt3ExpireDay', data.gpt3ExpireDay.toString())
      setEndDate(new Date(data.gpt3ExpireDay))

      if (data.gpt4ExpireDay) {
        localStorage.setItem('gpt4ExpireDay', data.gpt4ExpireDay.toString())
        setGpt4EndDate(new Date(data.gpt4ExpireDay))
      }

      if (data.midjourneyExpireDay) {
        localStorage.setItem('midjourneyExpireDay', data.midjourneyExpireDay.toString())
        setMjEndDate(new Date(data.midjourneyExpireDay))
      }

      if (endDate()! < new Date()) {
        setIsGPT3Expired(true)
      }

      if (gpt4EndDate() && gpt4EndDate()! < new Date()) {
        setIsGPT4Expired(true)
      }

      if (mjEndDate() && mjEndDate()! < new Date()) {
        setIsMJExpired(true)
      }

      setBalance(data.balance)

    }).catch((error) => {
      console.error('Error delete chat:', error);
    });
  })

  return (
    <div class="fixed inset-0 flex items-center justify-center z-100">
      <div class="fixed inset-0 bg-black opacity-50" onClick={props.closeDialog}></div>
      <div class="bg-white w-[30rem] mx-1 py-8 px-6 rounded-lg relative">
        <button class="absolute top-2 right-2 p-1" onClick={props.closeDialog}>
          <CloseIcon />
        </button>
        <div class="flex items-center mb-3 ml-6">
          <img
            src="http://7niu.kaokao.mobi/ai_pro_icon@2x.png"
            alt="VIP icon"
            class="w-7 h-4.5 mr-3"
          />
          <Show when={isGPT3Expired()}>
            <span class="text-lg text-red-500">GPT3 {i18n.t('expired')}!{i18n.t('expireRemind')}~</span>
          </Show>
          <Show when={!isGPT3Expired()}>
            <span class="text-lg">GPT3.5 {i18n.t('expireTime')}：</span>
            <Show when={endDate() != null}>
              <span class="text-lg font-bold text-indigo-600">{dateformat(endDate()!, 'yyyy-mm-dd HH:MM')}</span>
            </Show>
          </Show>
        </div>

        <Show when={gpt4EndDate() != null}>
          <div class="flex items-center mb-3  ml-6">
            <img
              src="http://7niu.kaokao.mobi/ai_pro_icon@2x.png"
              alt="VIP icon"
              class="w-7 h-4.5 mr-3"
            />
            <Show when={isGPT4Expired()}>
              <span class="text-lg text-red-500">GPT4 {i18n.t('expired')}!{i18n.t('expireRemind')}~</span>
            </Show>
            <Show when={!isGPT3Expired()}>
              <span class="text-lg">GPT4 {i18n.t('expireTime')}：</span>
              <Show when={endDate() != null}>
                <span class="text-lg font-bold text-indigo-600">{dateformat(gpt4EndDate()!, 'yyyy-mm-dd HH:MM')}</span>
              </Show>
            </Show>
          </div>
        </Show>


        <Show when={mjEndDate() != null}>
          <div class="flex items-center mb-3  ml-6">
            <img
              src="http://7niu.kaokao.mobi/ai_pro_icon@2x.png"
              alt="VIP icon"
              class="w-7 h-4.5 mr-3"
            />
            <Show when={isMJExpired()}>
              <span class="text-lg text-red-500">MJ {i18n.t('expired')}!{i18n.t('expireRemind')}~</span>
            </Show>
            <Show when={!isMJExpired()}>
              <span class="text-lg w-35">MJ {i18n.t('expireTime')}：</span>
              <Show when={endDate() != null}>
                <span class="text-lg font-bold text-indigo-600">{dateformat(mjEndDate()!, 'yyyy-mm-dd HH:MM')}</span>
              </Show>
            </Show>
          </div>
        </Show>
        <div class="ml-6 flex items-center">
          <span class="text-lg w-35">账户现金余额:{balance()}</span>
          <button
            onClick={props.inviteBtnClick}
            class="font-bold px-4 py-2 rounded-md bg-indigo-500 text-white"
          >
            邀请好友赚现金余额
          </button>
        </div>

        <div class="flex flex-col items-center mt-2">
          <img
            style={{ width: "100%", height: "auto" }}
            src="https://i.imgtg.com/2023/05/04/CkYCM.png"
            alt="QR code"
          />
          <p class="text-gray-600 mt-2">
            如需提现到支付宝请扫码添加坤哥微信
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

export default AccountInfoDialog;
