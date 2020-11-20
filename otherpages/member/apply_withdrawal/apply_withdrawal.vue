<template>
	<view :class="themeStyle">
		<view class="container">
			<view class="bank-account-wrap" @click="goAccount()">
				<view class="tx-wrap" v-if="bankAccountInfo.withdraw_type">
					<text class="tx-to">{{ $lang('withdrawTo') }}</text>
					<view class="tx-bank" v-if="bankAccountInfo.withdraw_type == 'wechatpay'">{{ $lang('defaultWithdraw') }}</view>
					<view class="tx-bank" v-else>{{ bankAccountInfo.bank_account }}</view>
					<view class="tx-img" v-if="bankAccountInfo.withdraw_type == 'alipay'">
						<image :src="$util.img('upload/uniapp/member/apply_withdrawal/alipay.png')" mode="widthFix"></image>
					</view>
					<view class="tx-img" v-else-if="bankAccountInfo.withdraw_type == 'bank'">
						<image :src="$util.img('upload/uniapp/member/apply_withdrawal/bank.png')" mode="widthFix"></image>
					</view>
					<view class="tx-img" v-else-if="bankAccountInfo.withdraw_type == 'wechatpay'">
						<image :src="$util.img('upload/uniapp/member/apply_withdrawal/wechatpay.png')" mode="widthFix"></image>
					</view>
				</view>
				<text class="tx-to" v-else>{{ $lang('withdrawType') }}</text>
				<view class="iconfont iconright"></view>
			</view>
			<view class="empty-box"></view>
			<view class="withdraw-wrap">
				<view class="withdraw-wrap-title">{{ $lang('withdrawMoney') }}：</view>
				<view class="money-wrap">
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<input type="digit" value="" class="withdraw-money" v-model="withdrawMoney" />
					<view class="delete" @click="remove" v-if="withdrawMoney">
						<image :src="$util.img('upload/uniapp/member/apply_withdrawal/close.png')" mode="widthFix"  @click="remove"></image>
					</view>
				</view>
				<view class="bootom">
					<view>
						<text class="ns-text-color-gray">{{ $lang('ableAccountBalance') }}：{{ $lang('common.currencySymbol') }}{{ withdrawInfo.member_info.balance_money | moneyFormat }}</text>
						<text class="all-tx ns-text-color" @click="allTx">{{ $lang('withdrawAll') }}</text>
					</view>
				</view>
				<view class="desc">
					<text>{{ $lang('minWithdraw') }} {{ $lang('common.currencySymbol') }}{{ withdrawInfo.config.min | moneyFormat }}</text>
					<text>，{{ $lang('formalities') }}{{ withdrawInfo.config.rate + '%' }}</text>
				</view>
			</view>

			<view class="btn  ns-gradient-otherpages-member-widthdrawal-withdrawal"
			 :class="{ themeStyle,disabled: withdrawMoney == '' || withdrawMoney == 0 }" @click="withdraw">{{ $lang('withdraw') }}</view>

			<view class="recoend">
				<navigator url="/otherpages/member/withdrawal/withdrawal" class="recoend-con">{{ $lang('withdrawRecord') }}</navigator>
			</view>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				withdrawInfo: {
					config: {
						is_use: 0,
						min: 1,
						rate: 0
					},
					member_info: {
						balance_money: 0,
						balance_withdraw: 0,
						balance_withdraw_apply: 0
					}
				},
				bankAccountInfo: {},
				withdrawMoney: '',
				isSub: false
			};
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			if (uni.getStorageSync('token')) {
				this.getWithdrawInfo();
				this.getBankAccountInfo();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/otherpages/member/apply_withdrawal/apply_withdrawal'
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
			//全部提现
			allTx() {
				this.withdrawMoney = this.withdrawInfo.member_info.balance_money;
			},

			// 删除提现金额
			remove() {
				this.withdrawMoney = '';
			},
			/**
			 * 获取提现信息
			 */
			getWithdrawInfo() {
				this.$api.sendRequest({
					url: '/api/memberwithdraw/info',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.withdrawInfo = res.data;
							if (this.withdrawInfo.config.is_use == 0) {
								this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
							}
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 银行账号信息
			 */
			getBankAccountInfo() {
				this.$api.sendRequest({
					url: '/api/memberbankaccount/defaultinfo',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.bankAccountInfo = res.data;
						}
					}
				});
			},
			verify() {
				if (this.withdrawMoney == '' || this.withdrawMoney == 0 || isNaN(parseFloat(this.withdrawMoney))) {
					this.$util.showToast({
						title: '请输入提现金额'
					});
					return false;
				}
				if (parseFloat(this.withdrawMoney) > parseFloat(this.withdrawInfo.member_info.balance_money)) {
					this.$util.showToast({
						title: '提现金额超出可提现金额'
					});
					return false;
				}
				if (parseFloat(this.withdrawMoney) < parseFloat(this.withdrawInfo.config.min)) {
					this.$util.showToast({
						title: '提现金额小于最低提现金额'
					});
					return false;
				}
				return true;
			},
			withdraw() {
				if (!this.bankAccountInfo.withdraw_type) {
					this.$util.showToast({
						'title': "请先添加提现方式"
					})
					return;
				}
				if (this.verify()) {
					if (this.isSub) return;
					this.isSub = true;
					this.$api.sendRequest({
						url: '/api/memberwithdraw/apply',
						data: {
							apply_money: this.withdrawMoney,
							transfer_type: this.bankAccountInfo.withdraw_type, //转账提现类型
							realname: this.bankAccountInfo.realname,
							mobile: this.bankAccountInfo.mobile,
							bank_name: this.bankAccountInfo.branch_bank_name,
							account_number: this.bankAccountInfo.bank_account
						},
						success: res => {
							if (res.code >= 0) {
								this.$util.showToast({
									title: '提现申请成功',
									success: res => {
										setTimeout(() => {
											this.$util.redirectTo('/otherpages/member/withdrawal/withdrawal', {}, 'redirectTo');
										}, 1500);
									}
								});
							} else {
								this.isSub = false;
								this.$util.showToast({
									title: res.message
								});
							}
						},
						fail: res => {
							this.isSub = false;
						}
					});
				}
			},
			goAccount() {
				this.$util.redirectTo(
					'/otherpages/member/account/account', {
						back: '/otherpages/member/apply_withdrawal/apply_withdrawal'
					},
					'redirectTo'
				);
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
	};
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

		.bank-account-wrap {
			margin: 0 20rpx;
			padding: 10rpx 30rpx;
			border-bottom: 1px solid #f7f7f7;
			position: relative;

			.tx-wrap {
				display: flex;
				justify-content: space-between;
				margin-right: 60rpx;

				.tx-bank {
					margin-right: 60rpx;
				}

				.tx-img {
					position: absolute;
					right: 100rpx;
					top: 50%;
					transform: translateY(-50%);
					width: 40rpx;
					height: 40rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.iconfont {
				position: absolute;
				right: 40rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.withdraw-wrap {
			margin: 0 20rpx;
			padding: 30rpx;
			border-radius: 16rpx;
			box-shadow: rgba(110, 110, 110, 0.09) 0 0 20rpx 0;

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

				.delete {
					width: 40rpx;
					height: 40rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.bootom {
				display: flex;
				padding-top: 20rpx;

				text {
					line-height: 1;
					flex: 2;
				}

				.all-tx {
					padding-left: 10rpx;
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

		.recoend {
			margin-top: 40rpx;

			.recoend-con {
				text-align: center;
			}
		}

		.desc {
			font-size: 24rpx;
			color: #999;
		}
	// }
</style>
