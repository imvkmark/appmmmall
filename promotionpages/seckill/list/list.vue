<template>
	<view :class="themeStyle">
		<view v-show="show">
			<mescroll-uni @getData="getData" refs="mescroll" :size="10" v-if="seckillId && addonIsExit.seckill" @scroll="scroll">
				<block slot="list">
					<ns-adv keyword="NS_SECKILL"></ns-adv>
					<scroll-view class="seckil-nav" scroll-with-animation :scroll-into-view="'a' + seckillId" :scroll-x="true">
						<!-- active 是选中之后的样式 -->
						<view class="nav-item" :id="'a' + item.seckill_id" :class="seckillId == item.seckill_id ? 'active ns-bg-color' : ''"
						 v-for="(item, key) in timeList" :key="key" @click="ontabtap(item.seckill_id, key)">
							<view class="nav-item-con">
								<text class="nav-title">{{ item.name }}</text>
								<text class="nav-content" :class="seckillId == item.seckill_id ? 'ns-bg-color' : ''" v-if="key > index">敬请期待</text>
								<text class="nav-content" :class="seckillId == item.seckill_id ? 'ns-bg-color' : ''" v-if="key == index && !item.isNow">即将开始</text>
								<text class="nav-content" :class="seckillId == item.seckill_id ? 'ns-bg-color' : ''" v-if="key == index && item.isNow">抢购中</text>
								<text class="nav-content" :class="seckillId == item.seckill_id ? 'ns-bg-color' : ''" v-if="key < index">已结束</text>
							</view>
						</view>
					</scroll-view>
					<view class="seckill-goods" v-if="dataList.length">
						<view class="goods-item" v-for="(item, key) in dataList" :key="key" @click="toGoodsDetail(item.id, seckillIndex == index && timeList[index].isNow)">
							<view class="goods-img">
								<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(key)" mode="aspectFill"></image>
							</view>
							<view class="goods-content">
								<text class="title">{{ item.sku_name }}</text>
								<view class="goods-content-info">
									<text class="del">{{ $lang('common.currencySymbol') }}{{ item.price }}</text>
									<view class="goods-content-bottom">
										<text class="present-price">
											<text class="price-title ns-text-color">秒杀价:</text>
											<text class="strong ns-text-color">{{ $lang('common.currencySymbol') }}{{ item.seckill_price }}</text>
										</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view v-if="!dataList.length">
						<ns-empty :siteId="siteId" :fixed="false"></ns-empty>
					</view>
				</block>
			</mescroll-uni>
		</view>
		<view class="big-empty" v-show="!show">
			<ns-empty text="当前活动暂未开启"></ns-empty>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>
<script>
	import list from '../public/js/list.js';
	import nsAdv from '@/components/ns-adv/ns-adv.vue';
	export default {
		components: {
			nsAdv
		},
		data() {
			return {};
		},
		onLoad(data) {
			this.siteId = parseInt(data.site_id) || 0;
		},
		onShow() {
			// 刷新多语言
			if(!this.addonIsExit.seckill){
				this.$util.showToast({
					title:'秒杀插件未安装',
					mask:true,
					duration:2000
				})
				setTimeout(()=>{
					this.$util.redirectTo('/pages/index/index/index',{},'redirectTo')
				},2000)
				return;
			}
			this.$langConfig.refresh();
			this.getTimeList();
		},
		computed: {
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			},
			addonIsExit(){
				return this.$store.state.addonIsExit
			}
		},
		mixins: [list],
		methods: {}
	};
</script>

<style lang="scss">
	.seckil-nav {
		white-space: nowrap;
		width: 100%;
		background: #ffffff;
		margin: 0;

		.nav-item {
			width: 25%;
			height: 100%;
			display: inline-block;
			line-height: 1;

			.nav-item-con {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding: 10rpx 0;

				text {
					line-height: 1.3;
				}
			}

			.nav-title {
				display: block;
				font-weight: bold;
				font-size: 28rpx;
			}

			.nav-content {
				margin-top: 10rpx;
				font-size: 24rpx;
				display: inline-block;
				padding: 3rpx 10rpx;
				border-radius: 18rpx;
			}
		}

		.nav-item.active {
			.nav-title {
				color: #FFFFFF;
			}

			.nav-content {
				color: #fff;
				margin-top: 8rpx;
			}
		}
	}

	.seckil-nav.active {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
	}

	.seckill-goods {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;


		.goods-item {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			background-color: #fff;
			border-radius: $ns-border-radius;
			width: 47%;
			margin-top: 20rpx;
			overflow: hidden;
			margin: 10rpx;
		}

		.goods-img {
			width: 100%;
			height: 350rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.goods-content {
			width: 100%;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				overflow: hidden;
				display: inline-block;
				font-size: $ns-font-size-base;
				color: #333333;
				font-weight: 400;
				line-height: 1.3;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.goods-content-info {
				width: 100%;
				padding-top: 30rpx;

				.del {
					margin-left: 8rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #ccc;
					text-decoration: line-through;
				}

				.goods-content-bottom {
					width: 100%;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;

					.present-price {
						display: flex;

						.price-title {
							font-size: $ns-font-size-sm;
						}

						.strong {
							margin-left: 2rpx;
							font-size: $ns-font-size-lg;
							padding-left: 5rpx;
						}
					}
				}
			}
		}
	}

	.empty {
		margin-top: 100rpx;
	}

	.big-empty {
		// margin-top: 300rpx;
	}

	.uni-progress-info {
		margin-left: 6rpx;
		font-size: 12px;
		color: #fff;
	}
</style>
