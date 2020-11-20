<template>
	<view>
		<block v-if="payTypeList.length">
			<view class="payment-type">
				<text class="tit">请选择支付方式</text>
				<view class="payment-item" v-for="(item, index) in payTypeList" :key="index" @click="payIndex = index">
					<view class="iconfont" :class="item.icon"></view>
					<text class="name">{{ item.name }}</text>
					<text class="iconfont" :class="payIndex == index ? 'iconyuan_checked ns-text-color' : 'iconcheckboxblank'"></text>
				</view>
			</view>

			<view class="pay-btn" :class="{'safe-area': isIphoneX}">
				<button type="primary" @click="pay">提交</button>
			</view>

			<web-view :src="payUrl" v-if="payUrl != ''"></web-view>
		</block>
		<block v-else>
			<view class="empty">平台尚未配置支付方式！</view>
		</block>
	</view>
</template>

<script>
	import {
		Weixin
	} from 'common/js/wx-jssdk.js';

	export default {
		name: 'payment-h5',
		props: {
			payInfo: {
				type: Object,
				default: function() {
					return {}
				}
			},
			isIphoneX: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				payIndex: 0,
				payTypeList: [{
						name: '支付宝支付',
						icon: 'iconzhifubaozhifu-',
						type: 'alipay'
					},
					{
						name: '微信支付',
						icon: 'iconweixinzhifu',
						type: 'wechatpay'
					}
				],
				payUrl: '',
				timer: null
			};
		},
		created() {
			this.getPayType();
		},
		methods: {
			pay() {
				var payType = this.payTypeList[this.payIndex];
				if (!payType) return;

				this.$api.sendRequest({
					url: '/api/pay/pay',
					data: {
						out_trade_no: this.payInfo.out_trade_no,
						pay_type: payType.type
					},
					success: res => {
						if (res.code >= 0) {
							switch (payType.type) {
								case 'alipay':
									this.payUrl = res.data.data;
									this.checkPayStatus();
									break;
								case 'wechatpay':
									if (this.$util.isWeiXin()) {
										// 获取jssdk配置
										this.$api.sendRequest({
											url: '/wechat/api/wechat/jssdkconfig',
											data: {
												url: location.href
											},
											success: jssdkRes => {
												var wxJS = new Weixin(),
													payData = res.data.data;
												wxJS.init(jssdkRes.data);

												wxJS.pay({
													timestamp: payData.timestamp,
													nonceStr: payData.nonceStr,
													package: payData.package,
													signType: payData.signType,
													paySign: payData.paySign
												}, res => {
													if (res.errMsg == 'chooseWXPay:ok') {
														this.$util.redirectTo('/pages/pay/result/result', {
															code: this.payInfo.out_trade_no
														}, '', 'redirectTo');
													} else {
														this.$util.showToast({
															title: res.errMsg
														});
													}
												})
											}
										})
									} else {
										this.payUrl = res.data.data;
										this.checkPayStatus();
									}
									break;
							}
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
			checkPayStatus() {
				this.timer = setInterval(() => {
					this.$api.sendRequest({
						url: '/api/pay/status',
						data: {
							out_trade_no: this.payInfo.out_trade_no
						},
						success: res => {
							if (res.code == 0) {
								if (res.data.pay_status == 2) {
									clearInterval(this.timer);
									this.$util.redirectTo('/pages/pay/result/result', {
										code: this.payInfo.out_trade_no
									}, '', 'redirectTo');
								}
							} else {
								clearInterval(this.timer);
							}
						}
					})
				}, 1000);
			}
		},
		deactivated() {
			clearInterval(this.timer);
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
	}

	.pay-btn.safe-area {
		bottom: 88rpx;
	}

	.empty {
		width: 100%;
		text-align: center;
		padding: 60rpx 0;
		color: #666;
		font-size: 24rpx;
	}
</style>