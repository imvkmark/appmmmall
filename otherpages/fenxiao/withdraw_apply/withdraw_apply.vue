<template>
	<view :class="themeStyle">
		<view class="container">
			<view class="empty-box"></view>
			<view class="withdraw-wrap">
				<view class="title">{{fenxiaoWords.account}}将{{fenxiaoWords.withdraw}}到余额</view>
				<view class="money-wrap">
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<input type="digit" value="" class="withdraw-money" v-model="withdrawMoney" />
				</view>
				<view class="bootom">
					<view><text class="ns-text-color-gray">可{{fenxiaoWords.withdraw}}{{fenxiaoWords.account}}：{{ $lang('common.currencySymbol') }}{{ fenxiaoInfo.account|moneyFormat }}</text></view>
				</view>
			</view>
			<view class="desc">
				<text>最小{{fenxiaoWords.withdraw}}金额为{{ $lang('common.currencySymbol') }}{{withdrawConfig.withdraw|moneyFormat}}</text>
			</view>
			<view class="btn ns-bg-color ns-border-color" :class="{disabled: (withdrawMoney == '' || withdrawMoney == 0)}"
			 @click="withdraw">{{fenxiaoWords.withdraw}}到余额</view>
			<view class="withdraw-list">
				<navigator hover-class="none" url="/otherpages/fenxiao/withdraw_list/withdraw_list" class="ns-text-color-gray">{{fenxiaoWords.withdraw+'明细'}}</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import fenxiaoWords from 'common/js/fenxiao-words.js';
	export default {
		data() {
			return {
				fenxiaoInfo: {
					account: 0
				},
				withdrawConfig: {
					withdraw: 0
				},
				withdrawMoney: '',
				isSub: false
			}
		},
		mixins: [fenxiaoWords],
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			uni.setNavigationBarTitle({
				title: this.fenxiaoWords.withdraw
			});


			if (uni.getStorageSync('token')) {
				this.getFenxiaoInfo();
				this.getWithdrawConfig();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/otherpages/fenxiao/withdraw_apply/withdraw_apply'
				});
			}
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			withdraw() {
				if (this.verify()) {
					if (this.isSub) return;
					this.isSub = true;
					this.$api.sendRequest({
						url: '/fenxiao/api/withdraw/apply',
						data: {
							money: this.withdrawMoney
						},
						success: res => {
							if (res.code >= 0) {
								this.$util.showToast({
									title: '提现申请成功',
									success: res => {
										setTimeout(() => {
											this.$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list', {}, 'redirectTo');
										}, 1500)
									}
								})
							} else {
								this.isSub = false;
								this.$util.showToast({
									title: res.message
								})
							}
						},
						fail: res => {
							this.isSub = false;
						}
					})
				}
			},
			verify() {
				if (this.withdrawMoney == '' || this.withdrawMoney == 0 || isNaN(parseFloat(this.withdrawMoney))) {
					this.$util.showToast({
						title: '请输入提现金额'
					});
					return false;
				}
				if (parseFloat(this.withdrawMoney) > parseFloat(this.fenxiaoInfo.account)) {
					this.$util.showToast({
						title: '提现金额超出可提现金额'
					});
					return false;
				}
				if (parseFloat(this.withdrawMoney) < parseFloat(this.withdrawConfig.withdraw)) {
					this.$util.showToast({
						title: '提现金额小于最低提现金额'
					});
					return false;
				}
				return true;
			},
			/**
			 * 获取佣金提现配置
			 */
			getWithdrawConfig() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/withdraw',
					success: res => {
						if (res.code >= 0) {
							this.withdrawConfig = res.data;
						}
					}
				})
			},
			/**
			 * 获取分销商信息
			 */
			getFenxiaoInfo() {
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/detail',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.fenxiaoInfo = res.data;
						} else {
							this.$util.redirectTo('/otherpages/fenxiao/apply/apply');
						}
					}
				})
			}
		},
		filters: {
			/**
			 * 金额格式化输出
			 * @param {Object} money
			 */
			moneyFormat(money) {
				return parseFloat(money).toFixed(2);
			}
		}
	}
</script>

<style lang="scss">
	// [data-theme] {
		.container {
			width: 100vw;
			height: 100vh;
			background: #fff;
		}

		.empty-box {
			height: 20rpx;
		}

		.align-right {
			text-align: right;
		}

		.withdraw-wrap {
			margin: 0 20rpx;
			padding: 30rpx;
			border-radius: 16rpx;
			box-shadow: rgba(110, 110, 110, 0.09) 0 0 20rpx 0;

			.title {
				color: #888;
			}

			.money-wrap {
				padding: 20rpx 0;
				border-bottom: 1px solid #eee;
				display: flex;

				.unit {
					font-size: 60rpx;
					line-height: 1;
				}

				.withdraw-money {
					height: 60rpx;
					line-height: 1;
					min-height: 60rpx;
					padding-left: 20rpx;
					font-size: 60rpx;
					flex: 1;
					font-weight: bolder;
				}
			}

			.bootom {
				display: flex;
				padding-top: 20rpx;

				&>view {
					line-height: 1;
					flex: 1;
				}
			}
		}

		.btn {
			margin: 0 30rpx;
			margin-top: 60rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 80rpx;
			color: #fff;
			text-align: center;
			border: 1px solid;

			&.disabled {
				background: #ccc;
				border-color: #ccc;
				color: #fff;
			}
		}

		.desc {
			margin: 20rpx 40rpx;
			font-size: 24rpx;
			color: #999;
		}

		.withdraw-list {
			text-align: center;
			margin-top: 40rpx;
		}
	// }
</style>
