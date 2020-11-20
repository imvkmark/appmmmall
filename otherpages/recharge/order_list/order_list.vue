<template>
	<view class="order-container">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<block v-if="orderList.length > 0">
					<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
						<view class="order-header">
							<view>
								<text class="ns-text-color-gray ns-font-size-sm">{{ orderItem.order_no }}</text>
							</view>
							<view class="align-right">
								<text class="ns-text-color-gray ns-font-size-sm">{{ $util.timeStampTurnTime(orderItem.create_time) }}</text>
							</view>
						</view>
						<view class="order-body">
							<view class="goods-wrap">
								<view class="goods-img">
									<image v-if="orderItem.cover_img" :src="$util.img(orderItem.cover_img)" @error="imageError(index)" mode="aspectFill"
									 :lazy-load="true" />
									<image v-else :src="$util.getDefaultImage().default_goods_img" mode="aspectFill" :lazy-load="true" />
								</view>
								<view class="goods-info">
									<view class="goods-name">{{ $lang('faceValue') }}：￥{{ orderItem.face_value }}</view>
									<view class="goods-name" v-if="orderItem.point > 0">{{ $lang('give') }}：{{ orderItem.point }}{{ $lang('point') }}</view>
									<view class="goods-name" v-if="orderItem.growth > 0">{{ $lang('give') }}：{{ orderItem.growth }}{{ $lang('growth') }}</view>
									<view class="goods-sub-section">
										<view>
											<text class="ns-text-color ns-font-size-lg">￥{{ orderItem.buy_price }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<view v-else>
					<ns-empty :isIndex="!1" text="暂无相关充值记录哦"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: []
			};
		},
		onLoad() {},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();

			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/otherpages/recharge/order_list/order_list');
			}
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/memberrecharge/api/order/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size
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
						if (mescroll.num == 1) this.orderList = []; //如果是第一页需手动制空列表
						this.orderList = this.orderList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			imageError(index) {
				this.orderList[index].cover_img = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.order-container {
		width: 100vw;
		height: 100vh;
	}

	.align-right {
		text-align: right;
	}

	.order-item {
		margin: $ns-margin;
		padding: $ns-padding;
		border-radius: $ns-border-radius;
		background: #fff;
		position: relative;

		.order-header {
			display: flex;
			align-items: center;
			position: relative;

			&>view {
				flex: 1;
			}
		}

		.order-body {
			.goods-wrap {
				margin-bottom: 20rpx;
				display: flex;
				position: relative;

				&:last-of-type {
					margin-bottom: 0;
				}

				.goods-img {
					width: 120rpx;
					height: 120rpx;
					padding: 20rpx 0 0 0;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: $ns-border-radius;
					}
				}

				.goods-info {
					flex: 1;
					position: relative;
					padding: 20rpx 0 0 0;
					max-width: calc(100% - 140rpx);

					.goods-name {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						line-height: 1.5;
						font-size: $ns-font-size-sm;
						color: $ns-text-color-gray;
					}

					.goods-sub-section {
						width: 100%;
						line-height: 1.3;
						display: flex;

						view {
							flex: 1;
							line-height: 1.3;
							text-align: right;
						}
					}
				}
			}
		}
	}
</style>
