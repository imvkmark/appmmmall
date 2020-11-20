<template>
	<view :class="themeStyle">
		<view class="content" :class="iphoneX?'active':''">
			<view class="head-wrap">
				<!-- 搜索区域 -->
				<view class="search-wrap uni-flex uni-row">
					<view class="flex-item input-wrap">
						<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()" placeholder="请输入您要搜索的店铺" />
						<text class="iconfont iconIcon_search" @click.stop="search()"></text>
					</view>
				</view>

				<!-- 排序 -->
				<view class="sort-wrap">
					<view class="comprehensive-wrap" :class="{ 'ns-text-color': orderType === '' }" @click="sortTabClick('')">
						<text :class="{ 'ns-text-color': orderType === '' }">{{ $lang('all') }}</text>
					</view>
					<view :class="{ 'ns-text-color': orderType === 'shop_sales' }" @click="sortTabClick('shop_sales')">{{ $lang('sale') }}</view>
					<view :class="{ 'ns-text-color': orderType === 'shop_desccredit' }" @click="sortTabClick('shop_desccredit')">{{ $lang('desccredit') }}</view>
				</view>
			</view>

			<mescroll-uni top="180" ref="mescroll" @getData="getShopList">
				<block slot="list">
					<view>
						<view v-if="shopList.length" class="line">

						</view>
						<view @click="jump('/otherpages/shop/index/index?site_id=' + item.site_id)" class="shop-box" v-for="(item, index) in shopList"
						 :key="index">
							<view class="avatar">
								<image v-if="item.avatar" :src="$util.img(item.avatar)" @error="imageError(index)" mode="aspectFit"></image>
								<image v-else :src="$util.getDefaultImage().default_shop_img" mode="aspectFit" />
							</view>
							<view class="shop-desc">
								<view class="name-box">
									<view class="shop-name">
										{{ item.site_name }}
									</view>
									<text class="ns-text-color-gray" style="font-size: 22rpx;">{{ $lang('distance') }}{{ item.distance|distance }}</text>
								</view>
								<view class="rate-box">
									<image class="icon-star" :src="$util.img('upload/uniapp/start.png')" mode=""></image>
									<view class="score">{{item.composite_score}}{{ $lang('score') }}</view>
								<!-- 	<view class="num">
										销量3131
									</view> -->
								</view>
								<view class="shop-content ns-text-color-gray ns-margin-top">
									<view class="shop-content-left">
										<text>{{ $lang('main') }}：{{ item.category_name }}</text><text style="margin-left: 31rpx;">有{{ item.sub_num }}人关注</text>
									</view>
									<!-- s -->
								</view>
							</view>
						</view>
						<view class="empty" v-if="!shopList.length">
							<ns-empty text="当前街上没有店铺哦"></ns-empty>
						</view>
					</view>
				</block>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
			<!-- 底部tabBar -->
			<diy-bottom-nav></diy-bottom-nav>
		</view>
	</view>

</template>

<script>
	import street from '../public/js/street.js';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	import sxRate from '@/components/sx-rate/index.vue'
	// import Map from '@/common/js/map/openMap.js'

	export default {
		components: {
			diyBottomNav,
			sxRate
		},
		data() {
			return {

			};
		},

		methods: {},
		computed: {
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			},
			starColor() {
				return this.$store.state.baseColor
			}
		},
		mixins: [street],
		filters: {
			distance(distance) {
				if (distance < 1000) return distance + 'm';
				else return (distance / 1000).toFixed(2) + 'km';
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/street.scss';

	.line {
		width: 100%;
		height: 20rpx;
		background: #f7f7f7;
	}

	.shop-box {
		width: 100%;
		height: 100%;
		padding: $ns-padding;
		box-sizing: border-box;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;


		.avatar {
			background: #ffffff;
			width: 138rpx;
			height: 138rpx;
			image {
				width: 138rpx;
				height: 138rpx;
				border-radius: 10rpx;
				border: 1rpx solid #e5e5e5;
			}
		}

		.shop-desc {
			width: calc(100% - 150rpx - 20rpx);

			.name-box {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;

				.iconfont {
					font-size: 32rpx;
					line-height: 1;
				}
			}

			.rate-box {
				height: 40rpx;
				display: flex;
				align-items: center;

				.icon-star {
					width: 21rpx;
					height: 20rpx;
				}

				.score {
					display: inline-block;
					margin-left: 2rpx;
					color: #383838;
					line-height: 1;
					font-size: 20rpx;
				}

				.num {
					color: #838383;
					font-size: 20rpx;
					margin-left: 20rpx;
				}
			}

			.shop-content {
				display: flex;
				justify-content: space-between;
				
				.shop-content-left{
					font-size: 20rpx;
				}

				.info-follow {
					padding: 5rpx 20rpx;
					border-radius: 40rpx;
					font-size: 20rpx;
					text-align: center;
					line-height: 30rpx;
					border: 1rpx solid;
				}
			}

			.shop-name {
				width: 70%;
				line-height: 1.3;
				margin-bottom: 12rpx;
				font-size: $ns-font-size-base;
				font-size: 30rpx;
				font-weight: 600;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.shop-address {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 5rpx;

				.shop-address-desc {
					width: 70%;
					line-height: 1.3;
				}

				.iconfont {
					font-size: 40rpx;
					line-height: 1;
					margin-top: -30rpx;
				}
			}
		}
	}
</style>

<style lang="scss">
	/deep/ .uni-scroll-view-content {
		background: #ffffff;
	}

	.content /deep/ .mescroll-upwarp {
		padding-bottom: 150rpx;
		background: #ffffff;
	}

	.content.active /deep/ .mescroll-upwarp {
		padding-bottom: 220rpx;
		background: #ffffff;
	}
</style>
