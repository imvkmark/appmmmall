<template>
	<view class="topic-detail" :style="{ backgroundColor: bgColor }" :class="themeStyle">
		<mescroll-uni @getData="getData" refs="mescroll" :size="10">
			<block slot="list">
				<view class="topic-pic" v-if="topicAdv">
					<image :src="$util.img(topicAdv)" mode="widthFix"></image>
				</view>
				<view class="goods-list" v-if="dataList.length">
					<navigator hover-class="none" :url="'/promotionpages/topics/goods_detail/goods_detail?id=' + item.id" class="goods-item"
					 v-for="(item, index) in dataList" :key="index">
						<view class="item-img">
							<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="aspectFit"></image>
						</view>
						<view class="item-content">{{ item.sku_name }}</view>
						<view class="item-price ns-text-color">{{ $lang('common.currencySymbol') }}{{ item.topic_price }}</view>
					</navigator>
				</view>
				<view v-if="!dataList.length">
					<ns-empty text="没有找到相应的商品..."></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				topicId: 0,
				bgColor: '#ffffff',
				topicAdv: ''
			};
		},
		onLoad(options) {
			if (options.topic_id) {
				this.topicId = options.topic_id;
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		computed:{
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/topic/api/topicgoods/page',
					data: {
						topic_id: this.topicId,
						page_size: mescroll.size,
						page: mescroll.num
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							this.topicAdv = res.data.topic_adv;
							this.bgColor = res.data.bg_color;
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			imageError(index) {
				this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		},
		onShareAppMessage(res) {
			var title = '活动多多，优惠多多哦';
			var path = '/promotionpages/topics/detail/detail?topic_id=' + this.topicId;
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss">
	.topic-detail {
		//#ifdef H5
		height: calc(100vh - 44px);
		//#endif
		height: 100vh;
	}

	.topic-pic {
		image {
			width: 100%;
		}
	}

	.goods-list {
		display: flex;
		flex-wrap: wrap;
		margin: 30rpx;

		.goods-item {
			overflow: hidden;
			margin-bottom: 20rpx;
			width: 330rpx;
			height: 420rpx;
			background-color: #fff;
			border-radius: 20rpx;
			padding-top: $ns-padding;

			.item-img {
				margin-bottom: 10rpx;
				height: 290rpx;

				image {
					width: 330rpx;
					height: 290rpx;
				}
			}

			.item-content {
				padding: 0 20rpx;
				line-height: 1.2;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.item-price {
				padding: 0 20rpx;
				height: 34rpx;
				line-height: 34rpx;
				margin-top: 10rpx;
			}
		}

		.goods-item:nth-child(2n) {
			margin-left: auto;
		}
	}
</style>
