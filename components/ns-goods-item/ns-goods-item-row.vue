<template>
	<view class="ns-goods-item-box">
		<view class="ns-goods-item" v-for="(item, index) in value" :key="index" @click="toDetail(item)">
			<view class="image-box"><image :src="$util.img(item.sku_image, { size: 'mid' })" mode="aspectFill" @error="imageError(index)"></image></view>

			<!-- 商品名称 -->
			<block v-if="showInfor.isShowGoodName">
				<view :class="showInfor.isShowGoodSubTitle ? 'good-name1' : 'good-name'" v-if="item.goods_name">
					<text :class="showInfor.isShowGoodSubTitle ? 'name-hidden-two' : 'name-hidden-one'">{{ item['goods_name'] }}</text>
				</view>
				<view :class="showInfor.isShowGoodSubTitle ? 'good-name1' : 'good-name'" v-else>
					<text :class="showInfor.isShowGoodSubTitle ? 'name-hidden-two' : 'name-hidden-one'">{{ item['sku_name'] }}</text>
				</view>
			</block>

			<!-- 副标题 -->
			<block v-if="showInfor.isShowGoodSubTitle">
				<view class="goods-sub-name">
					<text>{{ item.introduction }}</text>
				</view>
			</block>

			<view class="mail ns-text-color ns-border-color">
				<view v-if="item.is_free_shipping" class="ns-gradient-diy-goods-list ns-text-color" :data-theme="themeStyle">免运费</view>
				<view v-if="addonIsExit.discount && item.promotion_type == 1" class="ns-gradient-diy-goods-list ns-text-color" :data-theme="themeStyle">限时折扣</view>
			</view>

			<view class="price-info" v-if="type == 'default'">
				<block v-if="item.promotion_type == 1">
					<block v-if="item.member_price > 0">
						<view class="price-top">
							<view class="top-left">
								<text class="unit">￥</text>
								<text class="price">{{ item.discount_price }}</text>
								<image :src="$util.img('upload/uniapp/index/discount.png')"></image>
							</view>
							<text class="sale_num ns-margin-left" v-if="showInfor.isShowCart == 1 && showInfor.isShowGoodSaleNum">{{ item.sale_num }}人付款</text>
						</view>
						<view class="price-bottom">
							<view class="bottom-left">
								<text class="unit ns-text-color">￥</text>
								<text class="price ns-text-color">{{ item.member_price }}</text>
								<image :src="$util.img('upload/uniapp/index/VIP.png')"></image>
							</view>
							<text class="add iconfont iconadd-fill ns-text-color" v-if="showInfor.isShowCart == 1"></text>
							<text class="sale_num" v-else-if="showInfor.isShowGoodSaleNum">{{ item.sale_num }}人付款</text>
						</view>
					</block>
					<block v-else>
						<view class="price-top">
							<text>
								<text class="unit">￥</text>
								<text class="price">{{ item.price }}</text>
							</text>
							<text class="sale_num ns-margin-left" v-if="showInfor.isShowCart == 1 && showInfor.isShowGoodSaleNum">{{ item.sale_num }}人付款</text>
						</view>
						<view class="price-bottom">
							<view class="bottom-left">
								<text class="unit ns-text-color">￥</text>
								<text class="price ns-text-color">{{ item.discount_price }}</text>
								<image :src="$util.img('upload/uniapp/index/discount.png')"></image>
							</view>
							<text class="add iconfont iconadd-fill ns-text-color" v-if="showInfor.isShowCart == 1"></text>
							<text v-else-if="showInfor.isShowGoodSaleNum" class="sale_num">{{ item.sale_num }}人付款</text>
						</view>
					</block>
				</block>
				<block v-else>
					<block v-if="item.member_price > 0">
						<view class="price-top">
							<text>
								<text class="unit">￥</text>
								<text class="price">{{ item.price }}</text>
							</text>
							<text class="sale_num ns-margin-left" v-if="showInfor.isShowCart == 1 && showInfor.isShowGoodSaleNum">{{ item.sale_num }}人付款</text>
						</view>
						<view class="price-bottom">
							<view class="bottom-left">
								<text class="unit ns-text-color">￥</text>
								<text class="price ns-text-color">{{ item.member_price }}</text>
								<image :src="$util.img('upload/uniapp/index/VIP.png')"></image>
							</view>
							<text class="add iconfont iconadd-fill ns-text-color" v-if="showInfor.isShowCart == 1"></text>
							<text class="sale_num" v-else-if="showInfor.isShowGoodSaleNum">{{ item.sale_num }}人付款</text>
						</view>
					</block>
					<block v-else>
						<view class="price-top">
							<text class="line-through" v-if="item.market_price > 0 && showInfor.isShowMarketPrice">
								<text class="unit">￥</text>
								<text class="price">{{ item.market_price }}</text>
							</text>
							<text class="sale_num ns-margin-left" v-if="showInfor.isShowCart == 1 && showInfor.isShowGoodSaleNum">{{ item.sale_num }}人付款</text>
						</view>
						<view class="price-bottom">
							<view class="bottom-left">
								<text class="unit ns-text-color">￥</text>
								<text class="price ns-text-color">{{ item.price }}</text>
							</view>

							<text class="add iconfont iconadd-fill ns-text-color" v-if="showInfor.isShowCart == 1"></text>
							<text v-else-if="showInfor.isShowGoodSaleNum" class="sale_num">{{ item.sale_num }}人付款</text>
						</view>
					</block>
				</block>
			</view>
			<view class="fenxiaoMarket-price" v-if="type == 'fenxiaoMarket'">
				<view class="level_money">
					<view class="money_sign">佣金:</view>
					<view class="money ns-text-color">￥{{ item.commission_money }}</view>
				</view>

				<view class="good-share-money">
					<view class="item-con-price ns-text-color">
						<text class="ns-font-size-sm">￥</text>
						<text>{{ item.discount_price }}</text>
					</view>
					<view class="goods-bottom">
						<view
							class="goods-share ns-gradient-components-diy-fenxiao-goods-list"
							:class="themeStyle"
							v-if="!item.is_collect"
							@click.stop="followGoods(index, item.goods_id, item.sku_id, item.site_id)"
						>
							<text>关注</text>
						</view>
						<view class="goods-share ns-gradient-components-diy-fenxiao-goods-list" :class="themeStyle" v-else @click.stop="delFollowTip(item.collect_id, index)">
							<text>已关注</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="pintuan-price" v-if="type == 'pintuan'">
				<view class="item-con-desc">
					<text class="ns-bg-color">{{ item.pintuan_num }}人团</text>
				</view>
				<view class="item-con-price ns-text-color">
					<text class="ns-font-size-sm">￥</text>
					<text>{{ item.pintuan_price }}</text>
				</view>
			</view>

			<view class="topicList-price" v-if="type == 'topicsList'">
				<view class="item-through-price">{{ $lang('common.currencySymbol') }}{{ item.price }}</view>
				<view class="item-bottom">
					<view class="item-price ns-text-color">{{ $lang('common.currencySymbol') }}{{ item.topic_price }}</view>
					<view class="buy-btn ns-bg-color">立即购买</view>
				</view>
			</view>

			<view class="other-price" v-else></view>
		</view>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import category from '@/components/diy-goods-level-category/diy-goods-level-category.js';
export default {
	name: 'ns-goods-item-row',
	props: {
		value: {
			//循环商品列表
			type: Array
		},
		type: {
			//商品类型
			type: String,
			default: 'default'
		}
		// showInfor:{								//商品需要展示的字段
		// 	type: Object,
		// 	default () {
		// 		return {
		// 			isShowCart:false,					//加入购物车按钮
		// 			isShowGoodName: 1,				//是否展示商品名称
		// 			isShowGoodSaleNum: 1,			//是否展示售卖数量
		// 			isShowGoodSubTitle: 0,			//是否展示副标题
		// 			isShowMarketPrice: 1,
		// 		}
		// 	}

		// }
	},
	mixins: [globalConfig],
	data() {
		return {
			showInfor: {
				isShowCart: false, //加入购物车按钮
				isShowGoodName: 1, //是否展示商品名称
				isShowGoodSaleNum: 1, //是否展示售卖数量
				isShowGoodSubTitle: 0, //是否展示副标题
				isShowMarketPrice: 1
			}
		};
	},
	methods: {
		toDetail(e) {
			this.$emit('toDetail', e);
		},
		imageError(index) {
			this.value[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
.ns-goods-item-box {
	width: 100vw;
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx;
	box-sizing: border-box;
}

.ns-goods-item {
	width: calc(50% - 10rpx);
	margin-right: 18rpx;
	margin-bottom: 20rpx;
	background: #ffffff;
	padding: 20rpx;
	box-sizing: border-box;
	border-radius: 10rpx;

	.image-box {
		width: 306rpx;
		height: 306rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.good-name {
		width: 100%;
		height: 64rpx;
		margin-top: 10rpx;

		.name-hidden-one {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			font-size: $ns-font-size-sm;
			line-height: 1.4;
		}
	}
	.good-name1 {
		width: 100%;
		.name-hidden-two {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
			font-size: $ns-font-size-sm;
		}
	}

	.goods-sub-name {
		width: 100%;
		height: 54rpx;
		text {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			font-size: 20rpx;
			line-height: 1.4;
			color: #838383;
		}
	}

	.mail {
		width: 100%;
		height: 26rpx;
		display: flex;
		align-items: center;
		margin-top: 10rpx;

		view {
			line-height: 1;
			border: 1px solid #fff;
			font-size: 20rpx;
			padding: 2rpx 4rpx;
			border-radius: 4rpx;
			margin-right: 11rpx;
		}
	}

	.price-info {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 75rpx;
		margin-top: 10rpx;
		line-height: 1;
		text {
			line-height: 1;
		}
		.price-top {
			width: 100%;
			display: flex;
			align-items: flex-end;
			height: 50rpx;
			image {
				width: 56rpx;
				height: 22rpx;
				margin-left: 6rpx;
				display: block;
			}
			.unit {
				font-size: 22rpx;
				color: #777;
			}
			.price {
				font-size: 22rpx;
				color: #777;
			}
			.sale_num {
				font-size: 20rpx;
			}
		}
		.price-bottom {
			width: 100%;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			height: 50rpx;
			image {
				width: 56rpx;
				height: 22rpx;
				margin-left: 6rpx;
				display: block;
			}
			.unit {
				font-size: 22rpx;
			}
			.price {
				font-size: $ns-font-size-base;
				// font-weight: 500;
			}
			.sale_num {
				font-size: 20rpx;
			}
		}
		.line-through {
			text-decoration: line-through;
		}
		.bottom-left,
		.top-left {
			display: flex;
			align-items: center;
		}
		.add {
			font-size: 40rpx;
		}
	}
}

.fenxiaoMarket-price {
	width: 100%;
	height: 106rpx;
	.level_money {
		margin-right: 10rpx;
		display: flex;
		align-items: center;
	
		.money_sign {
			line-height: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			float: left;
			font-size: $ns-font-size-base;
		}
	
		.money {
			height: 100%;
			line-height: 38rpx;
			font-size: $ns-font-size-base;
		}
	}
	.item-con-price {
		margin-top: 10rpx;
		font-size: $ns-font-size-lg;
		display: flex;
		align-items: flex-end;
	
		text {
			line-height: 1;
		}
	}
	.good-share-money {
		margin-top: $ns-margin;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	.goods-share {
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 $ns-padding;
		border-radius: 50rpx;
	
		text {
			line-height: 1;
			color: #ffffff;
			font-size: 20rpx;
		}
	}
}
.pintuan-price{
	width: 100%;
	height: 88rpx;
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
.topicList-price {
	padding-top: 27rpx;
	.item-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.buy-btn {
			padding: 10rpx 12rpx;
			text-align: center;
			color: #fff;
			font-size: 20rpx;
			border-radius: 100rpx;
			line-height: 1;
		}
		.item-price {
			line-height: 1;
			font-size: $ns-font-size-base;
		}
	}
	.item-through-price {
		font-size: 22rpx;
		border-radius: 5rpx;
		text-decoration: line-through;
		color: #777777;
		line-height: 1;
	}
}

.ns-goods-item:nth-child(2n) {
	margin-right: 0;
}

// .ns-goods-item:nth-last-child(1) {
// 	margin-bottom: 0;
// }

// .ns-goods-item:nth-last-child(2) {
// 	margin-bottom: 0;
// }
</style>
