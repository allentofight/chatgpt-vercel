import { onMount, Setter } from "solid-js";
import throttle from "just-throttle";


let startPointY = 0;
let isDragging = false;

const touchStart = (event: TouchEvent | MouseEvent) => {
  startPointY = ('touches' in event) ? event.touches[0].clientY : event.clientY;
  isDragging = true;
};

const touchEnd = () => {
  isDragging = false;
};

function PullTrack(props: {
  setIsRefreshing: Setter<boolean>
}) {

  const setIsRefreshingThrottled = throttle(props.setIsRefreshing, 200);  // throttle to limit calls to once per 200ms


  const touchMove = (event: TouchEvent | MouseEvent) => {
    if (!isDragging || window.pageYOffset !== 0) return;

    const currentPointY = ('touches' in event) ? event.touches[0].clientY : event.clientY;
    const diffY = startPointY - currentPointY;

    if (diffY < 0) {
      console.log("touch Pulling up detected");
      setIsRefreshingThrottled(true);
      // Your logic here
    } else if (diffY > 0) {
      console.log("Pulling down detected");
      setIsRefreshingThrottled(false);
      // Your logic here
    }

    startPointY = currentPointY;
  };

  const handleWheel = (event: WheelEvent) => {
    if (window.pageYOffset === 0) {
      if (event.deltaY < 0) {
        // console.log("wheel Pulling up detected");
        setIsRefreshingThrottled(true);

        // Your logic here
      } else if (event.deltaY > 0) {
        console.log("Pulling down detected");
        setIsRefreshingThrottled(false);
      }
    }
  };


  onMount(() => {
    window.addEventListener('touchstart', touchStart, false);
    window.addEventListener('mousedown', touchStart, false);

    window.addEventListener('touchmove', touchMove, false);
    window.addEventListener('mousemove', touchMove, false);

    window.addEventListener('touchend', touchEnd, false);
    window.addEventListener('mouseup', touchEnd, false);
    window.addEventListener('mouseout', touchEnd, false);

    window.addEventListener('wheel', handleWheel, { passive: true });


    return () => {
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('mousedown', touchStart);

      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('mousemove', touchMove);

      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('mouseup', touchEnd);
      window.removeEventListener('mouseout', touchEnd);

      window.removeEventListener('wheel', handleWheel);

    };
  });

  return (
    <div>
      {/* Your chat layout here */}
    </div>
  );
}

export default PullTrack;
