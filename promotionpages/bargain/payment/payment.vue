<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 收货地址 -->
		<view class="address-wrap" v-if="orderPaymentData.is_virtual == 0">
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
		
		<view class="mobile-wrap" v-if="orderPaymentData.is_virtual == 1">
			<view class="tips ns-text-color ns-font-size-sm">购买虚拟类商品需填写您的手机号，以方便商家与您联系</view>
			<view class="form-group">								
				<view class="form-item">									
					<text class="text">手机号码</text>									
					<input type="number" value="" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="ns-font-size-base ns-text-color-gray placeholder" class="ns-font-size-base input" v-model="orderCreateData.member_address.mobile"/>								
				</view>
			</view>
		</view>
	
		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-header" @click="$util.redirectTo('/otherpages/shop/index/index', { site_id: orderPaymentData.shop_goods_list.site_id })">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ orderPaymentData.shop_goods_list.site_name }}</text>
			</view>
			<view class="site-body">
				<!-- 商品 -->
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderPaymentData.shop_goods_list.goods_list" :key="goodsIndex">
					<navigator hover-class="none" class="goods-img" :url="'/pages/goods/detail/detail?sku_id=' + goodsItem.sku_id">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(goodsIndex)" mode="aspectFill"></image>
					</navigator>
					<view class="goods-info">
						<navigator hover-class="none" :url="'/pages/goods/detail/detail?sku_id=' + goodsItem.sku_id" class="goods-name">{{ goodsItem.sku_name }}</navigator>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price ns-text-color">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									{{ goodsItem.price }}
								</text>
							</view>
							<view>
								<text>
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="site-footer">
				<block v-if="orderPaymentData.is_virtual == 0">
					<view class="order-cell">
						<text class="tit">配送方式</text>
						<block v-if="orderPaymentData.shop_goods_list.express_type.length">
							<view class="box" @click="openSiteDelivery">
								<text class="ns-text-color-gray">{{ orderPaymentData.delivery.delivery_type_name }}</text>
							</view>
							<text class="iconfont iconright"></text>
						</block>
						<block v-else-if="!orderPaymentData.member_address">
							<view class="box"><text class="ns-text-color">请先填写收货地址</text></view>
						</block>
						<block v-else>
							<view class="box"><text class="ns-text-color">商家未配置配送方式</text></view>
						</block>
					</view>
				</block>
				<view class="order-cell" v-if="orderPaymentData.shop_goods_list.coupon_list.length">
					<text class="tit">优惠券</text>
					<view class="box text-overflow" @click="openSiteCoupon">
						<text v-if="orderPaymentData.coupon.coupon_id" class="ns-text-color-gray">
							<text class="inline">已选择优惠券，已优惠</text>
							<text class="ns-text-color inline">
								<text class="ns-font-size-sm inline">{{ $lang('common.currencySymbol') }}</text>
								{{ orderPaymentData.coupon.coupon_money }}
							</text>
						</text>
						<text class="ns-text-color-gray" v-else>不使用优惠券</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell">
					<text class="tit">店铺活动</text>
					<view class="box text-overflow" @click="openSitePromotion">
						<text class="ns-text-color-gray">
							砍价
						</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell">
					<text class="tit">买家留言</text>
					<view class="box">
						<input
							type="text"
							value=""
							placeholder="留言前建议先与商家协调一致"
							class="ns-text-color-gray ns-font-size-base"
							placeholder-class="ns-text-color-gray ns-font-size-base"
							v-model="orderCreateData.buyer_message"
						/>
					</view>
				</view>
			</view>
		</view>
	
		<!-- 付款台 -->
		<view class="order-checkout" v-if="orderPaymentData.member_account.balance_total > 0">
			<view class="order-cell">
				<text class="tit">使用余额</text>
				<view class="box align-right"></view>
				<text class="iconfont" :class="orderCreateData.is_balance ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'" @click="useBalance"></text>
			</view>
		</view>
	
		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box align-right">
					<text class="ns-text-color-black">
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						{{ orderPaymentData.goods_money | moneyFormat }}
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.is_virtual == 0">
				<text class="tit">运费</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">+</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.delivery_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.invoice_money > 0">
				<text class="tit">税费</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">+</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.invoice_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.promotion_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.coupon_money > 0">
				<text class="tit">优惠券</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.coupon_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.balance_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
		</view>
	
		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text class="ns-text-color-gray">共{{ orderPaymentData.goods_num }}件，</text>
				<text>合计：</text>
				<text class="ns-text-color">
					{{ $lang('common.currencySymbol') }}
					<text class="money">{{ orderPaymentData.pay_money | moneyFormat }}</text>
				</text>
			</view>
			<view class="submit-btn">
				<button type="primary" size="mini" @click="orderCreate">提交订单</button>
			</view>
		</view>
	
		<!-- 发票弹窗 -->
		<uni-popup ref="invoicePopup" type="bottom">
			<view class="invoice-popup popup">
				<view class="popup-header">
					<view><text class="tit">发票</text></view>
					<view class="align-right">
						<text class="vice-tit">发票须知</text>
						<text class="iconfont iconguanbi ns-text-color-gray" @click="closePopup('invoicePopup')"></text>
					</view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="invoice-cell">
							<text class="tit">发票类型</text>
							<view class="option-grpup">
								<view class="option-item active ns-border-color ns-text-color">普通发票</view>
								<view class="option-item">电子发票</view>
								<view class="option-item disabled">增值税专票</view>
							</view>
						</view>
						<view class="invoice-cell">
							<text class="tit">发票抬头</text>
							<view class="option-grpup">
								<view class="option-item active  ns-border-color ns-text-color">个人</view>
								<view class="option-item">企业</view>
							</view>
							<view class="form-group">
								<view class="form-item">
									<text class="text">单位名称</text>
									<input
										type="text"
										value=""
										placeholder="请填写单位名称"
										placeholder-class="ns-font-size-base ns-text-color-gray placeholder"
										class="ns-font-size-base input"
									/>
								</view>
								<view class="form-item">
									<text class="text">纳税人识别号</text>
									<input
										type="text"
										value=""
										placeholder="请填写纳税人识别号"
										placeholder-class="ns-font-size-base ns-text-color placeholder"
										class="ns-font-size-base input"
									/>
								</view>
							</view>
						</view>
						<view class="invoice-cell">
							<text class="tit">发票内容</text>
							<view class="option-grpup">
								<view class="option-item active  ns-border-color ns-text-color">商品明细</view>
								<view class="option-item">商品类别</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn ns-bg-color">确定</view></view>
			</view>
		</uni-popup>
	
		<!-- 优惠券弹窗 -->
		<uni-popup ref="couponPopup" type="bottom">
			<view class="coupon-popup popup">
				<view class="popup-header">
					<view><text class="tit">优惠券</text></view>
					<view class="align-right"><text class="iconfont iconguanbi ns-text-color-gray" @click="closePopup('couponPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="coupon-item" v-for="(couponItem, couponIndex) in orderPaymentData.shop_goods_list.coupon_list" :key="couponIndex" @click="selectCoupon(couponItem)">
						<view
							class="iconfont"
							:class="orderPaymentData.coupon.coupon_id == couponItem.coupon_id ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"
						></view>
						<view class="circular"></view>
						<view class="coupon-info">
							<view class="coupon-money">
								<text class="ns-text-color">{{ parseFloat(couponItem.money) }}</text>
							</view>
							<view class="info">
								<view>{{ couponItem.coupon_name }}</view>
								<view class="ns-text-color-gray ns-font-size-sm" v-if="couponItem.at_least > 0">满{{ couponItem.at_least }}可用</view>
								<view class="ns-text-color-gray ns-font-size-sm" v-else>任意金额可用</view>
								<view class="ns-text-color-gray ns-font-size-sm">有效期：{{ $util.timeStampTurnTime(couponItem.end_time) }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn ns-bg-color" @click="popupConfirm('couponPopup')">确定</view></view>
			</view>
		</uni-popup>
	
		<!-- 活动优惠弹窗 -->
		<uni-popup ref="sitePromotionPopup" type="bottom">
			<view class="promotion-popup popup">
				<view class="popup-header">
					<view><text class="tit">店铺活动</text></view>
					<view class="align-right"><text class="iconfont iconguanbi ns-text-color-gray" @click="closePopup('sitePromotionPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="order-cell" v-if="orderPaymentData.bargain_info">
							<view class="tit"><view class="promotion-mark ns-gradient-promotionpages-topics-payment" :data-theme="themeStyle">砍价</view></view>
							<view class="box align-right">
								已砍价<text class="ns-text-color">{{ bargainPrice }}</text>元
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn ns-bg-color" @click="closePopup('sitePromotionPopup')">确定</view></view>
			</view>
		</uni-popup>
	
		<!-- 配送弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<view><text class="tit">配送</text></view>
					<view class="align-right"><text class="iconfont iconguanbi ns-text-color-gray" @click="closePopup('deliveryPopup')"></text></view>
				</view>
				<view class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-cell">
						<view class="option-grpup">
							<view
								class="option-item"
								:class="{ 'ns-text-color active ns-border-color': deliveryItem.name == orderPaymentData.delivery.delivery_type }"
								v-for="(deliveryItem, deliveryIndex) in orderPaymentData.shop_goods_list.express_type"
								:key="deliveryIndex"
								@click="selectDeliveryType(deliveryItem)"
							>
								{{ deliveryItem.title }}
							</view>
						</view>
					</view>
					<block v-for="(deliveryItem, deliveryIndex) in orderPaymentData.shop_goods_list.express_type" :key="deliveryIndex" v-if="orderPaymentData.delivery.delivery_type == deliveryItem.name">
						<block v-if="deliveryItem.name == 'store'">
							<view class="delivery-cell delivery-cont" v-show="orderPaymentData.delivery.delivery_type == 'store'">
								<block v-if="deliveryItem.store_list.length">
									<view
										class="pickup-point"
										v-for="(storeItem, storeIndex) in deliveryItem.store_list"
										:key="storeIndex"
										@click="selectPickupPoint(storeItem.store_id)"
									>
										<view class="name">
											<text>{{ storeItem.store_name }}</text>
											<view class="icon" v-if="storeItem.store_id == orderPaymentData.delivery.store_id">
												<text class="iconfont icondui ns-text-color"></text>
											</view>
										</view>
										<view class="info">
											<text class="ns-text-color-gray ns-font-size-sm">地址：{{ storeItem.full_address }}{{ storeItem.address }}</text>
											<text class="ns-text-color-gray ns-font-size-sm">营业时间：{{ storeItem.open_date }}</text>
										</view>
									</view>
								</block>
							</view>
						</block>
						<view class="delivery-cell delivery-cont" v-show="orderPaymentData.delivery.delivery_type == 'local' && orderPaymentData.delivery.showTimeBar">
							<view class="uni-list">
								<view class="uni-list-cell">
									<view class="uni-list-cell-left">送达时间</view>
									<view class="uni-list-cell-db">
										<picker mode="time" :value="timeTip" start="09:01" end="21:01" @change="bindTimeChange">
											<view class="uni-input">{{ timeTip }}</view>
										</picker>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn ns-bg-color" @click="popupConfirm('deliveryPopup')">确定</view></view>
			</view>
		</uni-popup>
		
		<!-- 支付密码弹窗 -->
		<uni-popup ref="payPassword" :custom="true">
			<view class="pay-password">
				<block v-if="orderPaymentData.member_account.is_pay_password == 0">
					<view class="title">为了您的账户安全,请先设置您的支付密码</view>
					<view class="tips">可到"个人中心","个人资料","支付密码"中设置</view>
					<view class="btn ns-bg-color ns-border-color" @click="setPayPassword">立即设置</view>
					<view class="btn white ns-text-color ns-border-color" @click="noSet">暂不设置</view>					
				</block>
				<block v-else>
					<view class="title">请输入支付密码</view>
					<view class="password-wrap">
						<myp-one :maxlength="6" :is-pwd="true" @input="input" ref="input" :auto-focus="isFocus" type="box"></myp-one>  
						<view class="align-right">
							<text class="ns-text-color ns-font-size-sm forget-password" @click="setPayPassword">忘记密码</text>
						</view>
					</view>
				</block>
			</view>
		</uni-popup>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import payment from '../public/js/payment.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import mypOne from '@/components/myp-one/myp-one.vue';

export default {
	mixins: [payment],
	components: {
		uniPopup
	},
	data() {
		return {
			timeTip: '选择配送时间',
			time:null
		};
	},
	computed:{
		bargainPrice(){
			if(this.orderPaymentData&&this.orderPaymentData.bargain_info){
				return (Number(this.orderPaymentData.bargain_info.price) - Number(this.orderPaymentData.bargain_info.curr_price)).toFixed(2)
			}else{
				return 0
			}
		}
	},
	onLoad() {},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		bindTimeChange(e) {
			this.timeTip=""+e.target.value;
			this.time = e.target.value;
			this.orderCreateData.delivery.buyer_ask_delivery_time=this.time;
		}
	}
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