import '../../styles/pageNav.css';
import '../../styles/member-vip.css';
import '../../styles/agreement.css';
import { onMount, createSignal, Show, createEffect } from 'solid-js';
import Swiper, { EffectCoverflow } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow'
import CourseDialog from "./CourseDialog"

export default function MemberCenter() {

  const [isHovered, setHovered] = createSignal(false);
  let leaveTimeout: NodeJS.Timeout | null = null;

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

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
      <div >
        <div class="width text text-2xl text-center pt-6 pb-8 font-medium" >
          让一部分人先看到未来
        </div>
      </div>
      <div >
        <div class="width flex pb-6 px-4" >
          <div class="flex-1 flex flex-col items-center justify-center transition-all hover:scale-125 cursor-pointer" >
            <img class="w-12" src="/images/vip-0.png" />
            <div class="text text-sm pt-1" >
              超级问答
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center transition-all hover:scale-125 cursor-pointer" >
            <img class="w-12" src="/images/vip-1.png" />
            <div class="text text-sm pt-1" >
              创意绘画
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img class="w-12" src="/images/vip-4.png" />
            <div class="text text-sm pt-1" >
              社区课程
            </div>
          </div>
        </div>
      </div>
      <div >
        <div class="vip width flex pc">
          <div class="px-4 py-4 flex-1 flex-shrink">
            <div class="vip-item h-full rounded-xl overflow-hidden ordinary">
              <div class="relative">
                <img class="w-full" src="/svg/vip-ordinary-bg.svg" />
                <div class="h-full absolute right-2 top-0 flex items-center">
                  <img class="w-24 ordinary_logo" src="/images/vip-ordinary.png" />
                </div>
                <div class="h-full absolute left-0 top-0 z-10 w-full pl-4 flex flex-col justify-center">
                  <div class="text0 text-2xl">
                    普通用户
                  </div>
                  <div class="text0 text-sm pt-2">
                    免费试用
                  </div>
                </div>
              </div>
              <div class="p-6 text text-xs flex items-end">
                <span class="text1 text-3xl flex">&yen;
                  <div >
                    &nbsp;0
                  </div></span>
                <span class="pb-1"> &nbsp;/月</span>
              </div>
              <div class="button-ordinary"></div>
              <div class="py-2">
                <div class="flex cell justify-between">
                  <div class="text">
                    超级问答
                  </div>
                  <div class="text flex-1 text-right">
                    10次
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    创意绘画快速模式
                  </div>
                  <div class="text flex-1 text-right">
                    10张
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    创意绘画休闲模式
                  </div>
                  <div class="text flex-1 text-right">
                    0张
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    直推收益奖励
                  </div>
                  <div class="text flex-1 text-right">
                    0%
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    间推收益奖励
                  </div>
                  <div class="text flex-1 text-right">
                    0%
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    人工智能2.0必修课
                  </div>
                  <div class="text flex-1 text-right">
                    无
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    求未AI关联产品联合会员
                  </div>
                  <div class="text flex-1 text-right">
                    无
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-4 flex-1 flex-shrink">
            <div class="vip-item h-full rounded-xl overflow-hidden annual">
              <div class="relative">
                <img class="w-full" src="/svg/vip-annual-bg.svg" />
                <div class="h-full absolute right-2 top-0 flex items-center">
                  <img class="w-24 annual_logo" src="/images/vip-annual.png" />
                </div>
                <div class="h-full absolute left-0 top-0 z-10 w-full pl-4 flex flex-col justify-center">
                  <div class="text0 text-2xl">
                    年度会员
                  </div>
                  <div class="text0 text-sm pt-2">
                    享受无限次问答权益和2000张绘画
                  </div>
                </div>
              </div>
              <div class="p-6 text text-xs flex items-end">
                <span class="text1 text-3xl flex">&yen;
                  <div >
                    &nbsp;799
                  </div></span>
                <span class="pb-1"> &nbsp;/年</span>
              </div>
              <div class="button-annual" onClick={() => {
                console.log('立即开通')
              }}>
                立即开通
              </div>
              <div class="py-2">
                <div class="flex cell justify-between">
                  <div class="text">
                    超级问答
                  </div>
                  <div class="text flex-1 text-right">
                    无限次
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    创意绘画快速模式
                  </div>
                  <div class="text flex-1 text-right">
                    2000张/年
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    并发快速作业
                  </div>
                  <div class="text flex-1 text-right">
                    4个
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    创意绘画休闲模式
                  </div>
                  <div class="text flex-1 text-right">
                    无限张
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    直推收益奖励
                  </div>
                  <div class="text flex-1 text-right">
                    20%
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    间推收益奖励
                  </div>
                  <div class="text flex-1 text-right">
                    10%
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    人工智能2.0必修课
                  </div>
                  <div class="text flex-1 text-right">
                    8折
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    求未AI关联产品联合会员
                  </div>
                  <div class="text flex-1 text-right">
                    联合会员特权
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-4 flex-1 flex-shrink">
            <div class="vip-item h-full rounded-xl overflow-hidden monthly">
              <div class="relative">
                <img class="w-full" src="/svg/vip-monthly-bg.svg" />
                <div class="h-full absolute right-2 top-0 flex items-center">
                  <img class="w-24 monthly_logo" src="/images/vip-monthly.png" />
                </div>
                <div class="h-full absolute left-0 top-0 z-10 w-full pl-4 flex flex-col justify-center">
                  <div class="text0 text-2xl">
                    月度会员
                  </div>
                  <div class="text0 text-sm pt-2">
                    享受无限次问答权益和120张绘画
                  </div>
                </div>
              </div>
              <div class="p-6 text text-xs flex items-end">
                <span class="text1 text-3xl flex">&yen;
                  <div >
                    &nbsp;219
                  </div></span>
                <span class="pb-1"> &nbsp;/月</span>
              </div>
              <div class="button-monthly" onClick={() => {
                console.log('立即开通')
              }}>
                立即开通
              </div>
              <div class="py-2">
                <div class="flex cell justify-between">
                  <div class="text">
                    超级问答
                  </div>
                  <div class="text flex-1 text-right">
                    无限次
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    创意绘画快速模式
                  </div>
                  <div class="text flex-1 text-right">
                    120张/月
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    并发快速作业
                  </div>
                  <div class="text flex-1 text-right">
                    2个
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    创意绘画休闲模式
                  </div>
                  <div class="text flex-1 text-right">
                    无限张
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    直推收益奖励
                  </div>
                  <div class="text flex-1 text-right">
                    20%
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    间推收益奖励
                  </div>
                  <div class="text flex-1 text-right">
                    0%
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    人工智能2.0必修课
                  </div>
                  <div class="text flex-1 text-right">
                    9折
                  </div>
                </div>
                <div class="flex cell justify-between">
                  <div class="text">
                    求未AI关联产品联合会员
                  </div>
                  <div class="text flex-1 text-right">
                    无
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="vip width flex mobile">
          <div class="swiper swiper-coverflow swiper-3d swiper-initialized swiper-horizontal swiper-watch-progress swiper">
            <div class="swiper-wrapper" style="cursor: grab; transition-duration: 0ms;">
              <div class="swiper-slide slide">
                <div class="vip-item h-full rounded-xl overflow-hidden ordinary">
                  <div class="relative">
                    <img class="w-full" src="/svg/vip-ordinary-bg.svg" />
                    <div class="h-full absolute right-2 top-0 flex items-center">
                      <img class="w-24 ordinary_logo" src="/images/vip-ordinary.png" />
                    </div>
                    <div class="h-full absolute left-0 top-0 z-10 w-full pl-4 flex flex-col justify-center">
                      <div class="text0 text-2xl">
                        普通用户
                      </div>
                      <div class="text0 text-sm pt-2">
                        免费试用
                      </div>
                    </div>
                  </div>
                  <div class="p-6 text text-xs flex items-end">
                    <span class="text1 text-3xl flex">&yen;
                      <div >
                        &nbsp;0
                      </div></span>
                    <span class="pb-1"> &nbsp;/月</span>
                  </div>
                  <div class="button-ordinary"></div>
                  <div class="py-2">
                    <div class="flex cell justify-between">
                      <div class="text">
                        超级问答
                      </div>
                      <div class="text flex-1 text-right">
                        10次
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        创意绘画快速模式
                      </div>
                      <div class="text flex-1 text-right">
                        10张
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        创意绘画休闲模式
                      </div>
                      <div class="text flex-1 text-right">
                        0张
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        直推收益奖励
                      </div>
                      <div class="text flex-1 text-right">
                        0%
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        间推收益奖励
                      </div>
                      <div class="text flex-1 text-right">
                        0%
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        社区课程
                      </div>
                      <div class="text flex-1 text-right">
                        无
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        求未AI关联产品联合会员
                      </div>
                      <div class="text flex-1 text-right">
                        无
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div class="swiper-slide slide">
                <div class="vip-item h-full rounded-xl overflow-hidden annual">
                  <div class="relative">
                    <img class="w-full" src="/svg/vip-annual-bg.svg" />
                    <div class="h-full absolute right-2 top-0 flex items-center">
                      <img class="w-24 annual_logo" src="/images/vip-annual.png" />
                    </div>
                    <div class="h-full absolute left-0 top-0 z-10 w-full pl-4 flex flex-col justify-center">
                      <div class="text0 text-2xl">
                        年度会员
                      </div>
                      <div class="text0 text-sm pt-2">
                        享受无限次问答权益和2000张绘画
                      </div>
                    </div>
                  </div>
                  <div class="p-6 text text-xs flex items-end">
                    <span class="text1 text-3xl flex">&yen;
                      <div >
                        &nbsp;799
                      </div></span>
                    <span class="pb-1"> &nbsp;/年</span>
                  </div>
                  <div class="button-annual">
                    立即开通
                  </div>
                  <div class="py-2">
                    <div class="flex cell justify-between">
                      <div class="text">
                        超级问答
                      </div>
                      <div class="text flex-1 text-right">
                        无限次
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        创意绘画快速模式
                      </div>
                      <div class="text flex-1 text-right">
                        2000张/年
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        并发快速作业
                      </div>
                      <div class="text flex-1 text-right">
                        4个
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        创意绘画休闲模式
                      </div>
                      <div class="text flex-1 text-right">
                        无限张
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        直推收益奖励
                      </div>
                      <div class="text flex-1 text-right">
                        20%
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        间推收益奖励
                      </div>
                      <div class="text flex-1 text-right">
                        10%
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        社区课程
                      </div>
                      <div class="text flex-1 text-right">
                        无限制
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        求未AI关联产品联合会员
                      </div>
                      <div class="text flex-1 text-right">
                        联合会员特权
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div class="swiper-slide slide">
                <div class="vip-item h-full rounded-xl overflow-hidden monthly">
                  <div class="relative">
                    <img class="w-full" src="/svg/vip-monthly-bg.svg" />
                    <div class="h-full absolute right-2 top-0 flex items-center">
                      <img class="w-24 monthly_logo" src="/images/vip-monthly.png" />
                    </div>
                    <div class="h-full absolute left-0 top-0 z-10 w-full pl-4 flex flex-col justify-center">
                      <div class="text0 text-2xl">
                        月度会员
                      </div>
                      <div class="text0 text-sm pt-2">
                        享受无限次问答权益和120张绘画
                      </div>
                    </div>
                  </div>
                  <div class="p-6 text text-xs flex items-end">
                    <span class="text1 text-3xl flex">&yen;
                      <div >
                        &nbsp;219
                      </div></span>
                    <span class="pb-1"> &nbsp;/月</span>
                  </div>
                  <div class="button-monthly">
                    立即开通
                  </div>
                  <div class="py-2">
                    <div class="flex cell justify-between">
                      <div class="text">
                        超级问答
                      </div>
                      <div class="text flex-1 text-right">
                        无限次
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        创意绘画快速模式
                      </div>
                      <div class="text flex-1 text-right">
                        120张/月
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        并发快速作业
                      </div>
                      <div class="text flex-1 text-right">
                        2个
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        创意绘画休闲模式
                      </div>
                      <div class="text flex-1 text-right">
                        无限张
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        直推收益奖励
                      </div>
                      <div class="text flex-1 text-right">
                        20%
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        间推收益奖励
                      </div>
                      <div class="text flex-1 text-right">
                        0%
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        社区课程
                      </div>
                      <div class="text flex-1 text-right">
                        无限制
                      </div>
                    </div>
                    <div class="flex cell justify-between">
                      <div class="text">
                        求未AI关联产品联合会员
                      </div>
                      <div class="text flex-1 text-right">
                        无
                      </div>
                    </div>
                  </div>
                </div>

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
      <div class="tables width px-4">
        <table class="w-full">
          <thead >
            <tr >
              <th class="font-normal">
                <div class="text-left flex items-center">
                  <div class="vip-logo px-2 py-1 rounded-md mr-2 text-sm font-normal">
                    VIP
                  </div>
                  <span class="text">会员权益</span>
                </div></th>
              <th class="font-normal">
                <div class="inline-flex items-center h-full text-center">
                  <img class="w-8 mr-2" src="/images/vip-ordinary.png" /> 普通用户
                </div></th>
              <th class="font-normal">
                <div class="inline-flex items-center">
                  <img class="w-8 mr-2" src="/images/vip-monthly.png" /> 月度会员
                </div></th>
              <th class="font-normal">
                <div class="inline-flex items-center">
                  <img class="w-8 mr-2" src="/images/vip-annual.png" /> 年度会员
                </div></th>
            </tr>
          </thead>
          <tbody >
            <tr class="h-14">
              <td >
                <div class="text-left px-4 text-sm">
                  超级问答
                </div></td>
              <td >
                <div class="text-center text-sm">
                  10次
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 无限次
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 无限次
                </div></td>
            </tr>
            <tr class="h-14">
              <td >
                <div class="text-left px-4 text-sm">
                  创意绘画快速模式
                </div></td>
              <td >
                <div class="text-center text-sm">
                  10张
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 120张/月
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 2000张/年
                </div></td>
            </tr>
            <tr class="h-14">
              <td >
                <div class="text-left px-4 text-sm">
                  并发快速作业
                </div></td>
              <td >
                <div class="text-center text-sm">
                  -
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 2个
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 4个
                </div></td>
            </tr>
            <tr class="h-14">
              <td >
                <div class="text-left px-4 text-sm">
                  创意绘画休闲模式
                </div></td>
              <td >
                <div class="text-center text-sm">
                  -
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 无限张
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 无限张
                </div></td>
            </tr>
            <tr class="h-14">
              <td >
                <div class="text-left px-4 text-sm">
                  直推收益奖励
                </div></td>
              <td >
                <div class="text-center text-sm">
                  -
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 20%
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 20%
                </div></td>
            </tr>
            <tr class="h-14">
              <td >
                <div class="text-left px-4 text-sm">
                  间推收益奖励
                </div></td>
              <td >
                <div class="text-center text-sm">
                  -
                </div></td>
              <td >
                <div class="text-center text-sm">
                  -
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 10%
                </div></td>
            </tr>
            <tr class="h-14">
              <td >
                <div class="text-left px-4 text-sm">
                  社区课程
                </div></td>
              <td >
                <div class="text-center text-sm">
                  -
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 无限制
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 无限制
                </div></td>
            </tr>
            <tr class="h-14">
              <td >
                <div class="text-left px-4 text-sm">
                  求未AI关联产品联合会员
                </div></td>
              <td >
                <div class="text-center text-sm">
                  -
                </div></td>
              <td >
                <div class="text-center text-sm">
                  -
                </div></td>
              <td >
                <div class="text-center text-sm">
                  <i class="iconfont  icon-gou icon text-xs mr-1"></i> 联合会员特权
                </div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="plan" style="display:none;">
        <div class="width py-10 px-4" >
          <div class="plan-img" >
            <img alt="" class="ad-img" src="/images/vip-ad.png" />
          </div>
          <div class="plan-text px-10" >
            <div class="text-2xl font-semibold pt-8 pb-0" >
              【邀请好友，享翻倍福利】
            </div>
            <div class="text-base leading-relaxed pt-4 pb-0" >
              欢迎走进未来，欢迎您加入求未AI会员的&quot;大家庭&quot;。此刻，我想借此机会感谢一直以来陪伴我们、信任我们的伙伴们。正是因为有了您们的支持，求未AI才得以诞生。
            </div>
            <div class="tracking-wide" >
              <h3 >🚀求未AI：用AI改变世界🚀</h3>
              <div class="text-base py-1 leading-relaxed" >
                我们的使命是推广AI，让更多的人了解并使用它。AI不仅能推动社会进步，也能帮助我们更好地面对各种挑战。因此，我们正在研究并负责任地应用AI，以使我们的工作和生活更为便捷。
              </div>
            </div>
            <div class="tracking-wide" >
              <h3 ></h3>
              <div class="text-base py-1 leading-relaxed" >
                我们坚持的价值观是诚信、善良、真诚和包容。我们致力于打造一个充满活力的社区，并热烈欢迎所有AI爱好者的加入。在这里，我们通过不断学习和提升效率，共同努力改变生活方式，创造价值。
              </div>
            </div>
            <div class="tracking-wide" >
              <h3 >📲我们的产品与服务📲</h3>
              <div class="text-base py-1 leading-relaxed" >
                我们已经在苹果应用商店上线了我们的另一款产品——
                <span class="red font-semibold" >Chat Pen</span>。求未AI的年费会员将获得Chat Pen的专属会员权益，无需再次付费。这只是我们的一部分工作，未来，我们将继续研发更多新产品，并将免费提供给我们的会员。
              </div>
              <div class="text-base py-1 leading-relaxed" >
                我们还提供了多元化的服务。一旦您成为求未AI会员，就可以加入我们的社区，（联系邀请您的伙伴加入社区）与一群热衷于探索AI的小伙伴一起学习和成长。我们会不定期开设免费学习课程，提升大家的AI技能。此外，我们还会与社区领袖一起探索AI的商业应用，引领每个社区成员探索AI的赚钱之道。
              </div>
            </div>
            <div class="tracking-wide" >
              <h3 >💰邀请奖励政策💰</h3>
              <div class="pb-2 pt-2 leading-relaxed" >
                <span class="monthly font-semibold" >月费会员：</span>邀请好友A开通，奖励您68✖20% =13.6元！邀请100人，就是1360元/月！
              </div>
              <div class="pb-2 pt-0 leading-relaxed" >
                <span class="annual font-semibold" >年费会员：</span>邀请好友A开通，奖励您688✖20%=136元！如果A再邀请好友B开通，您再获得688✖10%=68.8元！邀请的100位好友各自再邀请10位，收益就是688✖20%✖100+688✖10%✖1000=82400元！
              </div>
              <span class="red font-semibold" >只要您愿意，邀请的好友越多，您的收益就会越多，收益随时提现，这是一份不仅能够让您深入了解AI，还能让您获得丰厚回报的旅程。</span>
            </div>
            <div class="tracking-wide" >
              <h3 > ⚡注意事项️⚡ </h3>
              <div class="pb-2 pt-2 leading-relaxed" >
                不是会员，邀请好友成功开通会员，是不享受推广奖励的（邀请好友开通会员，然后自己在开通会员也是不享受的）
              </div>
            </div>
            <div class="pb-2 pt-2" >
              <h3 >🔮共创未来🔮</h3>
              <div class="text-base pb-8 leading-relaxed" >
                我们深信，有了您们的陪伴和支持，求未AI的未来将会更加美好、更加宽广。我们将以更优质的服务，更具竞争力的价格，更专业的团队，以及更丰富的产品，回馈每一位支持我们的朋友。
                <br /> 让我们携手共进，开启AI的美好未来，期待您的加入！
                <br /> 记住，这不仅仅是一次会员开通的邀请，更是一次进入未来世界的探索，一次AI改变生活的实践，一次您我共同走进未来的约定。
                <br /> 求未AI，期待与您共创美好的未来！
              </div>
            </div>
          </div>
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
      <div class="footer" >
        <div class="mr-6" >
          版权所有 &copy; 杭州求未科技有限公司
        </div>
        <a href="https://beian.miit.gov.cn" >网站备案：浙ICP备19052024号</a>
      </div>

      <Show when={isHovered()}>
        <CourseDialog closeBtnClicked={() => {
          setHovered(false)
        }} />
      </Show>
    </div>
  )
}