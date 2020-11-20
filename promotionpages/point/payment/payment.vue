<template>
	<view class="order-container" :class="themeStyle">
		<!-- 收货地址 -->
		<view class="address-wrap" v-if="orderPaymentData.exchange_info.type == 1">
			<view class="icon"><view class="iconfont icondizhi ns-text-color"></view></view>
			<view class="address-info" @click="selectAddress">
				<block v-if="orderPaymentData.member_address">
					<view class="info">
						<text>收货人：{{ orderPaymentData.member_address.name }}</text>
						<text>{{ orderPaymentData.member_address.mobile }}</text>
					</view>
					<view class="detail">
						<text>收货地址：{{ orderPaymentData.member_address.full_address }} {{ orderPaymentData.member_address.address }}</text>
					</view>
				</block>
				<block v-else>
					<view class="address-empty ns-text-color"><text>您还没有设置收货地址，前去设置</text></view>
				</block>
			</view>
			<view class="cell-more"><view class="iconfont iconright"></view></view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<view class="goods-wrap">
					<view class="goods-img">
						<block v-if="type==1">
							<image :src="$util.img(orderPaymentData.exchange_info.image)" v-if="orderPaymentData.exchange_info.image" @error="imageError()" mode="aspectFill"></image>
							<image :src="$util.img('upload/uniapp/point/gift.png')" v-else mode="aspectFill"></image>
						</block>
						<block v-if="type==2">
							<image :src="$util.img(orderPaymentData.exchange_info.image)" v-if="orderPaymentData.exchange_info.image" @error="imageError()" mode="aspectFill"></image>
							<image :src="$util.img('upload/uniapp/point/coupon.png')" v-else mode="aspectFill"></image>
						</block>
						<block v-if="type==3">
							<image :src="$util.img(orderPaymentData.exchange_info.image)" v-if="orderPaymentData.exchange_info.image" @error="imageError()" mode="aspectFill"></image>
							<image :src="$util.img('upload/uniapp/point/hongbao.png')" v-else mode="aspectFill"></image>
						</block>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ orderPaymentData.exchange_info.name }}</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price ns-text-color">{{ orderPaymentData.exchange_info.point }}积分</text>
							</view>
							<view>
								<text>
									<text class="iconfont iconclose"></text>
									{{ orderPaymentData.num }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="order-buyer-message">
			<view class="order-cell">
				<text class="tit">买家留言</text>
				<view class="box">
					<textarea
						value=""
						placeholder="留言前建议先与商家协调一致"
						class="ns-text-color-gray ns-font-size-base textarea"
						placeholder-class="ns-text-color-gray ns-font-size-base"
						v-model="orderCreateData.buyer_message"
						:auto-height="true"
					/>
				</view>
			</view>
		</view>

		<!-- 金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box align-right">
					<text class="ns-text-color-black">{{ orderPaymentData.point }}积分</text>
				</view>
			</view>
		</view>

		<view class="order-submit">
			<view class="order-settlement-info">
				<text class="ns-text-color-gray">共{{ orderPaymentData.num }}件，</text>
				<text>合计：</text>
				<text class="ns-text-color">
					<text class="money">{{ orderPaymentData.point }}积分</text>
				</text>
			</view>
			<view class="submit-btn"><button type="primary" size="mini" @click="orderCreate">提交订单</button></view>
		</view> 

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import payment from '../public/js/payment.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
	mixins: [payment],
	components: {
		uniPopup
	},
	data() {
		return {};
	},
	onLoad(option) {
		this.type=option.type?option.type:1
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {},
	computed:{
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		}
	},
};
</script>

<style lang="scss">
@import '../public/css/payment.scss';
</style>
<style scoped>
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
</style>
