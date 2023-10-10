import { createSignal, Accessor, onCleanup, onMount, Show, createEffect } from "solid-js";

import '../../styles/account-info.css';
import { fetchUserInfo } from "~/utils/api"
import toast, { Toaster } from 'solid-toast';
import GPT4ChargeDialog from '../GPT4ChargeDialog'
import InviteDialog from '../InviteDialog'
import ExchangeDialog from '../ExchangeDialog'
import FaqDialog from '../FaqDialog'
import dateformat from 'dateformat';

import { RootStore, loadSession } from "~/store"
import i18n from "~/utils/i18n";
const { store, setStore } = RootStore

import { detectIp } from "~/utils/api"

export default function AccountInfo(props: {
    closeBtnClicked?: () => void
}) {

    const [inviteSuccess, setInviteSuccess] = createSignal(false);

    const [showGPT4Dialog, setShowGPT4Dialog] = createSignal(false);

    const [showFaqDialog, setShowFaqDialog] = createSignal(false);

    const [showInviteDialog, setShowInviteDialog] = createSignal(false);

    const [showExchangeDialog, setShowExchangeDialog] = createSignal(false)


    let [isInChina, setIsInChina] = createSignal(true);

    const [phone, setPhone] = createSignal('');

    const [balance, setBalance] = createSignal('0');

    let inviteCode = localStorage.getItem('inviteCode')
    const inviteLink = `https://www.nextaibots.com/login?inviteCode=${inviteCode}`;

    const [inviteUrl, setInviteUrl] = createSignal(inviteLink);

    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [gpt3EndDate, setGpt3EndDate] = createSignal(yesterday);
    const [gpt4EndDate, setGpt4EndDate] = createSignal(yesterday);
    const [mjEndDate, setMjEndDate] = createSignal(yesterday);
    updateUserInfo()

    createEffect(() => {
        if (inviteSuccess()) {
            toast.success('邀请链接已复制到剪切板，可以分享给好友啦！')
        }
    })

    createEffect(() => {
        if (inviteSuccess()) {
            setTimeout(() => {
                setInviteSuccess(false);
            }, 2000);
        }
    });

    onMount(async () => {
        if (localStorage.getItem('phone')) {
            localStorage.setItem('isInChina', '1')
            setStore('inChina', true)
        }
        let inChina = localStorage.getItem('isInChina')
        if (!inChina) {
            let res = await detectIp()
            setIsInChina(res.isChina)
            localStorage.setItem('isInChina', isInChina() ? '1' : '2')
        }
        setIsInChina(inChina === '1')
        await fetchUserInfo();
        updateUserInfo()
    })

    function updateUserInfo() {
        let gpt3ExpireDate = localStorage.getItem('gpt3ExpireDay')
        let date = null
        if (gpt3ExpireDate) {
            date = new Date(parseInt(gpt3ExpireDate))
            setGpt3EndDate(date)
        }

        let gpt4EndDate = localStorage.getItem('gpt4ExpireDay')
        if (gpt4EndDate) {
            date = new Date(parseInt(gpt4EndDate))
            setGpt4EndDate(date)
        }

        let mjExpireDate = localStorage.getItem('midjourneyExpireDay')
        let mjDate = null
        if (mjExpireDate) {
            mjDate = new Date(parseInt(mjExpireDate))
            setMjEndDate(mjDate)
        }

        setBalance(localStorage.getItem('balance') ?? '0')
        setPhone(localStorage.getItem('phone') ?? '')

    }

    return (
        <div class="page flex-1 w-full overflow-y-auto pb-4 astro-RKRDL5K3">
            <div class="user">
                <div class="user-title">
                    {i18n.t('accountSettings')}
                </div>
                <div class="user-info">
                    <span class="el-avatar el-avatar--circle el-tooltip__trigger" style="--el-avatar-size: 70px;"><img src="http://tc.cos.cdn.jchdnet.cn/tables/24@3x_1682756184038.png?imageMogr2/thumbnail/70x70" style="object-fit: scale-down;" /></span>
                    <div class="el-popper is-light el-popover popper" tabindex="-1" aria-hidden="true" role="tooltip" id="el-id-9846-5" data-popper-reference-hidden="false" data-popper-escaped="false" data-popper-placement="bottom" style="z-index: 2002; position: absolute; inset: 181px auto auto 185.5px; width: 386px; display: none;">
                        <div class="avatar-list hidden">
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/1@3x_1682755404399.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/2@3x_1682755494344.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/3@3x_1682755522946.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/4@3x_1682755548199.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/5@3x_1682755578402.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/6@3x_1682755604621.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/7@3x_1682755633128.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/8@3x_1682755663093.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/9@3x_1682755686148.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/10@3x_1682755709181.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/11@3x_1682755740735.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/12@3x_1682755768971.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/13@3x_1682755795846.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/14@3x_1682755826109.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/15@3x_1682755855510.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/16@3x_1682755885107.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/17@3x_1682755918128.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/18@3x_1682755963830.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/18@3x_1682755963830.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/20@3x_1682756039892.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/21@3x_1682756130018.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/22@3x_1682756068250.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/23@3x_1682756151799.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/24@3x_1682756184038.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/25@3x_1682756210590.png" />
                            </div>
                            <div class="avatar-item">
                                <img alt="" loading="lazy" class="img" src="http://tc.cos.cdn.jchdnet.cn/tables/26@3x_1682756239807.png" />
                            </div>
                        </div>
                        <span class="el-popper__arrow" data-popper-arrow="" style="position: absolute; left: 0px;"></span>
                    </div>
                </div>
                <div class="user-cell">
                    <Show when={isInChina()}>
                        <div class="user-setting-item">
                            <div>
                                <div class="user-setting-item__title">
                                    手机
                                </div>
                                <div class="user-setting-item__desc">
                                    +86 {phone()}
                                </div>
                            </div>
                        </div>
                    </Show>

                    <div class="user-setting-item">
                        <div>
                            <div class="user-setting-item__title">
                                <span class="ordinary font-semibold">GPT3.5</span>
                            </div>
                            <div class="user-setting-item__desc">
                                <Show when={gpt3EndDate() > new Date()} fallback={
                                    <span class="bold text-red-500">{i18n.t('expired')}</span>
                                }>
                                    <span>{i18n.t('expireTime')}：{dateformat(gpt3EndDate()!, 'yyyy-mm-dd HH:MM')}</span>
                                </Show>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="gda-btn" onClick={() => {
                                setStore('menuTitle', i18n.t('memberCenter'))
                            }}><span>{i18n.t('renewal')}</span></button>
                        </div>
                    </div>
                    <div class="user-setting-item">
                        <div>
                            <div class="user-setting-item__title">
                                <span class="ordinary font-semibold">Midjourney</span>
                            </div>
                            <div class="user-setting-item__desc">
                                <Show when={mjEndDate() > new Date()} fallback={
                                    <span class="bold text-red-500">{i18n.t('expired')}</span>
                                }>
                                    <span>{i18n.t('expireTime')}：{dateformat(gpt3EndDate()!, 'yyyy-mm-dd HH:MM')}</span>
                                </Show>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="gda-btn" onClick={() => {
                                setStore('menuTitle', i18n.t('memberCenter'))
                            }}><span>{i18n.t('renewal')}</span></button>
                        </div>
                    </div>
                    <div class="user-setting-item">
                        <div>
                            <div class="user-setting-item__title">
                                <span class="ordinary font-semibold">GPT 4</span>
                            </div>
                            <div class="user-setting-item__desc">
                                <Show when={gpt4EndDate() > new Date()} fallback={
                                    <span class="bold text-red-500">{i18n.t('expired')}</span>
                                }>
                                    <span>{i18n.t('expireTime')}：{dateformat(gpt4EndDate()!, 'yyyy-mm-dd HH:MM')}</span>
                                </Show>
                            </div>
                        </div>
                        <div>
                            <button type="button" class="gda-btn" onClick={() => {
                                setStore('menuTitle', i18n.t('memberCenter'))
                            }}><span>{i18n.t('renewal')}</span></button>
                        </div>
                    </div>
                    <div class="user-setting-item">
                        <div class="flex-1">
                            <div class="user-setting-item__title">
                                {i18n.t('inviteLink')}
                            </div>
                            <div class="user-setting-item__desc">
                                {inviteUrl()}
                            </div>
                        </div>
                        <div>
                            <button type="button" class="gda-btn" onClick={() => {
                                setShowInviteDialog(true)
                            }}><span>{i18n.t('inviteImmediately')}</span></button>
                        </div>
                    </div>
                    <Show when={isInChina()}>
                        <div class="user-setting-item">
                            <div class="flex-1">
                                <div class="user-setting-item__title">
                                    现金余额
                                </div>
                                <div class="user-setting-item__desc">
                                    {balance()}
                                </div>
                            </div>
                            <div>
                                <button type="button" class="gda-btn" onClick={() => {
                                    toast.error('请添加微信 geekoftaste 来提现哦')
                                }}><span>立即提现</span></button>
                            </div>
                        </div>
                        <div class="user-setting-item">
                            <div class="flex-1">
                                <div class="user-setting-item__title">
                                    Midjourney权益兑换
                                </div>
                                <div class="user-setting-item__desc">
                                    月会员兑换
                                </div>
                            </div>
                            <div>
                                <button type="button" class="gda-btn" onClick={() => {
                                    setShowExchangeDialog(true)
                                }}><span>立即兑换</span></button>
                            </div>
                        </div>

                        <div class="user-setting-item">
                            <div class="flex-1">
                                <div class="user-setting-item__title">
                                    FAQ
                                </div>
                                <div class="user-setting-item__desc">
                                    常见问题
                                </div>
                            </div>
                            <div>
                                <button type="button" class="gda-btn" onClick={() => {
                                    setShowFaqDialog(true)
                                }}><span>查看</span></button>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>
            <Show when={showGPT4Dialog()}>
                <GPT4ChargeDialog
                    title="GPT4充值说明"
                    onClose={() => {
                        setShowGPT4Dialog(false)
                    }} />
            </Show>
            <Show when={showExchangeDialog()}>
                <ExchangeDialog
                    successClick={() => setShowExchangeDialog(false)}
                    showTitle={false}
                    showChargeBtn={false}
                    onClick={() => setShowExchangeDialog(false)} />
            </Show>
            <Show when={showFaqDialog()}>
                <FaqDialog closeDialog={() => {
                    setShowFaqDialog(false)
                }} />
            </Show>
            <Show when={showInviteDialog()}>
                <InviteDialog closeDialog={() => {
                    setShowInviteDialog(false)
                }} />
            </Show>
            <Toaster position="top-center" />
        </div>
    );
}



