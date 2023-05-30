export default function LoginSuccessDialog() {
  return (
    <div class='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center'>
      <div class="bg-white p-8 rounded-lg flex flex-col items-center mx-1">
        <h2 class="text-2xl">微信扫码关注后回复「ai」可领取 AI 资料一份</h2>
        <p class="mb-4"></p>
        <img class="mb-6" src="https://b1.beisheng.com/common/starchain_self_image/2305/30/qrcode_for_gh_fcb08cb582e9_344.jpg" alt="QR Code" width="432" height="496" />
        <button class="bg-red-500 text-white rounded px-4 py-2" onClick={() => window.location.href = '/'}>
          进入首页
        </button>
      </div>
    </div>
  );
}