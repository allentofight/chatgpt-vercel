import '../../styles/pageNav.css';
import '../../styles/member-vip.css';
import '../../styles/agreement.css';
import { onMount, createSignal, Show, createEffect } from 'solid-js';
import Swiper, { EffectCoverflow } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow'

import VipEnItem from './VipEnItem';
import i18n from '~/utils/i18n';


export default function MemberEnCenter() {

  onMount(() => {
    Swiper.use([EffectCoverflow]);
    new Swiper('.swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: true,
    });

    const swiperContainer = document.querySelector('.swiper');

    if (swiperContainer) {
      swiperContainer.addEventListener('click', (event: Event) => {
        const targetElement = event.target as HTMLElement;
        // Check if the click was inside a .button-annual or .button-monthly element
        if (targetElement && targetElement.matches('.button-annual')) {
          console.log('Annual button clicked');
        } else if (targetElement && targetElement.matches('.button-monthly')) {
          console.log('Monthly button clicked');
        }
      });
    }
  });

  return (
    <div class="page vip-container flex-1 overflow-y-auto w-full overflow-x-hidden">
      <div class="banner" style="display:none;">
        <img class="w-full" src="/images/vip-banner.png" />
      </div>
      <div class="my-4">
        <div class="width text text-2xl text-center pt-6 pb-8 font-medium flex justify-center" >
          {i18n.t('seeFuture')}
        </div>
      </div>
      <div >
        <div class="width flex pb-6 px-4" >
          <div class="flex-1 flex flex-col items-center justify-center transition-all hover:scale-125 cursor-pointer" >
            <img class="w-12" src="/images/vip-0.png" />
            <div class="text text-sm pt-1" >
              {i18n.t('superQA')}
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center transition-all hover:scale-125 cursor-pointer" >
            <img class="w-12" src="/images/vip-1.png" />
            <div class="text text-sm pt-1" >
              {i18n.t('creativeDrawing')}
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center cursor-pointer">
            <img class="w-12" src="/images/vip-4.png" />
            <div class="text text-sm pt-1" >
              {i18n.t('communityCourses')}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <div class="vip vip-width flex pc">
          <div class="px-4 py-4 flex-1 flex-shrink">
            <VipEnItem type={2} />
          </div>
          <div class="px-4 py-4 flex-1 flex-shrink">
            <VipEnItem type={3} />
          </div>
          <div class="px-4 py-4 flex-1 flex-shrink">
            <VipEnItem type={1} />
          </div>
        </div>
        <div class="vip vip-width flex mobile">
          <div class="swiper swiper-coverflow swiper-3d swiper-initialized swiper-horizontal swiper-watch-progress swiper">
            <div class="swiper-wrapper" style="cursor: grab; transition-duration: 0ms;">
              <div class="swiper-slide slide">
                <VipEnItem type={2} />
              </div>
              <div class="swiper-slide slide">
                <VipEnItem type={3} />
              </div>
              <div class="swiper-slide slide">
                <VipEnItem type={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="display:none;">
        <div class="width text text-2xl text-center pt-6 pb-8 font-medium">
          权益对比详情
        </div>
      </div>

      <div class="_footer" style="display:none;">
        <div class="_footer-items pt-6" >
          <div class="flex py-6 justify-around w-full" >
            <div class="_footer-items-item" >
              <div class="title" >
                联系我们
              </div>
              <div class="text">
                商务联系：ZJ0606hhq0505
              </div>
              <div class="text" >
                商务QQ：928207220
              </div>
            </div>
            <div class="_footer-items-item" >
              <div class="title" >
                导航
              </div>
              <div class="text" >
                <a href="/agreementPrivacy" >隐私条款</a>
              </div>
              <div class="text" >
                <a href="/agreementUser" >用户协议</a>
              </div>
              <div class="text" >
                <a href="/agreementVip" >会员协议</a>
              </div>
            </div>
          </div>
          <div class="flex pb-6 justify-center w-full">
            <div class="_code">
              <div class="_code-title">
                微信交流群
              </div>
              <img alt="" class="w-full" src="https://tc.cos.cdn.jchdnet.cn/tables/cd8a18be-2b4f-4b85-8ee5-de70675c10bb_1686025969570.png" />
            </div>
            <div class="_code ml-12">
              <div class="_code-title">
                QQ交流群
              </div>
              <img alt="" class="w-full" src="https://tc.cos.cdn.jchdnet.cn/tables/0cdc83cf-aebb-4427-8b7c-e9060811804f_1685615349177.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}