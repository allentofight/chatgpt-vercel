import type { JSXElement } from "solid-js"
import { Title } from "solid-start"

export default function (props: { children?: JSXElement }) {
  return <Title>AI技术浪潮网{props.children ? " | " + props.children : ""}</Title>
}
