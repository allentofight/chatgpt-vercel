// PaymentComponent.tsx
import { createSignal, onMount, Show, createEffect, onCleanup } from 'solid-js';

import { requestPayment, queryPaymentStatus } from "~/utils/api"

import PaymentSuccessDialog from "./PaymentSuccessDialog";

import QRCode from 'qrcode';

import { setItemWithExpiration, getItemWithExpiration } from "~/utils/orderStorage"


export default function PaymentComponent() {

  let intervalId: number;

  const [title, setTitle] = createSignal('');
  const [productId, setProductId] = createSignal('');
  const [showDialog, setShowDialog] = createSignal(false);

  const [qrDataURL, setQRDataURL] = createSignal<string>('');


  const [hintText, setHintText] = createSignal('加载中...');

  setTimeout(() => { setHintText('注：若二维码过期或因为网络加载不出，请刷新页面') }, 3000)


  const queryOrderStatus = async (outTradeNo: string) => {
    try {
      const response = await queryPaymentStatus(outTradeNo)
      if (response.status == 2) {
        window.clearInterval(intervalId);
        let key = `productid_${productId()}`
        localStorage.removeItem(key)
        setShowDialog(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const generateQRCode = async (qrCodeUrl: string) => {
    try {
      const url = await QRCode.toDataURL(qrCodeUrl);
      setQRDataURL(url);
    } catch (err) {
      console.error(err);
    }
  };
  createEffect(async () => {
    if (parseInt(productId()) > 0) {
      let key = `productid_${productId()}`
      let storage = getItemWithExpiration(key)
      let outTradeNo = ''
      if (storage) {
        storage = JSON.parse(storage)
        outTradeNo = storage.outTradeNo
        generateQRCode(storage.qrCode)
      } else {
        let result = await requestPayment(productId())
        outTradeNo = result.outTradeNo
        setItemWithExpiration(key, JSON.stringify({
          qrCode: result.qrCode,
          outTradeNo: result.outTradeNo
        }), 1)
        generateQRCode(result.qrCode)
      }

      intervalId = window.setInterval(() => {
        queryOrderStatus(outTradeNo)
      }, 3000);

      // Clean up the interval when the component is unmounted or the effect is re-run
      onCleanup(() => {
        clearInterval(intervalId);
      });
    }
  })

  onMount(() => {
    // You can access the query parameters here or do any other initialization logic
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      let id = queryParams.get('id')
      if (id && parseInt(id) < 4) {
        let product = {
          '1': '月度会员',
          '2': '季度会员',
          '3': '年度会员',
        }[id]
        setTitle(product!)
        setProductId(id)
      }
    }

    setTimeout(() => {
      document.querySelector("#root")?.classList.remove("before")
    })
    document.querySelector("#root")?.classList.add("after")
  });

  return (
    <div class="flex flex-col items-center justify-center mt-10">
      <div class="w-full flex justify-center mb-2">
        <h2 class="text-xl text-center">ChatGPT<strong class="text-blue-500">{title()}</strong></h2>
      </div>
      <div class="w-[136px] h-[136px]">
        <img src={qrDataURL()} alt="QR Code" />
      </div>
      <p class="mt-4 bg-[#fef7ea]">请使用支付宝扫码付款</p>
      <p class="mt-4 bg-[#fef7ea]">{hintText()}</p>
      <Show when={showDialog()}>
        <PaymentSuccessDialog />
      </Show>

    </div>
  );
}
