<template>
	<view class="order-container" :class="themeStyle">
		<view class="address-wrap">
			<view class="icon">
				<view class="iconfont icondizhi"></view>
			</view>
			<view class="address-info">
				<view class="info">
					<text>{{ $lang('name') }}：{{ orderData.member_name }}</text>
					<text>{{ orderData.mobile }}</text>
				</view>
				<view class="detail">
					<text>{{ $lang('address') }}：{{ orderData.full_address }}</text>
				</view>
			</view>
		</view>

		<view class="order-item">
			<view class="order-body">
				<view class="goods-wrap">
					<view class="goods-img">
						<image :src="$util.img(orderData.gift_image)" v-if="orderData.gift_image" @error="imageError()" mode="aspectFill" :lazy-load="true"></image>
						<image :src="$util.img('upload/uniapp/point/gift.png')" v-else  mode="aspectFill" :lazy-load="true"></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ orderData.gift_name }}</view>
						<view class="goods-sub-section">
							<view>
								<text>
									<text class="iconfont iconclose"></text>
									{{ orderData.num }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="order-summary">
			<view class="order-cell">
				<text class="tit">{{ $lang('createTime') }}：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">{{ $lang('expressStatus') }}：</text>
				<view class="box">
					<text class="ns-text-color-black">{{ orderData.express_status == 0 ? '未配送' : '已配送' }}</text>
				</view>
			</view>
			<block v-if="orderData.express_status > 0">
				<view class="order-cell">
					<text class="tit">{{ $lang('expressCompany') }}：</text>
					<view class="box">
						<text class="ns-text-color-black">{{ orderData.express_company_name }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">{{ $lang('expressNo') }}：</text>
					<view class="box">
						<text class="ns-text-color-black">{{ orderData.express_no }}</text>
					</view>
				</view>
			</block>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				orderData: {},
				orderId: 0
			};
		},
		onLoad(option) {
			if (option.id) this.orderId = option.id;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
			} else {
				this.getOrderData();
			}
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			getOrderData() {
				this.$api.sendRequest({
					url: '/gift/api/giftorder/info',
					data: {
						order_id: this.orderId
					},
					success: res => {
						uni.stopPullDownRefresh();
						if (res.code >= 0) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							this.orderData = res.data;
						} else {
							this.$util.showToast({
								title: '未获取到礼品订单信息!！',
								success: () => {
									setTimeout(() => {
										this.$util.redirectTo('/otherpages/member/gift/gift');
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
			imageError() {
				// this.orderData.gift_image = this.$util.getDefaultImage().default_goods_img;
				this.orderData.gift_image = this.$util.img('upload/uniapp/point/gift.png');
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/gift_detail';
</style>
