import { createSignal, onCleanup, onMount } from "solid-js";

declare global {
  interface WindowEventMap {
    selectOption: CustomEvent<{ index: number, disabled: boolean }>;
  }
}

const options = [
  { title: 'GPT-3.5', description: 'GPT 3.5  模型，仅对充值用户提供。此模型支持 4k token（大约 2000 字）的上下文会话' },
  { title: 'new bing', description: '底层基于当今最先进的 GPT-4 模型，new bing 是一个基于人工智能（AI）的搜索引擎，它可以让你用自然语言提出问题，获取完整的答案，进行聊天和创作。新必应不仅提供了可靠、及时的搜索结果，还会引用相关的来源。你可以用简单或复杂的方式提问，跟进，或在聊天中进行优化。新必应会理解你的意图，并给你惊喜的回复。' },
];

function OptionSelector() {
  const [selectedOption, setSelectedOption] = createSignal(options[0].title); // Changed to string
  const [hoveredIndex, setHoveredIndex] = createSignal(-1);

  const [disabled, setDisabled] = createSignal(false);
  const [isOptionsVisible, setOptionsVisible] = createSignal(false);


  onMount(() => {
    const selectOptionHandler = (event: CustomEvent<{ index: number, disabled: boolean }>) => {
      const index = event.detail.index;
      const selectedOption = options[index - 1].title; // Extract the title here
      setSelectedOption(selectedOption); // Now it's a string
      setDisabled(event.detail.disabled);
    };
    window.addEventListener("selectOption", selectOptionHandler);

    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;
      if ((event.target as HTMLElement).closest("#options-button")) {
        return;
      }
      setOptionsVisible(false);
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("selectOption", selectOptionHandler);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  })

  return (
    <div class="container">
      <span
        id="status-label"
        style={`display: ${disabled() ? 'inline' : 'none'};color:#334155;`}
      >
        Model: {selectedOption()}
      </span>
      <button
        id="options-button"
        class="border border-gray-300 px-3 py-1 rounded text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setOptionsVisible(!isOptionsVisible())}
        disabled={disabled()}
        style={`display: ${disabled() ? 'none' : 'inline'};`}
      >
        <span id="selected-option-text">{selectedOption()}</span>
        <span class="arrow-down ml-1">&#9662;</span>
      </button>
      {isOptionsVisible() && (
        <ul class="absolute bg-white border border-gray-200 rounded shadow-md z-20 max-w-md">
          {options.map((option, index) => (
            <li
              class="group relative border-b border-gray-200 last:border-b-0 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => { setSelectedOption(option.title); setOptionsVisible(false); }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              <div class="flex justify-between items-start">
                <div>
                  {option.title}
                  {selectedOption() === option.title ? <span class="inline-block ml-2 text-green-500">&#x2714;</span> : ''}
                </div>
              </div>
            </li>
          ))}
          {hoveredIndex() !== -1 && (
            <div class="absolute top-0 right-0 mt-2 transform translate-x-full w-64 bg-white border border-gray-300 shadow-md px-3 py-2 z-30" style={`top: ${hoveredIndex() * 2}rem`}>
              {options[hoveredIndex()].description}
            </div>
          )}
        </ul>
      )}
    </div>
  );
}

export default OptionSelector;
