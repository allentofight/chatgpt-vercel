// MembershipForm.tsx
import { createSignal } from 'solid-js';
import { extendMemberRights } from '~/utils/api';
import toast, { Toaster } from 'solid-toast';

export default function () {
    const [phoneNumbers, setPhoneNumbers] = createSignal('');
    const [membershipType, setMembershipType] = createSignal('365'); // 默认选择年会员

    const handleSubmit = async () => {
        if (!phoneNumbers().trim()) {
            alert('请输入电话号码!');
            return;
        }

        // 处理提交逻辑，例如发送到API等
        let result = await extendMemberRights(
            JSON.stringify({
                phones: phoneNumbers().trim(),
                days: membershipType(),
            })
        );

        if (result) {
            toast.success('更新成功');
            window.location.href = '/';
        } else {
            toast.error('更新失败');
        }
    };

    return (
        <div class="max-w-md mt-2 mx-auto p-4 bg-white shadow-md rounded-md">
            <textarea
                rows="4"
                class="w-full p-2 border rounded-md"
                placeholder="请输入逗号分隔的手机号码"
                value={phoneNumbers()}
                min-
                onInput={(e: Event) =>
                    setPhoneNumbers((e.target as HTMLTextAreaElement).value)
                }
            ></textarea>
            <select
                class="mt-4 w-full p-2 border rounded-md"
                value={membershipType()}
                onInput={(e: Event) =>
                    setMembershipType((e.target as HTMLSelectElement).value)
                }
            >
                <option value="30">月会员</option>
                <option value="90">季度会员</option>
                <option value="365">年会员</option>
            </select>
            <button
                class="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleSubmit}
            >
                提交
            </button>
            <Toaster position="top-center" />
        </div>
    );
}
