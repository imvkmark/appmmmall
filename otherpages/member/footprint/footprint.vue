<template>
	<view class="container" :class="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<view class="footprint-wrap clearfix">
					<block v-if="goodsList.length">
						<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @longpress="longpress(index)">
							<view>
								<view class="goods-img">
									<navigator hover-class="none" :url="'/pages/goods/detail/detail?sku_id=' + item.sku_id">
										<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)"></image>
									</navigator>
								</view>
								<view class="goods-name">
									<navigator hover-class="none" :url="'/pages/goods/detail/detail?sku_id=' + item.sku_id"><text>{{ item.goods_name }}</text></navigator>
								</view>
								<view class="goods-price">
									<text class="price ns-text-color">
										<text class="ns-font-size-sm">{{ $lang('common.currencySymbol') }}</text>
										<text>{{ item.discount_price }}</text>
									</text>
								</view>
								<view class="check-wrap" :class="{ show: current == index }" @click.stop="current = -1">
									<text class="iconfont iconicon7" @click="deleteFootprint(index)"></text>
								</view>
							</view>
						</view>
					</block>
					<view v-else>
						<ns-empty :text="$lang('emptyTpis')"></ns-empty>
					</view>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList: [],
				current: -1
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
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/api/goodsbrowse/page',
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
						if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
						this.goodsList = this.goodsList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			longpress(index) {
				this.current = index;
			},
			deleteFootprint(index) {
				this.$api.sendRequest({
					url: '/api/goodsbrowse/delete',
					data: {
						id: this.goodsList[index].id
					},
					success: res => {
						if (res.code >= 0) {
							this.goodsList.splice(index, 1);
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			imageError(index) {
				this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
	}
	// [data-theme] {
		.footprint-wrap {
			margin: 0 $ns-margin;

			.goods-item {
				display: inline-block;
				float: left;
				background: #fff;
				width: calc((100% - 20rpx) / 2);
				margin: 20rpx 20rpx 0 0;
				border-radius: $ns-border-radius;
				overflow: hidden;

				&>view {
					position: relative;

					.check-wrap {
						position: absolute;
						width: 0;
						height: 0;
						z-index: 5;
						top: 50%;
						left: 50%;
						background: rgba($color: #000000, $alpha: 0.4);
						display: flex;
						justify-content: center;
						align-items: center;
						opacity: 0;
						transform: translate(-50%, -50%);
						border-radius: 50%;
						transition: width ease-in 0.2s, height ease-in 0.2s, border-radius ease-in 0.3s, opacity 0s;
						overflow: hidden;

						&.show {
							width: 100%;
							height: 100%;
							opacity: 1;
							border-radius: 0;
						}

						.iconicon7 {
							font-size: 40rpx;
							color: #999;
							background: #fff;
							line-height: 1;
							padding: 30rpx;
							border-radius: 50%;
						}
					}
				}

				&:nth-child(2n + 2) {
					margin-right: 0;
				}

				.goods-img {
					width: 100%;
					position: relative;

					navigator {
						display: block;
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;

						image {
							width: 100%;
							height: 100%;
						}
					}

					&:after {
						content: '';
						display: block;
						padding-top: 100%;
					}
				}

				.goods-name {
					padding: 20rpx 20rpx 0 20rpx;
					height: 65rpx;
					font-size: $ns-font-size-sm;
					font-weight: 600;
					line-height: 1.3;

					text {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}

				.goods-price {
					padding: 16rpx 20rpx 20rpx 20rpx;
					line-height: 1;

					.price {
						font-size: 28rpx;
					}
				}
			}
		}

		.empty {
			margin-top: 100rpx;
		}
	// }
</style>
