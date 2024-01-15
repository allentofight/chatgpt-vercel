import { Accessor, createSignal, onMount, createEffect } from 'solid-js';

interface CircularProgressProps {
  size: number;       // Size of the progress bar
  strokeWidth: number;// Width of the stroke
  progress: Accessor<number>; // Reactive progress
}

const CircularProgress = (props: CircularProgressProps) => {
  const radius = 50 - props.strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = createSignal(0);

  onMount(() => {
    const progressOffset = ((100 - props.progress()) / 100) * circumference;
    setOffset(progressOffset);
  });

  createEffect(() => {
    setOffset(circumference - (props.progress() / 100) * circumference);
  });

  return (
    <svg
      width={props.size}
      height={props.size}
      class="transform -rotate-90"
      viewBox="0 0 100 100" // Update this line
    >
      <circle
        class="stroke-current text-gray-500"
        fill="transparent"
        stroke-width={props.strokeWidth}
        r={radius}
        cx="50"
        cy="50"
      />
      <circle
        class="stroke-current text-white"
        fill="transparent"
        stroke-width={props.strokeWidth}
        stroke-dasharray={circumference.toString()} // 修改此行
        stroke-dashoffset={offset()}
        r={radius}
        cx="50"
        cy="50"
      />
    </svg>
  );
};

export default CircularProgress;
