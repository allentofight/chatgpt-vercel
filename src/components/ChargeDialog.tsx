
interface ChargeDialogProps {
  closeDialog: () => void;
}

const ChargeDialog = (props: ChargeDialogProps) => {
  const vipEndDate = '2023-05-12'; // example VIP end date

  return (
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" onClick={props.closeDialog}></div>
      <div class="bg-white w-96 p-8 rounded-lg relative">
        <button class="absolute top-2 right-2 p-1" onClick={props.closeDialog}>
          <CloseIcon />
        </button>
        <div class="flex items-center justify-center mb-6">
          <img
            src="http://7niu.kaokao.mobi/ai_pro_icon@2x.png"
            alt="VIP icon"
            class="w-7 h-4.5 mr-4"
          />
          <span class="text-lg">VIP到期时间：</span>
          <span class="text-lg font-bold text-indigo-600">{vipEndDate}</span>
        </div>
        <div class="mb-6">
          <p class="text-gray-600">
            尊敬的VIP会员，您的VIP服务即将到期，请扫码及时续费，以免影响使用体验。
          </p>
        </div>

        <div class="flex flex-col items-center mt-6">
          <img
            style={{ width: "100%", height: "auto" }}
            src="https://iili.io/HkyLlKg.png"
            alt="QR code"
          />
          <p class="text-gray-600 mt-2">
            请扫码添加后续费哦
          </p>
        </div>
      </div>
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

export default ChargeDialog;
