import { createSignal, Show, onMount } from "solid-js";
import toast, { Toaster } from 'solid-toast';
const apiHost = import.meta.env.CLIENT_API_HOST;

const captchaId = import.meta.env.CLIENT_CAPTCHA_ID;

import LoginSuccessDialog from './LoginSuccessDialog'

import GoogleLogin from './GoogleLogin'

import { detectIp } from "~/utils/api"
import i18n from '~/utils/i18n';

export default function LoginDialog(props: {
  title: string,
  buttonTitle: string,
  showBindSuccess?: boolean,
  successCallback?: () => void;
}) {
  let [phone, setPhone] = createSignal("");
  let [code, setCode] = createSignal("");
  let [count, setCount] = createSignal(60);
  let [disabled, setDisabled] = createSignal(false);
  let [submitDisabled, setSubmitDisabled] = createSignal(true);
  let [showLoginSuccess, setShowLoginSuccess] = createSignal(false);
  const [inviteCode, setInviteCode] = createSignal('');
  let [isInChina, setIsInChina] = createSignal(true);

  onMount(async () => {

    const script = document.createElement('script');
    script.src = 'gt4.js';
    script.async = true;
    script.onload = () => {
      // 确保元素存在
      initializeCaptcha()
  };

    // 将 script 元素添加到文档中
    document.body.appendChild(script);

    const queryParams = new URLSearchParams(window.location.search);
    let inviteCode = queryParams.get('inviteCode')
    if (inviteCode) {
      setInviteCode(inviteCode)
    }

    let sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      window.location.href = '/'
    }

    let res = await detectIp()
    setIsInChina(res.isChina)


    let inChina = localStorage.getItem('isInChina')
    if (!inChina) {
      let res = await detectIp()
      setIsInChina(res.isChina)
      localStorage.setItem('isInChina', res.isChina ? '1' : '2')
    } else {
      setIsInChina(inChina === '1')
    }
    localStorage.setItem('isInChina', isInChina() ? '1' : '2')
  })

  const initializeCaptcha = () => {
    initGeetest4({
        captchaId: captchaId,
        product: 'bind',
        riskType:'slide'
    },function (captcha) {
      // captcha为验证码实例
      captcha.onReady(function(){
        }).onSuccess(function(){
          var result = captcha.getValidate();
          if (!result) {
              return alert('请先完成验证');
          }
          //your code
          sendCode(result)
        }).onError(function(){
            //your code
        })
        document.getElementById('sms-code').addEventListener('click', () => {
          if (!isPhoneValid()) {
            toast.error('手机号有误');
            return
          }

          captcha.showCaptcha(); 
        });
      });
  }

  function isPhoneValid() {
    var myreg = /^1[3-9]\d{9}$/;
    return myreg.test(phone())
  }

  const sendCode = async (verifyResult: any) => {

    setDisabled(true);
    let response = await fetch(`${apiHost}/api/auth/sendSmsCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone(),
        ...verifyResult,
      })
    });
    const result = await response.json()
    if (result.success) {
      let intervalId = setInterval(() => {
        setCount(count() - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        setDisabled(false);
        setCount(60);
      }, 60000);
    } else {
      toast.error(result.message)
      setDisabled(false);
    }
  };

  const login = async () => {
    var myreg = /^1[3-9]\d{9}$/;
    if (!myreg.test(phone())) {
      toast.error('手机号有误');
      return
    }

    setSubmitDisabled(true)
    let response = await fetch(`${apiHost}/api/auth/verifySmsCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'phone': phone(),
        'code': code(),
      })
    });
    const result = await response.json()
    if (result.success) {
      const response = await fetch(`${apiHost}/api/auth/signIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone(),
          inviteCode: inviteCode()
        }),
      });


      const result = await response.json()
      if (response.status !== 200) {
        toast.error(result.message, {
          duration: 4000,
        });
        return
      }
      localStorage.setItem('sessionId', result.sessionId)
      localStorage.setItem('inviteCode', result.inviteCode)
      if (props.showBindSuccess) {
        toast.success('恭喜你，绑定成功!');
        props.successCallback!()
      } else {
        toast.success('登录成功，欢迎体验^_^');
        setShowLoginSuccess(true)
      }
    } else {
      toast.error(result.message);
      setSubmitDisabled(false)
    }
  };

  return (
    <>
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-90">
        <div class="bg-white rounded-lg p-6 w-103">

          <h2 class="text-center text-xl mb-6">{props.title}</h2>
          <div class="border p-2">
            <div class="p-2 pt-0 text-lg font-bold text-blue-600">{i18n.t('methodOne')}:</div>
            <div class="mb-4">
              <input
                type="tel"
                class="border rounded w-full py-2 px-3 text-grey-darker"
                placeholder={`${i18n.t('chinesePhoneNum')}`}
                value={phone()}
                onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="flex justify-between items-center mb-4">
              <input
                type="text"
                class="border rounded w-2/3 py-2 px-3 text-grey-darker"
                placeholder={`${i18n.t('verifyCodeNum')}`}
                value={code()}
                onInput={(e) => {
                  setCode((e.target as HTMLInputElement).value);
                  setSubmitDisabled(!(e.target as HTMLInputElement).value); // Update submitDisabled based on the input's value
                }}
              />
              <button
                id="sms-code"
                class={`w-1/3 ml-4 py-2 px-1 rounded ${disabled() ? "bg-gray-300" : "bg-green-500 text-white"} whitespace-nowrap`}
                disabled={disabled()}
              >
                {disabled() ? `${count()}s` : i18n.t('sendSmsCode')}
              </button>
            </div>
            <div class="flex justify-center mt-3">
              <button
                class={`w-full ${submitDisabled() ? 'bg-opacity-50' : ''} py-2 px-4 rounded bg-blue-500 text-white`}
                onClick={login}
                disabled={submitDisabled()}
              >
                {props.buttonTitle}
              </button>
            </div>
          </div>

          <div class="border p-2 mt-6">
            <div class="pb-2 px-2 text-lg font-bold text-blue-600">{i18n.t('methodTwo')}:</div>
            <GoogleLogin />
          </div>
        </div>
        <Toaster position="top-center" />
        <Show when={showLoginSuccess()}>
          <LoginSuccessDialog />
        </Show>
      </div>
      <footer class="footer my-2 fixed bottom-0 flex justify-center w-full z-100" style="background-color: transparent;">
        <div class="footer-link m-auto">
          <a target="_blank" href="https://beian.miit.gov.cn" style="color: white !important;">浙ICP备2023014529号-3</a>
        </div>
      </footer>
  </>
  );
}
