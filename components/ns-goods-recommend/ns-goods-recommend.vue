<template>
	<view class="recommend-page">
		<view v-if="list.length">
			<view class="hr-view" v-if="isLike">
				<view class="hr"></view>
				<text>{{ $lang('common.goodsRecommendTitle') }}</text>
				<view class="hr"></view>
			</view>
	<!-- 		<view class="recommend-goods-list">
				<view v-for="(item, index) in list" :key="index" @click="goDetail(item.sku_id)" class="item ns-border-color-gray">
					<view class="control-thumbnail">
						<image :src="$util.img(item['sku_image'], { size: 'mid' })" mode="aspectFill" @error="imageError(index)"></image>
					</view>

					<view class="control-goods-name ns-font-size-base">
						<view class="goods-name">{{ item['goods_name'] }}</view>
					</view>

					<view class="control-goods-price">
						<text class="price ns-text-color">
							<text class="currency-symbol">{{ $lang('common.currencySymbol') }}</text>
							{{ item['discount_price'] }}
						</text>
					</view>
				</view>
			</view> -->
			<ns-goods-item-row :value="list" @toDetail="toDetail"></ns-goods-item-row>
		</view>
		<view class="circle-box" v-if="showLoading && load">
			<ns-loading></ns-loading>
		</view>
	</view>
</template>

<script>
	import nsLoading from '@/components/ns-loading/ns-loading.vue'
	import globalConfig from '@/common/js/golbalConfig.js';
	import nsGoodsItemRow from "@/components/ns-goods-item/ns-goods-item-row.vue";
	// 商品推荐
	export default {
		name: 'ns-goods-recommend',
		components: {
			nsLoading,nsGoodsItemRow
		},
		mixins:[globalConfig],
		data() {
			return {
				list: [],
				page: 1,
				isAll: !0,
				isClick: true,
				showLoading: false
			};
		},
		props: {
			isLike: {
				type: Boolean,
				default: true
			},
			size: {
				type: [Number, String],
				default: 10
			},
			auto: {
				type: Boolean,
				default: true
			},
			load: {
				type: Boolean,
				default: true
			}
		},
		mounted() {
			if (this.auto) {
				this.getLikeList();
			}
		},
		methods: {
			init() {
				this.list = [];
				this.page = 1;
			},
			toDetail(item) {
				this.$util.redirectTo('/pages/goods/detail/detail', {
					sku_id: item.sku_id
				});
			},
			getLikeList(size) {
				let that = this;
				if (!this.isClick) return;
				if (!this.isAll) return;
				this.isClick = false;
				if (this.page > 1) this.showLoading = true;
				return new Promise((resolve, reject) => {
					that.$api.sendRequest({
						url: '/api/goodssku/recommend',
						data: {
							page: this.page,
							page_size: this.auto ? this.size : size
						},
						success: res => {
							this.showLoading = false;
							this.isClick = true;
							if (res.code == 0) {
								if (this.page == 1) {
									this.list = [];
								}
								this.list = this.list.concat(res.data.list);
								if (this.list.length == res.data.count) this.isAll = !1;
								this.page += 1;
								resolve(res.data.list);
							}
						}
					});
				});
			},
			imageError(index) {
				this.list[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.recommend-page{
		background: #F7f7f7;
	}
	.hr-view {
		margin: 20rpx 20rpx 0 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 100%;
		box-sizing: content-box;
		padding-top: 60rpx;
	}

	.hr-view .hr {
		width: 36%;
		height: 2rpx;
		background: #e5e5e5;
	}

	.hr-view text {
		font-size: 24rpx;
	}

	.recommend-goods-list {
		margin-top: 20rpx;
		width: 100%;
		display: flex;
		flex-flow: wrap;
	}

	.recommend-goods-list .item {
		margin: 0 10rpx 20rpx 20rpx;
		box-sizing: border-box;
		background: #fff;
		width: calc(50% - 30rpx);
		border-radius: 4px;
		overflow: hidden;
	}

	.recommend-goods-list .item:nth-child(2n) {
		margin: 0 20rpx 20rpx 10rpx;
	}

	.recommend-goods-list .control-thumbnail {
		width: 100%;
		height: calc(50vw - 30rpx);
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		padding: $ns-padding;
		box-sizing: border-box;
	}

	.recommend-goods-list .control-thumbnail image {
		width: 100%;
		height: 100%;
	}

	.recommend-goods-list .control-goods-name {
		height: 70rpx;
	}

	.recommend-goods-list .control-goods-name .goods-name {
		padding: 0 20rpx 0 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 26rpx;
		line-height: 1.3;
		font-weight: 600;
	}

	.recommend-goods-list .item .control-goods-price {
		padding: 16rpx 20rpx 20rpx 20rpx;
		line-height: 1;
	}

	.recommend-goods-list .control-goods-price .price {
		font-size: 28rpx;
	}

	.recommend-goods-list .control-goods-price .currency-symbol {
		font-size: 24rpx;
	}

	/*旋转进度条 */
	.circle-box {}
</style>
