import { createMemo } from 'solid-js';

export default function FAQDialog(props: {
  closeDialog: () => void
}) {
  let faqs = [{
    question: '为什么有时候页面点击没反应',
    answer: '最好使用 Chrome 浏览器，为了网站极致的体验，采用了最新的技术，其他浏览器不一定兼容'
  }, {
    question: '网站为什么要收费',
    answer: createMemo(() => (
      <>
        因为当前官方限制了对免费 api key 的使用，为了保证回答问题的速度，站主自掏腰包去买了官方不限速的付费 api key，再加上为了维持网站的正常经营需要购买服务器，数据库等，这一个月下来是笔不小的支出，为爱发电不可持续，所以需要收费
      </>
    ))
  }, {
    question: '网站是怎么收费的',
    answer: createMemo(() => (
      <>
        非常合理，目前市面上多数按字数收费，多数在 5000 字 28 元左右, 而我们网站是包月<span style="color:red;">不限次数</span>！市面上可以说是独此一家了，目前是试运营阶段，包月不限次数很可能会超支，后期可能会涨价，提前续费后期也可以不限字数哦
      </>
    ))
  }, {
    question: '可以一直免费体验 VIP 权限吗',
    answer: '可以，点击左下角的邀请好友享收益，每邀请一人可延长 7 天 VIP 权益!'
  }, {
    question: '收费合理吗',
    answer: createMemo(() => (
      <>
        目前网站收费有以下几种形式:<br />
        &nbsp;&nbsp;&nbsp;&nbsp;2.月会员59.9<br />
        &nbsp;&nbsp;&nbsp;&nbsp;3.一季145<br />
        &nbsp;&nbsp;&nbsp;&nbsp;4.包年560
      </>
    ))
  },
  {
    question: '官方是怎么收费的',
    answer: '目前市面上普通号一个 45，且只能访问 GPT 3模型，不过由于官网访问火爆，一般输入两三次问题就会报错，需要重新刷新一下，体验非常差，可以选择在官方升级 PLUS，目前市面上报价 190～220，对比一下我们网站的收费可以说是非常良心了'
  },
  {
    question: '收费会员有什么权益',
    answer: createMemo(() => (
      <>
        收费会员主要有以下三大权益：<br /><br />
        1.独享的加速通道，与官方 PLUS 用户输出速度一样快，与 PLUS 会员一样可使用 GPT 3.5, GPT 4<br />
        2.永久的会话数据保存<br />
        3. 后期会集成 AI 绘画，也会一起开放给会员使用<br />
      </>
    ))
  },
  {
    question: '网站数据安全吗，会有隐私问题吗',
    answer: '用户的密码是加密的，即便网主本人也不知道用户的密码，不过用户的会话由于要明文返回给用户，所以理论上是看得到的，但只有网主本人可以看到，而且保存在国外很知名的数据库厂商 mongodb.com 上，所以数据是安全的，不会有丢失的风险'
  }]
  return (
    <>
      <div
        class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
        onClick={props.closeDialog}
      >
        <div class="bg-white p-4 rounded-md max-w-lg max-h-96 overflow-y-auto">

          <h2 class="text-lg font-bold mb-2 text-center">FAQ</h2>
          <div class="grid gap-4">
            {faqs.map((faq, index) => (
              <div class="flex">
                <span class="font-bold mr-2">{index + 1}.</span>
                <div>
                  <h3 class="font-bold mb-1">
                    Q: {faq.question}
                  </h3>
                  <p class="mb-4">
                    A: {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
