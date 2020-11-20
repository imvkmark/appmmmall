@@ -0,0 +1,508 @@
<template>
	<view class="ns-goods-item-box" :data-theme="themeStyle">
		<view class="ns-goods-item" @click="toDetail()">
			<view class="image-box">
				<image :src="$util.img(item.sku_image, { size: 'mid' })" mode="aspectFill" @error="imageError()"></image>
			</view>
			<view class="desc-box">
				<view class="good-name" v-if="item.goods_name">
					<text>{{item['goods_name']}}</text>
				</view>
				<view class="good-name" v-else>
					<text>{{item['sku_name']}}</text>
				</view>


				<block v-if="type=='default'">
					<view class="mail ns-text-color ns-border-color">
						<view v-if="item.is_free_shipping" class="ns-gradient-diy-goods-list ns-text-color" :data-theme="themeStyle">免运费</view>
						<view v-if="addonIsExit.discount && item.promotion_type == 1" class="ns-gradient-diy-goods-list ns-text-color"
						 :data-theme="themeStyle">限时折扣</view>
					</view>

					<view class="price-info">
						<block v-if="item.promotion_type == 1 ">
							<block v-if="item.member_price>0">
								<view class="price-top">
									<view class="top-left">
										<text class="unit">￥</text>
										<text class="price">{{item.discount_price}}</text>
										<image :src="$util.img('upload/uniapp/index/discount.png')"></image>
									</view>
								</view>
								<view class="price-bottom">
									<view class="bottom-left">
										<text class="unit ns-text-color">￥</text>
										<text class="price ns-text-color">{{item.member_price}}</text>
										<image :src="$util.img('upload/uniapp/index/VIP.png')"></image>
									</view>
									<text class="sale_num">{{item.sale_num}}人付款</text>
								</view>
							</block>
							<block v-else>
								<view class="price-top">
									<text>
										<text class="unit">￥</text>
										<text class="price">{{item.price}}</text>
									</text>
								</view>
								<view class="price-bottom">
									<view class="bottom-left">
										<text class="unit ns-text-color">￥</text>
										<text class="price ns-text-color">{{item.discount_price}}</text>
										<image :src="$util.img('upload/uniapp/index/discount.png')"></image>
									</view>
									<text class="sale_num">{{item.sale_num}}人付款</text>
								</view>
							</block>
						</block>
						<block v-else>
							<block v-if="item.member_price>0">
								<view class="price-top">
									<text>
										<text class="unit">￥</text>
										<text class="price">{{item.price}}</text>
									</text>
									<!-- <text class="sale_num">{{item.sale_num}}人付款</text> -->
								</view>
								<view class="price-bottom">
									<view class="bottom-left">
										<text class="unit ns-text-color">￥</text>
										<text class="price ns-text-color">{{item.member_price}}</text>
										<image :src="$util.img('upload/uniapp/index/VIP.png')"></image>
									</view>
									<text class="sale_num">{{item.sale_num}}人付款</text>
								</view>
							</block>
							<block v-else>
								<view class="price-top">
									<text class="line-through" v-if="item.market_price>0">
										<text class="unit">￥</text>
										<text class="price">{{item.market_price}}</text>
									</text>
									<!-- <text class="sale_num">{{item.sale_num}}人付款</text> -->
								</view>
								<view class="price-bottom">
									<view class="bottom-left">
										<text class="unit ns-text-color">￥</text>
										<text class="price ns-text-color">{{item.price}}</text>
									</view>
									<text class="sale_num">{{item.sale_num}}人付款</text>
								</view>
							</block>
						</block>
					</view>
				</block>

				

				<block v-if="type=='groupbuy'">
					<view class="group-price">
						<view class="price-num">
							<text class="ns-margin-right old-price">{{ $lang('common.currencySymbol') }}{{ item.price }}</text>
							<text class="ns-text-color new-price">{{ $lang('common.currencySymbol') }}{{ item.groupbuy_price }}</text>
						</view>
						<view class="seeDetail ns-bg-color">团购价</view>
					</view>
				</block>
				
				<block v-if="type=='pintuan'">
					<view class="pintuan-price">
						<view class="goods-size">
							<view class="ns-text-color ns-gradient-pintuan-border-color info-size" :data-theme="themeStyle">{{ item.pintuan_num }}人团</view>
							<view class="info-num ns-gradient-promotionpages-pintuan-payment ns-text-color" :data-theme="themeStyle">已成团{{ item.order_num }}件</view>
						</view>
						<view class="goods-price">
							<view class="price">
								<text>￥{{ item.price }}</text>
								<text class="ns-text-color">￥{{ item.pintuan_price }}</text>
							</view>
							<view class="btn ns-bg-color">去拼团</view>
						</view>
					</view>
				</block>
				
				<block v-if="type == 'fenxiaoMarket'">
					<view class="fenxiaoMarket-item-info">
						<view class="earn-price">
							<view class="ns-text-color ns-gradient-promotionpages-pintuan-payment" :data-theme="themeStyle"><text class="iconfont iconfenxiang1"></text> 赚￥{{ item.commission_money }}</view>
						</view>
						<view class="fenxiaoMarket-info-btn">
							<view class="fenxiaoMarket-price">
								<view v-if="addonIsExit.discount && item.promotion_type == 1" class="btn-price1">
									<text class="ns-text-color">￥{{ item.discount_price }}</text>
									<image :src="$util.img('upload/uniapp/index/discount.png')"></image>
								</view>
								<text class="btn-price2 ns-text-color" :class="addonIsExit.discount && item.promotion_type == 1? 'btn-price2-active':''">￥{{ item.price }}</text>
							</view>
							<view class="btn ns-bg-color" v-if="!item.is_collect" @click.stop="followGoods(index, item.goods_id, item.sku_id)">关注</view>
							<view class="btn ns-bg-color"  v-else @click.stop="delFollowTip(item.collect_id, index)">已关注</view>
						</view>
					</view>
				</block>
				
				<block v-else>
					<slot></slot>
				</block>
				
			</view>
		</view>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		name: 'ns-goods-item-col',
		props: {
			value: {
				type: Object,
			},
			type: {
				type: String,
				default: 'default'
			}
		},
		mixins: [globalConfig],
		data() {
			return {
				item:{}
			};
		},
		mounted() {
			this.item=this.value
		},
		methods: {
			toDetail(e) {
				this.$emit('toDetail',this.item)
			},
			imageError() {
				this.item.sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			//关注
			followGoods(index, goods_id, sku_id) {
				this.$emit('followGood',{ index, goods_id, sku_id })
			},
			//取消关注
			delFollowTip(collect_id,index) {
				this.$emit('delFollowTip',{ collect_id,index })
			}
		}
	};
</script>

<style lang="scss">
	.ns-goods-item-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx;
		box-sizing: border-box;
		padding-top: 0;
	}

	.ns-goods-item {
		width: 100%;
		margin-bottom: 20rpx;
		display: flex;
		background: #ffffff;
		padding: 20rpx;
		box-sizing: border-box;
		border-radius: 10rpx;

		.image-box {
			width: 200rpx;
			height: 200rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.desc-box {
			width: calc(100% - 200rpx);
			min-height: 200rpx;
			padding-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.good-name {
			width: 100%;
			height: 64rpx;

			text {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: $ns-font-size-sm;
				line-height: 1.4;
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
					font-size: 22rpx;
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
					font-weight: 500;
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
		}

		.group-price {
			display: flex;
			height: 50%;
			justify-content: space-between;
			align-items: flex-end;

			.price-num {
				flex: 3;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				line-height: 1;

				.old-price {
					text-decoration: line-through;
					font-size: 22rpx;
					color: #777;

				}

				.new-price {
					font-size: $ns-font-size-base;
					padding-top: 10rpx;
				}
			}

			.seeDetail {
				width: 136rpx;
				height: 48rpx;
				color: #fff;
				border-radius: 24px;
				text-align: center;
			}
		}
		.pintuan-price{
			.goods-size {
				flex: 1;
				display: flex;
				margin-top: 20rpx;
				align-items: center;
				.info-size {
					border: 1px solid #fff;
					height: 26rpx;
					font-size: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 2rpx 10rpx;
					border-radius: 5rpx;
					margin-right: 10rpx;
					border:1px solid ;
				}
				.info-num {
					height: 30rpx;
					font-size: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 2rpx 10rpx;
					border-radius: 5rpx;
				}
			}
			.goods-price {
				flex: 3;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				.price {
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					line-height: 1;
					margin-top: 23rpx;
					text {
						&:nth-child(1) {
							font-size: 22rpx;
							color: #777;
							text-decoration: line-through;
						}
						&:nth-child(2) {
							font-size: $ns-font-size-base;
							margin-right: 15rpx;
							margin-top: 18rpx;
						}
					}
				}
				.btn {
					width: 136rpx;
					height: 48rpx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 24rpx;
				}
			}
		}
	}
	.ns-goods-item:nth-last-child(1) {
		margin-bottom: 0;
	}
	
	.fenxiaoMarket-item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		line-height: 1;
		.earn-price {
			line-height: 1;
			display: flex;
			align-items: center;
			margin-top: 17rpx;
			view {
				line-height: 1;
				font-size: 22rpx;
				padding: 4rpx 10rpx;
				border-radius: 4rpx;
				text {
					font-size: 22rpx;
					margin-right: 10rpx;
				}
			}
		}
		.fenxiaoMarket-info-btn {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.fenxiaoMarket-price {
				display: flex;
				flex-direction: column;
				line-height: 1;
				.btn-price1 {
					display: flex;
					align-items: center;
					font-size: $ns-font-size-lg;
					line-height: 1;
					image {
						width: 62rpx;
						height: 24rpx;
						margin-left: 10rpx;
					}
				}
				.btn-price2 {
					font-size: $ns-font-size-lg;
					line-height: 1;
				}
				.btn-price2-active {
					text-decoration:line-through;
					color: #777777 !important;
					margin-top: 10rpx;
					font-size: 22rpx;
				}
			}
			.btn {
				width: 106rpx;
				height: 44rpx;
				border-radius: 22rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
				font-size: 22rpx;
			}
		}
	}
</style>