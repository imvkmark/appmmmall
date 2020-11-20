<template>
	<view class="container" :class="themeStyle">
		<block v-if="payInfo.pay_status">
			<view class="image-wrap">
				<image :src="$util.img('upload/uniapp/pay_success.png')" mode="" class="result-image"></image>
			</view>
			<view class="msg">{{ $lang('paymentSuccess') }}</view>
			<view class="pay-amount">{{ $lang('payMoney') }}:{{ payInfo.pay_money }} {{ $lang('unit') }}</view>
			<view class="operation">
				<view class="btn ns-text-color ns-border-color" @click="$util.redirectTo('/pages/member/index/index', {}, 'reLaunch')" v-if="token">{{ $lang('memberCenter') }}</view>
				<view class="btn go-home ns-bg-color ns-border-color" @click="goHome()">{{ $lang('goHome') }}</view>
			</view>
		</block>
		<block v-else>
			<view class="image-wrap">
				<image :src="$util.img('upload/uniapp/pay_fail.png')" mode="" class="result-image"></image>
			</view>
			<view class="msg">{{ $lang('paymentFail') }}</view>
			<view class="operation">
				<view class="btn go-home alone ns-bg-color ns-border-color" @click="goHome()">{{ $lang('goHome') }}</view>
			</view>
		</block>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payInfo: {},
				outTradeNo: '',
				token: null
			};
		},
		onLoad(option) {
			if (option.code) this.outTradeNo = option.code;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.getPayInfo();
			if (uni.getStorageSync('token')) this.token = uni.getStorageSync('token');
		},
		computed: {
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			getPayInfo() {
				this.$api.sendRequest({
					url: '/api/pay/info',
					data: {
						out_trade_no: this.outTradeNo
					},
					success: res => {
						if (res.code >= 0 && res.data) {
							this.payInfo = res.data;
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: '未获取到支付信息!！',
								success: () => {
									setTimeout(() => {
										this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
									}, 1500);
								}
							});
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			goHome() {
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			}
		}
	};
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		background: #fff;

		.image-wrap {
			display: flex;
			justify-content: center;
			padding: 200rpx 0 40rpx 0;

			.result-image {
				width: 140rpx;
				height: 140rpx;
			}
		}

		.msg {
			text-align: center;
			font-size: 40rpx;
			font-weight: 600;
			line-height: 1;
			margin-bottom: 30rpx;
		}

		.pay-amount {
			color: #999;
			text-align: center;
			line-height: 1;
			margin-bottom: 30rpx;
		}

		.operation {
			text-align: center;

			.btn {
				display: inline-block;
				line-height: 1;
				padding: 24rpx 70rpx;
				border: 2rpx solid #ffffff;
				margin-left: 30rpx;
				border-radius: 80rpx;
				font-size: 24rpx;
			}

			.alone {
				margin-left: 0;
				width: 60%;
			}

			.go-home {
				color: #fff;
			}
		}
	}
</style>
