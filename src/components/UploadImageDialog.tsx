import { createSignal, onMount } from "solid-js";
import toast, { Toaster } from 'solid-toast';
import CloseIcon from './CloseIcon'

const apiHost = import.meta.env.CLIENT_IMAGE_URL;

const UploadImageDialog = (props: {
  clickToDraw: (prompt: string) => void,
  onClose: () => void
}) => {
  const [image, setImage] = createSignal<File | null>(null);
  const [uploading, setUploading] = createSignal(false);
  const [preview, setPreview] = createSignal("");
  const [imageUrl, setImageUrl] = createSignal("");
  const [fileInput, setFileInput] = createSignal<HTMLInputElement>();


  onMount(() => {
    setFileInput(document.getElementById('file-upload') as HTMLInputElement);
  });

  const handleUpload = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      const file = inputElement.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setPreview(() => reader.result as string);
          } else {
            // Handle error condition here - could be user feedback or console logging
            console.error("FileReader did not produce a string result");
          }
        };
        reader.readAsDataURL(file);
        setImage(() => file);
      }
    }
    inputElement.value = "";
  };

  const handleImageUpload = async () => {
    setUploading(true)
    const file = image();
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        toast.error('图片不能大于 2M， 请重新选择')
        return
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(apiHost, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('data = ', data)
      if (data.success) {
        setImageUrl(data.data);
        props.clickToDraw(`/imagine ${data.data} `)
      } else {
        toast.error('上传失败成功!');
      }
      setUploading(false)
    }
  };

  return (
    <>
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black opacity-50"></div>

        <div class="bg-white p-6 rounded-md z-10 absolute">
          <button class="absolute top-4 right-4" onClick={props.onClose}>
            <CloseIcon />
          </button>
          <h2 class="text-xl text-center mb-2">上传垫图</h2>
          <label class="w-60 h-60 bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded-md relative">
            <input type="file" accept="image/*" class="hidden" id="file-upload" onChange={handleUpload} />
            {!preview() && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-12 w-12 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
            {preview() && (
              <>
                <img src={preview()} alt="Preview" class="object-cover w-60 h-60 rounded-md" />
                <div class="absolute inset-0 bg-gray-300 opacity-0 hover:opacity-50 flex items-center justify-center rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-12 w-12 text-gray-900">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </>
            )}
          </label>

          <div class="flex justify-center">
            <button
              disabled={uploading()}
              onClick={handleImageUpload} class={`bg-blue-500 hover:bg-blue-700
              ${uploading() ? 'bg-opacity-50' : ''}
              text-white font-bold py-2 px-4 rounded mt-2`}>{uploading() ? '处理中....' : '去垫图'}</button>
          </div>
        </div>
        <Toaster position="top-center" />
      </div>
    </>
  );
};

export default UploadImageDialog;
