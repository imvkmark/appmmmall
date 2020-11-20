<template>
	<view class="order-container" :class="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<block v-if="orderList.length">
					<view class="order-item" v-for="(orderItem, index) in orderList" :key="index" @click="toDetail(orderItem.order_id)">
						<view class="order-header">
							<view>
								<text class="ns-text-color-gray ns-font-size-sm">{{ $util.timeStampTurnTime(orderItem.create_time) }}</text>
							</view>
						</view>
						<view class="order-body">
							<view class="goods-wrap">
								<view class="goods-img">
									<image :src="$util.img(orderItem.gift_image)" v-if="orderItem.gift_image" @error="imageError(index)" mode="aspectFill" :lazy-load="true"></image>
									<image :src="$util.img('upload/uniapp/point/gift.png')" v-else mode="aspectFill" :lazy-load="true"></image>
								</view>
								<view class="goods-info">
									<view class="goods-name">{{ orderItem.gift_name }}</view>
									<view class="goods-sub-section">
										<view>
											<text>
												<text class="iconfont iconclose"></text>
												{{ orderItem.num }}
											</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view>
						<ns-empty :isIndex="!1" :text="$lang('emptyTips')"></ns-empty>
					</view>
				</block>
			</block>
		</mescroll-uni>
		<ns-login ref="login"></ns-login>
		<loading-cover ref="loadingCover"></loading-cover>
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
				this.$refs.login.open('/otherpages/member/gift/gift');
			}
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/gift/api/giftorder/page',
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
				// this.orderList[index].gift_image = this.$util.getDefaultImage().default_goods_img;
				this.orderList[index].gift_image = this.$util.img('upload/uniapp/point/hongbao.png');
				this.$forceUpdate();
			},
			toDetail(order_id) {
				this.$util.redirectTo('/otherpages/member/gift_detail/gift_detail', {
					id: order_id
				});
			}
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
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
					margin-bottom: $ns-margin;
					display: flex;
					position: relative;

					&:last-of-type {
						margin-bottom: 0;
					}

					.goods-img {
						width: 120rpx;
						height: 120rpx;
						padding: 20rpx 0 0 0;
						margin-right: $ns-margin;

						image {
							width: 100%;
							height: 100%;
							border-radius: $ns-border-radius;
						}
					}

					.goods-info {
						flex: 1;
						position: relative;
						padding: $ns-padding 0 0 0;
						max-width: calc(100% - 140rpx);

						.goods-name {
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							line-height: 1.5;
							font-size: $ns-font-size-base;
						}

						.goods-sub-section {
							width: 100%;
							line-height: 1.3;
							display: flex;

							.goods-price {
								font-weight: 700;
								font-size: $ns-font-size-base;
							}

							.unit {
								font-weight: normal;
								font-size: $ns-font-size-base;
								margin-right: 2rpx;
							}

							view {
								flex: 1;
								line-height: 1.3;

								&:last-of-type {
									text-align: right;

									.iconfont {
										line-height: 1;
										font-size: 26rpx;
									}
								}
							}
						}
					}
				}
			}

			.order-footer {
				margin-top: $ns-margin;
				background: #f5f5f5;
				padding: $ns-padding;
				border-radius: 4px;

				text {
					font-size: $ns-font-size-sm;
				}

				.label {
					color: $ns-text-color-gray;
				}

				&.no-express {
					padding: 0;
					border-radius: 0;
					background: #fff;
				}
			}
		}

		.empty {
			padding-top: 200rpx;
			text-align: center;

			.empty-image {
				width: 180rpx;
				height: 180rpx;
			}
		}
	// }
</style>
