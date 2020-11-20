@@ -0,0 +1,290 @@
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
			<view class="pay-btn" :class="{ 'safe-area': isIphoneX }"><button type="primary" @click="pay">提交</button></view>
		</block>
		<block v-else><view class="empty">平台尚未配置支付方式！</view></block>
	</view>
</template>

<script>
export default {
	name: 'payment-app',
	props: {
		payInfo: {
			type: Object,
			default: function() {
				return {};
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
			payTypeList: [
				{
					name: '支付宝支付',
					icon: 'iconzhifubaozhifu-',
					type: 'alipay'
				},
				{
					name: '微信支付',
					icon: 'iconweixinzhifu',
					type: 'wechatpay'
				}
			]
		};
	},
	created() {
		this.getPayType();
		this.getProvider();
	},
	methods: {
		getProvider() {
			uni.getProvider({
				service: 'payment',
				success: res => {
					let provider = res.provider;
					if (provider.indexOf('wxpay') == -1) {
						this.payTypeList.splice(1, 1);
						this.$util.showToast({ title: '未配置微信支付组件' });
					}
					if (provider.indexOf('alipay') == -1) {
						this.payTypeList.splice(0, 1);
						this.$util.showToast({ title: '未配置支付宝支付组件' });
					}
				}
			});
		},
		setPayType(index) {
			this.payIndex = index;
		},
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
						//提示错误信息
						if (res.code != 0) {
							this.$util.showToast({ title: res.message });
							return false;
						}

						//提示错误信息
						let real_res = res.data;
						if (real_res.code == -1) {
							this.$util.showToast({ title: res.message });
							return false;
						}
						var payData = res.data.data;
						if (payType == 'wechatpay') {
							// 微信支付
							this.wxpay(payData);
						} else if (payType == 'alipay') {
							// 支付宝支付
							this.alipay(payData);
						}
						// uni.requestPayment({
						// 	provider: payType.provider,
						// 	timeStamp: payData.timeStamp,
						// 	nonceStr: payData.nonceStr,
						// 	package: payData.package,
						// 	signType: payData.signType,
						// 	paySign: payData.paySign,
						// 	success: res => {
						// 		this.$util.redirectTo('/pages/pay/result/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
						// 	},
						// 	fail: res => {
						// 		this.flag = false;
						// 		if (res.errMsg == 'requestPayment:fail cancel') {
						// 			this.$util.showToast({ title: '您已取消支付' });
						// 		} else {
						// 			uni.showModal({ content: '支付失败,失败原因: ' + res.errMsg, showCancel: false });
						// 		}
						// 		setTimeout(()=>{
						// 			this.$util.redirectTo("/pages/order/list/list",{},"redirectTo")
						// 		},2000)
						// 	}
						// });
					} else {
						this.$util.showToast({ title: res.message });
					}
				},
				fail: res => {
					this.$util.showToast({ title: 'request:fail' });
				}
			});
		},
		wxpay(payData) {
			//uniapp文档地址 https://uniapp.dcloud.io/api/plugins/payment?id=orderinfo
			//微信文档地址 https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=8_5
			uni.requestPayment({
				provider: 'wxpay', //uniapp规定的微信支付类型
				orderInfo: JSON.stringify(payData),
				success: res => {
					if (res.errMsg == 'requestPayment:ok') {
						this.$util.showToast({
							title: '支付成功',
							success: () => {
								setTimeout(() => {
									this.$util.redirectTo('/pages/pay/result/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
								}, 1500);
							}
						});
					}
				},
				fail: res => {
					// this.flag = false;
					if (res.errMsg == 'requestPayment:fail cancel') {
						this.$util.showToast({ title: '您已取消支付' });
					} else {
						uni.showModal({ content: '支付失败,失败原因: ' + res.errMsg, showCancel: false });
					}
					setTimeout(() => {
						this.$util.redirectTo('/pages/order/list/list', {}, 'redirectTo');
					}, 2000);
				}
			});
		},
		alipay(payData) {
			//uniapp文档地址 https://uniapp.dcloud.io/api/plugins/payment?id=orderinfo
			//请求参数文档地址 https://docs.open.alipay.com/204/105465/
			//返回参数文档地址 https://docs.open.alipay.com/204/105301
			let alipay_err_obj = {
				9000 : '订单支付成功',
				8000 : '正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态',
				4000 : '订单支付失败',
				5000 : '重复请求',
				6001 : '用户中途取消',
				6002 : '网络连接出错',
				6004 : '支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态'
			};
			let alipay_success_code = 9000;
			uni.requestPayment({
				provider : 'alipay',//uniapp规定的支付宝支付类型
				orderInfo : payData,
				success : res => {
					let result = JSON.parse(res.rawdata);
					let err_code = result.resultStatus;
					let err_msg = '其他错误';
					if(err_code in alipay_err_obj){
						err_msg = alipay_err_obj[err_code];
					}
					this.$util.showToast({ title: err_msg });
					if(err_code == alipay_success_code){
						setTimeout(() => {
							this.$util.redirectTo('/pages/pay/result/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
						}, 1500);
					}else{
						this.$util.showToast({
							title: '支付失败,失败原因: ' + err_msg
						})
					}
				}
			});
		},
		getPayType() {
			this.$api.sendRequest({
				url: '/api/pay/type',
				success: res => {
					if (res.code == 0) {
						this.payTypeList.forEach((val, key) => {
							if (res.data.pay_type.indexOf(val.type) == -1) {
								this.payTypeList.splice(key, 1);
							}
						});
					}
				}
			});
		}
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