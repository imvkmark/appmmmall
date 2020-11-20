<template>
	<view class="diy-pintuan" :class="themeStyle" v-if="list.length" :style="{backgroundColor: value.backgroundColor}">
		<view class="diy-pintuan-top">
			<view class="pintuan-title"><text class="pintuan-title-name">拼团专区</text></view>
			<view class="pintuan-more ns-text-color" @click="toMore()">好友都在拼</view>
		</view>
		<!-- <view class="pintuan-box">
			<view class="pintuan-box-item" v-for="(item, index) in list" :key="index" @click="toDetail(item.id)">
				<view class="pic">
					<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="widthFix"></image>
				</view>
				<view class="pintuan-box-item-con">
					<view class="item-con-title">{{ item.goods_name }}</view>
					<view class="item-con-desc">
						<text class="ns-bg-color">{{ item.pintuan_num }}人团</text>
					</view>
					<view class="item-con-price ns-text-color">
						<text class="ns-font-size-sm">￥</text>
						<text>{{ item.pintuan_price }}</text>
					</view>
				</view>
			</view>
		</view> -->
		<ns-goods-item-row :value="list" @toDetail="toDetail" type="pintuan"></ns-goods-item-row>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import nsGoodsItemRow from "@/components/ns-goods-item/ns-goods-item-row.vue";
	export default {
		name: 'diy-pintuan',
		components: {
			nsGoodsItemRow
		},
		props: {
			value: {
				type: Object
			},
			siteId: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				list: []
			};
		},
		created() {
			this.getData();
		},
		mixins:[globalConfig],
		methods: {
			toMore() {
				this.$util.redirectTo('/promotionpages/pintuan/list/list');
			},
			getData() {
				this.$api.sendRequest({
					url: '/pintuan/api/goods/page',
					data: {
						page: 1,
						page_size: 4,
						site_id: this.siteId
					},
					success: res => {
						if (res.code == 0) {
							this.list = res.data.list;
						}
					}
				});
			},
			toDetail(item) {
				this.$util.redirectTo('/promotionpages/pintuan/detail/detail', {
					id: item.id
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
	.diy-pintuan {
		width: 100%;
		padding-top: $ns-padding;
		box-sizing: border-box;
	}

	.diy-pintuan-top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 $ns-padding;
		box-sizing: border-box;

		.pintuan-title {
			display: flex;
			align-items: center;

			.pintuan-title-name {
				font-size: $ns-font-size-base;
				font-weight: bold;
				margin-right: $ns-margin;
			}

			.pintuan-title-time {
				font-size: $ns-font-size-sm;
			}
		}

		.pintuan-more {
			font-size: $ns-font-size-sm;
		}

		.pintuan-more::after {
			font-family: 'iconfont';
			content: '\eb93';
			font-size: $ns-font-size-base;
			line-height: 1;
			position: relative;
			top: 2rpx;
			margin-left: 4rpx;
		}
	}

	.pintuan-box {
		width: 100%;
		margin-top: 10rpx;

		.pintuan-box-item {
			display: inline-block;
			width: 48%;
			margin-right: 4%;
			margin-bottom: $ns-padding;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: $ns-border-radius;
			// border: 2rpx solid $ns-border-color-gray;
			box-shadow: #ccc 0px 0px 8rpx;
			background-color: #fff;

			.pic {
				width: 300rpx;
				height: 300rpx;
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.pintuan-box-item-con {
				width: 100%;

				.item-con-title {
					height: 64rpx;
					margin-top: $ns-margin;
					line-height: 1.2;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-weight: 600;
				}
				.item-con-desc {
					width: 100%;
					text {
						padding: 4rpx $ns-padding;
						color: #ffffff;
						font-size: 20rpx;
						border-radius: $ns-border-radius;
					}
					text:nth-child(1) {
						margin-right: $ns-margin;
					}
				}
				.item-con-price {
					margin-top: 10rpx;
					width: 100%;
					font-size: $ns-font-size-lg;
					display: flex;
					align-items: flex-end;
					text {
						line-height: 1;
					}
				}
			}
		}

		.pintuan-box-item:nth-child(2n) {
			margin-right: 0;
		}
	}
</style>
