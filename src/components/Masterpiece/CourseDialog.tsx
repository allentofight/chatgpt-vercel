import { createSignal, Accessor, onCleanup, onMount, Show } from "solid-js";

import CircleCloseButton from '../CircleCloseButton'
import { isMobile } from "~/utils";


export default function CourseDialog(props: {
  closeBtnClicked?: () => void
}) {

  type Position = {
    x: number;
    y: number;
  };

  const position = useElementPosition();

  function useElementPosition(): Accessor<Position> {
    const [position, setPosition] = createSignal<Position>({ x: 0, y: 0 });

    onMount(() => {
      const handleResize = () => {
        const x = (window.innerWidth / 2);
        const y = (window.innerHeight / 2);

        setPosition({ x, y });
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      onCleanup(() => {
        window.removeEventListener('resize', handleResize);
      });
    });

    return position;
  }

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-90 pointer-events-none">
      <Show when={isMobile() && props.closeBtnClicked}>
        <CircleCloseButton onClick={props.closeBtnClicked!} />
      </Show>
      <img
        class={`absolute hover-img ${isMobile() ? 'w-6/7' : 'max-w-[233px]'} p-3 z-99`}
        src="https://b1.beisheng.com/common/starchain_self_image/2306/13/course.png"
        style={`top: ${position().y}px; left: ${position().x}px; transform: translate(-50%, -50%);`}
      />
    </div>
  );
}



