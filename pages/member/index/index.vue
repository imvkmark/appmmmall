<template>
	<view :class="themeStyle">
		<view class="container">
			<view class="member-container">
				<view class="user-section ns-gradient-pages-member-index-index" :class="themeStyle">
					<view class="bg-img"><image src="/static/user/bg-2.png" mode=""></image></view>
					<view class="user-section-box">
						<view class="user-info-box" v-if="token">
							<navigator hover-class="none" url="/otherpages/member/info/info" class="user-head">
								<image
									:src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().default_headimg"
									mode="aspectFill"
									@error="memberInfo.headimg = $util.getDefaultImage().default_headimg"
								></image>
							</navigator>
							<view class="user-box">
								<text class="user-title">{{ memberInfo.nickname }}</text>
								<view class="">
									<navigator hover-class="none" v-if="memberInfo.member_level_name" url="/otherpages/member/level/level" class="user-label">
										{{ memberInfo.member_level_name }}
									</navigator>
								</view>
							</view>
						</view>
						<view class="user-info-box no-log" v-if="!token" @click="redirectToLink('/pages/member/index/index')">
							<view class="user-head"><image :src="$util.getDefaultImage().default_headimg"></image></view>
							<view class="user-box">
								<text class="user-title">{{ $lang('login') }}</text>
								<text class="user-desc">{{ $lang('loginTpis') }}</text>
							</view>
						</view>
						<navigator hover-class="none" class="user-kefu" url="/otherpages/member/info/info" v-if="token">
							<view class="iconfont iconfuwupingjia-kefu"></view>
						</navigator>
						<navigator hover-class="none" class="user-set" url="/otherpages/member/info/info" v-if="token"><view class="iconfont iconshezhi"></view></navigator>
						<view class="member-sction">
							<view class="sction-item" @click="redirectToLink('/otherpages/member/balance_detail/balance_detail?type=balance')">
								<!-- <text class="num">{{ (parseFloat(memberInfo.balance) + parseFloat(memberInfo.balance_money)).toFixed(3) }}</text> -->
								<text class="num">{{ parseInt(memberInfo_news.mm || 0).toFixed(3) }}</text>
								<text class="sction-item-name">{{ $lang('balance') }}</text>
							</view>
							<view class="line"></view>
							<view class="sction-item" @click="redirectToLink('/otherpages/member/balance_detail/balance_detail?type=mycn')">
								<!-- <text class="num">{{ parseInt(memberInfo.point)).toFixed(3) }}</text> -->
								<text class="num">{{ parseInt(memberInfo_news.mycn || 0).toFixed(3) }}</text>
								<text class="sction-item-name">{{ $lang('point') }}</text>
							</view>
							<view class="line"></view>
							<view class="sction-item" @click="redirectToLink('/otherpages/member/balance_detail/balance_detail?type=mall')">
								<!-- <text class="num">{{ couponNum.toFixed(3) }}</text> -->
								<text class="num">{{ parseInt(memberInfo_news.mall || 0).toFixed(3) }}</text>
								<text class="sction-item-name">{{ $lang('poins') }}</text>
							</view>
						</view>
						<view class="member-sction">
							<view class="sction-item" @click="redirectToLink('/otherpages/member/balance_detail/balance_detail?type=growth')">
								<!-- <text class="num">{{ (parseFloat(memberInfo.balance) + parseFloat(memberInfo.balance_money)).toFixed(3) }}</text> -->
								<!-- <text class="num">{{ parseInt(memberInfo.growth).toFixed(3) }}</text> -->
								<text class="num">{{ parseInt(memberInfo_news.all || 0).toFixed(3) }}</text>
								<text class="sction-item-name">{{ $lang('heyuechi') }}</text>
							</view>
							<view class="line"></view>
							<view class="sction-item" @click="redirectToLink('/otherpages/member/balance_detail/balance_detailred?type=point')">
								<!-- <text class="num">{{ parseInt(memberInfo.point).toFixed(3) }}</text> -->
								<text class="num">{{ parseInt(memberInfo_news.red || 0).toFixed(3) }}</text>
								<text class="sction-item-name">{{ $lang('zhiyaredc') }}</text>
							</view>
							<!-- <view class="line"></view>
							<view class="sction-item" @click="redirectToLink('/otherpages/member/coupon/coupon')">
								<text class="num">{{ couponNum }}</text>
								<text class="sction-item-name">{{ $lang('coupon') }}</text>
							</view> -->
						</view>
					</view>
				</view>
				<view class="member-body">
					<!-- 订单模块 -->
					<view class="order-section">
						<view class="order-head" @click="redirectToLink('/pages/order/list/list')">
							<text class="order-tit">{{ $lang('allOrders') }}</text>
							<text class="order-tip">{{ $lang('seeAllOrders') }}</text>
							<text class="order-more iconfont iconright"></text>
						</view>
						<view class="order-body">
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitpay')">
								<view class="order-icon">
									<text v-if="orderNum.waitPay > 99" class="order-num ns-bg-color">99+</text>
									<text v-else-if="orderNum.waitPay > 0" class="order-num ns-bg-color">{{ orderNum.waitPay }}</text>
									<!-- <image :src="$util.img('upload/uniapp/member/index/order/blue_order_1.png')" mode=""></image> -->
									<image src="/static/user/order/blue_order_1.png" mode=""></image>
								</view>
								<text class="order-name">{{ $lang('waitPay') }}</text>
							</view>
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitsend')">
								<view class="order-icon">
									<text v-if="orderNum.readyDelivery > 99" class="order-num ns-bg-color">99+</text>
									<text v-else-if="orderNum.readyDelivery > 0" class="order-num ns-bg-color">{{ orderNum.readyDelivery }}</text>
									<image src="/static/user/order/blue_order_2.png" mode=""></image>
								</view>
								<text class="order-name">{{ $lang('readyDelivery') }}</text>
							</view>
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitconfirm')">
								<view class="order-icon">
									<text v-if="orderNum.waitDelivery > 99" class="order-num ns-bg-color">99+</text>
									<text v-else-if="orderNum.waitDelivery > 0" class="order-num ns-bg-color">{{ orderNum.waitDelivery }}</text>
									<image src="/static/user/order/blue_order_3.png" mode=""></image>
								</view>
								<text class="order-name">{{ $lang('waitDelivery') }}</text>
							</view>
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitrate')">
								<view class="order-icon">
									<text v-if="orderNum.waitEvaluate > 99" class="order-num ns-bg-color">99+</text>
									<text v-else-if="orderNum.waitEvaluate > 0" class="order-num ns-bg-color">{{ orderNum.waitEvaluate }}</text>
									<image src="/static/user/order/blue_order_4.png" mode=""></image>
								</view>
								<text class="order-name">{{ $lang('waitEvaluate') }}</text>
							</view>
							<!-- <view class="order-item" @click="redirectToLink('/pages/order/activist/activist')">
								<view class="order-icon">
									<text v-if="orderNum.refunding > 99" class="order-num ns-bg-color">99+</text>
									<text v-else-if="orderNum.refunding > 0" class="order-num ns-bg-color">{{ orderNum.refunding }}</text>
									<image :src="$util.img('upload/uniapp/member/index/order_5.png')" mode=""></image>
								</view>
								<text class="order-name">{{ $lang('refunding') }}</text>
							</view> -->
						</view>
					</view>

					<view class="member-level" @click="jumpLevel()">
						<view class="member"><image :src="$util.img('upload/uniapp/member/index/member.png')" mode=""></image></view>
						<view class="member-level-box">
							<view class="img-wrap">
								<image class="img-v" :src="$util.img('upload/uniapp/member/index/v.png')" mode=""></image>
								<text class="ns-font-size-base" v-if="token">{{ memberInfo.member_level_name }}</text>
								<text class="ns-font-size-sm" v-else>登录查看权益</text>
							</view>
							<text class="memeber-tit">
								<text class="member-title">会员等级更多权益</text>
								<text class="iconfont iconright ns-font-size-sm"></text>
							</text>
						</view>
					</view>

					<!-- 商城功能模块 -->
					<view class="example-body">
						<view class="example-body-head"><text class="example-tit">商城功能</text></view>
						<uni-grid :column="4" :show-border="false" :square="false">
							<!-- 会员充值 -->
							<!-- <view @click="redirectToLink('/otherpages/recharge/list/list')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/m-recharge.png')" mode="aspectFill" />
									<text class="text">充值</text>
								</uni-grid-item>
							</view> -->

							<!-- 签到 -->
							<view @click="redirectToLink('/otherpages/member/signin/signin')" v-if="addonIsExit.membersignin">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/blue_sign.png" mode="aspectFill" />
									<text class="text">签到</text>
								</uni-grid-item>
							</view>

							<!-- 个人资料 -->
							<view @click="redirectToLink('/otherpages/member/info/info')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/blue_person.png" mode="aspectFill" />
									<text class="text">{{ $lang('personInfo') }}</text>
								</uni-grid-item>
							</view>

							<!-- 发现 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/shop/street/street')">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/find.png')" mode="aspectFill" />
										<text class="text">发现</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 地址管理 -->
							<view @click="redirectToLink('/otherpages/member/address/address')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/blue_address.png" mode="aspectFill" />
									<text class="text">{{ $lang('receivingAddress') }}</text>
								</uni-grid-item>
							</view>

							<!-- 优惠券 -->
							<view @click="redirectToLink('/otherpages/member/coupon/coupon')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/blue_discount.png" mode="aspectFill" />
									<text class="text">{{ $lang('couponList') }}</text>
								</uni-grid-item>
							</view>

							<!-- 我的拼单 -->
							<block v-if="Development">
								<view @click="redirectToLink('/promotionpages/pintuan/my_spell/my_spell')" v-if="addonIsExit.pintuan">
									<uni-grid-item>
										<image class="image" src="/static/user/menu/blue_store.png" mode="aspectFill" />
										<text class="text">{{ $lang('mySpellList') }}</text>
									</uni-grid-item>
								</view>
							</block>

							<!-- 我的礼品 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/member/gift/gift')" v-if="addonIsExit.gift">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/gift.png')" mode="aspectFill" />
										<text class="text">{{ $lang('winningRecord') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 我的收藏 -->
							<view @click="redirectToLink('/otherpages/member/collection/collection')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/blue_like.png" mode="aspectFill" />
									<text class="text">{{ $lang('myCollection') }}</text>
								</uni-grid-item>
							</view>

							<!-- 我的足迹 -->
							<!-- <view @click="redirectToLink('/otherpages/member/footprint/footprint')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/toot.png')" mode="aspectFill" />
									<text class="text">{{ $lang('myTracks') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 兑换记录 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/promotionpages/point/order_list/order_list')" v-if="addonIsExit.pointexchange">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/point_recond.png')" mode="aspectFill" />
										<text class="text">{{ $lang('exchangeOrder') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 核销台 -->
							<!-- <view v-if="authInfo.is_verifier" @click="redirectToLink('/otherpages/verification/index/index')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/verification.png')" mode="aspectFill" />
									<text class="text">{{ $lang('verification') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 账户 -->
							<block v-if="Development">
								<view @click="redirectToLink('/otherpages/member/account/account')" v-if="addonIsExit.memberwithdraw && withdrawConfig && withdrawConfig.is_use">
									<uni-grid-item>
										<image class="image" src="/static/user/menu/blue_cash.png" mode="aspectFill" />
										<text class="text">{{ $lang('accountList') }}</text>
									</uni-grid-item>
								</view>
							</block>

							<!-- 砍价 -->
							<view @click="redirectToLink('/promotionpages/bargain/my_bargain/my_bargain')" v-if="addonIsExit.bargain">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/blue_bargain.png" mode="aspectFill" />
									<text class="text">{{ $lang('myBargain') }}</text>
								</uni-grid-item>
							</view>

							<!-- 分销中心 -->
							<block v-if="Development">
								<view
									@click="redirectToLink('/otherpages/fenxiao/promote_code/promote_code')"
									v-if="addonIsExit.fenxiao && fenxiaoBasicsConfig && fenxiaoBasicsConfig.level > 0"
								>
									<uni-grid-item>
										<image class="image" src="/static/user/menu/blue_fenxiao.png" mode="aspectFill" />
										<text class="text">{{ fenxiaoWords.concept + '海报' }}</text>
									</uni-grid-item>
								</view>
							</block>
						</uni-grid>
					</view>

					<!-- 合约功能模块 -->
					<view class="example-body" style="margin-top: -60rpx;">
						<view class="example-body-head"><text class="example-tit">合约功能</text></view>
						<uni-grid :column="4" :show-border="false" :square="false">
							<!-- 会员充值 -->
							<view @click="redirectToLink('/otherpages/recharge/list/list')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/m-recharge.png" mode="aspectFill" />
									<text class="text">充币中心</text>
								</uni-grid-item>
							</view>

							<!-- 投资合约 -->
							<view @click="redirectToLink('/pages/otc/invest')" v-if="addonIsExit.membersignin">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/tzhy.png" mode="aspectFill" />
									<text class="text">投资合约</text>
								</uni-grid-item>
							</view>

							<!-- 质押分红 -->
							<view @click="redirectToLink('/otherpages/member/address/address')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/zhiyared.png" mode="aspectFill" />
									<text class="text">{{ $lang('zhiyared') }}</text>
								</uni-grid-item>
							</view>

							<!-- 投资订单 -->
							<view @click="redirectToLink('/otherpages/member/info/info')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/tzorder.png" mode="aspectFill" />
									<text class="text">{{ $lang('touziorder') }}</text>
								</uni-grid-item>
							</view>

							<!-- 实名认证 -->
							<view @click="redirectToLink('/pages/otc/realname')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/shiming.png" mode="aspectFill" />
									<text class="text">{{ $lang('shimingrenzheng') }}</text>
								</uni-grid-item>
							</view>

							<!-- 释放记录 -->
							<view @click="redirectToLink('/otherpages/member/info/info')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/shifanglist.png" mode="aspectFill" />
									<text class="text">{{ $lang('sifanglist') }}</text>
								</uni-grid-item>
							</view>

							<!-- 分红明细 -->
							<view @click="redirectToLink('/otherpages/member/info/info')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/fenhongmingxi.png" mode="aspectFill" />
									<text class="text">{{ $lang('fenhonglist') }}</text>
								</uni-grid-item>
							</view>

							<!-- 发现 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/shop/street/street')">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/find.png')" mode="aspectFill" />
										<text class="text">发现</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 地址管理 -->
							<!-- <view @click="redirectToLink('/otherpages/member/address/address')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/address.png')" mode="aspectFill" />
									<text class="text">{{ $lang('receivingAddress') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 优惠券 -->
							<!-- <view @click="redirectToLink('/otherpages/member/coupon/coupon')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/discount.png')" mode="aspectFill" />
									<text class="text">{{ $lang('couponList') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 我的拼单 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/promotionpages/pintuan/my_spell/my_spell')" v-if="addonIsExit.pintuan">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/store.png')" mode="aspectFill" />
										<text class="text">{{ $lang('mySpellList') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 我的礼品 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/member/gift/gift')" v-if="addonIsExit.gift">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/gift.png')" mode="aspectFill" />
										<text class="text">{{ $lang('winningRecord') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 我的收藏 -->
							<!-- <view @click="redirectToLink('/otherpages/member/collection/collection')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/like.png')" mode="aspectFill" />
									<text class="text">{{ $lang('myCollection') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 我的足迹 -->
							<!-- <view @click="redirectToLink('/otherpages/member/footprint/footprint')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/toot.png')" mode="aspectFill" />
									<text class="text">{{ $lang('myTracks') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 兑换记录 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/promotionpages/point/order_list/order_list')" v-if="addonIsExit.pointexchange">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/point_recond.png')" mode="aspectFill" />
										<text class="text">{{ $lang('exchangeOrder') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 核销台 -->
							<!-- <view v-if="authInfo.is_verifier" @click="redirectToLink('/otherpages/verification/index/index')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/verification.png')" mode="aspectFill" />
									<text class="text">{{ $lang('verification') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 账户 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/member/account/account')" v-if="addonIsExit.memberwithdraw && withdrawConfig && withdrawConfig.is_use">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/cash.png')" mode="aspectFill" />
										<text class="text">{{ $lang('accountList') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 分销中心 -->
							<block v-if="Development">
								<view @click="redirectToLink('/otherpages/fenxiao/index/index')" v-if="addonIsExit.fenxiao && fenxiaoBasicsConfig && fenxiaoBasicsConfig.level > 0">
									<uni-grid-item>
										<image class="image" src="/static/user/menu/tuandui.png" mode="aspectFill" />
										<!-- <text class="text">{{ fenxiaoWords.concept + '中心' }}</text> -->
										<text class="text">我的团队</text>
									</uni-grid-item>
								</view>
							</block>

							<!-- 砍价 -->
							<!-- <view @click="redirectToLink('/promotionpages/bargain/my_bargain/my_bargain')" v-if="addonIsExit.bargain">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/menu/'+  themeStyleScore +'_bargain.png')" mode="aspectFill" />
									<text class="text">{{ $lang('myBargain') }}</text>
								</uni-grid-item>
							</view> -->
						</uni-grid>
					</view>

					<!-- 交易大厅模块 -->
					<view class="example-body" style="margin-top: -60rpx;">
						<view class="example-body-head"><text class="example-tit">交易大厅</text></view>
						<uni-grid :column="4" :show-border="false" :square="false">
							<!-- 区块钱包 -->
							<view @click="redirectToLink('/pages/wallet/wallet')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/money.png" mode="aspectFill" />
									<text class="text">{{ $lang('qukuaicoin') }}</text>
								</uni-grid-item>
							</view>

							<!-- 交易大厅主页 -->
							<view @click="redirectToLink('/pages/otc/otc')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/jiaoyidating.png" mode="aspectFill" />
									<text class="text">{{ $lang('jiaoyidating') }}</text>
								</uni-grid-item>
							</view>

							<!-- 我要买 -->
							<!-- <view @click="redirectToLink('/otherpages/recharge/list/list')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/buy.png" mode="aspectFill" />
									<text class="text">我要买</text>
								</uni-grid-item>
							</view> -->

							<!-- 我要卖 -->
							<!-- <view @click="redirectToLink('/pages/otc/order/list')" v-if="addonIsExit.membersignin">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/sell.png" mode="aspectFill" />
									<text class="text">我要卖</text>
								</uni-grid-item>
							</view> -->

							<!-- 交易记录 -->
							<view @click="redirectToLink('/pages/otc/order/list')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/jiaoyilist.png" mode="aspectFill" />
									<text class="text">{{ $lang('otcorder') }}</text>
								</uni-grid-item>
							</view>

							<!-- 收付款管理 -->
							<view @click="redirectToLink('/pages/otc/sale')"><!-- /pages/otc/payType -->
								<uni-grid-item>
									<image class="image" src="/static/user/menu/bank.png" mode="aspectFill" />
									<text class="text">{{ $lang('shoufukuan') }}</text>
								</uni-grid-item>
							</view>

							<!-- 实名认证 -->
							<!-- <view @click="redirectToLink('/otherpages/member/info/info')">
								<uni-grid-item>
									<image class="image" src="/static/user/menu/shiming.png" mode="aspectFill" />
									<text class="text">{{ $lang('shimingrenzheng') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 发现 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/shop/street/street')">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/find.png')" mode="aspectFill" />
										<text class="text">发现</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 地址管理 -->
							<!-- <view @click="redirectToLink('/otherpages/member/address/address')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/address.png')" mode="aspectFill" />
									<text class="text">{{ $lang('receivingAddress') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 优惠券 -->
							<!-- <view @click="redirectToLink('/otherpages/member/coupon/coupon')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/discount.png')" mode="aspectFill" />
									<text class="text">{{ $lang('couponList') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 我的拼单 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/promotionpages/pintuan/my_spell/my_spell')" v-if="addonIsExit.pintuan">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/store.png')" mode="aspectFill" />
										<text class="text">{{ $lang('mySpellList') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 我的礼品 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/member/gift/gift')" v-if="addonIsExit.gift">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/gift.png')" mode="aspectFill" />
										<text class="text">{{ $lang('winningRecord') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 我的收藏 -->
							<!-- <view @click="redirectToLink('/otherpages/member/collection/collection')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/like.png')" mode="aspectFill" />
									<text class="text">{{ $lang('myCollection') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 我的足迹 -->
							<!-- <view @click="redirectToLink('/otherpages/member/footprint/footprint')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/toot.png')" mode="aspectFill" />
									<text class="text">{{ $lang('myTracks') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 兑换记录 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/promotionpages/point/order_list/order_list')" v-if="addonIsExit.pointexchange">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/point_recond.png')" mode="aspectFill" />
										<text class="text">{{ $lang('exchangeOrder') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 核销台 -->
							<!-- <view v-if="authInfo.is_verifier" @click="redirectToLink('/otherpages/verification/index/index')">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/verification.png')" mode="aspectFill" />
									<text class="text">{{ $lang('verification') }}</text>
								</uni-grid-item>
							</view> -->

							<!-- 账户 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/member/account/account')" v-if="addonIsExit.memberwithdraw && withdrawConfig && withdrawConfig.is_use">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/cash.png')" mode="aspectFill" />
										<text class="text">{{ $lang('accountList') }}</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 分销中心 -->
							<!-- <block v-if="Development">
								<view @click="redirectToLink('/otherpages/fenxiao/index/index')" v-if="addonIsExit.fenxiao && fenxiaoBasicsConfig && fenxiaoBasicsConfig.level > 0">
									<uni-grid-item>
										<image class="image" :src="$util.img('upload/uniapp/member/index/fenxiao.png')" mode="aspectFill" /> -->
							<!-- <text class="text">{{ fenxiaoWords.concept + '中心' }}</text> -->
							<!-- <text class="text">我的团队</text>
									</uni-grid-item>
								</view>
							</block> -->

							<!-- 砍价 -->
							<!-- <view @click="redirectToLink('/promotionpages/bargain/my_bargain/my_bargain')" v-if="addonIsExit.bargain">
								<uni-grid-item>
									<image class="image" :src="$util.img('upload/uniapp/member/index/menu/'+  themeStyleScore +'_bargain.png')" mode="aspectFill" />
									<text class="text">{{ $lang('myBargain') }}</text>
								</uni-grid-item>
							</view> -->
						</uni-grid>
					</view>
				</view>
				<nsGoodsRecommend ref="goodrecommend"></nsGoodsRecommend>
				<view class="ns-padding-bottom"><ns-copy-right></ns-copy-right></view>

				<ns-login ref="login"></ns-login>
				<!-- 底部tabBar -->
				<diy-bottom-nav @isBulge="isBulge"></diy-bottom-nav>
			</view>
		</view>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>

<script>
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
import toTop from '@/components/toTop/toTop.vue';
import scroll from '@/common/js/scroll-view.js';
import nsCopyRight from '@/components/ns-copyright/ns-copyright.vue';
import fenxiaoWords from 'common/js/fenxiao-words.js';
import globalConfig from '@/common/js/golbalConfig.js'

export default {
	components: {
		uniGrid,
		uniGridItem,
		diyBottomNav,
		nsGoodsRecommend,
		toTop,
		nsCopyRight
	},
	data() {
		return {
			token: '',
			memberInfo: {
				balance: 0,
				balance_money: 0,
				point: 0
			},
			memberInfo_news: {
				mm:'',
				mycn:'',
				mall:'',
				all:'',
				red:''
			},
			couponNum: 0,
			orderNum: {
				waitPay: 0, //待付款
				readyDelivery: 0, //待发货
				waitDelivery: 0, //待收货
				waitEvaluate: 0, // 待评价
				refunding: 0 // 退款中
			},
			isVerification: true,
			copyrightLoad: 0,
			bottom_info: {},
			authInfo: {
				is_verifier: false
			},

			shopTop: false,
			scrollTop: 0,
			shopConfig: null,
			promoterInfo: null,
			withdrawConfig: null,
			fenxiaoBasicsConfig: null,
			Bulge:false
		};
	},
	mixins: [scroll, fenxiaoWords,globalConfig],
	onLoad() {
		this.sendRequest_moey()
		this.sendRequest_red()
	},
	async onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		this.token = uni.getStorageSync('token');

		if (uni.getStorageSync('userInfo')) {
			this.memberInfo = uni.getStorageSync('userInfo');
			console.log(this.memberInfo,777)
		}

		if (uni.getStorageSync('authInfo')) {
			this.authInfo = uni.getStorageSync('authInfo');
		}

		if (this.token) {
			await this.getMemberInfo();
			this.getOrderNum();
			this.getCouponNum();
			this.checkIsVerifier();
			if (this.addonIsExit.memberwithdraw) {
				this.getWithdrawConfig();
			}
			if (this.addonIsExit.fenxiao) {
				this.getFenxiaoBasicsConfig();
			}
		} else {
			this.initInfo();
		}
	},
	methods: {
		isBulge(e){
			this.Bulge=e;
		},
		redirectToLink(url) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open(url);
			} else {
				this.$util.redirectTo(url);
			}
		},
		initInfo() {
			this.token = '';
			this.memberInfo = {
				balance: '0.00',
				balance_money: '0.00',
				point: 0
			};
			this.couponNum = 0;
			this.orderNum = {
				waitPay: 0, //待付款
				readyDelivery: 0, //待发货
				waitDelivery: 0, //待收货
				waitEvaluate: 0, // 待评价
				refunding: 0 // 退款中
			};
			this.authInfo = {
				is_verifier: false
			};
			uni.stopPullDownRefresh();
		},
		// 获取合约池
		async sendRequest_red() {
			var that = this
			let res = await this.$api.sendRequest({
				url: '/api/exchange/pond',
				async: false
			});
			that.memberInfo_news.all = res.data.growth
			that.memberInfo_news.red = res.data.abonus
			// console.log(res,555)
		},
		// 获取币数量信息
		async sendRequest_moey() {
			var that = this
			let res = await this.$api.sendRequest({
				url: '/api/exchange/getBalance',
				async: false
			});
			console.log(res,666)
			that.memberInfo_news.mm = res.data.balance.money
			that.memberInfo_news.mycn = res.data.mycn.money
			that.memberInfo_news.mall = res.data.mall.money
		},
		// 获取会员基础信息
		async getMemberInfo() {
			let res = await this.$api.sendRequest({
				url: '/api/member/info',
				async: false
			});
			// console.log(res,'000')
			if (res.code >= 0 && res.data) {
				this.token = uni.getStorageSync('token');
				this.memberInfo = res.data;
				uni.setStorageSync('userInfo', this.memberInfo);
			} else {
				this.token = '';
				this.initInfo();
				uni.removeStorageSync('token');
			}
			uni.stopPullDownRefresh();
		},
		// 下拉刷新
		onPullDownRefresh() {
			if (uni.getStorageSync('token')) this.getMemberInfo();
			else this.initInfo();
		},
		// 订单数量
		getOrderNum() {
			this.$api.sendRequest({
				url: '/api/order/num',
				data: {
					order_status: 'waitpay,waitsend,waitconfirm,waitrate,refunding'
				},
				success: res => {
					if (res.code == 0) {
						this.orderNum.waitPay = res.data.waitpay;
						this.orderNum.readyDelivery = res.data.waitsend;
						this.orderNum.waitDelivery = res.data.waitconfirm;
						this.orderNum.waitEvaluate = res.data.waitrate;
						this.orderNum.refunding = res.data.refunding;
					}
				}
			});
		},
		// 优惠券数量
		getCouponNum() {
			this.$api.sendRequest({
				url: '/api/member/couponnum',
				success: res => {
					console.log(res,888)
					if (res.code == 0) {
						this.couponNum = res.data;
					}
				}
			});
		},
		checkIsVerifier() {
			this.$api.sendRequest({
				url: '/api/verify/checkisverifier',
				success: res => {
					if (res.data) this.authInfo.is_verifier = true;
					else this.authInfo.is_verifier = false;
					uni.setStorageSync('authInfo', this.authInfo);
				}
			});
		},
		jumpLevel() {
			if (this.token) {
				this.$util.redirectTo('/otherpages/member/level/level');
			} else {
				this.$refs.login.open('/pages/member/index/index');
			}
		},
		/**
		 * 获取余额提现配置
		 */
		getWithdrawConfig() {
			this.$api.sendRequest({
				url: '/api/memberwithdraw/config',
				success: res => {
					if (res.code >= 0 && res.data) {
						this.withdrawConfig = res.data;
					}
				}
			});
		},
		/**
		 * 获取分销基本配置
		 */
		getFenxiaoBasicsConfig() {
			this.$api.sendRequest({
				url: '/fenxiao/api/config/basics',
				success: res => {
					if (res.code >= 0) {
						this.fenxiaoBasicsConfig = res.data;
					}
				}
			});
		},
		toLevel(){
			this.$util.r
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/index.scss';
</style>
