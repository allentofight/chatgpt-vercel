import PaymentComponent from "~/components/PaymentComponent"
import Layout from "~/layout"

import { parseMjPrompts } from "~/utils"

export default function () {

  const prompts = parseMjPrompts()

  return (
    <PaymentComponent />
  )
}
