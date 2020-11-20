<template>
	<view>
		<block v-if="payTypeList.length">
			<view class="payment-type" v-if="payTypeList.length">
				<text class="tit">请选择支付方式</text>
				<view class="payment-item" v-for="(item, index) in payTypeList" :key="index" @click="setPayType(index)">
					<view class="iconfont" :class="item.icon"></view>
					<text class="name">{{ item.name }}</text>
					<text class="iconfont" :class="payIndex == index ? 'iconyuan_checked ns-text-color' : 'iconcheckboxblank'"></text>
				</view>
			</view>
			<view class="pay-btn">
				<button type="primary" @click="pay">提交</button>
			</view>
		</block>
		<block v-else>
			<view class="empty">平台尚未配置支付方式！</view>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'payment-mp-wx',
		props: {
			payInfo: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				payIndex: 0,
				payTypeList: [{
					name: '微信支付',
					provider: 'wxpay',
					icon: 'iconweixinzhifu',
					type: 'wechatpay'
				}]
			};
		},
		created() {
			this.getPayType();
		},
		methods: {
			setPayType(index) {
				this.payIndex = index;
			},
			pay() {
				var payType = this.payTypeList[this.payIndex];
				if (!payType) return;
				if (payType.provider == 'wxpay') {
					this.$api.sendRequest({
						url: '/api/pay/pay',
						data: {
							out_trade_no: this.payInfo.out_trade_no,
							pay_type: payType.type
						},
						success: res => {
							if (res.code >= 0) {
								var payData = res.data.data;
								uni.requestPayment({
									provider: payType.provider,
									timeStamp: payData.timeStamp,
									nonceStr: payData.nonceStr,
									package: payData.package,
									signType: payData.signType,
									paySign: payData.paySign,
									success: res => {
										this.$util.redirectTo('/pages/pay/result/result', {
											code: this.payInfo.out_trade_no
										}, '', 'redirectTo');
									},
									fail: res => {
										this.flag = false;
										if (res.errMsg == 'requestPayment:fail cancel') {
											this.$util.showToast({
												title: '您已取消支付'
											});
										} else {
											uni.showModal({
												content: '支付失败,失败原因: ' + res.errMsg,
												showCancel: false
											});
										}
										setTimeout(() => {
											this.$util.redirectTo("/pages/order/list/list", {}, "redirectTo")
										}, 2000)
									}
								});
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						},
						fail: res => {
							this.$util.showToast({
								title: 'request:fail'
							});
						}
					})
				}
			},
			getPayType() {
				this.$api.sendRequest({
					url: '/api/pay/type',
					success: res => {
						if (res.code == 0) {
							let arr=[];
							this.payTypeList.forEach((val, key) => {
								if (res.data.pay_type.indexOf(val.type) != -1) {
									arr.push(val)
								}
							})
							this.payTypeList=arr;
						}
					}
				})
			},
		}
	};
</script>

<style lang="scss">
	.payment-type {
		margin: 20rpx;
		border-radius: 8rpx;
		padding: 0 30rpx 20rpx;
		background-color: #fff;
	}

	.payment-type .tit {
		height: 84rpx;
		line-height: 84rpx;
		font-size: 32rpx;
		color: #999;
	}

	.payment-type .payment-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;
	}

	.payment-type .payment-item .iconweixinzhifu {
		color: #24af41;
		font-size: 44rpx;
	}

	.payment-type .payment-item .iconzhifubaozhifu- {
		color: #00a0e9;
		font-size: 44rpx;
	}

	.payment-type .payment-item .iconcheckboxblank {
		font-size: 44rpx;
		color: #ccc;
	}

	.payment-type .payment-item .iconyuan_checked {
		font-size: 44rpx;
	}

	.payment-type .payment-item .name {
		margin-left: 20rpx;
		font-size: 28rpx;
		flex: 1;
	}

	.pay-btn {
		width: 100%;
		position: fixed;
		bottom: 40rpx;
		left: 0;
		bottom:calc(40rpx + constant(safe-area-inset-bottom));
		bottom:calc(40rpx + env(safe-area-inset-bottom));
	}

	.empty {
		width: 100%;
		text-align: center;
		padding: 60rpx 0;
		color: #666;
		font-size: 24rpx;
	}
</style>
