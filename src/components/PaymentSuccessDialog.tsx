export default function PaymentSuccessDialog() {
  return (
    <div class='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center'>
      <div class="bg-white p-8 rounded-lg flex flex-col items-center">
        <h2 class="text-2xl mb-6">恭喜你，充值成功!</h2>
        <p class="mb-4">为保障您的权益，请务必扫码进入会员群哦</p>
        <img class="mb-6" src="https://i.imgtg.com/2023/05/04/CkYCM.png" alt="QR Code" width="432" height="496" />
        <button class="bg-red-500 text-white rounded px-4 py-2" onClick={() => window.location.href = '/'}>
          返回首页
        </button>
      </div>
    </div>
  );
}