import { createSignal, createEffect, onCleanup } from 'solid-js';

interface Option {
  name: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  className: string,
  onClick: () => void
}

const Dropdown = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [selectedOption, setSelectedOption] = createSignal("无");

  const [options, setOptions] = createSignal(props.options);

  const toggleDropdown = () => setIsOpen(!isOpen());

  const selectOption = (option) => {
    setSelectedOption(option.value);
    setIsOpen(false);
    props.onClick()
  };

  // Close the dropdown when clicking outside the button
  const closeDropdown = () => {
    setIsOpen(false);
  };

  createEffect(() => {
    if (isOpen()) {
      document.addEventListener('click', closeDropdown);
    } else {
      document.removeEventListener('click', closeDropdown);
    }
  });

  onCleanup(() => {
    document.removeEventListener('click', closeDropdown);
  });

  return (
    <div class={`relative ${props.className}`}>
      <button
        class="border border-gray-300 rounded-md p-2 flex items-center justify-between w-full"
        data-value={selectedOption()}
        onClick={toggleDropdown}
      >
        <span class="mr-2">{selectedOption() ? options().find((o) => o.value === selectedOption()).name : ''}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>

      </button>
      {isOpen() && (
        <div class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ul
            id="cl-3"
            role="listbox"
            aria-multiselectable="false"
            aria-labelledby="cl-2"
            aria-orientation="vertical"
            tabindex="0"
            data-sh="listbox-options"
            class="py-1"
          >
            {options().map((option, index) => (
              <li
                key={option.value}
                data-sh="button"
                data-sh-active="false"
                aria-selected={selectedOption() === option.value}
                data-sh-selected={selectedOption() === option.value}
                role="option"
                tabindex="-1"
                data-sh-owner="cl-3"
                class="focus:outline-none group"
                onClick={() => selectOption(option)}
              >
                <div
                  class={`text-gray-900 group-hover:text-amber-900 ${selectedOption() === option.value ? 'bg-amber-100' : ''
                    } cursor-default select-none relative py-2 pl-10 pr-4`}
                >

                  <span class={`font-normal block truncate`}>{option.name}</span>
                  {selectedOption() === option.value && (
                    <span class="text-amber-600 group-hover:text-amber-600 absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-5 h-5"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
