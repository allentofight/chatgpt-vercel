import { createSignal, Match, onMount, onCleanup, Switch } from 'solid-js';

import Chat from "~/components/Chat"
import Aside from "~/components/Aside"
import Layout from "~/layout"
import MjChat from "~/components/MjChat"

import { parseMjPrompts } from "~/utils"
import { ModelEnum } from "~/types"

export default function () {

  const [model, setModel] = createSignal(ModelEnum.GPT_3);
  const [hasMjChatLoaded, setHasMjChatLoaded] = createSignal(false);

  onMount(() => {

    const eventListenerFunction = function (e: CustomEvent) {
      const newModel = e.detail.index as ModelEnum;
      setModel(newModel);
      if (newModel === ModelEnum.MJ) {
        setHasMjChatLoaded(true);
      }
    };

    (window as any).addEventListener('optionSelected', eventListenerFunction);

    onCleanup(() => {
      (window as any).removeEventListener('optionSelected', eventListenerFunction);
    });
  })

  const prompts = parseMjPrompts()
  return (
    <Layout>
      <div style={{ display: model() != ModelEnum.MJ ? 'block' : 'none' }}>
        <Chat />
        <Aside />
      </div>
      {hasMjChatLoaded() &&
        <div style={{ display: model() == ModelEnum.MJ ? 'block' : 'none' }}>
          <MjChat prompts={prompts} />
        </div>
      }
    </Layout >
  )
}

