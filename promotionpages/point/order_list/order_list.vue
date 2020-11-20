<template>
	<view class="order-container" :class="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<block v-if="orderList.length">
					<view class="order-item" v-for="(orderItem, orderIndex) in orderList" :key="orderIndex" @click="detail(orderItem)">
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
								<block v-if="orderItem.type==1">
									<view class="goods-img" v-if="orderItem.exchange_image">
										<image :src="$util.img(orderItem.exchange_image)" @error="imageError(orderIndex,orderItem.type)" mode="aspectFill" :lazy-load="true"></image>
									</view>
									<view class="goods-img" v-else>
										<image :src="$util.img('upload/uniapp/point/gift.png')" mode="aspectFill" :lazy-load="true"></image>
									</view>
								</block>
								<block v-if="orderItem.type==2">
									<view class="goods-img" v-if="orderItem.exchange_image">
										<image :src="$util.img(orderItem.exchange_image)" @error="imageError(orderIndex,orderItem.type)" mode="aspectFill" :lazy-load="true"></image>
									</view>
									<view class="goods-img" v-else>
										<image :src="$util.img('upload/uniapp/point/coupon.png')" mode="aspectFill" :lazy-load="true"></image>
									</view>
								</block>
								<block v-if="orderItem.type==3">
									<view class="goods-img" v-if="orderItem.exchange_image">
										<image :src="$util.img(orderItem.exchange_image)" @error="imageError(orderIndex,orderItem.type)" mode="aspectFill" :lazy-load="true"></image>
									</view>
									<view class="goods-img" v-else>
										<image :src="$util.img('upload/uniapp/point/hongbao.png')" mode="aspectFill" :lazy-load="true"></image>
									</view>
								</block>
							<!-- 	<view class="goods-img">
									<image :src="$util.img(orderItem.exchange_image)" @error="imageError(orderIndex)" mode="aspectFill" :lazy-load="true"></image>
								</view> -->
								<view class="goods-info">
									<view class="goods-name">{{ orderItem.exchange_name }}</view>
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
						<view class="order-footer">
							<view class="order-base-info">
								<view class="total">
									<text>
										{{ orderItem.point }}
										<text class="ns-font-size-sm">{{ $lang('point') }}</text>
									</text>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-if="showEmpty&&!orderList.length">
					<view>
						<ns-empty :isIndex="!1" :text="$lang('emptyTips')"></ns-empty>
					</view>
				</block>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderList: [],
			showEmpty:false
		};
	},
	onLoad() {},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (this.$refs.mescroll) this.$refs.mescroll.refresh();

		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/login/login/login', { back: '/promotionpages/point/order_list/order_list' });
		}
	},
	computed:{
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		}
	},
	methods: {
		getListData(mescroll) {
			this.showEmpty=false;
			this.$api.sendRequest({
				url: '/pointexchange/api/order/page',
				data: {
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					this.showEmpty=true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({ title: msg });
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
		detail(item) {
			if (item.type == 1) {
			}
		},
		imageError(index,type) {
			let imageUrl=''
			if(type==1){
				imageUrl=this.$util.img('upload/uniapp/point/gift.png')
			}else if(type==2){
				imageUrl=this.$util.img('upload/uniapp/point/coupon.png')
			}else if(type==3){
				imageUrl=this.$util.img('upload/uniapp/point/hongbao.png')
			}
			
			this.orderList[index].exchange_image = imageUrl;
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

		& > view {
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
				padding: $ns-margin 0 0 0;
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
					font-size: 28rpx;
				}

				.goods-sub-section {
					width: 100%;
					line-height: 1.3;
					display: flex;

					.goods-price {
						font-weight: 700;
						font-size: 15px;
					}

					.unit {
						font-weight: normal;
						font-size: 24rpx;
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

				.goods-operation {
					text-align: right;
					padding-top: $ns-padding;

					.operation-btn {
						line-height: 1;
						padding: 14rpx $ns-padding;
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

			.total {
				text-align: right;
				padding-top: $ns-padding;
				flex: 1;

				& > text {
					line-height: 1;
					margin-left: 10rpx;
				}
			}
		}

		.order-operation {
			text-align: right;
			padding-top: $ns-padding;

			.operation-btn {
				line-height: 1;
				padding: $ns-padding 26rpx;
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

.empty {
	padding-top: 200rpx;
	text-align: center;

	.empty-image {
		width: 180rpx;
		height: 180rpx;
	}
}
</style>
