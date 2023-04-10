export default function LoginGuideDialog(props: {
  title: string
}) {
  const handleAgree = () => {
    window.location.href = '/login';
  };

  return (
    <>
      <div class='fixed inset-0 z-50'>
        <div class="fixed inset-0 bg-gray-900 opacity-70"></div>
        <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
          <h2 class="text-2xl font-bold mb-4">{props.title}</h2>
          <p class="mb-4">登录后可解锁更多功能</p>
          <div class="flex justify-end">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={handleAgree}>登录</button>
          </div>
        </div>
      </div>
    </>
  );
}
