// src/components/Dialog.tsx
import { createSignal } from 'solid-js';

export default function FansDialog(props: {
  onClick: () => void
}) {

  return (
    <div class="fixed inset-0 z-10 flex items-center justify-center">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl max-w-lg w-full z-100">
        <h2 class="text-2xl text-center mb-3">ChatGPT大礼包领取</h2>
        <div class="max-h-96 overflow-y-auto">
          <div>
            <h3 class="text-lg">步骤一: 使用微信扫码打开小程序</h3>
            <img src="https://s2.loli.net/2023/04/25/q6PVYIphus8jgxw.jpg" alt="QR Code" class="w-1/2 object-cover rounded-md mt-4 mx-auto" />
          </div>
          <div class="mt-8">
            <h3 class="text-lg">步骤二: 点击第三个tab，点击图中所示按钮即可获取资料</h3>
            <img src="https://s2.loli.net/2023/04/25/Pv8V5LYng2Gtko6.png" alt="Third Tab" class="w-1/2 object-cover rounded-md mt-4 mx-auto" />
          </div>
        </div>
        <div class="mt-4 flex justify-center">
          <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick={props.onClick}>
            进首页
          </button>
        </div>
      </div>
    </div>
  );
}
