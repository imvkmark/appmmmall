<template>
	<view class="diy-groupbuy" v-if="list.length > 0" :data-theme="themeStyle" :style="{backgroundColor: value.backgroundColor}">
		<navigator hover-class="none" :url="'/promotionpages/groupbuy/list/list?site_id=' + siteId" class="diy-groupbuy-top">
			<view class="seckill-title"><text class="seckill-title-name">团购专区</text></view>
			<view class="seckill-more ns-text-color">查看更多</view>
		</navigator>

		<view class="diy-groupbuy-list">
			<block v-for="(dataItem, index) in list" :key="index">
				<ns-goods-item-col :value="dataItem" @toDetail="toDetail" type="bargain">
					<view class="groupbuy-option">
						<view class="desc-price ns-margin-top">
							<text>
								<text>原价:</text>
								<text class="ns-margin-right old-price">{{ $lang('common.currencySymbol') }}{{ dataItem.price }}</text>
							</text>
							<text>
								<text>团购价:</text>
								<text class="ns-text-color">{{ $lang('common.currencySymbol') }}{{ dataItem.groupbuy_price }}</text>
							</text>
						</view>
						<view class="seeDetail"><button type="primary" size="mini">查看详情</button></view>
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
	name: 'diy-groupbuy',
	components: {
		nsGoodsItemCol
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
	mixins: [globalConfig],
	methods: {
		getData() {
			this.$api.sendRequest({
				url: '/groupbuy/api/goods/page',
				data: {
					page_size: 6,
					page: 1,
					site_id: this.siteId
				},
				success: res => {
					if (res.code == 0) {
						this.list = res.data.list;
					}
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/groupbuy/detail/detail', {
				id: e.groupbuy_id
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
.diy-groupbuy {
	width: 100%;
	padding-top: $ns-padding;
	box-sizing: border-box;
}

.diy-groupbuy-top {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 $ns-padding;
	box-sizing: border-box;

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

	.seckill-more {
		font-size: $ns-font-size-sm;
	}

	.seckill-more::after {
		font-family: 'iconfont';
		content: '\eb93';
		font-size: $ns-font-size-base;
		line-height: 1;
		position: relative;
		top: 0;
		margin-left: 2px;
	}
}
.groupbuy-option {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	position: relative;
	.desc-price {
		width: 60%;
		font-size: $ns-font-size-sm;
		display: flex;
		flex-direction: column;
	}

	.old-price {
		text-decoration: line-through;
		color: $ns-text-color-gray;
		font-size: $ns-font-size-sm;
	}

	.seeDetail {
		line-height: 1;
		position: absolute;
		right: 0;
		bottom: 10rpx;

		button {
			line-height: 1.8;
			padding: 0 25rpx;
		}
	}
}
</style>
