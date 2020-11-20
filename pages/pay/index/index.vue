<template>
	<scroll-view scroll-y="true" class="pay-container" :class="themeStyle">
		<view class="payment-amount">
			<text class="amount-tit">{{ $lang('paymentAmount') }}</text>
			<view class="amount-num">
				{{ $lang('common.currencySymbol') }}
				<text>{{ payInfo.pay_money }}</text>
			</view>
			<view class="amount-desc">
				<text>{{ payInfo.pay_body }}</text>
			</view>
		</view>

		<payment :pay-info="payInfo"></payment>

		<loading-cover ref="loadingCover"></loading-cover>
	</scroll-view>
</template>

<script>
	import loadingCover from '@/components/loading-cover/loading-cover.vue';
	// #ifdef H5
	import payment from '@/components/payment-h5/payment-h5.vue';
	// #endif

	// #ifdef MP-WEIXIN
	import payment from '@/components/payment-mp-wx/payment-mp-wx.vue';
	// #endif
	
	// #ifdef APP-PLUS
	import payment from '@/components/payment-app/payment-app.vue';
	// #endif

	export default {
		components: {
			loadingCover,
			payment
		},
		data() {
			return {
				payInfo: {},
				outTradeNo: '',
				balance: 0.0,
				payTypeList: [{
						name: '支付宝支付',
						provider: 'NsAlipay',
						icon: 'iconzhifubaozhifu-'
					},
					{
						name: '微信支付',
						provider: 'NsWeixinpay',
						icon: 'iconweixinzhifu'
					}
				]
			};
		},
		onLoad(option) {
			if (option.code) this.outTradeNo = option.code;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo('/pages/login/login/login');
			} else {
				this.getPayInfo();
			}
		},
		computed: {
			themeStyle(){
				return 'theme-'+this.$store.state.themeStyle
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
			}
		}
	};
</script>

<style lang="scss">
	.pay-container {
		width: 100vw;
		height: 100vh;
	}

	@mixin flex-column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	@mixin flex-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.payment-amount {
		@include flex-column;
		margin: $ns-margin;
		border-radius: 8rpx;
		padding: 20rpx 0;
		background-color: #fff;

		.amount-tit {
			font-size: $ns-font-size-base;
		}

		.amount-num {
			margin: 10rpx 0;

			text {
				font-size: $ns-font-size-lg + 24rpx;
			}
		}

		.amount-desc {
			font-size: $ns-font-size-base;
			color: $ns-text-color-gray;
			padding: 0 40rpx;
			width: 100%;
			box-sizing: border-box;
			text-align: center;

			text {
				width: 100%;
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}

	.payment-balance {
		@include flex-row;
		margin: $ns-margin;
		border-radius: 8rpx;
		padding: 0 30rpx;
		height: 104rpx;
		background-color: #fff;
		font-size: $ns-font-size-lg;

		.balance-num {
			margin-left: 6rpx;
			margin-right: auto;
		}
	}
</style>
