<template>
	<view class="order-container" :class="themeStyle">
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
					<input
						type="number"
						value=""
						maxlength="11"
						placeholder="请输入您的手机号码"
						placeholder-class="ns-font-size-base ns-text-color-gray placeholder"
						class="ns-font-size-base input"
						v-model="orderCreateData.member_address.mobile"
					/>
				</view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap" v-if="orderPaymentData.shop_goods_list" v-for="(siteItem, siteIndex) in orderPaymentData.shop_goods_list" :key="siteIndex">
			<view class="site-header" @click="toShopDetail(siteItem.site_id)">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ siteItem.site_name }}</text>
			</view>
			<view class="site-body">
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in siteItem.goods_list" :key="goodsIndex">
					<navigator hover-class="none" class="goods-img" :url="'/pages/goods/detail/detail?sku_id=' + goodsItem.sku_id">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(siteIndex, goodsIndex)" mode="aspectFill"></image>
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
						<block v-if="siteItem.express_type.length">
							<view class="box" @click="openSiteDelivery(siteItem.site_id, siteItem.express_type)">
								<text class="ns-text-color-gray">{{ orderPaymentData.delivery[siteItem.site_id].delivery_type_name }}</text>
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
				<view class="order-cell" v-if="siteItem.coupon_list.length">
					<text class="tit">优惠券</text>
					<view class="box text-overflow" @click="openSiteCoupon(siteItem.site_id, siteItem.coupon_list)">
						<text v-if="orderPaymentData.coupon[siteItem.site_id].coupon_id" class="ns-text-color-gray">
							<text class="inline">优惠</text>
							<text class="ns-text-color inline">
								{{ siteItem.coupon_money }} 元
							</text>
						</text>
						<text class="ns-text-color-gray" v-else>不使用优惠券</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell" v-if="siteItem.promotion">
					<text class="tit">店铺优惠</text>
					<view class="box text-overflow store-promotion-box" @click="openSitePromotion(siteItem.promotion)">
						<text class="ns-text-color-gray" v-if="siteItem.promotion.manjian">
							<text v-for="(item, index) in siteItem.promotion.manjian" :key="index">{{ item.discount_array.desc }}</text>
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
							v-model="orderCreateData.buyer_message[siteItem.site_id]"
						/>
					</view>
				</view>
				<view class="order-cell">
					<view class="box align-right order-pay">
						<text class="ns-text-color-gray">共{{ siteItem.goods_num }}件</text>
						<text>
							小计:
							<text class="ns-text-color">
								<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
								{{ siteItem.pay_money | moneyFormat }}
							</text>
						</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 付款台 -->
		<view class="order-checkout">
			<view class="order-cell" v-if="orderPaymentData.member_account.balance_total > 0">
				<text class="tit">使用余额</text>
				<view class="box align-right"></view>
				<text class="iconfont" :class="orderCreateData.is_balance ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'" @click="useBalance"></text>
			</view>
			<!-- <view class="order-cell">
				<text class="tit">发票信息</text>
				<view class="box align-right" @click="openPopup('invoicePopup')"><text class="ns-text-color-gray">无需发票</text></view>
				<text class="iconfont iconright"></text>
			</view> -->
			<view class="order-cell" @click="openPopup('PlatcouponPopup')" v-if="orderPaymentData&&orderPaymentData.platform_coupon_list&&orderPaymentData.platform_coupon_list.length>0">
				<text class="tit">平台优惠券</text>
				<view class="box">
					<text class="ns-text-color-gray">优惠</text>
					<text class="ns-text-color inline">
						<text class="ns-font-size-sm inline">{{ $lang('common.currencySymbol') }}</text>
						{{ orderPaymentData.platform_coupon_money }}  元
					</text>
				</view>
				<text class="iconfont iconright"></text>
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
				<text class="tit">店铺优惠券</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.coupon_money | moneyFormat }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.platform_coupon_money > 0">
				<text class="tit">平台优惠券</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderPaymentData.platform_coupon_money | moneyFormat }}</text>
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

		<view class="order-submit bottom-safe-area">
			<view class="order-settlement-info">
				<text class="ns-text-color-gray">共{{ orderPaymentData.goods_num }}件，</text>
				<text>合计：</text>
				<text class="ns-text-color">
					{{ $lang('common.currencySymbol') }}
					<text class="money">{{ orderPaymentData.pay_money | moneyFormat }}</text>
				</text>
			</view>
			<view class="submit-btn"><button type="primary" size="mini" @click="orderCreate">提交订单</button></view>
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
				<scroll-view scroll-y="true" class="popup-body">
					<view>
						<view class="invoice-cell">
							<text class="tit">发票类型</text>
							<view class="option-grpup">
								<view class="option-item active">普通发票</view>
								<view class="option-item">电子发票</view>
								<view class="option-item disabled">增值税专票</view>
							</view>
						</view>
						<view class="invoice-cell">
							<text class="tit">发票抬头</text>
							<view class="option-grpup">
								<view class="option-item active">个人</view>
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
								<view class="option-item active">商品明细</view>
								<view class="option-item">商品类别</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer"><view class="confirm-btn ns-bg-color">确定</view></view>
			</view>
		</uni-popup>

		<!-- 优惠券弹窗 -->
		<uni-popup ref="couponPopup" type="bottom">
			<view class="coupon-popup popup">
				<view class="popup-header">
					<view><text class="tit">优惠券</text></view>
					<view class="align-right"><text class="iconfont iconguanbi ns-text-color-gray" @click="closePopup('couponPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body">
					<view class="coupon-item" v-for="(couponItem, couponIndex) in siteCoupon.data" :key="couponIndex" @click="selectCoupon(couponItem)">
						<view
							class="iconfont"
							:class="selectCouponId == couponItem.coupon_id ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"
						></view>
						<view class="circular"></view>
						<view class="coupon-info">
							<view class="coupon-money">
								<block v-if="couponItem.type == 'reward'">
									<text class="ns-font-size-sm-right ns-text-color">￥</text>
									<text class="ns-text-color">{{ parseFloat(couponItem.money) }}</text>
								</block>
								<block v-if="couponItem.type == 'discount'">
									<text class="ns-text-color">{{ parseFloat(couponItem.discount) }}</text>
									<text class="ns-font-size-sm-left ns-text-color">折</text>
								</block>
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
				<view class="popup-footer"><view class="confirm-btn ns-bg-color" @click="popupConfirm('couponPopup',siteCoupon.site_id)">确定</view></view>
			</view>
		</uni-popup>

		<!-- 平台优惠券弹窗 -->
		<uni-popup ref="PlatcouponPopup" type="bottom">
			<view class="coupon-popup popup">
				<view class="popup-header">
					<view><text class="tit">平台优惠券</text></view>
					<view class="align-right"><text class="iconfont iconguanbi ns-text-color-gray" @click="closePopup('PlatcouponPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body">
					<view class="coupon-item" v-for="(couponItem, couponIndex) in orderPaymentData.platform_coupon_list" v-if="orderPaymentData&&orderPaymentData.platform_coupon_list" :key="couponIndex" @click="selectPlatCoupon(couponItem)">
						<view
							class="iconfont"
							:class="selectPlatCouponId == couponItem.platformcoupon_id ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"
						></view>
						<view class="circular"></view>
						<view class="coupon-info">
							<view class="coupon-money">
								<text class="ns-font-size-sm-right ns-text-color">￥</text>
								<text class="ns-text-color">{{ parseFloat(couponItem.money) }}</text>
							</view>
							<view class="info">
								<view>{{ couponItem.platformcoupon_name }}</view>
								<view class="ns-text-color-gray ns-font-size-sm" v-if="couponItem.at_least > 0">满{{ couponItem.at_least }}可用</view>
								<view class="ns-text-color-gray ns-font-size-sm" v-else>任意金额可用</view>
								<view class="ns-text-color-gray ns-font-size-sm">有效期：{{ $util.timeStampTurnTime(couponItem.end_time) }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<view class="confirm-btn ns-bg-color" @click="popupConfirm('PlatcouponPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 店铺优惠弹窗 -->
		<uni-popup ref="sitePromotionPopup" type="bottom">
			<view class="promotion-popup popup">
				<view class="popup-header">
					<view><text class="tit">店铺优惠</text></view>
					<view class="align-right"><text class="iconfont iconguanbi ns-text-color-gray" @click="closePopup('sitePromotionPopup')"></text></view>
				</view>
				<scroll-view scroll-y="true" class="popup-body">
					<view>
						<block v-for="(promotionItem, promotionIndex) in sitePromotion" :key="promotionIndex">
							<view class="order-cell" v-if="promotionIndex == 'manjian'">
								<text class="tit">满减</text>
								<view class="box align-right">
									<view v-for="(item, index) in promotionItem" :key="index" v-if="item.discount_array">{{ item.discount_array.desc }}</view>
								</view>
							</view>
							<view class="order-cell" v-if="promotionIndex == 'freeshipping'">
								<text class="tit">满额包邮</text>
								<view class="box align-right">
									<view v-for="(item, index) in promotionItem" :key="index" v-if="item.discount_array">{{ item.discount_array.desc }}</view>
								</view>
							</view>
						</block>
						
					</view>
				</scroll-view>
				<view class="popup-footer">
					<view class="confirm-btn ns-bg-color" @click="closePopup('sitePromotionPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 配送弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<view><text class="tit">配送</text></view>
					<view class="align-right"><text class="iconfont iconguanbi ns-text-color-gray" @click="closePopup('deliveryPopup')"></text></view>
				</view>
				<view class="popup-body">
					<view class="delivery-cell">
						<view class="option-grpup">
							<view
								class="option-item"
								:class="{ 'active ns-text-color ns-border-color': deliveryItem.name == orderPaymentData.delivery[siteDelivery.site_id].delivery_type }"
								v-for="(deliveryItem, deliveryIndex) in siteDelivery.data"
								:key="deliveryIndex"
								@click="selectDeliveryType(deliveryItem)"
							>
								{{ deliveryItem.title }}
							</view>
						</view>
					</view>
					<block
						v-for="(deliveryItem, deliveryIndex) in siteDelivery.data"
						:key="deliveryIndex"
						v-if="orderPaymentData.delivery[siteDelivery.site_id].delivery_type == deliveryItem.name"
					>
						<view class="delivery-cell delivery-cont" v-if="orderPaymentData.delivery[siteDelivery.site_id].delivery_type == 'store'">
							<block v-if="deliveryItem.store_list.length">
								<view
									class="pickup-point"
									v-for="(storeItem, storeIndex) in deliveryItem.store_list"
									:key="storeIndex"
									@click="selectPickupPoint(storeItem.store_id)"
								>
									<view class="name">
										<text>{{ storeItem.store_name }}</text>
										<view class="icon" v-if="storeItem.store_id == orderPaymentData.delivery[siteDelivery.site_id].store_id">
											<text class="iconfont ns-text-color icondui"></text>
										</view>
									</view>
									<view class="info">
										<text class="ns-text-color-gray ns-font-size-sm">地址：{{ storeItem.full_address }}{{ storeItem.address }}</text>
										<text class="ns-text-color-gray ns-font-size-sm">营业时间：{{ storeItem.open_date }}</text>
									</view>
								</view>
							</block>
						</view>
						<view class="delivery-cell delivery-cont" v-show="orderPaymentData.delivery[siteDelivery.site_id].delivery_type == 'local' && orderPaymentData.delivery[siteDelivery.site_id].showTimeBar">
							<view class="uni-list">
								<view class="uni-list-cell">
									<view class="uni-list-cell-left">送达时间</view>
									<view class="uni-list-cell-db">
										<picker mode="time" :value="timeTip" :data-siteId="siteDelivery.site_id" start="09:01" end="21:01" @change="bindTimeChange">
											<view class="uni-input">{{ timeTip }}</view>
										</picker>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="popup-footer">
					<view class="confirm-btn ns-bg-color" @click="popupConfirm('deliveryPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 支付密码弹窗 -->
		<uni-popup ref="payPassword" :custom="true">
			<view class="pay-password">
				<block v-if="orderPaymentData.member_account.is_pay_password == 0">
					<view class="title">为了您的账户安全,请先设置您的支付密码</view>
					<view class="tips">可到"个人中心","个人资料","支付密码"中设置</view>
					<view class="btn ns-border-color ns-bg-color" @click="setPayPassword">立即设置</view>
					<view class="btn white ns-border-color ns-text-color" @click="noSet">暂不设置</view>
				</block>
				<block v-else>
					<view class="title">请输入支付密码</view>
					<view class="password-wrap">
						<myp-one :maxlength="6" :is-pwd="true" @input="input" ref="input" :auto-focus="isFocus" type="box"></myp-one>
						<view class="align-right"><text class="ns-text-color ns-font-size-sm forget-password" @click="setPayPassword">忘记密码</text></view>
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
	components: {
		uniPopup,
		mypOne
	},
	data() {
		return {
			timeTip: '选择配送时间',
			time:null
		};
	},
	computed: {
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	onLoad() {},
	onShow() {},
	mixins: [payment],
	methods: {
		bindTimeChange(e) {
			this.timeTip=""+e.target.value;
			this.time = e.target.value;
			this.orderCreateData.delivery[e.currentTarget.dataset.siteid].buyer_ask_delivery_time=this.time;
		},
		toShopDetail(e){
			this.$util.redirectTo('/otherpages/shop/index/index', { site_id: e});
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
