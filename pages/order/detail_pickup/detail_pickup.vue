<template>
	<scroll-view scroll-y="true" class="detail-container" :class="themeStyle">
		<!-- 订单状态 -->
		<view class="status-wrap ns-bg-color">
			<view>
				<text class="status-name">{{ orderData.order_status_name }}</text>
			</view>
			<block v-if="orderData.order_status == 0">
				<view>
					<text class="desc">
						需付款：
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text class="ns-font-size-lg price">{{ orderData.pay_money }}</text>
					</text>
				</view>
				<view class="operation-group">
					<view class="operation-btn ns-text-color" @click="operation('orderPay')">去支付</view>
				</view>
			</block>
		</view>

		<!-- 地址信息 -->
		<view class="address-wrap">
	<!-- 		<view class="icon">
				<view class="iconfont icondizhi"></view>
			</view> -->
			<view class="address-info">
				<view class="info">
					<text>{{ orderData.delivery_store_name }}</text>
					<text v-if="orderData.delivery_store_info&&orderData.delivery_store_info.telphone">{{ orderData.delivery_store_info.telphone }}</text>
				</view>
				<view class="detail" v-if="orderData.delivery_store_info&&orderData.delivery_store_info.open_date">
					<text>营业时间：{{ orderData.delivery_store_info.open_date }}</text>
				</view>
				<view class="detail" v-if="orderData.delivery_store_info&&orderData.delivery_store_info.full_address">
					<text>地址：{{ orderData.delivery_store_info.full_address }}</text>
				</view>
			</view>
		</view>

		<view class="pickup-info" v-if="orderData.pay_status">
			<view class="pickup-point-info">
				<view class="name">
					<text class="ns-font-size-lg">{{ orderData.delivery_store_name }}</text>
					<text class="mark ns-text-color ns-border-color">自提点</text>
				</view>
				<block v-if="orderData.delivery_store_info">
					<view class="address">
						<text class="iconfont icondizhi"></text>
						详细地址：{{ orderData.delivery_store_info.full_address }}
					</view>
					<view class="time">
						<text class="iconfont iconshijian"></text>
						营业时间：{{ orderData.delivery_store_info.open_date }}
					</view>
					<view class="contact">
						<text class="iconfont icondianhua1"></text>
						联系方式：{{ orderData.delivery_store_info.telphone }}
					</view>
				</block>
			</view>
			<view class="hr"></view>
			<view class="pickup-code-info">
				<view class="info">
					<text>
						<text class="ns-text-color-gray">提货码：</text>
						{{ orderData.delivery_code }}
					</text>
				</view>
				<view class="code">
					<image :src="$util.img(orderData.pickup)" mode=""></image>
				</view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-header" @click="toShopDetail(orderData.site_id)">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ orderData.site_name }}</text>
				<view class="iconfont iconright"></view>
			</view>
			<view class="site-body">
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderData.order_goods" :key="goodsIndex">
					<navigator hover-class="none" class="goods-img" :url="'/pages/goods/detail/detail?sku_id=' + goodsItem.sku_id">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(goodsIndex)" mode="aspectFill"></image>
					</navigator>
					<view class="goods-info">
						<navigator hover-class="none" :url="'/pages/goods/detail/detail?sku_id=' + goodsItem.sku_id" class="goods-name">{{ goodsItem.sku_name }}</navigator>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price ns-text-color">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									<text>{{ goodsItem.price }}</text>
								</text>
							</view>
							<view>
								<text>
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</text>
							</view>
						</view>
						<view class="goods-operation">
							<block v-if="orderData.is_enable_refund">
								<navigator hover-class="none" :url="'/otherpages/order/refund/refund?order_goods_id=' + goodsItem.order_goods_id"
								 v-if="goodsItem.refund_status == 0 || goodsItem.refund_status == -1">
									<view class="order-box-btn">退款</view>
								</navigator>
								<navigator hover-class="none" :url="'/otherpages/order/refund_detail/refund_detail?order_goods_id=' + goodsItem.order_goods_id"
								 v-else>
									<view class="order-box-btn">查看退款</view>
								</navigator>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 联系客服 -->
		<view class="kefu">
			<block v-if="addonIsExit.servicer">
				<!-- #ifdef MP-WEIXIN -->
				<button type="default" hover-class="none" open-type="contact"></button>
				<!-- #endif -->
				<view >
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view>
			</block>
			<block v-else>
				<view @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>联系客服</text>
				</view>
			</block>
		</view>

		<!-- 订单概况 -->
		<view class="order-summary">
			<view class="order-cell">
				<text class="tit">订单编号：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ orderData.order_no }}</text>
					<view class="copy" @click="$util.copy(orderData.order_no)">复制</view>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">订单交易号：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ orderData.out_trade_no }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">创建时间：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.close_time > 0">
				<text class="tit">关闭时间：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ $util.timeStampTurnTime(orderData.close_time) }}</text>
				</view>
			</view>
			<block v-if="orderData.pay_status > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">支付方式：</text>
					<view class="box">
						<text class="ns-text-color-black">{{ orderData.pay_type_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">支付时间：</text>
					<view class="box">
						<text class="ns-text-color-black">{{ $util.timeStampTurnTime(orderData.pay_time) }}</text>
					</view>
				</view>
			</block>
			<view class="hr"></view>
			<view class="order-cell">
				<text class="tit">配送方式：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ orderData.delivery_type_name }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ orderData.buyer_message }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_type_name != ''">
				<text class="tit">店铺活动：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ orderData.promotion_type_name }}</text>
				</view>
			</view>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">商品金额</text>
				<view class="box align-right">
					<text class="ns-text-color-black">
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						{{ orderData.goods_money }}
					</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">运费</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">+</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.delivery_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_money > 0">
				<text class="tit">税费</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">+</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.adjust_money != 0">
				<text class="tit">订单调整</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator" v-if="orderData.adjust_money < 0">-</text>
						<text class="operator" v-else>+</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.adjust_money | abs }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.promotion_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.coupon_money > 0">
				<text class="tit">店铺优惠券</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.coupon_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.platform_coupon_total_money > 0">
				<text class="tit">平台优惠券</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.platform_coupon_total_money }}</text> 
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box align-right">
					<text class="ns-text-color">
						<text class="operator">-</text>
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.balance_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell">
				<view class="box align-right">
					<text>应付款：</text>
					<text class="ns-text-color">
						<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
						<text class="ns-font-size-lg">{{ orderData.pay_money }}</text>
					</text>
				</view>
			</view>
		</view>

		<view class="height-box"></view>

		<view class="order-operation bottom-safe-area" v-if="orderData.action.length > 0">
			<view class="order-box-btn" v-if="orderData.is_evaluate == 1" @click="operation('memberOrderEvaluation')">
				<text v-if="orderData.evaluate_status == 0">评价</text>
				<text v-else-if="orderData.evaluate_status == 1">追评</text>
			</view>
			<view class="order-box-btn" v-for="(operationItem, operationIndex) in orderData.action" :key="operationIndex" @click="operation(operationItem.action)">
				{{ operationItem.title }}
			</view>
		</view>
		<view class="order-operation bottom-safe-area" v-else-if="orderData.action.length == 0 && orderData.is_evaluate == 1">
			<view class="order-box-btn" @click="operation('memberOrderEvaluation')">
				<text v-if="orderData.evaluate_status == 0">评价</text>
				<text v-else-if="orderData.evaluate_status == 1">追评</text>
			</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</scroll-view>
</template>

<script>
	import orderMethod from '../public/js/orderMethod.js';
	import globalConfig from 'common/js/golbalConfig.js'
	export default {
		components: {},
		mixins: [orderMethod,globalConfig],
		data() {
			return {
				orderId: 0,
				orderData: {
					action: []
				}
			};
		},
		onLoad(option) {
			if (option.order_id) this.orderId = option.order_id;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			if (uni.getStorageSync('token')) {
				this.getOrderData();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/pages/order/detail/detail?order_id=' + this.orderId
				});
			}
		},
		methods: {
			//联系客服
			goConnect() {
				let that = this;
				that.$api.sendRequest({
					url: '/servicer/api/chat/hasServicers',
					data: {
						site_id: that.orderData.site_id
					},
					success(res) {
						if (res.code >= 0) {
							let data = {
								siteId: that.orderData.site_id,
								// avatar: that.shopInfo.avatar,
								siteName: that.orderData.site_name,
								orderId: that.orderData.order_id
							};
							that.$util.redirectTo('/otherpages/chat/room/room', data);
						} else {
							that.$util.showToast({ title: '客服未上线' });
						}
					}
				});
			},
			getOrderData() {
				this.$api.sendRequest({
					url: '/api/order/detail',
					data: {
						order_id: this.orderId
					},
					success: res => {
						uni.stopPullDownRefresh();
						if (res.code >= 0) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							this.orderData = res.data;
							if (this.orderData.delivery_store_info != '') this.orderData.delivery_store_info = JSON.parse(this.orderData.delivery_store_info);
						} else {
							this.$util.showToast({
								title: '未获取到订单信息!！',
								success: () => {
									setTimeout(() => {
										this.$util.redirectTo('/pages/order/list/list');
									}, 1500);
								}
							});
						}
					},
					fail: res => {
						uni.stopPullDownRefresh();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				this.getOrderData();
			},
			operation(action) {
				switch (action) {
					case 'orderPay': // 支付
						this.orderPay(this.orderData);
						break;
					case 'orderClose': //关闭
						this.orderClose(this.orderData.order_id, () => {
							this.getOrderData();
						});
						break;
					case 'memberTakeDelivery': //收货
						this.orderDelivery(this.orderData.order_id, () => {
							this.getOrderData();
						});
						break;
					case 'trace': //查看物流
						this.$util.redirectTo('/pages/order/logistics/logistics', {
							order_id: this.orderData.order_id
						});
						break;
					case 'memberOrderEvaluation': //评价
						this.$util.redirectTo('/otherpages/order/evaluate/evaluate', {
							order_id: this.orderData.order_id
						});
						break;
				}
			},
			imageError(index) {
				this.orderData.order_goods[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			toShopDetail(e){
				this.$util.redirectTo('/otherpages/shop/index/index', { site_id: e});
			}
		},
		filters: {
			abs(value) {
				return Math.abs(parseFloat(value)).toFixed(2);
			},
			// 转化时间字符串
			timeStr(val) {
				var h = parseInt(val / 3600).toString();
				var m = parseInt((val % 3600) / 60).toString();
				if (m.length == 1) {
					m = '0' + m;
				}
				if (h.length == 1) {
					h = '0' + h;
				}
				return h + ':' + m;
			},
		}
	};
</script>

<style lang="scss">
	@import '../public/css/detail.scss';
</style>
