<template>
    <div :style="backBg">
         <!-- nav -->
        <div :class="[isIPhoneX ? 'x-nav-bar': 'nav-bar']" ref="hb">
            <text class="nav-title" ref="to">签到领奖励金</text>
            <text class="rule-text" @click="showRules()" ref="tt">规则</text>
            <div @click="goBack()" class="nav-left">
                <image class="nav-right-back" :src="rightBackIcon" />
                <image class="cover-back-icon" ref="cb" src="http://h0.hucdn.com/open/201838/a30d7f9311ff6900_44x44.png" />               
            </div>
        </div>  
        <image v-if="suspendAd && suspendAd.img" @click="goAdSuspend(suspendAd)" class="suspend" :src="suspendAd.img" ref="ad"></image>
        <list v-if="isInit" ref="list" loadmoreoffset="200" @loadmore="loadMorePro" class="list-bg">
            <refresh @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'"></refresh>
            <!-- 签到 -->
            <cell>
                <sign-block
                    :eggs="eggObj"
                    :invites="invite_info"
                    :signed="distributeInfo.signed_list.length"
                    :ab="is_ab_test"
                    :flash="is_flash_show"
                    :lack="only_short"
                    :tip="showWithdrawlTip"
                    :money="money"
                    :bags="continue_checkin_bag"
                    :list="signList"
                    :continuous="continuousDays"
                    :checkin="is_checkin"
                    :distribute="distribute"
                    :iphonex="isIPhoneX"
                    :toasts="toasts"
                    :calender="calender"
                    @stretch="stretchCalender"
                    @sign="signClick()"
                    @award="renderShareProgressDialog"
                    @invite="inviteUser('only_share', $event)"
                    @draw="moneyDraw">
                </sign-block>
            </cell>
            <!-- app新人专享布点 -->
            <cell class="new-customer-item-list" v-if="is_new_buy_member && app_items && app_items.length">
                <image class="banner-app-bg" src="http://h0.hucdn.com/open/201812/8e629c5c89266208_750x470.png"></image>
                <scroller class="app-item-list" scroll-direction="horizontal" show-scrollbar="false">
                    <div class="item-unit" v-for="item in app_items" :key="item.iid" @click="goDetail(item, 2)">
                        <image :src="item.img" class="item-img"></image>
                        <text class="item-title">{{item.title}}</text>
                        <text class="item-price">到手：￥{{item.hand_price | price}}</text>
                        <div class="item-tag">
                            <text class="item-tag-text">APP专享</text>                            
                        </div>
                    </div>
                </scroller>
            </cell>
            <!-- <cell v-if="user_login_type === 2 && trailorProducts.length > 0">
                <product-trailor :list="trailorProducts" @detail="goDetail($event, 1)"></product-trailor>
            </cell>
            <cell v-else>
                <picked-group :list="groupList" v-if="groupList && groupList.length > 0" @detail="goDetail($event, 4)"></picked-group>
            </cell> -->
            <cell>
                <promotion-list :list="promotions"></promotion-list>
            </cell>
            <!-- 商品模块 -->
            <cell class="product-block-title">
                <!-- 商品模块的头部 -->
                <image src="http://h0.hucdn.com/open/201901/d9d0e125ab8c7b20_149x14.png" class="title-arrow"/>
                <text class="product-title-text">今日必推</text>
                <image src="http://h0.hucdn.com/open/201901/e0daf83358aff5ad_149x14.png" class="title-arrow"/>
            </cell>
            <!-- 商品list -->
            <cell class="product-container" v-for="(item, index) in proList" :key="index">
                <product-item 
                    v-if="item.odd" 
                    :type="user_login_type" 
                    :data="item.odd"
                    @detail="goDetail(item.odd, 3)"
                    @share="share(item.odd, 2)">
                </product-item>
                 <product-item 
                    v-if="item.even" 
                    :type="user_login_type" 
                    :data="item.even"
                    @detail="goDetail(item.even, 3)"
                    @share="share(item.even, 2)">
                </product-item>
            </cell>
            <cell>
                <loadMore :hasMore="has_more"></loadMore>
            </cell>
        </list>
        <!--  签到红包 -->
        <image :src="continous_bag_bg[0]" v-if="continue_award === 0 && shadowObj.type !== 3" class="sign-bag" @click="bagNote()" />
        <image :src="continous_bag_bg[1]" v-else-if="continue_award === 1 && shadowObj.type !== 3" class="sign-bag" @click="inviteUser('init', {id: 3, block: '连签奖励悬浮_立即领取_点击'})" />
        <!-- 规则 -->
        <rule :userLoginType="user_login_type" :coupon_rename_switch="coupon_rename_switch" v-if="showRule" @change="ruleClose"></rule>
        <dialog-shadow
            @sign="closeReturnWindow"
            @leave="closePage"
            @closeinvite="inviteClosed"
            @closesign="bombClosed"
            @popclose="closedPop($event)"
            @usecoupon="useCoupon"
            @openshare="distributeToFriend"
            @signinvite="inviteUser('only_share',$event)"
            :iphonex="isIPhoneX"
            :show="shadowObj.show" 
            :type="shadowObj.type"
            :extra="shadowObj.extra">
        </dialog-shadow>
    </div>
</template>

<script>
/* eslint-disable */
import bindingx from 'weex-bindingx';
import {isIOS, version} from '@weex/env';
import hybrid from '../../common/js/hybrid';
import loadMore from '../../common/components/loadMore.vue';
// import title from '../../common/components/title.vue';
import statistics from '../../common/js/common';
import productItem from './components/product.vue';
import rule from './components/rule.vue';
import shadow from './components/shadow.vue';
import sign from './components/sign.vue';
import promotionList from './components/promotion.vue';

const storage = weex.requireModule('storage');

const modal = weex.requireModule('modal');
const dom = weex.requireModule('dom');
const noop = () => false;
const whiteBackIcon =
  'http://h0.hucdn.com/open/201838/7373aea9330101ca_44x44.png';
const blackBackIcon =
  'http://h0.hucdn.com/open/201838/a30d7f9311ff6900_44x44.png';
const oneFive = 1.5;
const ffz = 450;
const hundred = 100;
module.exports = {
    components: {
        loadMore,
        rule,
        'product-item': productItem,
        'dialog-shadow': shadow,
        'sign-block': sign,
        'promotion-list': promotionList,
    },
    data() {
        return {
            shadowObj: {
                show: false, // 弹窗显示
                type: 0, // 弹窗类型
                extra: {},
            },
            backBg: {},
            showWithdrawlTip: false,
            isIPhoneX: false,
            rightBackIcon: whiteBackIcon,
            user_login_type: 1,
            page: 1,
            refreshing: false,
            isLocked: false,
            luck_bag: [
                'http://h0.hucdn.com/open/201848/e6d8a3ad0d2ddd59_70x71.png',
                'http://h0.hucdn.com/open/201848/3b079a561e6db8da_48x51.png',
            ],
            is_checkin: true,
            // 连续签到天数
            continuousDays: 0,
            // 当日签到金额
            checkinAmt: 0.00,
            // 连签金额
            continueCheckinAmt: 0.00,
            // 是否显示连签
            continueCheckinIcon: false,
            signList: [1, 2, 3, 4, 5, 6, 7],
            continue_checkin_bag: [],
            money: 0.00,
            only_short: 0.00,
            continous_bag_bg: [
                'http://h0.hucdn.com/open/201848/d843a827e2eefbd9_96x106.png',
                'http://h0.hucdn.com/open/201848/9f0dda4ff69a39a5_96x106.png',
            ],
            current_scale: oneFive,
            suspend_scale: oneFive,
            continue_award: 2,
            invite_info: [],
            showRule: false,
            is_new_buy_member: false,
            has_more: false,

            // 分享
            shareUrl: '',
            shareTitle: '',
            shareDesc: '',
            shareComment: '',
            sharePlatForms: [],
            shareImg: '',
            shareSmallImg: '',
            toasts: [],
            proList: [],

            app_items: [],

            // 大数据打点
            page_track_data: '',

            // 兜底闪现
            is_flash_show: true,

            //  广告位
            ads_obj: [],
            suspendAd: {},
            distribute: true, // 是否分享红包玩法
            // ABtest
            is_ab_test: null,
            toastToken: {},
            // 签到接口请求结束
            isInit: false,
            distributeInfo: {
                signed_list: [],
                luckiest: 0,
                distributed_award: 0,
            },
            eggObj: {
                cnt: 0,
                bttText: '',
                bttAllow: false,
                type: 0,
                show: false,
            },
            calender: {
                continues: 0,
                automatic: false,
                show: false,
                expand: false,
                dates: [
                    {
                        num: 30,
                        text: '廿六',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 1,
                        text: '廿七',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 2,
                        text: '廿八',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 3,
                        text: '廿九',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 4,
                        text: '除夕',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 5,
                        text: '初一',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 6,
                        text: '初二',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 7,
                        text: '初三',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 8,
                        text: '初四',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 9,
                        text: '初五',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 10,
                        text: '初六',
                        checked: false,
                        dubble: false,
                    },
                    {
                        num: 11,
                        text: '初七',
                        checked: false,
                        dubble: false,
                    },
                ],
            },
            promotions: [],
        };
    },
    filters: {
        price(val) {
            return val / 100;
        },
        itemImg(val) {
            return `${val.img}!250x250.webp`;
        },
    },
    created() {
        if (isIOS) {
            this.backBg = {
                'background-color': '#f2f4f6',
            };
        }
    },
    mounted() {
        this.init();
        this.isPhoneX();
        this.getAdsInfo();
    },
    methods: {
        stretchCalender() {
            this.calender.expand = !this.calender.expand;
        },
        useCoupon() {
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: '新专粉承接弹窗-立即使用按钮点击',
                },
            });
            hybrid('openURL').openURL({
                url: `https://m.beidian.com/app/new_member.html`,
            });
        },
        showDialog(type, extra = {}) {
            this.shadowObj = {
                show: true,
                type,
                extra,
            };
        },
        // 关闭蒙层
        closedPop(statics = {}) {
            if (statics.block_name) {
                statistics.sendLog({
                    et: 'click',
                    json: statics,
                });
            }
            this.shadowObj = {
                show: false,
                type: 0,
                extra: {},
            }
        },
        renderShareProgressDialog() {
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: 'App-签到成功页-给好友发红包按钮点击',
                },
            });
            hybrid('showLoading').showLoading({}, noop);
            this.getData().then((data) => {
                hybrid('dismissLoading').dismissLoading({});
                this.distributeInfo = data.data.distribute_info;
                const tempList = this.distributeInfo.signed_list;
                const signedList = [];
                for (let i = 0; i < 6; i++) {
                    if (tempList[i]) {
                        signedList.push(tempList[i]);
                        const item = signedList[i];
                        item.avatar = `${item.friend_avatar}!160x160.webp`;
                        item.exist = true;
                    } else {
                        signedList.push({
                            exist: false,
                        });
                    }
                }
                statistics.sendLog({
                    et: 'float_start',
                    json: {
                        block_name: '发红包弹窗曝光',
                    },
                });
                this.showDialog(5, {
                    distributeAward: this.distributeInfo.distributed_award,
                    signedList,
                    signedNum: tempList.length,
                    luckiest: this.distributeInfo.luckiest,
                });
            });
        },
        getBigData(){
            hybrid('ajax').ajax({
                apiURL: 'http://api.beidian.com/gateway/route.html',
                url: '<default-api-url>',
                query: {
                    method: 'beidian.recom.list.get',
                    scene_id: 'member_checkin_recom_list',
                    page: this.page,
                },
                form: {},
                method: 'get',
            }, ({data}) => {
                if (!data) {
                    return;
                }
                var dataSource = data.data
                if(dataSource){
                    this.parsePro(dataSource);
                    if(dataSource.has_more){
                        this.has_more = dataSource.has_more;
                    }
                    if(dataSource.page_track_data){
                        this.page_track_data = dataSource.page_track_data;
                    }
                }
                hybrid('dismissLoading').dismissLoading({});
            }); 
        },
        scrollAnimation() {
                const $list = this.$refs.list.ref;
                const $hb = this.$refs.hb.ref;
                const $to = this.$refs.to.ref;
                const $tt = this.$refs.tt.ref;
                const $cb = this.$refs.cb.ref;
                bindingx.bind({
                    eventType: 'scroll',
                    anchor: $list,
                    props: [
                        {
                            element: $hb,
                            property: 'background-color',
                            expression: {
                                origin: 'rgba(255, 255, 255, min(y, 133) / 133)',
                            },
                        },
                        {
                            element: $to,
                            property: 'color',
                            expression: {
                                origin: `rgb(255-255*(min(133, y)/133), 255-255*(min(133, y)/133), 255-255*(min(133, y)/133))`,
                            },
                        },
                        {
                            element: $tt,
                            property: 'color',
                            expression: {
                                origin: `rgb(255-255*(min(133, y)/133), 255-255*(min(133, y)/133), 255-255*(min(133, y)/133))`,
                            },
                        },
                        {
                            element: $cb,
                            property: 'opacity',
                            expression: {
                                origin: `min(y, 133)/133`,
                            },
                        },
                    ],
                });
        },
        // 获取设备
        getPhone() {
            return weex.config.env.deviceModel;
        },
        isPhoneX() {
            let model = this.getPhone();
            if (model === 'iPhone10,3' || model === 'iPhone10,6' || model === 'iPhone11,3' || model === 'iPhone11,6') {
                this.isIPhoneX = true;
            } else {
                this.isIPhoneX = false;
            }
        },
        dealGroup(list) {
            const trailors = list || [];
            const groupIid = [];
            trailors.forEach((item) => {
                item.type = 2; // 老带新商品，类型为2
                item.img = `${item.img}!160x160.webp`;
                item.group_price = `¥${item.group_price / 100}`;
                item.price = `单买价¥${item.price / 100}`;
                item.require_num = `${item.require_num}人团`;
                item.avatars = item.members.map((m) => {
                    return `${m}!160x160.webp`;
                });
                groupIid.push(item.iid);
            });
            statistics.sendLog({
                et: 'target_show',
                json: {
                    block_name: '精选拼团商品区块',
                    iid: groupIid.join(','),
                },
            });
            return list;
        },
        getTrailor(list) {
            const iids = [];
            const trailorList = list ? list.map((item) => {
                iids.push(item.iid);
                item.type = 1; // 爆款商品，类型为1
                item.price = `¥${item.price / 100}`;
                item.origin_price = `¥${item.origin_price / 100}`;
                item.commissionValue = item.commission.commission_value / 100;
                item.img = `${item.img}!160x160.webp`;
                item.percent = Math.floor((item.sold_num / (item.sold_num + item.stock)) * 100);
                item.percentText = `抢购中，已抢${item.percent}%`;
                return item;
            }) : [];
            statistics.sendLog({
                et: 'target_show',
                json: {
                    block_name: '今日爆款商品区块',
                    iid: iids.join(','),
                },
            });
            return trailorList;
        },
        getInviteInfo(info) {
            let list = [];
            if (info.length >= 5) {
                list = info;
                list.push({
                    share: true,
                    placeholder: true,
                })
            } else {
                for (let i = 0; i < 5; i++) {
                    const token = info[i] || {
                        placeholder: true,
                    };
                    if (i === 0) {
                        token.share = true; // 第一个样式不同
                    }
                    list.push(token);
                }
            }
            return list;
        },
        dealToasts(list) {
            list.forEach((item) => {
                item.avatar = `${item.avatar}!160x160.webp`;
            });
            return list;
        },
        saveCurrent(current) {
            storage.setItem('last', current, noop);
        },
        setListStringToNumber(list) {
            return list.map((item) => {
                item = +item;
                return item;
            });
        },
        dealCalender(data) {
            if (data) {
                if (data.need_alert) {
                    this.showDialog(7);
                    statistics.sendLog({
                        et: 'floatStart',
                        json: {
                            block_name: '累签奖励发放弹窗曝光',
                        },
                    });
                } else {
                    data.checkin_days = this.setListStringToNumber(data.checkin_days);
                    data.multi_days = this.setListStringToNumber(data.multi_days);
                    // 用户当日第一次进入展开
                    storage.getItem('last', (e) => {
                        const current = new Date().getDate();
                        if (e.data === 'undefined' || !e.data || current !== +e.data) {
                            this.calender.expand = true;
                            this.calender.automatic = true; // 控制是否要自动收起
                            this.saveCurrent(current);
                        }
                        this.calender.show = true;
                        this.calender.continues = data.checkin_days.length;
                        this.calender.dates.forEach((day) => {
                            day.checked = data.checkin_days.indexOf(day.num) > -1;
                            day.dubble = data.multi_days.indexOf(day.num) > -1;
                        });
                    });
                }
            } else {
                this.calender.show = false;
            }
        },
        getBttText(data) {
            if (data.is_over) {
                return '已完成';
            } else if (data.task_id === 3 && !data.remain_coupon) {
                return '券已领完';
            } else if (data.task_id !== 1 && data.cnt === 1) {
                return '再邀1人';
            }
            return '立即邀请';
        },
        dealEggData(data) {
            if (data) {
                const blocks = ['累签1日彩蛋模块曝光', '累签3日彩蛋模块曝光', '累签5日彩蛋模块曝光'];
                const type = (data.task_id - 1) / 2;
                this.eggObj = {
                    show: true,
                    type,
                    cnt: data.cnt,
                    bttText: this.getBttText(data),
                    bttAllow: !data.is_over,
                }
                statistics.sendLog({
                    et: 'floatStart',
                    json: {
                        block_name: blocks[type],
                    },
                });
            } else {
                this.eggObj = {
                    cnt: 0,
                    bttText: '',
                    bttAllow: false,
                    type: 0,
                    show: false,
                };
            }
        },
        getPromotions(data) {
            const trailorProducts = this.getTrailor(data.activity_hot_items);
            const groupList = this.dealGroup(data.pintuan_items);
            if (this.user_login_type === 2 && trailorProducts.length > 1 && groupList.length > 1) {
                const promotions = [trailorProducts[0], groupList[0]];
                return promotions;
            }
            return groupList;
        },
        init() {
            this.getData().then((data) => {
                if (!data) {
                    return;
                }
                let dataSource = data.data;
                if (dataSource) {
                    this.distribute = dataSource.is_redbag_uid || false; //是否红包用户
                    if (dataSource.distribute_info) {
                        this.distributeInfo = dataSource.distribute_info ;
                    }
                    // 是否展示提现小红点
                    this.showWithdrawlTip = dataSource.is_coupon_ab_test;
                    // 跳转兜底闪现时，不显示金额、提现
                    this.is_flash_show = false;
                    // 气泡动画
                    // this.doAnimation(dataSource);
                    this.has_more = dataSource.has_more;
                    this.user_login_type = data.user_login_type;
                    this.promotions = this.getPromotions(dataSource);
                    console.log(this.promotions);
                    // 取分享信息
                    if (dataSource.share_info) {
                        this.getShareData(dataSource.share_info);
                    }
                    // 取签到信息
                    if (dataSource.checkin_info) {
                        this.getCheckinFo(dataSource.checkin_info);
                    }

                    // 判断abtest
                    if ('is_ab_test' in dataSource){
                        this.is_ab_test = dataSource.is_ab_test;
                    }

                    // 签到奖励金信息
                    if (dataSource.account) {
                        this.money = dataSource.account.money;
                        this.only_short = 'only_short' in dataSource.account ? dataSource.account.only_short : '';
                    }
                    this.isPop(dataSource);
                    // 重置数组
                    this.clearData();
                    this.parseData(dataSource);
                    this.toasts = this.dealToasts(dataSource.toast_list);
                    // 判断邀请记录弹框
                    if (dataSource.invite_info) {
                        dataSource.invite_info.forEach((item) => {
                            item.avatar = `${item.avatar}!160x160.webp`;
                        });
                        let nowTime = parseInt(new Date().getTime() / 1000);
                        // 邀请记录弹框逻辑
                        storage.getItem('nowTime', (event) => {
                            if (event.data && (nowTime - parseInt(event.data) >= 14400) && (dataSource.invite_info.length !== 0)) {
                                this.showDialog(2, {
                                    amount: dataSource.invite_award_sum,
                                    inviteList: dataSource.invite_info,
                                });
                                this.isLocked = true;
                                statistics.sendLog({
                                    et: 'float_start',
                                    json: {
                                        block_name: '好友签到成功弹窗曝光',
                                    },
                                });
                            }
                        });
                        storage.setItem('nowTime', nowTime);
                        this.invite_info = this.getInviteInfo(dataSource.invite_info);
                    }
                    this.dealCalender(dataSource.calendar_data);
                    this.dealEggData(dataSource.egg_task);
                    if (!this.isInit) {
                        this.isInit = true;
                        this.$nextTick(() => {
                            this.scrollAnimation();
                        });
                    }
                    this.$refs.list && this.$refs.list.resetLoadmore();
                    this.getBigData();
                } else {
                    modal.alert({
                        message: data.message || '退出重新进吧～',
                    });
                }
            });
        },
        // 邀请记录弹框
        isPop(data) {
            if ('is_pop_new_rule' in data) {
                this.showDialog(4, {
                    rule: data.is_pop_new_rule,
                    money: this.money,
                })
            }
        },
        // 获取分享信息
        getShareData(dataSource) {
            this.shareUrl = dataSource.url || '';
            this.shareTitle = dataSource.title || '';
            this.shareDesc = dataSource.desc || '';
            this.shareComment = dataSource.comment || '';
            this.sharePlatForms = dataSource.platforms || [];
            this.shareImg = dataSource.image || '';
            this.shareSmallImg = dataSource.small_img || '';
        },
        // 获取签到信息
        getCheckinFo(dataSource) {
            this.continuousDays = dataSource.continuous_days;
            this.continue_checkin_bag = dataSource.continue_checkin_bag;
            this.continue_award = dataSource.continue_award;
            this.$nextTick(() => {
                //处理weex偶现bug
                this.is_checkin = dataSource.is_checkin;
            });
            // 判断新用户回流自动签到
            if (dataSource.need_checkin_immediate && !dataSource.is_checkin) {
                this.getReturnData('init');
            }
            if (this.continue_award === 0) {
                statistics.sendLog({
                    et: 'float_start',
                    json: {
                        block_name: '连签奖励-明日领取悬浮曝光',
                    },
                });
            } else if (this.continue_award === 1) {
                statistics.sendLog({
                    et: 'float_start',
                    json: {
                        block_name: '连签奖励-今日领取悬浮曝光',
                    },
                });
            }
        },
        // 签到提现
        moneyDraw() {
            this.showWithdrawlTip = true;
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: '提现按钮点击',
                },
            });
            hybrid('openURL').openURL({
                url: 'https://m.beidian.com/app/cash_area.html#/',
            }, noop);
        },
        avatarImg(img) {
            return `${img}!56x56.webp`;
        },
        // 返回toast气泡的长度
        returnWidth(val) {
            let obj = {};
            if (val && val.length) {
                let len = val.length;
                const zeroSix = 0.6;
                const tt = 23;
                obj = {
                    width: `${len * zeroSix * tt}px`,
                };
            }
            return obj;
        },
        clearData() {
            this.is_new_buy_member = false;
            // this.toasts = [];
            this.app_items = [];
            // this.activity_hot_items = [];
            this.proList = [];
        },
        // 预告商品处理
        parseData(data) {
            this.is_new_buy_member = data.is_new_buy_member;
            this.app_items = data.app_items;
            this.page_track_data = data.page_track_data;
            // this.parsePro(data);
        },
        // 时间处理
        gapTime(begin, end) {
            if (begin > end) {
                return false;
            }
            const gapObj = {
                hour: '',
                minute: '',
                second: '',
            };
            const gap = (end - begin);

            if (gap < 0) {
                return gapObj;
            }
            const _hour = 3600;
            const _minute = 60;
            let temp;

            gapObj.hour = parseInt(gap / _hour); // 得到剩余小时数
            temp = gap - (gapObj.hour * _hour);
            gapObj.minute = parseInt(temp / _minute); // 得到剩余分钟数
            gapObj.second = parseInt(temp - (gapObj.minute * _minute)); // 得到剩余秒数

            return gapObj;
        },
        formatDateNumber(num) {
            const two = -2;
            if (num < 10) {
                return (`0${num}`).slice(two);
            }
            return num;
        },
        // 去商品详情
        goDetail(item, type) {
            let jsonObj = {
                iid: item.iid,
                block_name: '',
            };
            if (type === 1) {
                if (item && item.top_desc === '明日预告') {
                    jsonObj.block_name = '明日预告_点击进商详';
                } else if (item && item.top_desc === '今日爆款') {
                    jsonObj.block_name = '今日爆款-点击进商详';
                }
            } else if (type === 2) {
                jsonObj.block_name = '新人专享商品点击';
            } else if (type === 4) {
                jsonObj = {
                    iid: item.iid,
                    block_name: '精选拼团商品区域&按钮',
                    item_track_data: item.item_track_data || '',
                    page_track_data: this.page_track_data || '',
                };
            } else {
                jsonObj = {
                    iid: item.iid,
                    block_name: '商品图片&加购按钮',
                    item_track_data: item.item_track_data || '',
                    page_track_data: this.page_track_data || '',
                };
            }
            statistics.sendLog({
                et: 'click',
                json: jsonObj,
            });
            if (!item.target) {
                item.target = `beidian://bd/product/detail?iid=${item.iid}`;
            }
            hybrid('openURL').openURL({
                url: item.target, // beidian://bd/product/detail?iid=25939187
            }, noop);
        },
        // 处理商品渲染
        parsePro(data) {
            let items = [];
            items = data.recom_items;
            if (items && items.length > 0) {
                this.isLocked = false;
                // 处理商品的图片
                items.forEach((el, index) => {
                    el.show_img = `${el.img}!320x320.webp`;
                });
                for (let i = 0; i < items.length; i += 2) {
                    this.proList.push({
                        odd: items[i],
                        even: items[i + 1],
                    });
                }
                statistics.sendLog({
                    et: 'list_show',
                    json: {
                        block_name: '商品列表',
                        list: {
                            ids: items.map((it) => `${it.iid}|${it.item_track_data || ''}`).join(','),
                            page_track_data: data.page_track_data || '',
                        },
                    },
                });
                this.proList = this.proList.concat(items);
            }
        },
        // 签到首页接口
        getData() {
            hybrid('showLoading').showLoading({}, noop);
            this.isLocked = true;
            return new Promise((resolve, reject) => {
                hybrid('ajax').ajax({
                    apiURL: 'http://api.beidian.com/gateway/route.html',
                    url: '<default-api-url>',
                    query: {
                        method: 'beidian.member.checkin.home.new',
                        page: this.page,
                    },
                    form: {},
                    method: 'get',
                }, ({data}) => {
                    if (!data) {
                        return;
                    }
                    hybrid('dismissLoading').dismissLoading({});
                    if (data.success && data.data) {
                        this.refreshing = false;
                        resolve(data);
                    } else {
                        modal.alert({
                            message: (data.message) || '网络错误～',
                        });
                    }
                });
            });
        },
        stop() {
            return;
        },
        // 邀请打点数据
        staticLogs(extra) {
            const id = +extra.id;
            const logNames = extra.block || '';
            const jsonObj = {};
            if (id === 4 || id === 5) {
                let typeText = '普通样式';
                if (this.continueCheckinIcon) {
                    typeText = '获得连签奖励样式';
                }
                if (+this.continueCheckinAmt) {
                    typeText = '打开连签奖励样式';
                }
                jsonObj.type = typeText;
            }
            jsonObj.block_name = logNames;
            statistics.sendLog({
                et: 'click',
                json: jsonObj,
            });
        },
        distributeToFriend() {
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: '发红包弹窗-继续发红包按钮点击',
                },
            });
            this.inviteUser('distribute');
        },
        signClick() {
            if (!this.distribute) {
                this.inviteUser('init', {id: 0, block: '签到领奖励金按钮点击'}); // 非瓜分红包玩法，走原来签到逻辑
            } else {
                statistics.sendLog({
                    et: 'click',
                    json: {
                        block_name: 'App-签到页-签到按钮点击',
                    },
                });
                this.getReturnData('init');
            }
        },
        startShare(type) {
            hybrid('share').share({
                url: this.shareUrl,
                title: this.shareTitle,
                // android专用
                desc: this.shareDesc,
                // iOS专用
                comment: this.shareComment,
                // 安卓没有refresh
                platforms: this.sharePlatForms,
                // android专用
                image: this.shareImg,
                // iOS专用
                small_img: this.shareSmallImg,
            }, () => {
                this.getReturnData(type);
            });
        },
        // 邀请好友签到
        inviteUser(type, extra = {}) {
            if (extra.id) {
                this.staticLogs(extra);
            }
            if(this.is_ab_test && type === 'init') {
                this.getReturnData(type)
            } else {
                this.startShare(type);
            }
        },
        signDialog(dataSource) {
            if (dataSource.egg && dataSource.egg.egg_task) {
                const eggBlocks = ['签到成功-累签1日弹窗曝光', '签到成功-累签3日弹窗曝光', '签到成功-累签5日弹窗曝光'];
                const eggType = (dataSource.egg.egg_task - 1) / 2;
                statistics.sendLog({
                    et: 'floatStart',
                    json: {
                        block_name: eggBlocks[eggType],
                    },
                });
                this.showDialog(8, {
                    luckyText: dataSource.content || '',
                    distribute: this.distribute,
                    continueDays: this.continuousDays,
                    continueCheckin: this.continueCheckinIcon,
                    continueCheckinAmt: this.continueCheckinAmt,
                    checkinAmt: this.checkinAmt,
                    multiple: dataSource.multi_num || 0,
                    eggType,
                });
            } else if (dataSource.new_member_award && dataSource.new_member_award.coupon_value) {
                statistics.sendLog({
                    et: 'floatStart',
                    json: {
                        block_name: 'APP-新专粉承接弹窗曝光',
                    },
                });
                this.showDialog(6, {
                    awardTitle: dataSource.new_member_award.title,
                    awardText: dataSource.new_member_award.award_text,
                    couponValue: dataSource.new_member_award.coupon_value,
                });
            } else {
                let typeText = '普通样式';
                if (this.continueCheckinIcon) {
                    typeText = '获得连签奖励样式';
                }
                if (this.continueCheckinAmt * 1) {
                    typeText = '打开连签奖励样式';
                }
                statistics.sendLog({
                    et: 'floatStart',
                    json: {
                        block_name: '签到成功弹窗曝光',
                        type: typeText,
                    },
                });
                this.showDialog(3, {
                    luckyText: dataSource.content || '',
                    distribute: this.distribute,
                    continueDays: this.continuousDays,
                    continueCheckin: this.continueCheckinIcon,
                    continueCheckinAmt: this.continueCheckinAmt,
                    checkinAmt: this.checkinAmt,
                    multiple: dataSource.multi_num || 0,
                });
            }
        },
        getReturnData(type){
            if (type === 'only_share') {
                    this.closedPop();
                    this.page = 1;
                    this.init();
                } else if (type === 'init') {
                    this.getSignData().then((data) => {
                        if (!data) {
                            return;
                        }
                        let dataSource = data.data;
                        if (dataSource) {
                            this.continuousDays = dataSource.continue_days;
                            this.checkinAmt = dataSource.checkin_amt;
                            this.continueCheckinIcon = dataSource.continue_checkin_icon;
                            this.continueCheckinAmt = dataSource.continue_checkin_amt;
                        }
                        // 签到之后获取新的签到信息
                        if (dataSource.share_info) {
                            this.getShareData(dataSource.share_info);
                        }
                        this.page = 1;
                        this.signDialog(dataSource); // 展示签到成功之后弹窗
                    });
                }
        },
        // 签到接口
        getSignData() {
            this.isLocked = true;
            return new Promise((resolve, reject) => {
                hybrid('ajax').ajax({
                    apiURL: 'http://api.beidian.com/gateway/route.html',
                    url: '<default-api-url>',
                    query: {
                        method: 'beidian.member.checkin.apply.new',
                    },
                    form: {},
                    method: 'post',
                }, ({data}) => {
                    if (!data) {
                        return;
                    }
                    hybrid('dismissLoading').dismissLoading({});
                    if (data.success && data.data) {
                        this.refreshing = false;
                        resolve(data);
                    } else {
                        modal.alert({
                            message: (data.message) || '网络错误～',
                        });
                    }
                });
            });
        },
        // 关闭邀请记录弹框
        inviteClosed() {
            this.closedPop();
            this.isLocked = false;
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: '好友签到成功弹窗_关闭按钮点击',
                },
            });
        },
        // 关闭签到弹窗
        bombClosed() {
            this.closedPop();
            this.page = 1;
            this.isInit = false;
            this.init();
            let typeText = '普通样式';
            if (this.continueCheckinIcon) {
                typeText = '获得连签奖励样式';
            }
            if (this.continueCheckinAmt * 1) {
                typeText = '打开连签奖励样式';
            }
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: '签到成功弹窗_关闭按钮点击',
                    type: typeText,
                },
            });
        },
        // 获取广告位接口
        getAdsInfo() {
            hybrid('ajax').ajax({
                apiURL: 'http://api.beidian.com/gateway/route.html',
                url: '<default-api-url>',
                query: {
                    method: 'beidian.app.ads.get',
                    ad_id: '35_93',
                },
                form: {},
                method: 'get',
            }, (res) => {
                if (res.data && res.data.beidian_35s) {
                    this.ads_obj = res.data.beidian_35s;
                }
                if (res.data && res.data.beidian_93s) {
                    this.suspendAd = res.data.beidian_93s[0];
                }
            });
        },
        // 去悬浮广告位
        goAdSuspend(item) {
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: '签到区悬浮广告位',
                    page_track_data: this.page_track_data || '',
                    target: item.target,
                    title: item.title,
                    sid: item.sid,
                    rid: item.rid,
                },
            });
            hybrid('openURL').openURL({
                url: item.target,
            }, noop);
        },
        signMarkWith(item) {
            if (item.amt_new) {
                return {
                    width: '112px',
                };
            }
            return {
                width: '72px',
            };
        },
        // 加载更多,next page
        loadMorePro() {
            if (this.has_more && !this.isLocked) {
                this.page += 1;
                this.getBigData()
            }
        },
        onrefresh() {
            this.refreshing = true;
            this.isLocked = false;
            this.page = 1;
            clearInterval(this.toastToken);
            hybrid('showLoading').showLoading({}, noop);
            this.$refs.list && this.$refs.list.resetLoadmore();
            this.init();
        },
        goBack() {
            if (this.is_checkin) {
               this.closePage();
            } else {
                if(!this.is_checkin){
                    this.showDialog(1, {
                        continue: this.continueCheckinIcon,
                    });
                    // this.is_show_return_window = true;
                    this.returnLogs();
                }
            }
        },
        // 挽留弹框打点
        returnLogs(){
            if (this.continueCheckinIcon){
                statistics.sendLog({
                    et: 'floatStart',
                    json: {
                        block_name: '福利挽留弹窗曝光',
                    },
                });
            }else{
                statistics.sendLog({
                    et: 'floatStart',
                    json: {
                        block_name: '兜底挽留弹窗曝光',
                    },
                });
            }
        },
        closePage () {
            if(this.continueCheckinIcon){
                statistics.sendLog({
                    et: 'click',
                    json: {
                        block_name: '福利挽留弹窗_离开按钮',
                    },
                });
            } else {
                statistics.sendLog({
                    et: 'click',
                    json: {
                        block_name: '兜底挽留弹窗_离开按钮',
                    },
                });
            }
            hybrid('close').close({}, noop);
        },
        closeReturnWindow(){
            this.closedPop();
            if (this.continueCheckinIcon) {
                statistics.sendLog({
                    et: 'click',
                    json: {
                        block_name: '福利挽留弹窗_立即签到领取按钮',
                    },
                });
            } else {
                statistics.sendLog({
                    et: 'click',
                    json: {
                        block_name: '兜底挽留弹窗_立即签到领取按钮',
                    },
                });
            }
            this.inviteUser('init');
        },
        // 显示规则
        showRules() {
            this.showRule = true;
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: '规则按钮点击',
                },
            });
        },
        // 关闭规则
        ruleClose() {
            this.showRule = false;
        },
        // 明日领取红包提示
        bagNote() {
            modal.toast({
                message: '明天才能领取连签奖励哦',
                duration: 1,
            });
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: '连签奖励悬浮_明日领取_点击',
                },
            });
        },
        // 分享
        share(item, type) {
            let blockName = '';
            if (type === 1) {
                blockName = '明日预告_抢先分享按钮点击';
            } else if (type === 2) {
                blockName = '今日必推_分享按钮点击';
            }
            statistics.sendLog({
                et: 'click',
                json: {
                    block_name: blockName,
                    iid: item.iid,
                },
            });
            let shareInfo = item.share_invite_info;
            let img = item.img;
            if (item.img.indexOf('!') > -1) {
                img = item.img.split('!')[0];
            }
            if (version().gt('3.10.00')) {
                hybrid('shareBoard').shareBoard(item.share_board, (result) => {
                    // if (error) {
                    //     hybrid('openURL').openURL({
                    //         url: target,
                    //     }, () => false);
                    // }
                });
            } else {
                hybrid('shareToast').shareToast({
                    icon_promotion: shareInfo.icon_promotion,
                    link: shareInfo.link,
                    title: shareInfo.title,
                    desc: shareInfo.desc,
                    img,
                    content: shareInfo.content,
                    price: shareInfo.price, // 售卖价，单位是分
                    origin_price: shareInfo.origin_price, // 原价，单位是分
                    commissionValue: item.commission.commission_value, // 佣金
                    qr_title: shareInfo.qr_title, // 分享二维码文案
                    platforms: shareInfo.platforms,
                    dlg_title: shareInfo.dlg_title,
                    dlg_desc: shareInfo.dlg_desc,
                    discount_info: shareInfo.discount_info,
                    promotion_infos: shareInfo.promotion_infos,
                    avatar: shareInfo.avatar,
                    need_border: shareInfo.need_border || false,
                }, noop);
            }
        },
        // 返回商品前面的icon
        backIcon(item, type) {
            let obj = {};
            if (item.title_icon) {
                let width = parseInt(item.title_icon.icon_width);
                let height = parseInt(item.title_icon.icon_height);
                if (type === 1) {
                    obj = {
                        width: `${width}px`,
                        height: `${height}px`,
                    };
                } else {
                    obj = {
                        'padding-left': `${width}px`,
                    };
                }
            }
            return obj;
        },
        // 控制气泡长度
        getShort(data) {
            if (data && data.length >= 4) {
                let content = data.slice(0, 12);
                return `${content}...`;
            }
            return data;
        },
    },
};
</script>

<style src="./index.less"></style>
