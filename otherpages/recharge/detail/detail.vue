<template>
	<view :class="themeStyle">
		<view class="point-detail">
			<view class="detail-top">
				<image v-if="rechargeInfo.cover_img" class="adv-pic" :src="$util.img(rechargeInfo.cover_img)" @error="imageError()"
				 mode="widthFix" />
				<image v-else class="adv-pic" :src="$util.getDefaultImage().default_goods_img" @error="imageError()" mode="widthFix" />
				<view class="detail-desc">
					<view class="desc-point ns-text-color">
						<view class="desc-point-left ns-text-color">
							<view class="desc-point-left-con ns-text-color">
								<text class="ns-font-size-sm">￥</text>
								<text class="point-num">{{ rechargeInfo.buy_price }}</text>
							</view>
							<view class="ns-margin-left desc-point-left-oldPrice">
								<text>￥</text>
								<text>{{ rechargeInfo.face_value }}</text>
							</view>
						</view>
					</view>
					<view class="name-wrap">{{ rechargeInfo.recharge_name }}</view>
				</view>
				<view class="coupon-desc" v-if="rechargeInfo.point || rechargeInfo.growth">
					<text v-if="rechargeInfo.point">
						{{$lang('give')}}：
						<text>{{ rechargeInfo.point }}{{$lang('point')}}</text>
					</text>
					<text v-if="rechargeInfo.growth">
						{{$lang('give')}}：
						<text>{{ rechargeInfo.growth }}{{$lang('growth')}}</text>
					</text>
				</view>
			</view>
			<view class="detail-swap" @click="login()" :class="{ 'position-bottom': isIphoneX }" v-if="!isLogin"><button type="primary">{{$lang('login')}}</button></view>
			<view class="detail-swap" @click="makeSure()" :class="{ 'position-bottom': isIphoneX }" v-else-if="rechargeInfo.status"><button
				 type="primary">{{$lang('recharge')}}</button></view>
			<view class="detail-swap" :class="{ 'position-bottom': isIphoneX }" v-else><button type="primary" class="active">{{$lang('recharge')}}</button></view>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				rechargeInfo: {},
				isIphoneX: false, //判断手机是否是iphoneX以上
				isLogin: false
			};
		},
		onLoad(options) {
			if (uni.getStorageSync('token')) this.isLogin = true;
			this.isIphoneX = this.$util.uniappIsIPhoneX()
			if (options.id) {
				this.id = options.id;
				this.getRechargeInfo();
			} else {
				this.$util.redirectTo('/otherpages/recharge/list/list', {}, 'redirectTo');
			}
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			//获取详情
			getRechargeInfo() {
				this.$api.sendRequest({
					url: '/memberrecharge/api/memberrecharge/info',
					data: {
						recharge_id: this.id
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.rechargeInfo = res.data;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail() {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			//登录
			login() {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/otherpages/recharge/detail/detail?id=' + this.id
				});
			},
			//点击去充值
			makeSure() {
				this.$api.sendRequest({
					url: '/memberrecharge/api/ordercreate/create',
					data: {
						recharge_id: this.id
					},
					success: res => {
						if (res.data && res.code == 0) {
							this.$util.redirectTo('/pages/pay/index/index', {
								code: res.data
							}, 'redirectTo');
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			imageError() {
				this.rechargeInfo.cover_img = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.point-detail {
		.detail-top {
			width: 100%;
			background: #ffffff;
			padding-bottom: 120rpx;

			.adv-pic {
				width: 100%;
				display: block;
			}

			.detail-desc {
				width: 100%;
				// height: 80rpx;
				background: #ffffff;
				padding: $ns-padding $ns-padding 0;
				box-sizing: border-box;

				.name-wrap {
					margin-top: 20rpx;
				}

				.desc-name {
					width: 100%;
					height: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: $ns-font-size-base;
				}

				.desc-point {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					height: 100%;

					.desc-point-left {
						display: flex;
						align-items: flex-end;

						.desc-point-left-con {
							font-weight: 700;
							font-size: 40rpx;
							line-height: 1;
						}

						.desc-point-left-oldPrice {
							color: $ns-text-color-gray;
							text-decoration: line-through;
							font-size: $ns-font-size-sm;
							line-height: 1;
						}
					}
				}
			}

			.coupon-desc {
				width: 100%;
				display: flex;
				flex-direction: column;
				padding: 0 $ns-padding;
				box-sizing: border-box;
				margin-top: 16rpx;
			}
		}

		.detail-content {
			width: 100%;
			padding: $ns-padding;
			box-sizing: border-box;
			padding-bottom: 80rpx;
			margin-top: $ns-margin;
			background: #ffffff;

			.content-title {
				width: 100%;
				text-align: center;
				font-size: $ns-font-size-lg;
				font-weight: 700;
			}
		}

		.detail-swap {
			height: 100rpx;
			box-sizing: border-box;
			background: #ffffff;
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			button {
				width: 100%;
			}
		}
	}

	.position-bottom {
		bottom: 68rpx !important;
	}
</style>
