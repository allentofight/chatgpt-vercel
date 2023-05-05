import { createEffect, Show, onCleanup, onMount, createSignal } from 'solid-js';
import { Spinner } from 'spin.js';
import '../styles/spinner-animation.css';

interface ImageWithSpinnerProps {
  src: string;
  className?: string;
  process?: string; // Add process property
}

export default function ImageWithSpinner(props: ImageWithSpinnerProps) {
  let containerRef!: HTMLDivElement;
  let imgRef!: HTMLImageElement;
  let spinner: Spinner;
  const [isLoading, setIsLoading] = createSignal(true);

  const opts = {
    lines: 13,
    length: 0,
    width: 17,
    radius: 45,
    scale: 1,
    corners: 1,
    speed: 1,
    rotate: 0,
    animation: 'spinner-line-fade-custom',
    direction: 1,
    color: '#ffffff',
    top: '50%',
    left: '50%',
    fadeColor: 'transparent',
    shadow: '0 0 1px transparent',
    zIndex: 2000000000,
    className: 'spinner',
    position: 'absolute',
  };

  onMount(() => {
    spinner = new Spinner(opts).spin(containerRef);
  });

  createEffect(() => {
    if (imgRef) {
      imgRef.onload = () => {
        spinner.stop();
        setIsLoading(false);
      };
    }
  });

  onCleanup(() => {
    spinner.stop();
  });

  return (
    <>
      <div class={`${isLoading() ? `relative bg-gray-500 w-[350px] h-[350px] ${props.className}` : props.className}`} ref={containerRef}>
        <div class="absolute top-0 left-0 w-full h-full flex justify-center items-center" style={`display: ${isLoading() ? 'flex' : 'none'};`}>
          <div ref={containerRef}></div>
          <Show when={
            props.process?.length && isLoading()
          }>
            <div class="absolute text-2xl text-white">{props.process}</div>
          </Show>
        </div>
        <img
          src={props.src}
          alt='开始绘图'
          ref={imgRef}
          class={`${isLoading() ? 'w-[350px] h-[350px] object-none opacity-0' : 'rounded-md object-cover w-full max-w-[350px] opacity-100'} ${props.className}`}
          onLoad={() => {
            imgRef.style.display = '';
          }}
        />
      </div>
    </>
  );
}
