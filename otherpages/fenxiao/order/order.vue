<template>
	<view :class="themeStyle">
		<view>
			<view class="withdraw-cate">
				<view class="cate-li" v-for="(item,index) in category" :key="index" @click="selectCate(item.id)">
					<view class="li-con" :class="{'active ns-border-color ns-text-color':selectId==item.id}">
						{{item.name}}
					</view>
				</view>
			</view>
			<mescroll-uni ref="mescroll" @getData="getData" top="90" class="member-point" :size="8">
				<view class="goods_list" slot="list">
					<view class="order-list">
						<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex" @click="toDetail(orderItem.fenxiao_order_id)">
							<view class="order-header">
								<text class="site-name">{{ orderItem.order_no }}</text>
								<text class="status-name ns-text-color" v-if="orderItem.is_refund==1">已退款</text>
								<text class="status-name ns-text-color" v-else-if="orderItem.is_settlement==1">已结算</text>
								<text class="status-name ns-text-color" v-else>待结算</text>
							</view>
							<view class="xian">

							</view>

							<view class="order-body">
								<view class="goods-wrap">
									<view class="goods-img">
										<image :src="$util.img(orderItem.sku_image, { size: 'mid' })" @error="imageError(orderIndex)" mode="aspectFill"
										 :lazy-load="true"></image>
									</view>
									<view class="goods-info">
										<view class="goods-name">{{ orderItem.sku_name }}</view>
										<view class="goods-sub-section">
											<view>
												<text class="order-num">
													<text class="iconfont iconclose"></text>
													{{ orderItem.num }}
												</text>
											</view>
										</view>
										<view class="time-wrap">
											<view class="creat-time">
												{{$util.timeStampTurnTime(orderItem.create_time)}}
											</view>
											<view class="goods-price">
												<text class="unit">￥</text>
												<text>{{ orderItem.price }}</text>

											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="xian">

							</view>
							<view class="order-footer">
								<view class="order-base-info active">
									<view class="order-type ">
										<text>返{{fenxiaoWords.account}}金额：</text>
										<text class="ns-text-color">{{ $lang('common.currencySymbol') }}{{orderItem.commission}}</text>
									</view>
									<view class="total">
										<text>合计：</text>
										<text class="all-money ns-text-color">{{ $lang('common.currencySymbol') }}{{orderItem.real_goods_money}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>


					<ns-empty text="您暂时没有订单哦" :isIndex="!1" v-if="selectId==0 && orderList.length==0 && emptyShow"></ns-empty>
					<ns-empty text="您没有待结算订单哦" :isIndex="!1" v-if="selectId==1 && orderList.length==0 && emptyShow"></ns-empty>
					<ns-empty text="您没有已结算订单哦" :isIndex="!1" v-if="selectId==2 && orderList.length==0 && emptyShow"></ns-empty>
					<ns-empty text="您没有已退款订单哦" :isIndex="!1" v-if="selectId==3 && orderList.length==0 && emptyShow"></ns-empty>
				</view>
			</mescroll-uni>

			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>

</template>

<script>
	import fenxiaoWords from 'common/js/fenxiao-words.js';
	export default {
		data() {
			return {
				category: [{
						id: 0,
						name: "全部",
						number: 2
					},
					{
						id: 1,
						name: "待结算",
						number: 0
					},
					{
						id: 2,
						name: "已结算",
						number: 0
					},
					{
						id: 3,
						name: "已退款",
						number: 0
					}
				],
				selectId: 0,
				orderList: [],
				// is_settlement
				emptyShow: false
			}
		},
		mixins: [fenxiaoWords],
		onShow() {
			this.$langConfig.refresh();

			uni.setNavigationBarTitle({
				title: this.fenxiaoWords.concept + '订单'
			});

			if (uni.getStorageSync('token')) {

			} else {
				this.$util.redirectTo(
					'/pages/login/login/login', {
						back: '/otherpages/fenxiao/order/order'
					},
					'redirectTo'
				);
			}
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			//获得列表数据
			getData(mescroll) {
				this.emptyShow = false;
				if (mescroll.num == 1) {
					this.orderList = []
				}
				this.$api.sendRequest({
					url: '/fenxiao/api/order/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						is_settlement: this.selectId
					},
					success: res => {
						this.emptyShow = true;
						let newArr = []
						let msg = res.message;
						if (res.code == 0 && res.data && res.data.list) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							})
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
			selectCate(e) {
				this.selectId = e;
				this.$refs.mescroll.refresh()
			},
			toDetail(e) {
				this.$util.redirectTo("/otherpages/fenxiao/order_detail/order_detail", {
					id: e
				})
			}
		}
	}
</script>

<style lang="scss">
	// [data-theme] {
		.withdraw-cate {
			width: 100%;
			height: 90rpx;
			display: flex;
			border-bottom: 1rpx solid $ns-border-color-gray;
			box-sizing: border-box;
			background: #ffffff;

			.cate-li {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;

				.li-con {
					display: inline-block;
					line-height: 90rpx;
					height: 100%;
				}

				.li-con.active {
					border-bottom: 6rpx solid;
					box-sizing: border-box;
				}
			}
		}

		.xian {
			width: 100%;
			border: 1rpx solid #F1F1F1;
		}

		.goods_list {
			width: 100%;
			height: 100%;
			padding: 0 $ns-padding;
			box-sizing: border-box;

			.order-item {
				border-radius: $ns-border-radius;
				background: #ffffff;
				position: relative;
				margin-top: $ns-margin;

				.order-header {
					display: flex;
					align-items: center;
					position: relative;
					padding: 26rpx 26rpx 26rpx 36rpx;

					.site-name {
						font-size: 22rpx;
						color: #383838;
					}

					.status-name {
						flex: 1;
						text-align: right;
						font-size: 22rpx;
					}
				}

				.order-body {
					padding: 26rpx 26rpx 26rpx 36rpx;

					.goods-wrap {
						display: flex;
						position: relative;


						&:last-of-type {
							margin-bottom: 0;
						}

						.goods-img {
							width: 170rpx;
							height: 170rpx;
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
							margin: 11rpx 0 11rpx 0;
							max-width: calc(100% - 200rpx);

							.goods-name {
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
								line-height: 1.5;
								font-size: 22rpx;
							}

							.goods-sub-section {
								width: 100%;
								line-height: 1.5;
								display: flex;
								align-items: center;
								margin-top: 57rpx;

								.order-num {
									color: #838383;
								}

								view {
									flex: 1;
									line-height: 1;

									&:last-of-type {
										text-align: right;

										.iconfont {
											line-height: 1;
											font-size: 26rpx;
										}
									}
								}
							}

							.time-wrap {
								display: flex;
								flex-direction: row;
								justify-content: space-between;
								align-items: center;

								.creat-time {
									font-size: 22rpx;
									color: $ns-text-color-gray;
								}

								.goods-price {
									font-weight: 700;
									font-size: 22rpx;
									color: #000000;

									.unit {
										font-weight: normal;
										font-size: 22rpx;
										margin-right: 2rpx;
										color: #000000;
									}
								}
							}

							.goods-operation {
								text-align: right;
								padding-top: 20rpx;

								.operation-btn {
									line-height: 1;
									padding: 14rpx 20rpx;
									color: #333;
									display: inline-block;
									border-radius: 28rpx;
									background: #fff;
									border: 0.5px solid #999;
									font-size: 24rpx;
									margin-left: 10rpx;
								}
							}
						}
					}
				}

				.order-footer {

					.order-base-info {
						display: flex;
						padding: 20rpx 13rpx 10rpx 30rpx;

						.total {
							text-align: right;
							padding-top: 20rpx;
							flex: 1;


							&>text {
								line-height: 1;
								margin-left: 10rpx;
							}
						}

						.order-type {
							padding-top: 20rpx;
							font-size: 22rpx;

							&>text {
								line-height: 1;
							}
						}
					}

					.order-base-info.active {
						.total {
							padding-top: 0;

							.all-money {
								font-size: 28rpx;
								font-weight: bold;
							}
						}

						.order-type {
							padding-top: 0;
						}
					}

					.order-operation {
						text-align: right;
						padding-top: 20rpx;

						.operation-btn {
							line-height: 1;
							padding: 20rpx 26rpx;
							color: #333;
							display: inline-block;
							border-radius: 32rpx;
							background: #fff;
							border: 0.5px solid #999;
							font-size: 24rpx;
							margin-left: 10rpx;
						}
					}
				}
			}

			.order-item:last-child {
				border: none;
			}
		}
	// }
</style>
