export default function PaymentSuccessDialog() {
  return (
    <div class='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center'>
      <div class="bg-white p-8 rounded-lg flex flex-col items-center">
        <h2 class="text-2xl mb-6">恭喜你，充值成功!</h2>
        <p class="mb-4">欢迎扫码添加坤哥微信进GPT技巧群</p>
        <img class="mb-6" src="https://i.loli.wiki/public/230419/WechatIMG6.png" alt="QR Code" width="432" height="418" />
        <button class="bg-red-500 text-white rounded px-4 py-2" onClick={() => window.location.href = '/'}>
          返回首页
        </button>
      </div>
    </div>
  );
}