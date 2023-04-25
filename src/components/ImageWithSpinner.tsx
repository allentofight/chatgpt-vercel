import { createEffect, onCleanup, onMount } from 'solid-js';
import { Spinner } from 'spin.js';
import '../styles/spinner-animation.css';

interface ImageWithSpinnerProps {
  src: string;
  className?: string;
}

export default function ImageWithSpinner(props: ImageWithSpinnerProps) {
  let containerRef!: HTMLDivElement;
  let imgRef!: HTMLImageElement;
  let spinner: Spinner;

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
      };
    }
  });

  onCleanup(() => {
    spinner.stop();
  });

  return (
    <>
      <style>
        {`
          .image-container {
            width: 350px;
            height: 350px;
            position: relative;
          }

        `}
      </style>
      <div class={props.className} ref={containerRef}>
        <img
          src={props.src}
          alt='开始绘图'
          ref={imgRef}
          class="mt-2 rounded-md"
          style="display: none; width: 350px; height: 350px;"
          onLoad={() => {
            imgRef.style.display = '';
          }}
        />
      </div>
    </>
  );
}
