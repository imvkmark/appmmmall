<template>
	<view :class="themeStyle">
		<view class="goods-evaluate">
			<mescroll-uni ref="mescroll" @getData="getGoodsEvaluate">
				<block slot="list">
					<view class="evaluate-item" v-for="(item, index) in list" :key="index">
						<view class="evaluator">
							<view class="evaluator-face">
								<image v-if="item.member_headimg" :src="$util.img(item.member_headimg)" @error="imageError(index)" mode="aspectFill" />
								<image v-else :src="$util.getDefaultImage().default_headimg" mode="aspectFill" />
							</view>
							<text class="evaluator-name">{{ item.member_name }}</text>
						</view>
						<view class="cont">{{ item.content }}</view>
						<view class="evaluate-img" v-if="item.images">
							<view class="img-box" v-for="(img, img_index) in item.images" :key="img_index" @click="previewEvaluate(index, img_index, 'images')">
								<image :src="$util.img(img)" mode="aspectFit" />
							</view>
						</view>
						<view class="time">
							<text>{{ $util.timeStampTurnTime(item.create_time) }}</text>
							<text>{{ item.sku_name }}</text>
						</view>

						<view class="evaluation-reply ns-text-color" v-if="item.explain_first != ''">店家回复：{{ item.explain_first }}</view>

						<template v-if="item.again_content != ''">
							<view class="review-evaluation">
								追加评价
								<text class="review-time ns-text-color-gray">{{ $util.timeStampTurnTime(item.again_time) }}</text>
							</view>
							<view class="cont">{{ item.again_content }}</view>
							<view class="evaluate-img" v-if="item.again_images.length > 0">
								<view class="img-box" v-for="(again_img, again_index) in item.again_images" :key="again_index" @click="previewEvaluate(index, again_index, 'again_images')">
									<image :src="$util.img(again_img)" mode="aspectFit" />
								</view>
							</view>
							<view class="evaluation-reply" v-if="item.again_explain != ''">店家回复：{{ item.again_explain }}</view>
						</template>
					</view>
					<view v-if="list.length == 0">
						<ns-empty></ns-empty>
					</view>
				</block>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				goodsId: 0,
				list: []
			};
		},
		onLoad(data) {
			this.goodsId = data.goods_id || 0;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			getGoodsEvaluate(mescroll) {
				this.$api.sendRequest({
					url: '/api/goodsevaluate/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						goods_id: this.goodsId
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}

						for (var i = 0; i < newArr.length; i++) {
							if (newArr[i].images) newArr[i].images = newArr[i].images.split(',');
							if (newArr[i].again_images) newArr[i].again_images = newArr[i].again_images.split(',');
							if (newArr[i].is_anonymous == 1)
								newArr[i].member_name = newArr[i].member_name.replace(newArr[i].member_name.substring(1, newArr[i].member_name
									.length - 1), '***');
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},

			// 预览评价图片
			previewEvaluate(index, img_index, field) {
				var paths = [];
				for (let i = 0; i < this.list[index][field].length; i++) {
					paths.push(this.$util.img(this.list[index][field][i]));
				}
				uni.previewImage({
					current: img_index,
					urls: paths
				});
			},
			imageError(index) {
				this.list[index].member_headimg = this.$util.getDefaultImage().default_headimg;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		.goods-evaluate {
			.evaluate-item {
				padding: 20rpx;
				background: #fff;
				margin-bottom: 20rpx;

				.evaluator {
					display: flex;
					align-items: center;

					.evaluator-face {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.evaluator-name {
						margin-left: 20rpx;
						color: #999;
					}
				}

				.cont {
					text-align: justify;
					display: -webkit-box;
					word-break: break-all;
				}

				.evaluate-img {
					display: inline-flex;

					.img-box {
						width: 100rpx;
						height: 100rpx;
						overflow: hidden;
						margin: 0 20rpx 20rpx 0;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}

				.time {
					color: #999;

					text {
						margin-right: 20rpx;
					}
				}

				.evaluation-reply {
					margin-top: 10rpx;
					font-size: $ns-font-size-sm;
				}

				.review-evaluation {
					margin-top: 20rpx;

					.review-time {
						overflow: hidden;
						float: right;
					}
				}
			}
		}
	// }
</style>
