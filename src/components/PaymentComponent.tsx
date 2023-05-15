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


  let alipayLogoUrl = 'https://files.mdnice.com/user/1650/15575282-3a57-48ae-b8f3-7d9aa8c58caa.png'

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

    const qrCodeImage = new Image();
    qrCodeImage.src = qrCodeDataURL;
    qrCodeImage.onload = () => {
      const qrCodeCanvas = document.createElement('canvas');
      qrCodeCanvas.width = 256;
      qrCodeCanvas.height = 256;
      const qrCodeCtx = qrCodeCanvas.getContext('2d');
      if (!qrCodeCtx) return;
      qrCodeCtx.drawImage(qrCodeImage, 0, 0);

      const logoImage = new Image();
      logoImage.crossOrigin = 'anonymous'; // 添加这一行
      logoImage.src = '/alipay.png';
      logoImage.onload = () => {
        const logoSize = 64;
        const logoPosition = (qrCodeCanvas.width - logoSize) / 2;
        qrCodeCtx.drawImage(logoImage, logoPosition, logoPosition, logoSize, logoSize);

        const finalDataURL = qrCodeCanvas.toDataURL();
        const finalImage = new Image();
        finalImage.src = finalDataURL;
        qrCodeContainer()!.appendChild(finalImage);
      };
    };
  });

  createEffect(async () => {
    if (parseInt(productId()) > 0) {
      let key = `productid_${productId()}`
      let storage = getItemWithExpiration(key)
      let outTradeNo = ''
      if (storage) {
        storage = JSON.parse(storage)
        outTradeNo = storage.outTradeNo
        setQRDataURL(storage.qrCode)
      } else {
        let result = await requestPayment(productId())
        outTradeNo = result.outTradeNo
        setItemWithExpiration(key, JSON.stringify({
          qrCode: result.qrCode,
          outTradeNo: result.outTradeNo
        }), 1)
        setQRDataURL(result.qrCode)
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
        <h2 class="text-xl text-center">ChatGPT<strong class="text-blue-500">{title()}</strong>购买</h2>
      </div>
      <div ref={setQRCodeContainer}>
      </div>
      <p class="mt-4 bg-[#fef7ea]">{hintText()}</p>
      <Show when={showDialog()}>
        <PaymentSuccessDialog />
      </Show>

    </div>
  );
}
