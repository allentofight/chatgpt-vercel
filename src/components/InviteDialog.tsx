import { createEffect, createSignal } from 'solid-js';
const apiHost = import.meta.env.PUBLIC_API_HOST;
import { isLocalStorageAvailable } from "~/utils/localStorageCheck"

const InviteDialog = (props: {
  closeDialog: () => void
}) => {
  const [inviteSuccess, setInviteSuccess] = createSignal(false);


  const handleInvite = async () => {

    if (!isLocalStorageAvailable()) {
      return
    }

    setInviteSuccess(true);
    let inviteCode = localStorage.getItem('inviteCode')
    const inviteLink = `https://codesea.makechat.help/login?inviteCode=${inviteCode}`;
    try {
      // 复制链接到剪贴板
      await navigator.clipboard.writeText(inviteLink);
    } catch (err) {
      console.error("复制失败：", err);
    }
  };

  createEffect(() => {
    if (inviteSuccess()) {
      setTimeout(() => {
        setInviteSuccess(false);
      }, 2000);
    }
  });

  return (
    <div>
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-white w-96 p-8 rounded-lg relative">
          <button class="absolute top-2 right-2 p-1" onClick={props.closeDialog}>
            <CloseIcon />
          </button>
          <h2 class="text-2xl font-bold mb-4">邀请好友享 VIP 权益</h2>
          <p class="mb-6">每邀请一位好友，可增加 6 天 VIP 体验期！上不封顶!</p>
          {!inviteSuccess() && (
            <button
              class="font-bold py-2 px-4 rounded-md w-full bg-indigo-500 text-white"
              onClick={handleInvite}
            >
              立即邀请
            </button>
          )}
          {inviteSuccess() && (
            <div class="text-green-500 font-semibold">邀请链接已复制到剪切板，可以分享给好友啦！</div>
          )}
        </div>
      </div>
      <div
        class="fixed inset-0 bg-black opacity-50"
        onClick={props.closeDialog}
      ></div>
    </div>
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

export default InviteDialog;
