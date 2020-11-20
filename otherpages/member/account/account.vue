<template>
	<view :class="themeStyle">
		<view>
			<mescroll-uni ref="mescroll" @getData="getData">
				<block slot="list">
					<view v-if="dataList.length > 0">
						<view class="info-list" v-for="(item, index) in dataList" :key="index" @click="setDefault(item.id)">
							<view class="info-top">
								<image class="default" v-if="item.is_default == 1" :src="$util.img('upload/uniapp/member/default.png')" mode=""></image>
								<view class="info-content">
									<text class="info-wrap">{{ item.realname }}</text>
									<text class="info-tel">{{ item.mobile }}</text>
								</view>
								<view class="info-account" v-if="item.withdraw_type == 'alipay'">
									<text>{{ $lang('withdrawalAccount') }} ：{{ item.bank_account }}</text>
								</view>
							</view>
							<view class="xian"></view>
							<view class="info-bottom">
								<view class="account-type">
									<view class="info-item-content">
										<text>{{ $lang('accountType') }} ：{{ item.withdraw_type_name }}</text>
									</view>
								</view>
								<view class="account-type" v-if="item.withdraw_type == 'bank'">
									<view class="info-item-content">
										<text>{{ $lang('bankName') }} ：{{ item.branch_bank_name }}</text>
									</view>
								</view>
								<view class="info-operation">
									<text @click.stop="editAccount('edit', item.id)">{{ $lang('update') }}</text>
									<text class="del" v-if="item.is_default != 1" @click.stop="deleteAccount(item.id)">{{ $lang('del') }}</text>
								</view>
							</view>
						</view>
					</view>
					<view v-else><ns-empty :text="$lang('emptyText')" :isIndex="false" :fixed="!1"></ns-empty></view>
					<button class="add-account" type="primary" @click="editAccount('add')">{{ $lang('newAddAccount') }}</button>
					<loading-cover ref="loadingCover"></loading-cover>
				</block>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: [], //账号列表
			back: '', // 返回页
			redirect: 'redirectTo' // 跳转方式
		};
	},
	onLoad(option) {
		if (option.back) this.back = option.back;
		if (option.redirect) this.redirect = option.redirect;
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (this.$refs.mescroll) this.$refs.mescroll.refresh();
	},
	computed: {
		//vueX页面主题
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	methods: {
		// 编辑提现账户信息
		editAccount(type, id) {
			let data = {};
			if (type == 'edit') data.id = id;
			this.$util.redirectTo('/otherpages/member/account_edit/account_edit', data);
		},
		deleteAccount(id) {
			uni.showModal({
				title: '操作提示',
				content: '确定要删除该账户吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/api/memberbankaccount/delete',
							data: {
								id: id
							},
							success: result => {
								if (result.code == 0) {
									this.$util.showToast({
										title: '删除成功'
									});
									this.$refs.mescroll.refresh();
								} else {
									this.$util.showToast({
										title: '删除失败'
									});
								}
							}
						});
					}
				}
			});
		},
		setDefault(id) {
			this.$api.sendRequest({
				url: '/api/memberbankaccount/setdefault',
				data: {
					id
				},
				success: res => {
					if (res.data >= 0) {
						if (this.back != '') {
							this.$util.redirectTo(this.back, {}, this.redirect);
						} else {
							this.$refs.mescroll.refresh();
							// this.$util.showToast({
							// 	title: '修改默认账户成功'
							// });
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			});
		},
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/api/memberbankaccount/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据

					let withdrawType = {
						bank: '银行',
						alipay: '支付宝',
						wechatpay: '微信'
					};
					this.dataList.forEach(item => {
						item.withdraw_type_name = withdrawType[item.withdraw_type] ? withdrawType[item.withdraw_type] : '';
					});
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.nc-info-list-content {
}

.info-list {
	background-color: #ffffff;
	padding: 24rpx 24rpx 26rpx 24rpx;
	margin: 12rpx 0;

	.info-top {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 10rpx 26rpx 10rpx;
		position: relative;

		.default {
			position: absolute;
			width: 78rpx;
			height: 72rpx;
			right: -22rpx;
			top: -26rpx;
			z-index: 999;
		}

		.info-content {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 30rpx;
			font-weight: 500;
			color: #000000;
		}

		.info-account {
			margin-top: 28rpx;
			font-size: 22rpx;
			font-weight: 500;
			color: #535353;
		}
	}

	.xian {
		width: 100%;
		height: 1;
		border: 1rpx solid #f1f1f1;
	}

	.info-bottom {
		padding: 20rpx 10rpx 0 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.account-type {
			color: #535353;
			font-size: 22rpx;
		}

		.info-operation {
			text-align: right;
			font-size: 22rpx;
			color: #a9a9a9;

			.del {
				margin-left: 43rpx;
			}
		}
	}
}
.add-account {
	margin-top: 60rpx;
	margin-bottom: 60rpx;
}
.empty {
	margin-top: 100rpx;
}
</style>
