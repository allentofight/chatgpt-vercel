interface CloseButtonProps {
  onClick: () => void;
}

export default function CircleCloseButton(props: CloseButtonProps) {


  const handleClick = function (e) {
    e.stopPropagation(); // Stop event propagation
    props.onClick();
  };

  return (
    <div
      class='hidden flex justify-center items-center w-9 h-9 border-2 border-solid rounded-full cursor-pointer absolute top-0 right-0 mt-2 mr-2'
      aria-label='关闭'
      role='button'
      tabindex='0'
      onClick={handleClick}
      style="border-color: #D6E0F0;" // Set a lighter border color
    >
      <svg
        aria-hidden='true'
        role='img'
        width='18'
        height='18'
        viewBox='0 0 24 24'
      >
        <path
          fill='#D6E0F0' // Set a lighter SVG color
          d='M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z'
        ></path>
      </svg>
    </div>
  );
};