import '../../styles/chat-nav.css';
import { createSignal } from 'solid-js';
import { RootStore, loadSession } from "~/store"
const { store, setStore } = RootStore


export default function (props: {
}) {
    const [isHovered, setHovered] = createSignal(false);


    return (
        <>
            <style>
                {`
                    .web-icon-container {
                        padding: 4px 10px;
                        border-radius: 20px;
                        border:1px solid hsla(0,0%,100%,.192);
                        max-width: 38px; /* smaller max-width, adjust if necessary */
                        transition: max-width 0.2s ease-in-out; /* transition on max-width */
                    }
                    .web-icon-container-expanded {
                        max-width: 136px; /* larger max-width, adjust if necessary */
                    }
                    .label {
                        white-space: nowrap; /* Prevent text wrapping */
                    }
                `}
            </style>
            <div class="flex items-center">
                <div
                    class={`web-icon-container overflow-hidden flex items-center text-gray-900 ${store.useWebSearch ? 'bg-blue-500' : 'bg-slate-400'} ease-in-out ${isHovered() ? 'web-icon-container-expanded' : ''}`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => {
                        setStore('useWebSearch', !store.useWebSearch)
                    }}
                >
                    <img src={`/svg/web-search-${store.useWebSearch ? 'selected' : 'empty'}.svg`} style="width:16px;height:16px;" />
                    <label class={`label ml-3 ${isHovered() ? 'visible' : 'hidden'}`}>联网查询</label>
                </div>
            </div>
        </>

    );
}
