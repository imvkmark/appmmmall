<template>
	<view class="newAll newpage" :class="isSafari?'active':''" :style="{height: bottom +'px',boxSizing: 'border-box'}">
		<view class="newPage-box3" v-if="cateList.length">
			<view class="category-cate" v-if="type!=3">
				<scroll-view scroll-y="true" class="oneScroll">
					<view class="oneScroll-item" v-for="(item,index) in cateList" :key="index" :class="{'active ns-text-color ns-bg-before' : item.category_id_1 ==oneCategoryId}"
					 @click="selectOneCategory(item.category_id_1,index)">
						<text class="max-font-2">{{item.short_name?item.short_name:item.category_name}}</text>
					</view>
				</scroll-view>
				<view class="twoScroll">
					<view class="category-cate-top">
						<nsSearch></nsSearch>
						<image class="cate-adv" v-if="categoryAdvImage" :src="$util.img(categoryAdvImage)" @error="categoryAdvImage=$util.img('/upload/uniapp/default_ad.png')"
						 mode=""></image>
					</view>
					<scroll-view scroll-y="true" :style="{
						height: 'calc(100% - ' + height + ' )'
					}">
						<view class="twoScroll-cate">
							<view class="cate-right-box" v-if="twoCateList" v-for="(item, index) in twoCateList" :key="index" >
								<view class="title" @click="toListDetail(item.category_id_2,item.level)">
									<text>{{item.category_name}}</text>
									<view class="ns-text-color-gary ns-font-size-sm more">
										更多
										<text class="iconfont iconright ns-text-color-gary ns-font-size-sm"></text>
									</view>
								</view>
								<view class="cate-goods-list" v-if="type==2">
									<view class="cate-goods-li" v-for="(i, j) in item.child_list" :key="j" @click="toListDetail(i.category_id_3,i.level)">
										<block >
											<image v-if="i.image" class="goods-pic ns-margin-bottom" :src="$util.img(i.image)" @error="threeCateImageError(index,j)"
											 mode="aspectFill"></image>
											<image v-else class="goods-pic  ns-margin-bottom" :src="$util.getDefaultImage().default_goods_img" mode="aspectFill"></image>
										</block>
										<view class="goods-name max-font-1" :class="type==1?'isBgccc':''">{{i.category_name}}</view>
									</view>
								</view>
								
								<view class="cate-goods-list" v-if="type==1">
									<view class="cate-goods-li2" v-for="(i, j) in item.child_list" :key="j" @click="toListDetail(i.category_id_3,i.level)">
										<view class="goods-name max-font-1">{{i.category_name}}</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<view class="category-goods" v-if="type==3">
				<scroll-view scroll-y="true" class="oneScroll">
					<view class="oneScroll-item" v-for="(item,index) in cateList" :key="index" :class="{'active ns-text-color ns-bg-before' : item.category_id_1 ==oneCategoryId}"
					 @click="selectOneCategory(item.category_id_1,index)">
						<text class="max-font-2">{{item.short_name?item.short_name:item.category_name}}</text>
					</view>
				
				</scroll-view>
				<view class="twoScroll">
					<view class="category-cate-top">
						<nsSearch v-if="type == 3"></nsSearch>
						<image class="cate-adv" v-if="categoryAdvImage" :src="$util.img(categoryAdvImage)" @error="categoryAdvImage=$util.img('/upload/uniapp/default_ad.png')"
						 mode=""></image>
						<scroll-view v-if="twoCateList.length" scroll-x="true" class="three-two-cate">
							<view class="three-two-cate-item max-font-1" :class="index==TwoCategoryIndex?'active ns-border-color ns-text-color':''" v-for="(item,index) in twoCateList"
							 :key="index" @click="selectTwoCategory(item.category_id_2,index)">
								{{item.category_name}}
							</view>
						</scroll-view>
						<view class="empty-box" v-else>
							<ns-empty :isIndex="!1" :fixed="!1"></ns-empty>
						</view>
					</view>
					<scroll-view scroll-y="true" @scrolltolower="pullRefresh" v-if="twoCateList.length>0" class="category-cate-concent" :style="{
						height: 'calc(100% - ' + height + ' )'
					}">
						<block v-if="threeCateList">
						<view class="twoScroll-goods-box">
							<view class="twoScroll-goods" v-for="(item, index) in threeCateList"
							 :key="index">
								<view class="twoScroll-goods-title" @click="toListDetail(item.category_id_3,item.level)">
									<view class="ns-font-size-base">
										{{item.category_name}}
									</view>
									<view class="ns-text-color-gary ns-font-size-sm more">
										更多
										<text class="iconfont iconright ns-text-color-gary ns-font-size-sm"></text>
									</view>
								</view>
								<view>         
									<view class="twoScroll-item" v-for="(i,j) in item.goods_list" :key="j" v-if="item.goods_list">
										<view class="twoScroll-item-box">
											<view class="twoScroll-item-image" @click="toDetail(i.sku_id)">
												<image class="" :src="$util.img(i.sku_image, { size: 'mid' })" @error="threeGoodsImageError(index,j)" mode="aspectFill" />
											</view>
											
											<view class="goods_detail">
												<view @click="toDetail(i.sku_id)">
													<view class="goods_name">
														<text class="max-font-2">{{i.goods_name}}</text>
													</view>
													<view class="is_discount ns-border-color ns-gradient-diy-goods-list ns-text-color" :class="themeStyle" v-if="i.promotion_type == 1  && addonIsExit.discount">
														<text>限时折扣</text>
													</view>
												</view>
									
												<view class="goods_price ns-text-color">
													<view class="goods_price_content">
														<view class="ns-font-size-sm">
															<text class="ns-text-color-gray">{{i.sale_num}}人付款</text>
														</view>
														<view class="ns-font-size-sm">
															<text class="ns-font-size-x-lg ns-text-color">￥{{price(i)}}</text>
															<image v-if="priceLogo(i) == 'discount_price'" :src="$util.img('upload/uniapp/index/discount.png')"></image>
															<image v-else-if="priceLogo(i) == 'member_price'" :src="$util.img('upload/uniapp/index/VIP.png')"></image>
														</view>
													</view>
												
													
													<view :class="i.goods_spec_format?'careBox_more ns-bg-color':'careBox'" v-if="i.is_virtual == 0 ">
														<text class="iconfont iconjianshao ns-text-color" v-if="!i.goods_spec_format && i.num>0" @click.stop="cartNumChange('minus',i.num,i.cart_id,i.sku_id,i.site_id)"></text>
														<input class="" disabled="true" :value="i.num" v-if="!i.goods_spec_format && i.num>0"/>
														<text class="iconfont iconadd-fill ns-text-color" @click.stop="cartNumChange('add',i.num,i.cart_id,i.sku_id,i.site_id)" v-if="!i.goods_spec_format"></text>
														<text class="" @click.stop="getGoodsSkuDetail(i.sku_id)" v-else>选规格</text>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- <view class="loading-box" v-if="isShow">
							<ns-loading></ns-loading>
						</view> -->
						</block>
						<!-- 空 -->
						<view class="empty-box" v-if="!threeCateList.length">
							<ns-empty :isIndex="!1" :fixed="!1"></ns-empty>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- <ns-goods-sku ref="goodsSku" :goods-detail="goodsSkuDetail" @refresh="refreshGoodsSkuDetail"></ns-goods-sku> -->
		<ns-goods-sku-new ref="goodSkuNew" @refresh="refreshGoodsSkuDetail"></ns-goods-sku-new>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
	import category from "@/components/diy-goods-level-category/diy-goods-level-category.js"
	import nsSearch from '@/components/ns-search/ns-search.vue'
	import nsGoodsSkuNew from '@/components/ns-goods-sku/ns-goods-sku-new.vue';
	import nsLoading from '@/components/ns-loading/ns-loading.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		name: "diy-goods-level-three",
		data() {
			return {
				list: [],
				isShow: false,
				somehowSwitch: false,
			}
		},
		mixins: [category,globalConfig],
		components: {
			nsGoodsSkuNew,
			nsSearch,
			nsLoading
		},
		onLoad() {
			this.getHeight();
		},
		methods:{
			pullRefresh() {
				this.isShow = true;
				setTimeout(()=>{
					this.isShow = false;
				},600)
			},
			directionSwitch(){
				this.somehowSwitch = !this.somehowSwitch;
			},
			a(){
				return 111
			}
		}
		
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
		font-size: $ns-font-size-sm;
	}
	.newpage{
		width: 100%;
		/* #ifdef H5 || APP-PLUS */
		height: calc(100vh - 100px);
		height: -webkit-calc(100vh - 100px);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		height: calc(100vh - 56px);
		height: -webkit-calc(100vh - 56px);
		/* #endif */
	}
	.newpage.active{
		// height: calc(100vh - 175px);
	}
	
	.category-cate{
		.search-box{
			padding: 20rpx 0 30rpx;
			padding-bottom: 30rpx;
		}
		.cate-adv{
			padding-bottom: 30rpx;
			height: 220rpx;
		}
	}

	.newPage-box3 {
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
					padding: 0 10rpx;
					box-sizing: border-box;
					font-size: 26rpx;
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
					height: 220rpx;
					display: block;
					margin: 0 auto;
					padding-bottom: 30rpx;
				}

				.three-two-cate {
					width: 100%;
					line-height: 1;
					white-space: nowrap;
					padding-bottom: 30rpx;

					.three-two-cate-item {
						display: inline-block;
						min-width: 112rpx;
						padding: 0 10rpx;
						box-sizing: border-box;
						height: 50rpx;
						line-height: 50rpx;
						margin-right: 18rpx;
						border: 2rpx solid #e0e0e0;
						color: #8a8a8a;
						border-radius: 50rpx;
						box-sizing: border-box;
						text-align: center;
						font-size: $ns-font-size-base;
					}

					.three-two-cate-item.active {
						border: 2rpx solid #ffffff;
					}
				}
				.category-cate-top{
					padding: 0 24rpx;
					box-sizing: border-box;
				}
				.search-box{
					padding:0;
					margin-top: 20rpx;
					padding-bottom: 30rpx;
				}
				.search-box .search-content .iconfont{
					right: 20rpx;
				}
				
				.category-cate-concent{
					box-sizing: border-box;
				}
				.twoScroll-goods-box{
					padding-bottom: 30px;
				}
				.twoScroll-goods {
					margin-top: 40rpx;
					padding: 0 22rpx;
					&:first-of-type{
						margin-top: 0;
					}

					.twoScroll-goods-title {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						box-sizing: border-box;

						.more {
							color: #8A8A8A;
						}

						.iconfont {
							color: #8A8A8A;
						}
					}
					.twoScroll-item:first-of-type .twoScroll-item-box{
						border-top: none;
					}
					.twoScroll-item {
						width: 100%;
						box-sizing: border-box;
					
						.twoScroll-item-box {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 100%;
							height: 100%;
							padding: 30rpx 0;
							box-sizing: border-box;
							display: flex;
							border-top: 1rpx solid #f4f4f4;
					
							.twoScroll-item-image {
								width: 154rpx;
								height: 160rpx;
								border-radius: 10rpx;
								// border: 2rpx solid rgba(241,241,241,1);
								box-sizing: border-box;
								image{
									width: 154rpx;
									height: 160rpx;
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
					font-size: 26rpx;
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
					height: 220rpx;
					margin: 0 auto;
					display: block;
				}
				.category-cate-top{
					padding: 0 $ns-padding;
					box-sizing: border-box;
				}
				.twoScroll-cate{
					padding-bottom: 30px;
				}
				.cate-right-box {
					width: 100%;
					background: #ffffff;
					overflow: hidden;
					margin-top: 30rpx;
					padding: 0 22rpx;
					box-sizing: border-box;
					border-radius: $ns-border-radius;
					&:first-of-type{
						margin-top: 20rpx;
					}
					.title {
						width: 100%;
						height: 56rpx;
						font-size: $ns-font-size-base;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-weight: 500;
						line-height: 1;

						.more {
							color: #8A8A8A;
							font-size: $ns-font-size-sm;
							line-height: 1;
						}

						.iconfont {
							color: #8A8A8A;
							font-size: $ns-font-size-sm;
						}
					}

					.cate-goods-list {
						display: flex;
						flex-wrap: wrap;
						padding: 0 12rpx;
						background: #ffffff;
						border-radius: 15rpx;
					}

					.cate-goods-li {
						width: 154rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						margin: 12rpx 30rpx 12rpx 0;

						.goods-pic {
							width: 128rpx;
							height: 128rpx;
						}

						.goods-name {
							width: 100%;
							height: 45rpx;
							text-align: center;
							line-height: 45rpx;
							font-size: $ns-font-size-base;
							box-sizing: border-box;
						}
					}
					.cate-goods-li2 {
						width: 154rpx;
						height: 50rpx;
						display: flex;
						justify-content: center;
						font-size: $ns-font-size-base;
						align-items: center;
						margin: 12rpx 30rpx 20rpx 0;
						background: #f1f1f1;
						color: #000000;
					
						.goods-pic {
							width: 128rpx;
							height: 128rpx;
						}
					
						.goods-name {
							line-height: 1;
							font-size: $ns-font-size-base;
							padding: 0 12rpx;
						}
					}

					.cate-goods-li:nth-child(3n) {
						margin-right: 0;
					}
					.cate-goods-li2:nth-child(3n) {
						margin-right: 0;
					}
				}
			}

		}
	}

	
	.loading-box{
		height: 50px;
	}

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
	.mescroll-upwarp {
		min-height: 60rpx;
		padding: 30rpx 0;
		text-align: center;
		clear: both;
		margin-bottom: 20rpx;
	}

	/*提示文本 */
	.mescroll-upwarp .upwarp-tip,
	.mescroll-upwarp .upwarp-nodata {
		display: inline-block;
		font-size: $ns-font-size-lg;
		color: #b1b1b1;
		vertical-align: middle;
	}

	.mescroll-upwarp .upwarp-tip {
		margin-left: 16rpx;
	}

	/*旋转进度条 */
	.mescroll-upwarp .upwarp-progress {
		display: inline-block;
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		border: 2rpx solid #b1b1b1;
		border-bottom-color: transparent;
		vertical-align: middle;
	}

	/* 旋转动画 */
	.mescroll-upwarp .mescroll-rotate {
		animation: mescrollUpRotate 0.6s linear infinite;
	}

	@keyframes mescrollUpRotate {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.no-more {
		width: 100%;
		height: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: $ns-text-color-gray;
		padding-bottom: 100rpx;
	}

	.empty-box {
		// padding-top: 200rpx;
		// box-sizing: border-box;
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
		font-size:  20rpx;;
	}
</style>
