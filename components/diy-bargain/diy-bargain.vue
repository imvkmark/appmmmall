<template>
	<view class="diy-bargain" v-if="dataList.length" :data-theme="themeStyle" :style="{ backgroundColor: value.backgroundColor, padding: value.padding * 2 + 'rpx 0rpx' }">
		<view hover-class="none" @click="$util.redirectTo('/promotionpages/bargain/list/list')" class="diy-bargain-title" v-if="value.list">
			<view class="seckill-title">
				<image class="left-img" :src="$util.img(value.list.imageUrl)" v-if="value.list.imageUrl"></image>
				<text class="seckill-title-name" :style="{ color: value.titleTextColor }">{{ value.list.title }}</text>
			</view>
			<view class="seckill-more" :style="{ color: value.moreTextColor }">{{ value.listMore.title }}</view>
		</view>
		<view class="diy-bargain-list">
			<block v-for="(dataItem, index) in dataList" :key="index">
				<ns-goods-item-col :value="dataItem" @toDetail="toDetail" type="bargain">
					<view class="bargain-operation">
						<view class="price-box">
							<text class="original-price">{{ dataItem.price }}</text>
							<text>
								底价：
								<text class="floor-price ns-text-color ns-font-size-base">{{ $lang('common.currencySymbol') }}{{ dataItem.floor_price }}</text>
							</text>
						</view>
						<button class="btn ns-bg-color" @click="toDetail(dataItem)">去砍价</button>
					</view>
				</ns-goods-item-col>
			</block>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import nsGoodsItemCol from '@/components/ns-goods-item/ns-goods-item-col.vue';
export default {
	name: 'diy-pintuan',
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
			dataList: []
		};
	},
	components: {
		nsGoodsItemCol
	},
	mounted() {
		this.getData();
	},
	watch: {
		siteId(val, nal) {
			this.getData();
		}
	},
	mixins: [globalConfig],
	methods: {
		toMore() {
			this.$util.redirectTo('/promotionpages/bargain/list/list');
		},

		getData() {
			var data = {
				page: 1,
				page_size: this.value.goodsCount
			};
			if (this.value.sources == 'diy') {
				data.id_arr = this.value.goodsId.toString();
			}
			if (this.siteId) {
				data.site_id = this.siteId;
			}

			this.$api.sendRequest({
				url: '/bargain/api/bargain/page',
				data: data,
				success: res => {
					if (res.code == 0) {
						this.dataList = res.data.list;
					}
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/bargain/detail/detail', {
				id: e.id
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
scroll-view ::-webkit-scrollbar {
	width: 0;
	height: 0;
	background-color: transparent;
}
.diy-bargain-list {
	padding: 20rpx 0;
	.bargin-item-title {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 76rpx;
		color: #ff7200;
	}
}
.diy-bargain-title {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 0 0 $ns-padding;
	box-sizing: border-box;

	.seckill-title {
		display: flex;
		align-items: center;

		.left-img {
			width: 50rpx;
			height: 50rpx;
			margin-right: 10rpx;
		}
		.seckill-title-name {
			font-size: $ns-font-size-base;
			font-weight: bold;
			margin-right: $ns-margin;
		}

		.seckill-title-time {
			font-size: $ns-font-size-sm;
		}
	}

	.seckill-more {
		font-size: $ns-font-size-sm;
		color: #858585;
		margin-right: 20rpx;
	}

	.seckill-more::after {
		font-family: 'iconfont';
		content: '\e6a3';
		font-size: $ns-font-size-base;
		line-height: 1;
		position: relative;
		top: 0;
		margin-left: 2px;
	}
}

.bargain-operation {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	width: 100%;
	.residue-price {
		display: inline-block;
		margin-top: 6rpx;
		background: rgba($base-color, 0.08) !important;
		font-size: $ns-font-size-sm;
		padding: 2rpx 4rpx;
	}
	.price-box {
		line-height: 1.6;
		font-size: $ns-font-size-sm;
		display: flex;
		flex-direction: column;
		.original-price {
			color: #777;
			text-decoration: line-through;
		}
		.time {
			font-size: 22rpx;
			text {
				padding: 2rpx 4rpx;
				margin: 0 4rpx;
				color: #fff;
				border-radius: 4rpx;
				line-height: 1;
			}
		}
	}
	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
		width: 136rpx;
		height: 48rpx;
		line-height: 1;
		color: #fff;
		font-size: $ns-font-size-sm;
		background-color: #ff7200;
		border-radius: 40rpx;
	}
}
</style>
