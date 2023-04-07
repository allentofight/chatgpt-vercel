// src/components/LoginDialog.tsx
import { createSignal } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
const apiHost = import.meta.env.PUBLIC_API_HOST;


export default function LoginDialog() {

  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [resetPasswordMode, setResetPasswordMode] = createSignal(false);
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [isSignUp, setIsSignUp] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [confirmationMessage, setConfirmationMessage] = createSignal('');

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
          body: JSON.stringify({ email: email(), password: password() }),
        });

        if (response.status !== 200) {
          setIsLoading(false)
          const error = await response.json()
          toast.error(error.message);
          return
        }
        setIsSignUp(false)
        setIsLoading(false)
        setConfirmationMessage('注册成功！验证邮箱就可以登录啦');
        // Handle success
        toast.success('注册成功！验证邮箱就可以登录啦');
      } catch (error) {
        setIsLoading(false)
        // Handle error
        toast.error('Error signing up: ' + error);
      }

    } else if (resetPasswordMode()) {
      // 重置密码
    } else {
      // 登录
      const response = await fetch(`${apiHost}/api/auth/signIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email(), password: password() }),
      });

      if (response.status !== 200) {
        setIsLoading(false)
        const error = await response.json()
        toast.error(error.message, {
          duration: 5000,
        });
        return
      }
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
    } else if (!resetPasswordMode()) {
      return '登录';
    } else {
      return '确认';
    }
  }

  function getTitle() {
    if (isSignUp()) {
      return '注册';
    } else if (resetPasswordMode()) {
      return '重置密码';
    } else {
      return '登录';
    }
  }

  const handleForgotPasswordClick = async () => {
    if (!email()) {
      toast.error("请先输入邮箱");
      return;
    }

    // Send a request to your server to trigger the password reset email
    const response = await fetch('/api/send-reset-password-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email() }),
    });

    if (response.ok) {
      toast.success("Reset password email sent");
    } else {
      toast.error("Error sending reset password email");
    }
  };

  return (
    <>
      <style>
        {`
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
            <p class="text-center text-gray-600">请查收邮件，按照指示完成邮箱验证。</p>
            <button
              class="bg-green-500 text-white py-2 px-4 rounded-md font-bold uppercase w-full mt-4"
              onClick={() => handleConfirmationButtonClick()}
            >
              知道了
            </button>
          </div>
        ) : (<div class="bg-gray-100 border border-gray-300 rounded-lg p-6 w-full max-w-sm mx-2.5 md:mx-auto md:max-w-md relative">
          {(isSignUp() || resetPasswordMode()) && (
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
          )}
          <h2 class="mb-4 text-center">
            {getTitle()}
          </h2>
          <form onSubmit={handleSubmit} class="space-y-4" novalidate>
            <div>
              <label for="email" class="block text-sm font-medium mb-2">邮箱:</label>
              <input
                type="email"
                id="email"
                value={email()}
                onInput={(e: Event) => setEmail((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-2 border border-gray-300 rounded-md"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                required
              />
            </div>
            {!resetPasswordMode() && (
              <div>
                <label for="password" class="block text-sm font-medium mb-2">
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
            )}
            {isSignUp() && (
              <div>
                <label
                  for="confirm-password"
                  class="block text-sm font-medium mb-2"
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
            )}
            <div class="flex justify-between">
              <button
                type="submit"
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
              {!isSignUp() && !resetPasswordMode() && (
                <button
                  type="button"
                  class="bg-blue-500 text-white py-2 px-4 rounded-md font-bold uppercase"
                  onClick={() => {
                    setIsSignUp(true);
                  }}
                >
                  注册
                </button>
              )}
            </div>
          </form>
          {!isSignUp() && !resetPasswordMode() && (
            <div class="text-right mt-2">
              <button
                class="text-blue-500 underline hover:text-blue-700 focus:outline-none focus:underline"
                type="button"
                onClick={() => {
                  setResetPasswordMode(true)
                }}
              >
                忘记密码?
              </button>
            </div>
          )}
        </div>)}
        <Toaster position="top-center" />
      </div>
    </>
  );
}
