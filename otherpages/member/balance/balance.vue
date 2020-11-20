<template>
 	<view class="balance" :data-theme="themeStyle">
 		<view :style="'background:url(' + $util.img('upload/uniapp/member/balance.png') + ') no-repeat bottom right/148rpx 170rpx'" class="balance-wrap ns-bg-color">
 			<view class="balance-top">
 				<view class="balance-num">
 					<text class="balance-tips balance-title">{{ $lang('accountBalance') }}{{ $lang('money') }}</text>
 					<text class="all-alance">{{ (parseFloat(balanceInfo.balance) + parseFloat(balanceInfo.balance_money)).toFixed(2) }}</text>
 				</view>
 				<block v-if="Development">
 					<view @click="toList" class="withdraw-btn ns-text-color" v-if="addonIsExit.memberrecharge && memberrechargeConfig && memberrechargeConfig.is_use">
 						{{ $lang('recharge') }}
 					</view>
 				</block>
 			</view>
 			<block v-if="Development">
 				<view class="balance-bottom">
 					<view class="balance-bottom-item">
 						<text class="balance-title">{{ $lang('ableAccountBalance') }} {{ $lang('money') }}</text>
 						<view class="balance">{{ balanceInfo.balance_money }}</view>
 					</view>
 					<view class="balance-bottom-item">
 						<text class="balance-title">{{ $lang('noAccountBalance') }} {{ $lang('money') }}</text>
 						<view class="balance">{{ balanceInfo.balance }}</view>
 					</view>
 				</view>
 			</block>
 		</view>
 		<block v-if="Development">
 			<view class="operation">
 				<view class="withdraw ns-bg-color" v-if="addonIsExit.memberwithdraw && withdrawConfig && withdrawConfig.is_use" @click="toWithdrawal">
 						{{ $lang('withdrawal') }}
 				</view>
 			</view>
 			<view class="balance-other-info">
 				<view class="balance-detail" v-if="addonIsExit.memberwithdraw && withdrawConfig && withdrawConfig.is_use">
 					<view @click="toBalanceDetail">
 						{{ $lang('balanceDetailed') }}
 					</view>
 				</view>
 				<view
 					class="balance-xian"
 					v-if="
 						addonIsExit.memberrecharge && memberrechargeConfig && memberrechargeConfig.is_use && addonIsExit.memberwithdraw && withdrawConfig && withdrawConfig.is_use
 					"
 				></view>

 				<view class="recharge-record" v-if="addonIsExit.memberrecharge && memberrechargeConfig && memberrechargeConfig.is_use">
 					<view @click="toOrderList">
 						{{ $lang('rechargeRecord') }}
 					</view>
 				</view>
 			</view>
 		</block>
 		<loading-cover ref="loadingCover"></loading-cover>
 	</view>
 </template>

 <script>
 export default {
 	data() {
 		return {
 			balanceInfo: {
 				balance: 0,
 				balance_money: 0
 			},
 			withdrawConfig: null,
 			memberrechargeConfig: null
 		};
 	},
	computed: {
		Development() {
			return this.$store.state.Development
		},
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		},
		addonIsExit(){
			return this.$store.state.addonIsExit
		}
	},
 	async onShow() {
 		// 刷新多语言
 		this.$langConfig.refresh();
 		if (!uni.getStorageSync('token')) {
 			this.$refs.login.open('/otherpages/member/balance/balance');
 		}
 		this.getUserInfo();
 		this.getWithdrawConfig();
 		this.getMemberrechargeConfig();
 	},
 	methods: {
 		toWithdrawal(){
 			this.$util.redirectTo('/otherpages/member/apply_withdrawal/apply_withdrawal');
 		},
 		toOrderList(){
 			this.$util.redirectTo('/otherpages/recharge/order_list/order_list');
 		},
 		toBalanceDetail(){
 			this.$util.redirectTo('/otherpages/member/balance_detail/balance_detail');
 		},
 		toList(){
 			this.$util.redirectTo('/otherpages/recharge/list/list');
 		},
 		//获取余额信息
 		getUserInfo() {
 			this.$api.sendRequest({
 				url: '/api/memberaccount/info',
 				data: {
 					account_type: 'balance,balance_money'
 				},
 				success: res => {
 					if (res.data) {
 						this.balanceInfo = res.data;
 					} else {
 						this.$util.showToast({ title: res.message });
 					}
 					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
 				},
 				fail: res => {
 					mescroll.endErr();
 					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
 				}
 			});
 		},
 		/**
 		 * 获取余额提现配置
 		 */
 		getWithdrawConfig() {
 			this.$api.sendRequest({
 				url: '/api/memberwithdraw/config',
 				success: res => {
 					if (res.code >= 0 && res.data) {
 						this.withdrawConfig = res.data;
 					}
 				}
 			});
 		},
 		/**
 		 * 获取充值提现配置
 		 */
 		getMemberrechargeConfig() {
 			this.$api.sendRequest({
 				url: '/memberrecharge/api/memberrecharge/config',
 				success: res => {
 					if (res.code >= 0 && res.data) {
 						this.memberrechargeConfig = res.data;
 					}
 				}
 			});
 		}
 	}
 };
 </script>

 <style lang="scss">
 page {
 	background-color: #fff;
 }
 .balance-wrap {
 	height: 336rpx;
 	position: relative;
 	display: flex;
 	margin: 24rpx;
 	flex-direction: column;
 	border-radius: 20rpx;
 	overflow: hidden;
 	padding: 44rpx;
 	box-sizing: border-box;
 	.balance-top {
 		display: flex;
 		justify-content: space-between;
 		.balance-num {
 			display: flex;
 			flex-direction: column;
 		}
 		.balance-tips {
 			font-size: $ns-font-size-sm;
 			margin-bottom: 20rpx;
 		}
 		.withdraw-btn {
 			height: 44rpx;
 			background-color: #fff;
 			border-radius: 50px;
 			padding: 2rpx 40rpx;
 			line-height: 44rpx;
 			font-size: 20rpx;
 		}
 		.all-alance {
 			line-height: 1;
 			font-size: 54rpx;
 			font-weight: 400;
 			color: #ffffff;
 		}
 	}

 	.balance-bottom {
 		flex: 2;
 		display: flex;
 		justify-content: space-between;
 		align-items: center;
 		margin-right: 104rpx;

 		.balance-bottom-item {
 			display: flex;
 			flex-direction: column;
 			justify-content: center;
 			.balance-title {
 				font-size: $ns-font-size-base;
 				margin-bottom: 10rpx;
 			}

 			.balance {
 				line-height: 1;
 				font-size: 36rpx;
 				color: #ffffff;
 			}
 		}
 	}
 }
 .operation {
 	width: 100%;
 	top: 500rpx;
 	display: flex;
 	flex-direction: column;
 	justify-content: center;
 	align-items: center;
 	margin-top: 100rpx;
 	.recharge {
 		color: #ffffff;
 		width: 80%;
 		border-radius: 50rpx;
 		text-align: center;
 		padding: 20rpx 0;
 	}

 	.withdraw {
 		margin-top: 50rpx;
 		text-align: center;
 		width: 534rpx;
 		height: 78rpx;
 		line-height: 78rpx;
 		box-sizing: border-box;
 		border-radius: 50rpx;
 		color: #fff;
 		font-size: $ns-font-size-base;
 	}
 }
 .balance-other-info {
 	margin-top: 50rpx;
 	width: 100%;
 	display: flex;
 	justify-content: center;
 	align-items: center;
 	top: 750rpx;
 	margin-top: 50rpx;
 	.balance-detail {
 		line-height: 1;
 		padding: 0 20rpx;
 		font-size: $ns-font-size-base;
 	}
 	.recharge-record {
 		line-height: 1;
 		padding: 0 20rpx;
 		font-size: $ns-font-size-base;
 	}
 }
 .balance-xian {
 	width: 2rpx;
 	height: 20rpx;
 	background-color: #383838;
 }
 .balance-title {
 	color: rgba(255, 255, 255, 0.7);
 }
 </style>
