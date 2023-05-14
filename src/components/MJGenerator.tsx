import { createSignal, onMount, Setter, onCleanup } from 'solid-js';

import CircleCloseButton from './CircleCloseButton'

import { sendMjTranslate } from "~/utils/api"

import CustomSelect from './CustomSelect';

const generatePrompt = () => {
  // Get all form elements
  const formElements = document.querySelectorAll('input, button[data-value], select, textarea');
  // Start building the command
  let command = '';

  // Add the prompt
  command += ` ${document.getElementById('prompt').value}`;

  // Add the other form elements
  formElements.forEach((element) => {
    if (element.value.includes('showPrompt')) {
      return;
    }


    if (element.type === 'submit') {
      const dataValue = element.getAttribute('data-value');
      if (dataValue !== '无') {
        command += `, ${dataValue}`;
      }
    } else if (element.type === 'checkbox') {
      if (element.checked) {
        if (element.classList.contains('checkbox-value')) {
          command += `, ${element.value}`;
        } else {
          command += ` --${element.id}`;
        }
      }
    } else if (
      element.id !== 'computed-prompt' &&
      element.id != 'input' &&
      element.id !== 'prompt' && element.value
    ) {
      if (element.classList.contains('full-text-option-select')) {
        command += `, ${element.value}`;
      } else if (element.classList.contains('full-text-option-value-select')) {
        command += `, ${element.options[element.selectedIndex].text}`;
      } else {
        command += ` --${element.name} ${element.value}`;
      }
    }
  });

  // Update the prompt textarea
  const computedPrompt = document.getElementById('computed-prompt') as HTMLTextAreaElement;

  computedPrompt.value = command;
};

function containsChineseCharacters(str: string) {
  const regex = /[\u4E00-\u9FFF]/;
  return regex.test(str);
}

const copyToClipBoard = (sendPrompt?: Setter<string>) => {
  let copyButton = document.getElementById('copy-button')
  copyButton?.addEventListener('click', async () => {
    let computedPrompt = document.getElementById('computed-prompt')

    if (!computedPrompt?.value) {
      return
    }

    if (copyButton) {
      copyButton.innerHTML = "翻译复制中";
      copyButton.disabled = true;
      copyButton.style.opacity = 0.5;
    }

    let result = { message: { content: computedPrompt?.value } }

    if (containsChineseCharacters(computedPrompt?.value)) {
      result = await sendMjTranslate({ prompt: computedPrompt?.value })
    }

    if (result.message) {
      copyButton.disabled = false;
      copyButton.style.opacity = 1;
      let content = result.message.content.replace(/"/g, '').replace(/\.$/, '');
      sendPrompt(content)
      copyButton.innerHTML = "复制到剪切板";
      computedPrompt.value = content
    }
  });
}

const MJGenerator = (props: {
  handleClick: () => void,
  setPrompt?: Setter<string>
}) => {
  const [htmlContent, setHtmlContent] = createSignal<string>("<div></div>");

  const [container, setContainer] = createSignal<HTMLDivElement>();
  const [computedPromptDiv, setComputedPromptDiv] = createSignal<HTMLDivElement>();


  onMount(() => {

    document.querySelectorAll('input, select, textarea').forEach((element) => {
      element.addEventListener('input', generatePrompt);
    });
    copyToClipBoard(props.setPrompt)

    const setComputedPromptDivWidth = () => {
      computedPromptDiv().style.width = `${container().offsetWidth}px`;
    };

    setComputedPromptDivWidth();

    window.addEventListener("resize", setComputedPromptDivWidth);

    onCleanup(() => {
      window.removeEventListener("resize", setComputedPromptDivWidth);
    });
  });

  return (
    <>
      <style>
        {`
          select.minimal {
            background-image:
              linear-gradient(45deg, transparent 50%, gray 50%),
              linear-gradient(135deg, gray 50%, transparent 50%),
              linear-gradient(to right, #ccc, #ccc);
            background-position:
              calc(100% - 20px) calc(1em + 2px),
              calc(100% - 15px) calc(1em + 2px),
              calc(100% - 2.5em) 0.5em;
            background-size:
              5px 5px,
              5px 5px,
              1px 1.5em;
            background-repeat: no-repeat;
          }

          select.minimal:focus {
            background-image:
              linear-gradient(45deg, green 50%, transparent 50%),
              linear-gradient(135deg, transparent 50%, green 50%),
              linear-gradient(to right, #ccc, #ccc);
            background-position:
              calc(100% - 15px) 1em,
              calc(100% - 20px) 1em,
              calc(100% - 2.5em) 0.5em;
            background-size:
              5px 5px,
              5px 5px,
              1px 1.5em;
            background-repeat: no-repeat;
            border-color: green;
            outline: 0;
          }
        `}
      </style>
      <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-90">
        <div
          ref={setContainer}
          class="mx-auto my-3 px-6 sm:max-w-sm md:max-w-md lg:max-w-7xl  bg-white overflow-y-auto rounded pb-37">
          <div>
            <h1 class="text-center mb-5 pt-5 text-sky-500 text-lg">Midjourney Prompt生成器</h1>
            <div id="description" class="text-center mb-5">
              <p>
                对于刚接触智能AI绘画工具的新手，编写绘画关键词（Prompts ）是个很头疼的事情。这个智能AI绘画关键词（Prompts
                ）的生成工具，可以自动生成规范的AI绘画关键词，提供色彩、风格、插画师、图片比例等描述词，让你更准确的描述出想要的画面。这个工具可以根据文本输入和各种选项生成中途提示。只需在下面输入提示和所需的选项，应用程序就会为您生成提示。
              </p>
            </div>
          </div>

          <div class="border bg-[#F5FAFF] p-4 rounded">
            <h5 class="mb-2 text-lg font-medium">Prompt</h5>
            <p class="mb-2">请在这里输入你的关键prompt</p>
            <textarea placeholder="支持中文输入" id="prompt" class="p-3 w-full border rounded" rows="3"></textarea>
          </div>

          <div class="border p-4 mt-2 rounded">
            <h5 class="mb-2 text-lg font-medium">否定提示词（No）</h5>
            <p class="mb-2">否定提示（例如--no plants表示尝试去除植物）相当于使用高级文本权重::-0.5。</p>
            <input placeholder="不想在图片里看到的" class="p-2 w-full border rounded" id="no" name="no"></input>
          </div>

          <div class="flex flex-col mt-2 sm:flex-row">
            <div class="p-4 border mr-5 w-full rounded">
              <h5 class="mb-3 text-lg font-medium">风格</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "acrylic", name: "丙烯" },
                { value: "watercolor", name: "水彩" },
                { value: "oil", name: "油画" },
                { value: "pastel", name: "粉笔画" },
                { value: "pen-ink", name: "钢笔画" },
                { value: "graphite", name: "石墨" },
                { value: "charcoal", name: "炭画" },
                { value: "colored-pencil", name: "彩铅画" },
                { value: "marker", name: "马克笔画" },
                { value: "pencil-crayon", name: "蜡笔画" },
                { value: "clay", name: "黏土" },
                { value: "sculpture", name: "雕塑" },
                { value: "photography", name: "摄影" },
                { value: "printmaking", name: "版画" },
                { value: "collage", name: "拼贴画" },
                { value: "assemblage", name: "组合画" },
                { value: "textile-art", name: "纺织品艺术" },
                { value: "digital-art", name: "数字艺术" }]}
                className="w-full"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
            <div class="p-4 border w-full rounded">
              <h5 class="mb-3 text-lg font-medium">光线</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "natural-light", name: "自然光" },
                { value: "cinematic", name: "电影照明" },
                { value: "contrejour", name: "逆光照明" },
                { value: "dramatic", name: "戏剧照明" },
                { value: "tungsten-light", name: "钨丝灯光" },
                { value: "fluorescent-light", name: "荧光灯光" },
                { value: "umbrella", name: "遮阳伞" },
                { value: "barn-doors", name: "谷仓门" },
                { value: "grid-spot", name: "网格灯光" },
                { value: "reflector", name: "反光板" },
                { value: "lantern", name: "灯笼" },
                { value: "icicle-lights", name: "冰柱灯光" },
                { value: "string-lights", name: "串灯" },
                { value: "neon-lights", name: "霓虹灯光" },
                { value: "flood-light", name: "洪灯" },
                { value: "spot-light", name: "聚光灯" },
                { value: "stage-light", name: "舞台灯光" },
                { value: "work-light", name: "工作灯" },
                { value: "atmospheric", name: "氛围照明" },
                { value: "auroraborealis", name: "极光" },
                { value: "backlight", name: "背景灯" },
                { value: "backlit", name: "背光照明" },
                { value: "bioluminescence", name: "生物发光" },
                { value: "blacklight", name: "紫外灯" },
                { value: "bright", name: "明亮照明" },
                { value: "campfire", name: "篝火灯光" },
                { value: "candlelight", name: "烛光" },
                { value: "crepuscular", name: "暮光" },
                { value: "daylight", name: "白天光" },
                { value: "dusk", name: "黄昏" },
                { value: "earlymorning", name: "早晨" },
                { value: "fullmoon", name: "满月" },
                { value: "goldenhour", name: "金色阳光" },
                { value: "indoor", name: "室内照明" },
                { value: "infrared", name: "红外线照明" },
                { value: "laser", name: "激光灯" },
                { value: "lateafternoon", name: "傍晚" },
                { value: "moonlight", name: "月光" },
                { value: "natural", name: "自然光" },
                { value: "nightlight", name: "夜光" },
                { value: "pink", name: "粉色灯光" },
                { value: "prismatic", name: "棱柱光" },
                { value: "rainbow", name: "彩虹光" },
                { value: "red", name: "红色光" },
                { value: "reflection", name: "反射光" },
                { value: "side", name: "侧面光" },
                { value: "stage", name: "舞台灯光" },
                { value: "studio", name: "工作室灯光" },
                { value: "sunset", name: "日落光" },
                { value: "task", name: "任务灯光" },
                { value: "uplight", name: "向上照明" },
                { value: "uv", name: "紫外线光" },
                { value: "warm", name: "暖色调光" },
                { value: "white", name: "白色光" }]}
                className="w-full"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
          </div>

          <div class="border p-4 mt-2 rounded">
            <h5 class="mb-3 text-lg font-medium">画质强化词</h5>
            <div class="flex flex-wrap">
              <div class="flex items-center mr-2 mb-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="high-detail" value="high detail" />
                <label class="form-check-label ml-1" for="high-detail">高细节</label>
              </div>

              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="hyper-quality" value="hyper quality" />
                <label class="form-check-label ml-1" for="hyper-quality">高品质</label>
              </div>


              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="high-resolution" value="high resolution" />
                <label class="form-check-label ml-1" for="high-resolution">高分辨率</label>
              </div>

              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="htrending-on-artstation" value="trending on artstation" />
                <label class="form-check-label ml-1" for="trending-on-artstation">Artstation上趋势</label>
              </div>



              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="hyperrealism" value="hyperrealism" />
                <label class="form-check-label ml-1" for="hyperrealism">超写实主意</label>
              </div>



              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="surrealism" value="surrealism" />
                <label class="form-check-label ml-1" for="surrealism">超现实主义</label>
              </div>



              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="khd" value="HD" />
                <label class="form-check-label ml-1" for="khd">HD</label>
              </div>


              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="k8k" value="8K" />
                <label class="form-check-label ml-1" for="k8k">8K</label>
              </div>

              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="k16k" value="16K" />
                <label class="form-check-label ml-1" for="k16K">16K</label>
              </div>
            </div>
          </div>

          <div class="border p-4 mt-2 rounded">
            <h5 class="mb-3 text-lg font-medium">画家</h5>

            <div class="flex flex-wrap">

              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-vincent-van-gogh" value="by Vincent van Gogh" />
                <label class="form-check-label ml-1" for="painter-vincent-van-gogh">文森特·梵高</label>
              </div>
              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-claude-monet" value="by Claude Monet" />
                <label class="form-check-label ml-1" for="painter-claude-monet">克劳德·莫奈</label>
              </div>
              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-rembrandt" value="by Rembrandt" />
                <label class="form-check-label ml-1" for="painter-rembrandt">伦勃朗</label>
              </div>
              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-paul-cezanne" value="by Paul Cézanne" />
                <label class="form-check-label ml-1" for="painter-paul-cezanne">保罗·塞尚</label>
              </div>
              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-salvador-dali" value="by Salvador Dali" />
                <label class="form-check-label ml-1" for="painter-salvador-dali">萨尔瓦多·达利</label>
              </div>
              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-pablo-picasso" value="by Pablo Picasso" />
                <label class="form-check-label ml-1" for="painter-pablo-picasso">巴勃罗·毕加索</label>
              </div>
              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-henri-matisse" value="by Henri Matisse" />
                <label class="form-check-label ml-1" for="painter-henri-matisse">
                  亨利·马蒂斯</label>
              </div>

              <div class="flex items-center mr-2 mb-2">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-" value="by Frida Kahlo" />
                <label class="form-check-label ml-1" for="painter-frida-kahlo">弗里达·卡罗</label>
              </div>
              <div class="flex items-center mr-2 mb-2 checkbox-value">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-johannes-vermeer" value="by Johannes Vermeer" />
                <label class="form-check-label ml-1" for="painter-johannes-vermeer">约翰内斯·维米尔</label>
              </div>
              <div class="flex items-center mr-2 mb-2 checkbox-value">
                <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-leonardo-da-vinci" value="by Leonardo da Vinci" />
                <label class="form-check-label ml-1" for="painter-leonardo-da-vinci">
                  莱昂纳多·达·芬奇</label>
              </div>
              <div class="collapse hidden" id="collapsePainters">
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-michelangelo" value="by Michelangelo" />
                  <label class="form-check-label ml-1" for="painter-michelangelo">米开朗琪罗</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-edgar-degas" value="by Edgar Degas" />
                  <label class="form-check-label ml-1" for="painter-edgar-degas">爱德加·德加</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-jan-vermeer" value="by Jan Vermeer" />
                  <label class="form-check-label ml-1" for="painter-jan-vermeer">扬·弗梅尔</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-pierre-auguste-renoir" value="by Pierre-Auguste Renoir" />
                  <label class="form-check-label ml-1" for="painter-pierre-auguste-renoir">皮埃尔-奥古斯特·雷诺阿</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-gustav-klimt" value="by Gustav Klimt" />
                  <label class="form-check-label ml-1" for="painter-gustav-klimt">古斯塔夫·克里姆特</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-edvard-munch" value="by Edvard Munch" />
                  <label class="form-check-label ml-1" for="painter-edvard-munch">爱德华·蒙克</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-georgia-okeeffe" value="by Georgia O'Keeffe" />
                  <label class="form-check-label ml-1" for="painter-georgia-okeeffe">乔治亚·欧姬芙</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-henri-de-toulouse-lautrec" value="by Henri de Toulouse-Lautrec" />
                  <label class="form-check-label ml-1" for="painter-henri-de-toulouse-lautrec">亨利·图卢兹-洛特列克</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-franz-marc" value="by Franz Marc" />
                  <label class="form-check-label ml-1" for="painter-franz-marc">弗朗茨·马克</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-giovanni-bellini" value="by Giovanni Bellini" />
                  <label class="form-check-label ml-1" for="painter-giovanni-bellini">
                    乔凡尼·贝利尼</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-hieronymus-bosch" value="by Hieronymus Bosch" />
                  <label class="form-check-label ml-1" for="painter-hieronymus-bosch">耶罗尼穆斯·博世</label>
                </div>
                <div class="flex items-center mr-2 mb-2">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-grant-wood" value="by Grant Wood" />
                  <label class="form-check-label ml-1" for="painter-grant-wood">格兰特·伍德</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-edward-hopper" value="by Edward Hopper" />
                  <label class="form-check-label ml-1" for="painter-edward-hopper">爱德华·霍珀</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-mary-cassatt" value="by Mary Cassatt" />
                  <label class="form-check-label ml-1" for="painter-mary-cassatt">玛丽·卡萨特</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-albrecht-durer" value="by Albrecht Dürer" />
                  <label class="form-check-label ml-1" for="painter-albrecht-durer">阿尔布雷希特·杜勒</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-paul-gauguin" value="by Paul Gauguin" />
                  <label class="form-check-label ml-1" for="painter-paul-gauguin">保罗·高更</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-john-singer-sargent" value="by John Singer Sargent" />
                  <label class="form-check-label ml-1" for="painter-john-singer-sargent">约翰·辛格·萨金特</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-titian" value="by Titian" />
                  <label class="form-check-label ml-1" for="painter-titian">Titian</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-caravaggio" value="by Caravaggio" />
                  <label class="form-check-label ml-1" for="painter-caravaggio">卡拉瓦乔</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-francisco-goya" value="by Francisco Goya" />
                  <label class="form-check-label ml-1" for="painter-francisco-goya">弗朗西斯科·戈雅</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-john-constable" value="by John Constable" />
                  <label class="form-check-label ml-1" for="painter-john-constable">约翰·康斯特布尔</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-caspar-david-friedrich" value="by Caspar David Friedrich" />
                  <label class="form-check-label ml-1" for="painter-caspar-david-friedrich">卡斯帕·大卫·弗里德里希</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-william-morris" value="by William Morris" />
                  <label class="form-check-label ml-1" for="painter-william-morris">威廉·莫里斯</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-pierre-bonnard" value="by Pierre Bonnard" />
                  <label class="form-check-label ml-1" for="painter-pierre-bonnard">皮埃尔·博纳尔</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-camille-pissarro" value="by Camille Pissarro" />
                  <label class="form-check-label ml-1" for="painter-camille-pissarro">卡米尔·毕沙罗</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-paul-klee" value="by Paul Klee" />
                  <label class="form-check-label ml-1" for="painter-paul-klee">保罗·克利</label>
                </div>
                <div class="flex items-center mr-2 mb-2 checkbox-value">
                  <input class="form-check-input checkbox-value w-6 h-6" type="checkbox" id="painter-Rene-Magritte" value="by Rene Magritte" />
                  <label class="form-check-label ml-1" for="painter-Rene-Magritte">勒内·马格利特</label>
                </div>

              </div>
              <a class="btn btn-link hidden" data-bs-toggle="collapse" href="#collapsePainters" role="button" aria-expanded="false" aria-controls="collapsePainters">
                显示全部
              </a>

            </div>
          </div>


          <div class="flex flex-col mt-2 sm:flex-row">
            <div class="p-4 border mr-5 w-full rounded">
              <h5 class="mb-3 text-lg font-medium">艺术风格</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "Abstract Expressionism", name: "抽象表现主义" },
                { value: "Art Deco", name: "装饰艺术" },
                { value: "Art Nouveau", name: "新艺术运动" },
                { value: "Baroque", name: "巴洛克风格" },
                { value: "Classicism", name: "古典主义" },
                { value: "Cubism", name: "立体派" },
                { value: "Dada", name: "达达主义" },
                { value: "Expressionism", name: "表现主义" },
                { value: "Fauvism", name: "野兽派" },
                { value: "Futurism", name: "未来主义" },
                { value: "Impressionism", name: "印象主义" },
                { value: "Mannerism", name: "后期文艺复兴风格" },
                { value: "Minimalism", name: "极简主义" },
                { value: "Modernism", name: "现代主义" },
                { value: "Neoclassicism", name: "新古典主义" },
                { value: "Post-Impressionism", name: "后印象派" },
                { value: "Realism", name: "写实主义" },
                { value: "Rococo", name: "洛可可风格" },
                { value: "Romanticism", name: "浪漫主义" },
                { value: "Surrealism", name: "超现实主义" },
                { value: "Symbolism", name: "象征主义" }
              ]}
                className="w-full z-99"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
            <div class="p-4 border w-full rounded">
              <h5 class="mb-3 text-lg font-medium">渲染引擎</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "unreal", name: "虚幻引擎" },
                { value: "unity", name: "Unity" },
                { value: "cryengine", name: "CryEngine" },
                { value: "source", name: "Source引擎" },
                { value: "havok", name: "Havok引擎" },
                { value: "gamemaker", name: "GameMaker" },
                { value: "frostbite", name: "Frostbite引擎" },
                { value: "renderman", name: "RenderMan" },
                { value: "mudbox", name: "Mudbox" },
                { value: "blender", name: "Blender" },
                { value: "3ds-max", name: "3ds Max" },
                { value: "maya", name: "Maya" },
                { value: "cinema-4d", name: "Cinema 4D" },
                { value: "houdini", name: "Houdini" },
                { value: "arnold", name: "Arnold渲染器" },
                { value: "v-ray", name: "V-Ray渲染器" },
                { value: "keyshot", name: "Keyshot渲染器" },
                { value: "modo", name: "Modo" },
                { value: "zbrush", name: "ZBrush" },
                { value: "substance-designer", name: "Substance Designer材质编辑器" },
              ]}
                className="w-full z-100"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
          </div>


          <div class="flex flex-col mt-2 sm:flex-row">
            <div class="p-4 border mr-5 w-full rounded">
              <h5 class="mb-3 text-lg font-medium">视角</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "aerial", name: "空气透视" },
                { value: "atmospheric", name: "大气透视" },
                { value: "bird's-eye", name: "鸟瞰透视" },
                { value: "close-up", name: "特写透视" },
                { value: "dutch-angle", name: "荷兰倾斜透视" },
                { value: "fish-eye", name: "鱼眼透视" },
                { value: "high-angle", name: "俯角透视" },
                { value: "low-angle", name: "仰角透视" },
                { value: "macro", name: "微距透视" },
                { value: "normal", name: "正常透视" },
                { value: "overhead", name: "俯视透视" },
                { value: "panoramic", name: "全景透视" },
                { value: "pov", name: "视角透视" },
                { value: "rising-angle", name: "升角透视" },
                { value: "rule-of-thirds", name: "三分法透视" },
                { value: "side-angle", name: "侧面透视" },
                { value: "slanted-angle", name: "斜角透视" },
                { value: "top-down", name: "俯视透视" },
                { value: "trompe-l'œil", name: "立体画透视" },
                { value: "worm's-eye", name: "蚯蚓视角透视" }
              ]}
                className="w-full z-98"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
            <div class="p-4 border w-full rounded">
              <h5 class="mb-3 text-lg font-medium">材质</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "acrylic", name: "由丙烯制成" },
                { value: "bronze", name: "由青铜制成" },
                { value: "ceramic", name: "由陶瓷制成" },
                { value: "copper", name: "由铜制成" },
                { value: "cotton", name: "由棉制成" },
                { value: "leather", name: "由皮革制成" },
                { value: "linen", name: "由亚麻制成" },
                { value: "gold", name: "由金制成" },
                { value: "iron", name: "由铁制成" },
                { value: "marble", name: "由大理石制成" },
                { value: "nylon", name: "由尼龙制成" },
                { value: "paper", name: "由纸制成" },
                { value: "plastic", name: "由塑料制成" },
                { value: "rubber", name: "由橡胶制成" },
                { value: "silver", name: "由银制成" },
                { value: "steel", name: "由钢铁制成" },
                { value: "stone", name: "由石头制成" },
                { value: "silk", name: "由丝绸制成" },
                { value: "wool", name: "由羊毛制成" },
                { value: "bamboo", name: "由竹子制成" },
                { value: "glass", name: "由玻璃制成" },
                { value: "grass", name: "由草制成" },
                { value: "ice", name: "由冰制成" },
                { value: "wood", name: "由木头制成" },
                { value: "clay", name: "由黏土制成" },
                { value: "concrete", name: "由混凝土制成" },
                { value: "crystal", name: "由水晶制成" },
                { value: "feather", name: "由羽毛制成" },
                { value: "jute", name: "由黄麻制成" }
              ]}
                className="w-full z-99"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
          </div>

          <div class="flex flex-col mt-2 sm:flex-row">
            <div class="p-4 border mr-5 w-full rounded">
              <h5 class="mb-3 text-lg font-medium">相机</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "dslr", name: "单反相机" },
                { value: "mirrorless", name: "无反相机" },
                { value: "point-and-shoot", name: "便携式数码相机" },
                { value: "film", name: "胶片相机" },
                { value: "medium-format", name: "中画幅相机" },
                { value: "large-format", name: "大画幅相机" },
                { value: "disposable", name: "一次性相机" },
                { value: "instant", name: "即影即有相机" },
                { value: "rangefinder", name: "测距相机" },
                { value: "action", name: "运动相机" },
                { value: "drone", name: "无人机相机" },
                { value: "smartphone", name: "手机相机" },
                { value: "gopro", name: "Go-Pro 相机" },
                { value: "trail", name: "狩猎相机" },
                { value: "security", name: "安防相机" },
                { value: "underwater", name: "水下相机" },
                { value: "toy", name: "玩具相机" },
                { value: "pinhole", name: "针孔相机" },
                { value: "camera-obscura", name: "暗箱相机" },
                { value: "holga", name: "Holga 相机" },
              ]}
                className="w-full z-97"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
            <div class="p-4 border w-full rounded">
              <h5 class="mb-3 text-lg font-medium">滤镜</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "polarizing", name: "偏光镜" },
                { value: "neutral-density", name: "中性密度滤镜" },
                { value: "graduated-neutral-density", name: "渐变中性密度滤光片" },
                { value: "uv", name: "紫外线过滤器" },
                { value: "fluorescent", name: "荧光滤光片" },
                { value: "warming", name: "加热过滤器" },
                { value: "cooling", name: "冷却过滤器" },
                { value: "red", name: "红色滤镜" },
                { value: "orange", name: "橙色过滤器" },
                { value: "yellow", name: "黄色滤镜" },
                { value: "green", name: "绿色滤镜" },
                { value: "blue", name: "蓝色滤镜" },
                { value: "purple", name: "紫色滤镜" },
                { value: "pink", name: "粉色滤镜" },
                { value: "infrared", name: "红外滤光片" },
                { value: "star", name: "星形过滤器" },
                { value: "soft-focus", name: "柔焦滤镜" },
                { value: "vignette", name: "晕影滤镜" },
                { value: "diffuser", name: "扩散过滤器" },
                { value: "fog", name: "牙齿过滤器" },
              ]}
                className="w-full"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
          </div>


          <div class="flex flex-col mt-2 sm:flex-row">
            <div class="p-4 border mr-5 w-full rounded">
              <h5 class="mb-3 text-lg font-medium">场景类型</h5>
              <CustomSelect options={[
                { value: "无", name: "无" },
                { value: "aerial", name: "航拍场景" },
                { value: "animated", name: "动画场景" },
                { value: "character", name: "人物拍摄场景" },
                { value: "cutaway", name: "切角镜头场景" },
                { value: "documentary", name: "纪录片场景" },
                { value: "dramatic", name: "戏剧性的一幕" },
                { value: "fantasy", name: "奇幻场景" },
                { value: "horror", name: "恐怖场景" },
                { value: "landscape", name: "风景拍摄现场" },
                { value: "music-video", name: "音乐视频场景" },
                { value: "mystery", name: "神秘现场" },
                { value: "nature", name: "自然风光" },
                { value: "news", name: "新闻现场" },
                { value: "romance", name: "浪漫场景" },
                { value: "sci-fi", name: "科幻场景" },
                { value: "sports", name: "运动场景" },
                { value: "talk-show", name: "脱口秀现场" },
                { value: "war", name: "战争场面" },
                { value: "western", name: "西景" },
              ]}
                className="w-full"
                onClick={() => {
                  generatePrompt()
                }}
              ></CustomSelect>
            </div>
            <div class="p-4 border w-full rounded">
              <h5 class="mb-3 text-lg font-medium">混沌程度</h5>
              <p class="mb-2">表示结果的多样性、随机性和差异性有多大。取值范围为0-100。数值越高，代表更有趣、更不寻常的生成结果，但组合的可靠性会下降。</p>
              <input type="number" class="p-1 w-full border rounded" id="chaos" name="chaos" min="0" max="100"></input>
            </div>
          </div>

          <div class="flex flex-col mt-2 sm:flex-row">
            <div class="p-4 border mr-5 w-full rounded">
              <h5 class="mb-3 text-lg font-medium">图像权重（IW）</h5>
              <p class="mb-2">设置相对于文本权重的图像提示权重。默认值为 0.25。</p>
              <input type="number" class="p-1 w-full border rounded" id="iw" name="iw" min="-1" max="1" step="0.1"></input>
            </div>
            <div class="p-4 border w-full rounded">
              <h5 class="mb-3 text-lg font-medium">质量</h5>
              <p class="mb-2">您要花费多少渲染质量时间。默认值为 1。值越高成本越高，值越低成本越低。</p>
              <input type="number" class="p-1 w-full border rounded" id="quality" name="quality" min="0" max="2" step="0.5"></input>
            </div>
          </div>

          <div class="flex flex-col mt-2 sm:flex-row">
            <div class="p-4 border mr-5 w-full rounded">
              <h5 class="mb-3 text-lg font-medium">尺寸比例 (AR)</h5>
              <p class="mb-2">生成具有所需纵横比的图像。以“W:H”格式输入所需的宽高比，例如“16:9”表示 16:9 的宽高比 (~448x256)。</p>
              <input type="text" class="p-1 w-full border rounded" id="ar" name="ar" placeholder="W:H"></input>
            </div>
            <div class="p-4 border w-full rounded">
              <h5 class="mb-3 text-lg font-medium">Stylize</h5>
              <p class="mb-2">stylize 参数设置图像的“程式化”强度，设置得越高，它就越自以为是。默认值为 2500。有关详细信息，请参见下文。
              </p>
              <input type="number" class="p-1 w-full border rounded" id="stylize" name="stylize" min="625" max="60000" />
            </div>
          </div>
        </div>
        <div
          ref={setComputedPromptDiv}
          id="computed-prompt-div" class="z-101 fixed bottom-0 rounded-bl rounded-br inset-x-0 mx-auto left-0 px-6 py-3 flex flex-col border border-[#A2D5FF] bg-[#F5FAFF] mb-3">
          <textarea id="computed-prompt" disabled class="p-1 form-control w-full resize-none border" rows="2"></textarea>
          <button id="copy-button" class="ml-auto mr-auto text-white bg-[#54b4eb] rounded py-3 w-[100px] rounded mt-2">复制去作图</button>
        </div>
        <CircleCloseButton onClick={props.handleClick} />
      </div>
    </>
  );
};

export default MJGenerator
