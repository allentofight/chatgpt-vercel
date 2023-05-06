import { createSignal } from 'solid-js';

import CircleCloseButton from './CircleCloseButton'

interface DialogProps {
  children: (isDialogOpen: boolean, isOpen: boolean) => any;

}

export default function ImageLargeDialog({ children }: DialogProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const handleClick = () => {
    setIsOpen(!isOpen());
  };

  return (
    <>
      <div onClick={handleClick}>{children(false, isOpen())}</div>
      {isOpen() && (
        <div class="fixed inset-0 bg-red flex justify-center items-center z-99" onClick={handleClick}>
          <div class="mx-1 rounded-md shadow-lg">
            {children(true, isOpen())}
          </div>
          <CircleCloseButton onClick={handleClick} />
        </div>
      )}
    </>
  );
}