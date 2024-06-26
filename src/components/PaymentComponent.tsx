// PaymentComponent.tsx
import { createSignal, onMount, Show, createEffect, onCleanup } from 'solid-js';

import { requestPayment, queryPaymentStatus } from "~/utils/api"

import PaymentSuccessDialog from "./PaymentSuccessDialog";
import QRCode from 'qrcode';

import { useAuth } from "~/utils/useAuth"

export default function PaymentComponent() {

  let intervalId: number;

  const [title, setTitle] = createSignal('');
  const [productId, setProductId] = createSignal('');
  const [options, setOptions] = createSignal('');
  const [showDialog, setShowDialog] = createSignal(false);

  const [qrDataURL, setQRDataURL] = createSignal<string>('');

  const [qrCodeContainer, setQRCodeContainer] = createSignal<HTMLDivElement | null>(null);

  const [hintText, setHintText] = createSignal('加载中...');

  setTimeout(() => { setHintText('注：若二维码加载不出，请稍等片刻刷新页面') }, 2000)


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

  createEffect(async () => {
    if (!qrCodeContainer() || !qrDataURL().length) return;

    const qrCodeDataURL = await QRCode.toDataURL(qrDataURL(), {
      width: 256,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });


    const finalImage = new Image();
    finalImage.src = qrCodeDataURL;
    qrCodeContainer()!.appendChild(finalImage);
  });

  createEffect(async () => {
    if (parseInt(productId()) > 0) {
      let result = await requestPayment(productId(), options())
      let outTradeNo = result.outTradeNo
      setQRDataURL(result.qrCode)

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

    const { isLogin } = useAuth()
    if (!isLogin()) {
      window.location.href = '/login'
      return
    }

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

        let options = queryParams.get('options') as string
        setOptions(options)
      }
    }

  });

  return (
    <>
      <style>
        {`
            .shadow-bg {
              box-shadow: 0px 0px 24px 0px rgba(133,193,255,0.49);
            }
        `}
      </style>
      <div class="flex flex-col items-center justify-center mt-10">
      <div class="w-full flex justify-center mb-2">
        <h2 class="text-xl text-center text-white light:text-black">ChatGPT<strong class="text-blue-500">{title()}</strong>购买</h2>
      </div>
      <div class="shadow-bg" ref={setQRCodeContainer}>
      </div>
      <p class="mt-3 text-white text-xl light:text-black">请使用支付宝扫码付款</p>
      <p class="mt-4 bg-[#fef7ea]">{hintText()}</p>
      <Show when={showDialog()}>
        <PaymentSuccessDialog />
      </Show>

    </div>
    </>
  );
}
