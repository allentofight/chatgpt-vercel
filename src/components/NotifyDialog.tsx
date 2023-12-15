import { createEffect, createSignal } from 'solid-js';

const NotifyDialog = () => {
  const [inviteSuccess, setInviteSuccess] = createSignal(false);
  const handleInvite = async () => {
    let sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      window.location.href = `https://www.nextaibots.cn?sid=${sessionId}`;
    } else {
      window.location.href = `https://www.nextaibots.cn/login`;
    }
  };

  createEffect(() => {
    if (inviteSuccess()) {
      setTimeout(() => {
        setInviteSuccess(false);
      }, 4000);
    }
  });

  return (
    <div>
      <div class="fixed inset-0 flex items-center justify-center z-102">
        <div class="bg-white w-96 p-8 rounded-lg relative">
          <p class="mb-6">网站已切换至 <span class="text-blue-500">https://www.nextaibots.cn</span></p>
          <button
            class="font-bold py-2 px-4 rounded-md w-full bg-indigo-500 text-white"
            onClick={handleInvite}
          >
            立即前往
          </button>
        </div>
      </div>
      <div
        class="fixed inset-0 bg-black opacity-50 z-55"
      ></div>
    </div>
  );
};

export default NotifyDialog;
