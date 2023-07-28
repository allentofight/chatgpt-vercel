import { createSignal, Show } from 'solid-js';
import toast, { Toaster } from 'solid-toast';
import { createPrompt } from "~/utils/api"

type SubmitEvent = {
    preventDefault: () => void;
};


export default function () {
    const [text, setText] = createSignal("");
    const [uploadedImageUrl, setUploadedImageUrl] = createSignal('');

    const [isUploading, setIsUploading] = createSignal(false);

    const handleImageUpload = async (file: File) => {
        setIsUploading(true);

        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 5) {
            toast.error('图片不能大于 5M， 请重新选择');
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("https://api-tt.beisheng.com/japi/outer/api/auth?starchain.operate.upload.image", {
            method: "POST",
            body: formData,
        });

        const res = await response.json();
        if (res.success) {
            let url = res.data;
            setUploadedImageUrl(url);
        } else {
            toast.error('上传失败成功!');
        }
        setIsUploading(false);
    };

    const handleFileChange = (event: Event & { currentTarget: HTMLInputElement }) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        event.currentTarget.value = "";
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        if (!text().length || !uploadedImageUrl()) {
            return
        }

        let flag = await createPrompt(JSON.stringify({ keyWord: text(), corUrl: uploadedImageUrl() }))
        if (flag) {
            toast.success('创建成功!')
        } else {
            toast.error('创建失败，请稍后再试')
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} class="p-2 sm:w-2/3 mx-auto flex flex-col">
                <textarea
                    placeholder="请输入你的 prompt"
                    class="p-2 border border-gray-300 rounded mt-1 mb-2 w-full"
                    onInput={(e: Event & { currentTarget: HTMLTextAreaElement }) => setText(e.currentTarget.value)}
                    rows={3}
                />
                <Show when={uploadedImageUrl().length > 0}>
                    <div class="flex flex-wrap">
                        <img src={uploadedImageUrl()} class="w-full sm:w-1/2 object-cover p-1" alt="" />
                    </div>
                </Show>

                <Show when={uploadedImageUrl().length == 0}>
                    <div class="border-white border flex flex-col items-center p-2">
                        {<p class="text-center text-white my-2">请上传你的文件</p>}
                        <input
                            type="file"
                            class="hidden"
                            id="fileUpload"
                            onChange={handleFileChange}
                        />
                        <label for="fileUpload" class="text-4xl w-24 h-24 border-2 border-dashed border-gray-400 flex justify-center items-center cursor-pointer text-blue-400">
                            +
                        </label>
                    </div>
                </Show>
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Submit
                </button>
            </form>
            <Toaster position="top-center" />
        </div>
    );
}
