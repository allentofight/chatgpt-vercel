export default function DeleteConfirm(props: {
  confirmDelete: () => void
  cancelDelete: () => void
}) {
  return (
    <div class="absolute flex right-1 z-10 text-gray-300 visible">
      <button class="p-1 hover:text-white" onMouseDown={props.confirmDelete}>
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg></button>
      <button class="p-1 hover:text-white" onMouseDown={props.cancelDelete}>
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg></button>
    </div>
  );
}