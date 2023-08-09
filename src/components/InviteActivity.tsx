import { createSignal, onMount, Show } from 'solid-js';
import InviteDialog from './InviteDialog'

export default function InviteActivity() {

    const [showDialog, setShowDialog] = createSignal(false);

    const [showInviteDialog, setShowInviteDialog] = createSignal(false);

    let closeDialog = () => {
        const today = new Date().toISOString().split("T")[0]; // 获取 YYYY-MM-DD 格式的日期
        const lastShownDate = localStorage.getItem("showActivity");
        if (lastShownDate !== today) {
            localStorage.setItem("showActivity", today);
        }
        setShowDialog(false)
    }

    onMount(() => {
        const today = new Date().toISOString().split("T")[0]; // 获取 YYYY-MM-DD 格式的日期
        const lastShownDate = localStorage.getItem("showActivity");
        setShowDialog(lastShownDate !== today)
    })

    return (
        <>
            <Show when={showDialog()}>
                <div class="flex flex-col items-end fixed bottom-48 right-3 hidden">
                    <img class="w-6 h-6" src="https://b1.beisheng.com/common/starchain_self_image/2308/08/close.png" onClick={() => {
                        closeDialog()
                    }} />
                    <img class="mt-2 w-[112px] sm:w-[150px] rounded" src="https://b1.beisheng.com/common/starchain_self_image/2308/08/img_v2_2af28970-a500-40f3-b116-b2bf4b5dee0g.jpg"
                        onClick={() => {
                            setShowInviteDialog(true)
                        }} />
                </div>
                <Show when={showInviteDialog()}>
                    <InviteDialog closeDialog={() => {
                        setShowInviteDialog(false)
                    }} />
                </Show>
            </Show>

        </>
    );
}
