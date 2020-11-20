<template>
	<!-- 当前商品参与的营销活动入口 -->
	<view class="goods-promotion" v-if="goodsPromotion.length">
		<view v-for="(item, index) in goodsPromotion" v-if="promotion!=item.promotion_type" :key="index">
			<text>当前商品正在参与：{{ item.promotion_name }}</text>
			<view v-if="item.promotion_type == 'discount'" class="item" @click="$util.redirectTo('/pages/goods/detail/detail?sku_id=' + item.sku_id)">点击进入</view>
			<view v-else-if="item.promotion_type == 'groupbuy'" class="item" @click="$util.redirectTo('/promotionpages/groupbuy/detail/detail?id=' + item.groupbuy_id)">点击进入</view>
			<view v-else-if="item.promotion_type == 'pintuan'" class="item" @click="$util.redirectTo('/promotionpages/pintuan/detail/detail?id=' + item.id)">点击进入</view>
			<view v-else-if="item.promotion_type == 'seckill'" class="item" @click="$util.redirectTo('/promotionpages/seckill/detail/detail?id=' + item.id)">点击进入</view>
			<view v-else-if="item.promotion_type == 'topic'" class="item" @click="$util.redirectTo('/promotionpages/topics/goods_detail/goods_detail?id=' + item.id)" >点击进入</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ns-goods-promotion',
	props: {
		promotion: {
			type: String,
			default:''
		}
	},
	data() {
		return {
			goodsPromotion: {
				type: Array
			}
		};
	},
	created() {},
	methods: {
		refresh(goodsPromotion) {
			this.goodsPromotion = goodsPromotion;
		}
	}
};
</script>

<style lang="scss">
.goods-promotion {
	background-color: #fff;
	view {
		padding: 20rpx;
	}
	.item {
		float: right;
	}
}
</style>
