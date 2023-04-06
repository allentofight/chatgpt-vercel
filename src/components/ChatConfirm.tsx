export default function ChatConfirm(props: {
  edit: () => void
  cancel: () => void
}) {
  return (
    <div class="absolute flex right-1 text-gray-300 visible z-30">
      < button class="p-1 hover:text-white" onMouseDown={props.edit} >
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg></button >
      <button class="p-1 hover:text-white" onMouseDown={props.cancel}>
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg></button>
    </div >
  );
}