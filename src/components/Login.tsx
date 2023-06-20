import { createSignal, Show, onMount } from "solid-js";
import toast, { Toaster } from 'solid-toast';
const apiHost = import.meta.env.CLIENT_API_HOST;

import LoginSuccessDialog from './LoginSuccessDialog'

import CaptchaForm from './CaptchaForm'

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

  onMount(async () => {
    const queryParams = new URLSearchParams(window.location.search);
    let inviteCode = queryParams.get('inviteCode')
    if (inviteCode) {
      setInviteCode(inviteCode)
    }
  })

  function isPhoneValid() {
    var myreg = /^1[3-9]\d{9}$/;
    return myreg.test(phone())
  }

  const sendCode = async () => {

    if (!isPhoneValid()) {
      toast.error('手机号有误');
      return
    }

    const captchaResponse = (window as any).hcaptcha.getResponse();
    if (!captchaResponse) {
      toast.error('请先点击下方验证');
      return
    }

    setDisabled(true);
    let response = await fetch(`${apiHost}/api/auth/sendSmsCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone(),
        token: captchaResponse
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
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-90">
      <div class="bg-white rounded-lg p-6 w-95">
        <h2 class="text-center text-xl mb-6">{props.title}</h2>
        <div class="mb-4">
          <input
            type="tel"
            class="border rounded w-full py-2 px-3 text-grey-darker"
            placeholder="手机号"
            value={phone()}
            onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="flex justify-between items-center mb-4">
          <input
            type="text"
            class="border rounded w-2/3 py-2 px-3 text-grey-darker"
            placeholder="验证码"
            value={code()}
            onInput={(e) => {
              setCode((e.target as HTMLInputElement).value);
              setSubmitDisabled(!(e.target as HTMLInputElement).value); // Update submitDisabled based on the input's value
            }}
          />
          <button
            class={`w-1/3 ml-4 py-2 px-1 rounded ${disabled() ? "bg-gray-300" : "bg-green-500 text-white"} whitespace-nowrap`}
            disabled={disabled()}
            onClick={sendCode}
          >
            {disabled() ? `${count()}s` : "发送验证码"}
          </button>
        </div>
        <div class="flex justify-center">
          <CaptchaForm />
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
      <Toaster position="top-center" />
      <Show when={showLoginSuccess()}>
        <LoginSuccessDialog />
      </Show>
    </div>
  );
}
