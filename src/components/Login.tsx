// src/components/LoginDialog.tsx
import { createSignal, onMount, Show } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
const apiHost = import.meta.env.PUBLIC_API_HOST;
import { useAuth } from "~/utils/useAuth"

export default function LoginDialog() {

  const [email, setEmail] = createSignal('');
  const [inviteCode, setInviteCode] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [resetPasswordMode, setResetPasswordMode] = createSignal(false);
  const [resetPassword, setResetPassword] = createSignal(false);
  const [isResetPasswordConfirm, setIsResetPasswordConfirm] = createSignal(false);
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [isSignUp, setIsSignUp] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [confirmationMessage, setConfirmationMessage] = createSignal('');
  let isInviteCodeConfirmed = false

  onMount(async () => {
    const { isLogin } = useAuth()
    if (isLogin()) {
      window.location.href = '/'
      return
    }

    const queryParams = new URLSearchParams(window.location.search);
    let token = queryParams.get('token')
    let type = queryParams.get('type')
    let inviteCode = queryParams.get('inviteCode')
    if (inviteCode) {
      isInviteCodeConfirmed = true
      setInviteCode(inviteCode)
      setIsSignUp(true)
    }
    setResetPassword(type === 'resetpwd')
    if (type === 'signup' && token) {
      const response = await fetch(`${apiHost}/api/auth/confirmEmail?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json()
      if (response.status !== 200) {
        toast.error(result.message);
      } else {
        toast.success('恭喜你，注册通过，欢迎体验 GPT 网站!', {
          duration: 3000
        });
        localStorage.setItem('sessionId', result.sessionId)
        setTimeout(() => { window.location.href = '/' }, 3000)
      }
    } else if (type === 'resetpwd' && token) {
      const response = await fetch(`${apiHost}/api/auth/validateToken?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json()
      if (response.status !== 200) {
        toast.error(result.message);
      } else {
        setIsResetPasswordConfirm(true)
        setEmail(result.email)
      }
    }
  })

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (!emailInput.validity.valid) {
      toast.error('请输入正确的邮箱地址');
      return;
    }

    if (!resetPasswordMode()) {
      if (passwordInput.value.length < 6) {
        toast.error('邮箱密码至少6位哦');
        return;
      }
    }

    setIsLoading(true)

    if (isSignUp()) {
      // 注册
      const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
      if (confirmPasswordInput.value.length < 6) {
        setIsLoading(false)
        toast.error('邮箱密码至少6位哦');
        return;
      }

      if (confirmPasswordInput.value !== passwordInput.value) {
        toast.error('密码与确认密码需相同');
        setIsLoading(false)
        return;
      }

      try {
        const response = await fetch(`${apiHost}/api/auth/signUp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email(), password: password(), inviteCode: inviteCode() }),
        });

        if (response.status !== 201) {
          setIsLoading(false)
          const error = await response.json()
          toast.error(error.message);
          return
        }
        setIsSignUp(false)
        setIsLoading(false)
        setConfirmationMessage('注册成功！');
        // Handle success
        toast.success('注册成功！验证邮箱就可以登录啦');
      } catch (error) {
        setIsLoading(false)
        // Handle error
        toast.error('Error signing up: ' + error);
      }

    } else if (resetPasswordMode()) {
      const response = await fetch(`${apiHost}/api/auth/resetPwd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email() }),
      });

      if (response.status !== 200) {
        setIsLoading(false)
        toast.error('发送失败，请重试')
        return
      }
      toast.success('请点击我们发送你的邮件来重置密码')
      // 重置密码
      setConfirmationMessage('重置密码邮件发送成功!');
      setIsLoading(false)
    } else if (isResetPasswordConfirm()) {
      // 修改密码
      const response = await fetch(`${apiHost}/api/auth/modifyPwd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email(), password: password() }),
      });

      const result = await response.json()
      if (response.status !== 200) {
        setIsLoading(false)
        toast.error(result.message, {
          duration: 4000,
        });
        return
      }

      toast.success('修改密码成功!请登录后体验GPT', {
        duration: 4000
      });
      setIsLoading(false)
      setResetPassword(false)
      setIsResetPasswordConfirm(false)
    } else {
      // 登录
      const response = await fetch(`${apiHost}/api/auth/signIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email(), password: password() }),
      });

      const result = await response.json()
      if (response.status !== 200) {
        setIsLoading(false)
        toast.error(result.message, {
          duration: 4000,
        });
        return
      }
      localStorage.setItem('sessionId', result.sessionId)
      localStorage.setItem('inviteCode', result.inviteCode)
      toast.success('登录成功，欢迎体验^_^');
      window.location.href = '/'
      setIsLoading(false)
    }

  };

  const handleBackClick = () => {
    setIsSignUp(false);
    setResetPasswordMode(false)
  };

  function getEmailProvider(email: string) {
    const emailDomain = email.split('@')[1];
    switch (emailDomain) {
      case 'gmail.com':
        return 'https://mail.google.com';
      case 'yahoo.com':
        return 'https://mail.yahoo.com';
      case 'hotmail.com':
      case 'outlook.com':
        return 'https://outlook.live.com';
      default:
        return 'https://mail.' + emailDomain;
    }
  }

  function handleConfirmationButtonClick() {
    const emailProvider = getEmailProvider(email());
    window.open(emailProvider, '_blank');
    setConfirmationMessage('');
  }

  function getButtonText(): string {
    if (isSignUp()) {
      return '注册';
    } else if (resetPassword() || isResetPasswordConfirm()) {
      return '确认';
    } if (!resetPasswordMode()) {
      return '登录';
    } else {
      return '确认';
    }
  }

  function getTitle() {
    if (isSignUp()) {
      return '注册';
    } else if (resetPasswordMode() || resetPassword() || isResetPasswordConfirm()) {
      return '重置密码';
    } else {
      return '登录';
    }
  }

  return (
    <>
      <style>
        {`
          label.required::before {
            content: "*";
            color: red;
            margin-right: 0.25em;
          }
          
        
          .spinner {
            display: inline-block;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-left-color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        {confirmationMessage() ? (
          <div class="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-sm mx-2.5 md:mx-auto md:max-w-md">
            <h2 class="mb-4 text-center text-xl font-bold text-gray-700">{confirmationMessage()}</h2>
            <p class="text-center text-gray-600">我们发了一封验证邮件到你的邮箱，请在30分钟内点击确认哦（如果没收到请查看是否在垃圾箱里）</p>
            <button
              class="bg-green-500 text-white py-2 px-4 rounded-md font-bold uppercase w-full mt-4"
              onClick={() => handleConfirmationButtonClick()}
            >
              前往验证&gt;
            </button>
          </div>
        ) : (<div class="bg-gray-100 border border-gray-300 rounded-lg p-6 w-full max-w-sm mx-2.5 md:mx-auto md:max-w-md relative">

          <Show when={isSignUp() || resetPasswordMode()}>
            <button
              class="absolute top-4 left-4 text-gray-600"
              onClick={handleBackClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </Show>

          <h2 class="mb-4 text-center">
            {getTitle()}
          </h2>
          <form onSubmit={handleSubmit} class="space-y-4" novalidate>
            <div>
              <label for="email" class="required block text-sm font-medium mb-2">邮箱:</label>
              <input
                disabled={isResetPasswordConfirm()}
                type="email"
                id="email"
                value={email()}
                onInput={(e: Event) => setEmail((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-2 border border-gray-300 rounded-md"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                required
              />
            </div>
            <Show when={!resetPasswordMode()}>
              <div>
                <label for="password" class="required block text-sm font-medium mb-2">
                  密码:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password()}
                  onInput={(e: Event) => setPassword((e.target as HTMLInputElement).value)}
                  placeholder="请输入密码，密码至少6位"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md"
                  minlength="6"
                  required
                />
              </div>
            </Show>
            <Show when={isSignUp() || resetPassword() || isResetPasswordConfirm()}>
              <div>
                <label
                  for="confirm-password"
                  class="required block text-sm font-medium mb-2"
                >
                  确认密码:
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="请输入确认密码，密码至少6位"
                  value={confirmPassword()}
                  onInput={(e: Event) =>
                    setConfirmPassword(
                      (e.target as HTMLInputElement).value
                    )
                  }
                  class="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                  title="Confirm password must match the password"
                  minlength="6"
                />
              </div>
            </Show>

            <Show when={isSignUp()}>
              <div>
                <label for="inviteCode" class="block text-sm font-medium mb-2">邀请码:</label>
                <input
                  id="inviteCode"
                  disabled={isInviteCodeConfirmed}
                  placeholder="选填,可以不填"
                  value={inviteCode()}
                  onInput={(e: Event) => setInviteCode((e.target as HTMLInputElement).value)}
                  class="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </Show>

            <div class="flex justify-between">
              <button
                disabled={isLoading()}
                class={`bg-green-500 text-white py-2 px-4 rounded-md font-bold uppercase flex-1 mr-2 ${isLoading() ? 'bg-opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading() ? (
                  <>
                    <span class="spinner mr-2" />
                    <span>{getButtonText()}</span>
                  </>
                ) : (
                  getButtonText()
                )}
              </button>
              <Show when={!isSignUp() && !resetPasswordMode() && !resetPassword() && !isResetPasswordConfirm()}>
                <button
                  class="bg-blue-500 text-white py-2 px-4 rounded-md font-bold uppercase"
                  onClick={() => {
                    setIsSignUp(true);
                  }}
                >
                  注册
                </button>
              </Show>
            </div>
          </form>
          <Show when={!isSignUp() && !resetPasswordMode() && !resetPassword() && !isResetPasswordConfirm()}>
            <div class="text-right mt-2">
              <button
                class="text-blue-500 underline hover:text-blue-700 focus:outline-none focus:underline"
                onClick={() => {
                  setResetPasswordMode(true)
                }}
              >
                忘记密码?
              </button>
            </div>
          </Show>
        </div>)}
        <Toaster position="top-center" />
      </div>
    </>
  );
}
