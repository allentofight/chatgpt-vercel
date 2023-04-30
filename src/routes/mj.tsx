import MjChat from "~/components/MjChat"
import Layout from "~/layout"

import { parseMjPrompts } from "~/utils"

export default function () {

  const prompts = parseMjPrompts()

  return (
    <Layout>
      <MjChat
        prompts={prompts} />
    </Layout>
  )
}
