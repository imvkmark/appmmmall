<template>
	<view class="newAll" :class="autoHeight?'newpage':'newpage1'" :style="{height: bottom +'px',boxSizing: 'border-box'}">
		<view class="newPage-box2" v-if="cateList.length">
			<view class="category-goods" v-if="type==3">
				<scroll-view scroll-y="true" class="oneScroll">
					<view class="oneScroll-item" v-for="(item,index) in cateList" :key="index" :class="{'active ns-bg-before ns-text-color' : item.category_id_1 ==oneCategoryId}"
					 @click="selectOneCategory(item.category_id_1,index)">
						<text class="max-font-2">{{item.short_name?item.short_name:item.category_name}}</text>
					</view>
				</scroll-view>
				<view class="twoScroll" @scrolltolower="getGoodsList()">
					<view class="category-cate-top">
						<nsSearch></nsSearch>
						<image class="cate-adv" v-if="categoryAdvImage" @error="categoryAdvImage=$util.img('/upload/uniapp/default_ad.png')"
						 :src="$util.img(categoryAdvImage)" mode=""></image>
						<scroll-view scroll-x="true" class="three-two-cate" v-if="twoCateList.length">
							<view class="three-two-cate-item" :class="index==TwoCategoryIndex?'active ns-border-color ns-text-color':''" v-for="(item,index) in twoCateList"
							 :key="index" @click="selectTwoCategory(item.category_id_2,index)">
								{{item.category_name}}
							</view>
						</scroll-view>
					</view>
					<scroll-view scroll-y="true" class="category-cate-concent" :style="{
						height: 'calc(100% - ' + height + ' )'
					}"
					 @scrolltolower="getGoodsList()">
						<view class="twoScroll-goods">
							<view class="twoScroll-item" v-for="(item,index) in goodsList" :key="index">
								<view class="twoScroll-item-box">
									<view class="twoScroll-item-image" @click="toDetail(item.sku_id)">
										<image class="" :src="$util.img(item.sku_image, { size: 'mid' })" @error="goodsImageError(index)" mode="aspectFill" />
									</view>
									
									<view class="goods_detail">
										<view>
											<view class="goods_name" @click="toDetail(item.sku_id)">
												<text class="max-font-2">{{item.goods_name}}</text>
											</view>
											<view class="is_discount ns-border-color ns-gradient-diy-goods-list ns-text-color" :class="themeStyle" v-if="item.promotion_type == 1 && addonIsExit.discount">
												<text>限时折扣</text>
											</view>
										</view>
							
										<view class="goods_price ns-text-color">
											<view class="goods_price_content">
												<view class="ns-font-size-sm">
													<text class="ns-text-color-gray">{{item.sale_num}}人付款</text>
												</view>
												<view class="ns-font-size-sm">
													<text class="ns-font-size-x-lg ns-text-color">￥{{price(item)}}</text>
													<image v-if="priceLogo(item) == 'discount_price'" :src="$util.img('upload/uniapp/index/discount.png')"></image>
													<image v-else-if="priceLogo(item) == 'member_price'" :src="$util.img('upload/uniapp/index/VIP.png')"></image>
												</view>
											</view>
											<view :class="item.goods_spec_format?'careBox_more ns-bg-color':'careBox'" v-if="item.is_virtual == 0 ">
													<text class="iconfont iconjianshao ns-text-color" v-if="!item.goods_spec_format && item.num>0" @click.stop="cartNumChange('minus',item.num,item.cart_id,item.sku_id,item.site_id)"
													></text>
													<input class="" disabled="true" :value="item.num" v-if="!item.goods_spec_format && item.num>0"/>
													<text class="iconfont iconadd-fill ns-text-color" @click.stop="cartNumChange('add',item.num,item.cart_id,item.sku_id,item.site_id)" v-if="!item.goods_spec_format"></text>
													<text class="" @click.stop="getGoodsSkuDetail(item.sku_id)" v-else>选规格</text>
											</view>
											
										</view>
									</view>
								</view>
							</view>
						</view>


						<!-- 加载中 -->
					<!-- 	<view class="mescroll-upwarp" v-show="isLoading">
							<ns-loading></ns-loading>
						</view> -->
						<!-- 没有更多 -->
						<!-- <view v-if="isAll&&goodsList.length>1" class="no-more">
							<text>— 我是有底线的 —</text>
						</view> -->
						<!-- 空 -->
						<view class="empty-box" v-if="isAll&&goodsList.length==0 && !isLoading">
							<ns-empty :isIndex="!1" :fixed="!1"></ns-empty>
						</view>
					</scroll-view>
				</view>
			</view>

			<view class="category-cate" v-else>
				<scroll-view scroll-y="true" class="oneScroll">
					<view class="oneScroll-item" v-for="(item,index) in cateList" :key="index" :class="{'active ns-bg-before ns-text-color' : item.category_id_1 ==oneCategoryId}"
					 @click="selectOneCategory(item.category_id_1,index,true)">
						<text class="max-font-2">{{item.short_name?item.short_name:item.category_name}}</text>
					</view>
				</scroll-view>
				<view class="twoScroll">
					<view class="category-cate-top">
						<nsSearch></nsSearch>
						<image class="cate-adv" v-if="categoryAdvImage" :src="$util.img(categoryAdvImage)" @error="categoryAdvImage=$util.img('/upload/uniapp/default_ad.png')"
						 mode=""></image>
					</view>
					<scroll-view scroll-y="true" class="category-cate-content" :style="{
						height: 'calc(100% - ' + height + ' )'
					}">	
						<view class='twoScroll-cate'>
							<view class="twoScroll-item" v-for="(item,index) in twoCateList" :key="index"  @click="toListDetail(item.category_id_2,item.level)" v-if="type==2">
								<view class="twoScroll-item-box" >
									<image v-if="item.image" class="twoScroll-item-image" :src="$util.img(item.image)"  @error="cateImageError(index,2)" mode="aspectFill"></image>
									<image v-else class="twoScroll-item-image" :src="$util.getDefaultImage().default_goods_img" mode="aspectFill"></image>
									<text class="max-font-1" :class="type==1?'cate-name':''">
										{{item.short_name?item.short_name:item.category_name}}
									</text>
								</view>
							</view>
							<view class="twoScroll-item1" v-for="(item,index) in twoCateList" :key="index" @click="toListDetail(item.category_id_2,item.level)"  v-if="type==1">
								<view class="twoScroll-item-box1">
									<text class="max-font-1">
										{{item.short_name?item.short_name:item.category_name}}
									</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- <ns-goods-sku ref="goodsSku" :goods-detail="goodsSkuDetail" @refresh="refreshGoodsSkuDetail"></ns-goods-sku> -->
		<ns-goods-sku-new ref="goodSkuNew" :goods-detail="goodsSkuDetail" @refresh="refreshGoodsSkuDetail"></ns-goods-sku-new>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
	import nsGoodsSkuNew from '@/components/ns-goods-sku/ns-goods-sku-new.vue';
	import category from "@/components/diy-goods-level-category/diy-goods-level-category.js"
	import nsLoading from '@/components/ns-loading/ns-loading.vue'
	import nsSearch from '@/components/ns-search/ns-search.vue'
		import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		name: "diy-goods-level-two",
		components: {
			nsGoodsSku,
			nsLoading,
			nsSearch,
			nsGoodsSkuNew
		},
		data() {
			return {
				list: [],
			}
		},

		mixins: [category,globalConfig]
	}
</script>

<style lang="scss">
	.lineation-price{
		text-decoration: line-through;
	}
	.max-font-1 {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.max-font-2 {
		word-break: break-all;
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.newpage{
		width: 100%;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifdef APP-PLUS */
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		height: 100vh;
		/* #endif */
	}
	.newpage.active{
		height: calc(100vh - 175px);
	}
	.category-cate{
		.search-box{
			padding: 20rpx 20rpx 30rpx;
		}
		.cate-adv{
			padding-bottom: 30rpx;
			height: 220rpx;
		}
	}
	.newPage-box2 {
		width: 100%;
		height: 100%;
		display: flex;

		.category-goods {
			width: 100%;
			height: 100%;
			display: flex;

			.oneScroll {
				width: 160rpx;
				height: 100%;
				background: #f1f1f1;

				.oneScroll-item {
					width: 100%;
					padding: 10rpx $ns-padding;
					box-sizing: border-box;
					font-size: $ns-font-size-base;
					text-align: center;
					height: 100rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					text {
						line-height: 1.3;
					}
				}

				.oneScroll-item.active {
					background: #ffffff;
					position: relative;
				}

				.oneScroll-item.active:before {
					content: '';
					display: inline-block;
					width: 8rpx;
					height: 68rpx;
					border-radius: 8rpx;
					position: absolute;
					left: 0;
					top: 16rpx;
					border-radius: 6rpx;
				}
			}

			.twoScroll {
				width: calc(100% - 160rpx);
				height: 100%;
				background: #ffffff;

				.cate-adv {
					width: 544rpx;
					height: 220rpx;
					margin: 0 auto;
					padding-bottom: 30rpx;
					display: block;
				}
				
				.search-box{
					padding-bottom: 30rpx;
				}

				.three-two-cate {
					width: 100%;
					padding: 0 20rpx 30rpx;
					box-sizing: border-box;
					line-height: 1;
					white-space: nowrap;

					.three-two-cate-item {
						display: inline-block;
						padding: 0 30rpx;
						box-sizing: border-box;
						height: 50rpx;
						line-height: 50rpx;
						margin-right: 20rpx;
						border: 1rpx solid #e0e0e0;
						color: #8a8a8a;
						border-radius: 45rpx;
						box-sizing: border-box;
						font-size: $ns-font-size-base;
					}

					.three-two-cate-item.active {
						border: 1rpx solid #ffffff;
					}
				}

				.twoScroll-goods {
					border-radius: 15rpx;
					padding-bottom: 30px;

					.twoScroll-goods-title {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 60rpx;
						padding: 0 $ns-padding;
						box-sizing: border-box;

						.more {
							color: $ns-text-color-gray;
						}

						.iconfont {
							color: $ns-text-color-gray;
						}
					}
					.twoScroll-item:first-of-type .twoScroll-item-box{
						border-top: none;
					}
					.twoScroll-item {
						width: 100%;
						padding: 0 $ns-padding;
						box-sizing: border-box;
						
						.twoScroll-item-box {
							width: 100%;
							height: 100%;
							padding: 30rpx 0;
							box-sizing: border-box;
							display: flex;
							align-items: center;
							border-top: 1rpx solid #F1F1F1;
					
							.twoScroll-item-image {
								width: 155rpx;
								height: 155rpx;
								border-radius: 10rpx;
								// border: 2rpx solid rgba(241,241,241,1);
								box-sizing: border-box;
								image{
									width: 151rpx;
									height: 151rpx;
									border-radius: 20rpx;
								}
								
							}
					
							.goods_detail {
								width: calc(100% - 157rpx);
								min-height: 155rpx;
								padding-left: $ns-padding;
								box-sizing: border-box;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
					
								.goods_name {
									font-size: $ns-font-size-base;
					
									text {
										line-height: 1.3;
									}
								}
					
								.goods_price {
									margin-top: 10rpx;
									position: relative;
									line-height: 1.2;
									image {
										width: 56rpx;
										height: 22rpx;
										margin-left: 6rpx;
										display: block;
									}
									.goods_price_content > view{
										line-height: 1.3;
										display: flex;
										align-items: center;
									}
									
									.careBox{
										position: absolute;
										bottom: 0;
										right: 0;
										height: 52rpx;
										display: flex;
										justify-content: center;
										align-items: center;
										border-radius: 50%;
										padding: 10rpx 10rpx 4rpx 10rpx;
										box-sizing: border-box;
									}
									.careBox input{
										font-size: 26rpx;
										width:60rpx;
										padding: 0 10rpx;
										box-sizing: border-box;
										text-align: center;
									}
									.careBox .iconfont {
										font-size: 36rpx;
									}
									.careBox_more{
										position: absolute;
										right: 0;
										bottom: 0;
										display: flex;
										justify-content: center;
										align-items: center;
										box-sizing: border-box;
										color:#fff;
										border-radius: 44rpx;
										width: 86rpx;
										height: 40rpx;
										padding: 0 6rpx;
										font-size: $ns-font-size-sm;
										text{
											line-height: 1;
										}
									}
								}
							}
						}
					}
				}
			}
		}


		.category-cate {
			width: 100%;
			height: 100%;
			display: flex;

			.oneScroll {
				width: 160rpx;
				height: 100%;
				background: #f1f1f1;

				.oneScroll-item {
					width: 100%;
					padding: 10rpx $ns-padding;
					box-sizing: border-box;
					font-size: $ns-font-size-base;
					text-align: center;
					height: 100rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					text {
						line-height: 1.3;
					}
				}

				.oneScroll-item.active {
					background: #ffffff;
					position: relative;
				}

				.oneScroll-item.active:before {
					content: '';
					display: inline-block;
					width: 8rpx;
					height: 68rpx;
					position: absolute;
					left: 0;
					top: 16rpx;
					border-radius: 8rpx;
				}

			}

			.twoScroll {
				width: calc(100% - 160rpx);
				height: 100%;
				box-sizing: border-box;
				background: #ffffff;

				.cate-adv {
					width: 544rpx;
					height: 270rpx;
					margin: 0 auto;
					display: block;
				}
				.category-cate-content{
					width: 100%;
					padding: 0 $ns-padding;
					box-sizing: border-box;
				}
				.twoScroll-cate{
					padding-bottom: 30px;
				}
				.twoScroll-item {
					display: inline-block;
					margin: 12rpx 32rpx 12rpx 0;
				
					.twoScroll-item-box {
						width: 162rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						text-align: center;
						padding: 0 $ns-padding;
						box-sizing: border-box;
						border-radius: $ns-border-radius;
						overflow: hidden;
				
						text {
							display: inline-block;
							box-sizing: border-box;
							width: 100%;
							font-size: $ns-font-size-base;
						}
				
						.twoScroll-item-image {
							width: 130rpx;
							height: 130rpx;
							margin: 10rpx 0;
						}
				
						.cate-name {
							background: #f1f1f1;
						}
					}
					.twoScroll-item-box1 {
						width: 153rpx;
						height: 50rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						text-align: center;
						overflow: hidden;
						font-size: $ns-font-size-base;
						background: rgba(241,241,241,1);
						padding: 0 $ns-padding;
						box-sizing: border-box;
						text {
							display: inline-block;
							box-sizing: border-box;
							width: 100%;
							color: #000000;
							line-height: 1;
						}
					}
				}
				.twoScroll-item1 {
					display: inline-block;
					margin: 12rpx 46rpx 20rpx 0;
				
					.twoScroll-item-box1 {
						width: 153rpx;
						height: 50rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						text-align: center;
						overflow: hidden;
						font-size: $ns-font-size-base;
						background: rgba(241,241,241,1);
						padding: 0 $ns-padding;
						box-sizing: border-box;
						text {
							display: inline-block;
							box-sizing: border-box;
							width: 100%;
							color: #000000;
							line-height: 1;
						}
					}
				}
				
				
				.twoScroll-item:nth-child(3n) {
					margin-right: 0;
				}
				.twoScroll-item1:nth-child(3n) {
					margin-right: 0;
				}
			}
		}
	}

	//isBgccc
	.isBgccc {
		background: #f1f1f1 !important;
	}

	//是否为限时折扣
	.is_discount {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: $ns-margin;
		margin-top: 8rpx;
		padding: 0 8rpx;
		line-height: 30rpx;
		height: 30rpx;
		box-sizing: border-box;
		border: 2rpx solid;
		text-align: center;
		font-size: 20rpx;
		border-radius: 2rpx;
		width: 116rpx;
		text{
			line-height: 1;
		}
	}

	/* 上拉加载区域 */
	.mescroll-upwarp {}

	.no-more {
		width: 100%;
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: $ns-text-color-gray;
		padding-bottom: 100rpx;
		padding-top: $ns-padding;
	}

	.empty-box {
		width: 100%;
		height: 400rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	// sku弹出按钮
	.iconadd1{
		padding: 6rpx;
		border-radius: 50%;
		color: #fff;
		font-size: $ns-font-size-base;
	}
	.buy-num{
		font-size: 20rpx;
	}
</style>
