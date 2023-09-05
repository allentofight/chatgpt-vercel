import Login from "~/components/Login"
import Layout from "~/layout"
import i18n from '~/utils/i18n'

export default function () {
  return (
    <Layout>
      <Login title={`${i18n.t('logIn')}`} buttonTitle={`${i18n.t('logIn')}`} />
    </Layout>
  )
}