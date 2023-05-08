import { Show } from "solid-js"
export default function MessageAction(props: {
  hidden: boolean
  del: () => void
}) {
  return (
    <Show when={!props.hidden}>
      <div class="flex absolute items-center justify-between <sm:top--4 <sm:right-0 top-2 right-2 text-sm text-slate-7 dark:text-slate group-hover:opacity-100 group-focus:opacity-100 opacity-0 dark:bg-#292B32 bg-#E7EBF0 rounded">
        <ActionItem
          label="删除"
          onClick={props.del}
          icon={"i-carbon:trash-can"}
        />
      </div>
    </Show>
  )
}

function ActionItem(props: { onClick: any; icon: string; label?: string }) {
  return (
    <div
      class="flex items-center cursor-pointer p-2 hover:bg-slate/10 rounded text-1.2em"
      onClick={props.onClick}
    >
      <button class={props.icon} title={props.label} />
    </div>
  )
}
