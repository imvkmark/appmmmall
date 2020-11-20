<template>
	<view class="diy-discount" v-if="dataList.length > 0">
		<view class="diy-discount-top">
			<view class="seckill-title">
				<text class="seckill-title-name">限时折扣</text>
				<uni-count-down :day="timeMachine.d" :hour="timeMachine.h" :minute="timeMachine.i" :second="timeMachine.s"
				 backgroundColorClass="ns-bg-color" splitorColorClass="ns-text-color" borderColor="#ffffff" color="#ffffff" />
			</view>
		</view>
		<scroll-view class="diy-discount-box" scroll-x="true">
			<view class="discount-box-item" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.sku_id)">
				<view class="discount-item">
					<view class="item-image">
						<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="widthFix" />
					</view>
					<view class="item-desc">{{ item.sku_name }}</view>
					<view class="item-price">
						<text class="seckill-item-new-price ns-text-color">￥{{ item.discount_price }}</text>
					</view>
					<text class="seckill-item-old-price">￥{{ item.price }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import uniCountdown from '@/components/uni-count-down/uni-count-down.vue';
	export default {
		components: {
			uniCountdown
		},
		name: 'diy-discount',
		props: {
			value: {
				type: Object,
				default: () => {
					return {};
				}
			}
		},
		data() {
			return {
				dataList: [],
				timeMachine: {
					d: 0,
					h: 0,
					i: 0,
					s: 0
				}
			};
		},
		created() {
			this.getDiscountList();
		},
		methods: {
			//获取限时折扣列表
			getDiscountList() {
				this.$api.sendRequest({
					url: '/discount/api/discount/latestone',
					success: res => {
						if (res.code == 0 && res.data && res.data.length > 0) {
							this.dataList = res.data;
							let nowTime = res.timestamp;
							let endTime = res.data[0].end_time;
							this.timeMachine = this.$util.countDown(endTime - nowTime);
						}
					}
				});
			},
			toDetail(e) {
				this.$util.redirectTo('/pages/goods/detail/detail', {
					sku_id: e
				});
			},
			imageError(index) {
				this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.diy-discount {
		width: 100%;
		padding: $ns-padding;
		box-sizing: border-box;
		background: #fff;
	}

	.diy-discount-top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.seckill-title {
			display: flex;
			align-items: center;

			.seckill-title-name {
				font-size: $ns-font-size-base;
				font-weight: bold;
				margin-right: $ns-margin;
			}

			.seckill-title-time {
				font-size: $ns-font-size-sm;
			}
		}
	}

	.diy-discount-box {
		width: 100%;
		/*white-space 不能丢  */
		white-space: nowrap;
		box-sizing: border-box;
		margin-top: 10rpx;
	}

	.discount-box-item {
		width: 230rpx;
		height: 100%;
		display: inline-block;
		background: #ffffff;
		margin-right: 10rpx;

		.discount-item {
			width: 100%;
			height: 100%;

			.item-image {
				width: 220rpx;
				height: 220rpx;
				overflow: hidden;
				position: relative;
				margin: 0 auto;

				image {
					width: 100%;
					height: 100%;
				}

				.time {
					width: 100%;
					position: absolute;
					left: 0;
					bottom: 0;
				}
			}

			.item-desc {
				width: 100%;
				font-size: $ns-font-size-sm;
				padding: 0 10rpx;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				// display: -webkit-box;
				// -webkit-line-clamp: 2;
				// -webkit-box-orient: vertical;
				line-height: 1.2;
				margin-top: 10rpx;
			}

			.item-price {
				width: 100%;
				margin-top: 10rpx;
				line-height: 1;

				.seckill-item-new-price {
					font-size: $ns-font-size-base;
					text-align: center;
					font-size: 1;
				}
			}

			.seckill-item-old-price {
				font-size: $ns-font-size-sm;
				text-align: center;
				color: $ns-text-color-gray;
				text-decoration: line-through;
				font-size: 1;
				line-height: 1;
			}
		}
	}
</style>
