<template>
	<view class="order-container" :class="themeStyle">
		<scroll-view id="tab-bar" class="order-nav" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view v-for="(statusItem, statusIndex) in statusList" :key="statusIndex" class="uni-tab-item" :id="statusItem.id"
			 :data-current="statusIndex" @click="ontabtap">
				<text class="uni-tab-item-title" :class="statusItem.status == orderStatus ? 'uni-tab-item-title-active ns-border-color ns-text-color' : ''">{{ statusItem.name }}</text>
			</view>
		</scroll-view>

		<mescroll-uni ref="mescroll" @getData="getListData" top="100rpx">
			<block slot="list">
				<view class="order-list" v-if="orderList.length > 0">
					<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
						<view class="order-header" :class="{ waitpay: (orderStatus == 'waitpay' && orderItem.order_status == 0) }">
							<view class="iconfont" :class="$util.inArray(orderItem.order_id, mergePayOrder) == -1 ? 'iconyuan_checkbox' : 'iconyuan_checked ns-text-color'"
							 v-if="orderStatus == 'waitpay' && orderItem.order_status == 0" @click="selectOrder(orderItem.order_id)"></view>
							<view class="iconfont icondianpu" @click="toShopDetail(orderItem.site_id)"></view>
							<text class="site-name" @click="toShopDetail(orderItem.site_id)">{{ orderItem.site_name }}</text>
							<view class="iconfont iconright" @click="toShopDetail(orderItem.site_id)"></view>
							<text class="status-name ns-text-color">{{ orderItem.order_status_name }}</text>
						</view>
						<view class="order-body" @click="orderDetail(orderItem)">
							<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderItem.order_goods" :key="goodsIndex">
								<view class="goods-img">
									<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(orderIndex,goodsIndex)" mode="aspectFill"
									 :lazy-load="true"></image>
								</view>
								<view class="goods-info">
									<view class="goods-name">{{ goodsItem.sku_name }}</view>
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
									</view>
								</view>
							</view>
						</view>
						<view class="order-footer">
							<view class="order-base-info">
								<view class="order-type">
									<text class="ns-text-color">{{ orderItem.order_type_name }}</text>
								</view>
								<view class="total">
									<text>共{{ orderItem.goods_num }}件商品</text>
									<text>
										应付：
										<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
										{{ orderItem.pay_money }}
									</text>
								</view>
							</view>
							<view class="order-operation" v-if="orderItem.action.length > 0">
								<view class="order-box-btn" v-if="orderItem.is_evaluate == 1" @click="operation('memberOrderEvaluation', orderItem)">
									<text v-if="orderItem.evaluate_status == 0">评价</text>
									<text v-else-if="orderItem.evaluate_status == 1">追评</text>
								</view>
								<view class="order-box-btn" :class="{ 'order-pay' : operationItem.action == 'orderPay' }" v-for="(operationItem, operationIndex) in orderItem.action"
								 :key="operationIndex" @click="operation(operationItem.action, orderItem)">
									{{ operationItem.title }}
								</view>
							</view>
							<view class="order-operation" v-else-if="orderItem.action.length == 0 && orderItem.is_evaluate == 1">
								<view class="order-box-btn" v-if="orderItem.is_evaluate == 1" @click="operation('memberOrderEvaluation', orderItem)">
									<text v-if="orderItem.evaluate_status == 0">评价</text>
									<text v-else-if="orderItem.evaluate_status == 1">追评</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else>
					<ns-empty :isIndex="!1" :text="text"></ns-empty>
				</view>
			</block>
		</mescroll-uni>

		<view class="order-batch-operation bottom-safe-area" v-if="mergePayOrder.length">
			<view class="operation-btn ns-text-color ns-border-color" @click="mergePay">合并付款</view>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import orderMethod from '../public/js/orderMethod.js';

	export default {
		data() {
			return {
				scrollInto: '',
				orderStatus: 'all',
				statusList: [],
				orderList: [],
				contentText: {},
				mergePayOrder: [],
				text:'您还暂无相关订单'
			};
		},
		mixins: [orderMethod],
		onLoad(option) {
			if (option.status) this.orderStatus = option.status;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.getOrderStatus();

			if (uni.getStorageSync('token')) {
				if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/pages/order/list/list?status=' + this.orderStatus
				});
			}
		},
		methods: {
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.orderStatus = this.statusList[index].status;
				if(this.orderStatus == 'all' ){
					this.text = '您还暂无相关订单'
				}else if(this.orderStatus == 'waitpay' ){
					this.text = '您还暂无待付款订单'
				}else if(this.orderStatus == 'waitsend' ){
					this.text = '您还暂无待发货订单'
				}else if(this.orderStatus == 'waitconfirm' ){
					this.text = '您还暂无待收货订单'
				}else{
					this.text = '您还暂无待评价订单'
				}
				if (this.orderStatus == '') this.mergePayOrder = [];
				this.$refs.loadingCover.show();
				this.$refs.mescroll.refresh();
			},
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/api/order/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						order_status: this.orderStatus
					},
					success: res => {
						let newArr = []
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							})
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
						this.orderList = this.orderList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 获取订单状态
			 */
			getOrderStatus() {
				this.statusList = [{
						status: 'all',
						name: this.$lang('all'),
						id: 'status_0'
					},
					{
						status: 'waitpay',
						name: this.$lang('waitPay'),
						id: 'status_1'
					},
					{
						status: 'waitsend',
						name: this.$lang('readyDelivery'),
						id: 'status_2'
					},
					{
						status: 'waitconfirm',
						name: this.$lang('waitDelivery'),
						id: 'status_3'
					},
					{
						status: 'waitrate',
						name: this.$lang('waitEvaluate'),
						id: 'status_4'
					}
				];
			},
			operation(action, orderData) {
				let index = this.status;
				switch (action) {
					case 'orderPay': // 支付
						this.orderPay(orderData);
						break;
					case 'orderClose': //关闭
						this.orderClose(orderData.order_id, () => {
							this.$refs.mescroll.refresh();
						});
						break;
					case 'memberTakeDelivery': //收货
						this.orderDelivery(orderData.order_id, () => {
							this.$refs.mescroll.refresh();
						});
						break;
					case 'trace': //查看物流
						this.$util.redirectTo('/pages/order/logistics/logistics', {
							order_id: orderData.order_id
						});
						break;
					case 'memberOrderEvaluation': //评价
						this.$util.redirectTo('/otherpages/order/evaluate/evaluate', {
							order_id: orderData.order_id
						});
						break;
				}
			},
			orderDetail(data) {
				switch (parseInt(data.order_type)) {
					case 2:
						// 自提订单
						this.$util.redirectTo('/pages/order/detail_pickup/detail_pickup', {
							order_id: data.order_id
						});
						break;
					case 3:
						// 本地配送订单
						this.$util.redirectTo('/pages/order/detail_local_delivery/detail_local_delivery', {
							order_id: data.order_id
						});
						break;
					case 4:
						// 虚拟订单
						this.$util.redirectTo('/pages/order/detail_virtual/detail_virtual', {
							order_id: data.order_id
						});
						break;
					default:
						this.$util.redirectTo('/pages/order/detail/detail', {
							order_id: data.order_id
						});
						break;
				}
			},
			/**
			 * 选择订单
			 * @param {Object} orderId
			 */
			selectOrder(orderId) {
				if (this.$util.inArray(orderId, this.mergePayOrder) != -1) {
					this.mergePayOrder.splice(this.$util.inArray(orderId, this.mergePayOrder), 1);
				} else {
					this.mergePayOrder.push(orderId);
				}
			},
			/**
			 * 合并支付
			 */
			mergePay() {
				if (this.mergePayOrder.length) {
					this.$api.sendRequest({
						url: '/api/order/pay',
						data: {
							order_ids: this.mergePayOrder.toString()
						},
						success: res => {
							if (res.code >= 0) {
								this.$util.redirectTo('/pages/pay/index/index', {
									code: res.data
								});
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						}
					});
				}
			},
			imageError(orderIndex, goodsIndex) {
				this.orderList[orderIndex].order_goods[goodsIndex].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			toShopDetail(e){
				this.$util.redirectTo('/otherpages/shop/index/index', { site_id: e});
			}
		},
		computed: {
			mpOrderList() {
				if (!this.orderList[this.status]) return;
				return this.orderList[this.status].list || [];
			},
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/list.scss';
</style>
<style scoped>
	/deep/ .uni-page {
		overflow: hidden;
	}

	/deep/ .mescroll-upwarp {
		padding-bottom: 100rpx;
	}
</style>
