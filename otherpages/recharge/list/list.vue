<template>
	<view :class="themeStyle">
		<view>
			<mescroll-uni @getData="getData" refs="mescroll" :size="10">
				<block slot="list">
					<view class="recharge-box" v-if="list.length">
						<view class="recharge-box-top ns-gradient-otherpages-list-list-top" :class="themeStyle">
							<text class="ns-font-size-sm">{{ $lang('mycnconis') }}</text>
							<text class="money">{{ (parseFloat(balanceInfo.balance) + parseFloat(balanceInfo.balance_money)).toFixed(2) }}</text>
						</view>
						<view class="recharge-box-top ns-gradient-otherpages-list-list-top" :class="themeStyle">
							<text class="ns-font-size-sm">{{ $lang('mallcoins') }}</text>
							<text class="money">{{ (parseFloat(balanceInfo.balance) + parseFloat(balanceInfo.balance_money)).toFixed(2) }}</text>
						</view>
						<view class="recharge-box-bottom">
							<view class="recharge-box-title">
								<text>{{ $lang('rechargeleixing') }}</text>
								<view class="recharge-record ns-text-color">
									<navigator hover-class="none" url="/otherpages/recharge/order_list/order_list">{{ $lang('rechargeRecord') }}</navigator>
								</view>
							</view>
							<view class="recharge-list-item" v-for="(item, index) in list" :key="index">
								<view class="item-left">
									<image v-if="item.cover_img" :src="$util.img(item.cover_img)" @error="imageError(index)" mode="aspectFill" />
									<image v-else :src="$util.getDefaultImage().default_goods_img" mode="widthFix" />
								</view>
								<view class="item-right">
									<view class="item-right-name">
										<text class="right-recharge-name">{{ item.recharge_name }}</text>
										<text class="recharge-other">{{ $lang('give') }}： {{ item.point }}{{ $lang('point') }}/{{ item.growth }}{{ $lang('growth') }}</text>
										<text class="face_value">{{ $lang('faceValue') }}：
											<text>￥</text>
											<text>{{ item.face_value }}</text>
										</text>
									</view>
									<view class="item-right-bottom">
										<view class="item-con-title ns-text-color">
											<text class="ns-font-size-sm">￥</text>
											<text class="ns-font-size-lg">{{ item.buy_price }}</text>
										</view>
										<view class="recharge-btn ns-gradient-otherpages-list-list-btn" :class="themeStyle" @click="toDetail(item.recharge_id)">{{ $lang('recharge') }}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-else>
						<ns-empty text="暂无充值套餐,敬请期待" :isIndex="!1"></ns-empty>
					</view>
				</block>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				list: [],
				balanceInfo: {
					balance: 0,
					balance_money: 0
				}
			};
		},
		onLoad() {},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.getUserInfo()
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
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
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/memberrecharge/api/memberrecharge/page',
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
						if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: () => {
						//联网失败的回调
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			toDetail(e) {
				this.$util.redirectTo('/otherpages/recharge/detail/detail', {
					id: e
				});
			},
			imageError(index) {
				this.list[index].cover_img = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.recharge-box {
		width: 100%;
		height: 100%;

		.recharge-box-top {
			height: 20%;
			display: flex;
			float:left;
			width:50%;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #ffffff;
			padding: 50rpx 0;
		}

		.money {
			font-size: 45rpx;
		}

		.recharge-box-bottom {
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;

			.recharge-box-title {
				display: flex;
				justify-content: space-between;
				padding: 10rpx 10rpx 0 10rpx;
			}

			.recharge-list-item {
				display: flex;
				margin-top: 10rpx;
				padding: 30rpx;
				background-color: #FFFFFF;

				.item-left {
					flex: 1;

					image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 15rpx;
						border: 1rpx solid #e5e5e5;
					}
				}

				.item-right {
					flex: 3;
					padding-left: 10rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding: 0 20rpx;

					.item-right-name {
						display: flex;
						flex-direction: column;

						.right-recharge-name {
							color: #000000;
							font-size: $ns-font-size-base;
						}

						.recharge-other {
							font-size: 20rpx;
							color: $ns-text-color-gray;
						}

						.face_value {
							color: $ns-text-color-gray;
							font-size: 20rpx;
						}
					}

					.item-right-bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-bottom: 10rpx;

						.item-con-title {
							margin-top: $ns-margin;
							line-height: 1.2;
						}

						.recharge-btn {
							font-size: $ns-font-size-sm;
							color: #FFFFFF;
							padding: 0 30rpx;
							border-radius: 100rpx;
						}
					}
				}
			}
		}
	}
</style>
