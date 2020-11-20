<template>
	<view class="bill" :class="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getData" class="member-point" :size="8">
			<block slot="list">
				<view class="bill-wrap" v-if="accountList.length">
					<view class="bill-item" v-for="item in accountList" :key="item.id">
						<view class="bill-image">
							<image v-if="item.type == 'order'" :src="$util.img('upload/uniapp/fenxiao/bill/jiesuan.png')" mode="widthFix"></image>
							<image v-else :src="$util.img('upload/uniapp/fenxiao/bill/withdraw.png')" mode="widthFix"></image>
						</view>
						<view class="bill-content-wrap">
							<view class="bill-content">
								<view class="bill-title">{{ item.type_name }} {{ item.money }}</view>
								<view class="bill-cate">{{ item.type_name }}</view>
								<view class="bill-account-no">订单编号: {{ item.account_no }}</view>
								<view class="bill-time">{{ $util.timeStampTurnTime(item.create_time) }}</view>
							</view>
							<view class="bill-price" :class="{ 'ns-text-color': item.money > 0 }">{{ item.money }}</view>
						</view>
					</view>
				</view>
				<view v-if="!accountList.length && showEmpty"><ns-empty text="您当前没有账单信息哦" :isIndex="!1"></ns-empty></view>
			</block>
			<loading-cover ref="loadingCover"></loading-cover>
		</mescroll-uni>
	</view>
</template>

<script>
export default {
	data() {
		return {
			accountList: {},
			showEmpty: false
		};
	},
	onLoad() {},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	computed: {
		//vueX页面主题
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	methods: {
		getData(mescroll) {
			if (mescroll.num == 1) {
				this.accountList = [];
			}
			this.showEmpty = false;
			this.$api.sendRequest({
				url: '/fenxiao/api/account/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					is_settlement: this.selectId
				},
				success: res => {
					this.showEmpty = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data && res.data.list) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.accountList = []; //如果是第一页需手动制空列表
					this.accountList = this.accountList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					this.showEmpty = true;
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		}
	}
};
</script>

<style lang="scss">
	.bill-wrap {
		background-color: #ffffff;

		.bill-item {
			padding: $ns-padding;
			display: flex;

			.bill-image {
				flex: 1;
				width: 70rpx;
				height: 70rpx;
				border-radius: 50%;
				margin-left: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.bill-content-wrap {
				flex: 9;
				display: flex;
				justify-content: space-between;
				padding: 0 20rpx 20rpx 20rpx;
				border-bottom: 1rpx solid #e5e5e5;

				.bill-content {
					display: flex;
					flex-direction: column;

					.bill-title {
						font-weight: 600;
						font-size: $ns-font-size-base;
					}

					.bill-cate {
						font-size: $ns-font-size-sm;
					}

					.bill-account-no {
						font-size: $ns-font-size-sm;
						color: $ns-text-color-gray;
					}

					.bill-time {
						font-size: $ns-font-size-sm;
						color: $ns-text-color-gray;
					}
				}

				.bill-price {
					font-size: $ns-font-size-lg;
					font-weight: 600;
				}
			}
		}
	}

</style>
