import 'js-circle-progress'

import { Accessor, Show} from 'solid-js';

import CircularProgress from './CircularProgress';


export default function (props: {
    fileName: string,
    value: number; 
    size: Accessor<number>;
    close: () => void
}) {
    return (
        <>
            <style>
                {`
                    
                `}
            </style>
            
            <div class="group relative inline-block text-sm text-black/70 dark:text-white/90">
                <div class="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white">
                    <div class="p-2 dark:bg-gray-600 w-60">
                    <div class="flex flex-row items-center gap-2">
                    <div class="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" class="h-10 w-10 flex-shrink-0" width="36" height="36">
                        <rect width="36" height="36" rx="6" fill="#0000FF"></rect>
                        <path d="M18.833 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V15.5L18.833 9.66663Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M18.833 9.66663V15.5H24.6663" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <Show when={props.size() < 100}>
                        <div class="absolute top-1 left-1">
                            <CircularProgress size={30} strokeWidth={12} progress={props.size} />
                        </div>
                    </Show>
                    
                    </div>
                    <div class="overflow-hidden">
                    <div class="truncate font-medium">
                        {props.fileName}
                    </div>
                    <div class="truncate text-gray-300">
                        文件
                    </div>
                    </div>
                    </div>
                    </div>
                </div>
                <button class="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full border border-white bg-gray-500 p-0.5 text-white transition-colors hover:bg-black hover:opacity-100 group-hover:opacity-100 md:opacity-0" onClick={() => {
                    props.close()
                }}><span class="" data-state="closed">
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg></span>
                </button>
            </div>
        </>
    );
}