<template>
	<view class="diy-wholesale" v-if="dataList.length" :data-theme="themeStyle" :style="{backgroundColor: value.backgroundColor}">
		<view class="diy-wholesale-top">
			<view class="wholesale-title"><text class="wholesale-title-name">批发专区</text></view>
			<view class="wholesale-more ns-text-color" @click="toMore()">查看更多</view>
		</view>
		<view class="diy-wholesale-list">
			<block v-for="(dataItem, index) in dataList" :key="index">
				<ns-goods-item-col :value="dataItem" @toDetail="toDetail" type="bargain">
					<view class="wholesale-option">
						<view class="sale ns-font-size-sm">已售{{dataItem.sale_num}}件</view>
						<view class="wholesale-price ns-font-size-sm">
							<block v-if="dataItem.min_price==dataItem.max_price">
								<text class="ns-text-color">￥{{dataItem.min_price}}</text>
							</block>
							<block v-else>
								<text class="ns-text-color">￥{{dataItem.min_price}} ~ ￥{{dataItem.max_price}}</text>
							</block>
							<text class="ns-margin-left">{{Number(dataItem.min_num)}}件起批</text>
						</view>
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
	name: 'diy-whole-sale',
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
			this.$util.redirectTo('/promotionpages/wholesale/list/list');
		},
		getData() {
			var data = {
				page: 1,
				page_size: 5
			};
			if (this.siteId) {
				data.site_id = this.siteId;
			}
			this.$api.sendRequest({
				url: '/wholesale/api/goods/page',
				data: data,
				success: res => {
					if (res.code == 0) {
						this.dataList = res.data.list;
					}
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/wholesale/detail/detail', {
				sku_id: e.sku_id
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
	.diy-wholesale{
		padding-top: $ns-padding;
	}
.diy-wholesale-list {}
.wholesale-option{
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-start;
}
.diy-wholesale-top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;

		.wholesale-title {
			display: flex;
			align-items: center;

			.wholesale-title-name {
				font-size: $ns-font-size-base;
				font-weight: bold;
				margin-right: $ns-margin;
			}

			.wholesale-title-time {
				font-size: $ns-font-size-sm;
			}
		}

		.wholesale-more {
			font-size: $ns-font-size-sm;
		}

		.wholesale-more::after {
			font-family: 'iconfont';
			content: '\eb93';
			font-size: $ns-font-size-base;
			line-height: 1;
			position: relative;
			top: 2rpx;
			margin-left: 4rpx;
		}
	}

</style>
