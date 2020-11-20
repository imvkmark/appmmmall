<template>
	<view :class="themeStyle">
		<view class="verify-container">
			<scroll-view id="tab-bar" class="verify-type" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
				<view v-for="(typeItem, typeIndex) in typeList" :key="typeIndex" class="uni-tab-item" :id="typeItem.pickup"
				 :data-current="typeIndex" @click="ontabtap">
					<text class="uni-tab-item-title" :class="type == typeIndex ? 'uni-tab-item-title-active ns-border-color ns-text-color' : ''">{{ typeItem.name }}</text>
				</view>
			</scroll-view>
		
			<swiper :current="type" class="swiper-box" style="flex: 1;" :duration="200" @change="ontabchange">
				<swiper-item class="swiper-item" :key="typeIndex" v-for="(typeItem, typeIndex) in typeList">
					<block v-if="verifyList[typeIndex] != undefined && verifyList[typeIndex].list.length > 0">
						<scroll-view scroll-y="true" class="verify-list" @scrolltolower="scrolltolower">
							<view class="item" v-for="(item, index) in verifyList[typeIndex].list" :key="index">
								<navigator hover-class="none" :url="'/otherpages/verification/detail/detail?code=' + item.verify_code">
									<view class="header">
										<view class="ns-text-color-gray">{{ $util.timeStampTurnTime(item.verify_time) }}</view>
										<view class="ns-text-color-gray align-right">核销员：{{ item.verifier_name }}</view>
									</view>
									<view class="body">
										<view class="content-item" v-for="(citem, citemIndex) in item.item_array" :key="citemIndex">
											<view class="img-wrap">
												<image :src="$util.img(citem.img)" @error="imageError(typeIndex, index, citemIndex)"></image>
											</view>
											<view class="name-wrap">
												<text class="goods-name">{{ citem.name }}</text>
											</view>
											<view class="money-wrap">
												<view class="align-right">{{ $lang('common.currencySymbol') }}{{ citem.price | abs }}</view>
												<view class="align-right ns-text-color-gray">
													<text class="iconfont iconclose"></text>
													{{ citem.num }}
												</view>
											</view>
										</view>
									</view>
								</navigator>
							</view>
						</scroll-view>
					</block>
					<block v-else>
						<view>
							<ns-empty :isIndex="!1" :text="$lang('emptyTips')"></ns-empty>
						</view>
					</block>
				</swiper-item>
			</swiper>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				scrollInto: '',
				type: 0,
				typeList: [],
				verifyList: []
			};
		},
		onLoad() {},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.getVerifyType();
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.switchTab(index);
			},
			switchTab(index) {
				if (this.type === index) {
					return;
				}
				this.type = index;
				this.scrollInto = this.typeList[index].type;
			},
			ontabchange(e) {
				let index = e.target.current || e.detail.current;
				this.switchTab(index);
			},
			getVerifyType() {
				this.$api.sendRequest({
					url: '/api/verify/getVerifyType',
					success: res => {
						if (res.code >= 0) {
							this.typeList = [];
							this.verifyList = [];
							Object.keys(res.data).forEach(key => {
								this.typeList.push({
									type: key,
									name: res.data[key].name
								});
								this.verifyList.push({
									page: 1,
									totalPage: 1,
									list: [],
									isLoading: false
								});
								this.getVerifyList(key, 1, this.typeList.length - 1);
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 获取核销记录
			 * @param {Object} type
			 * @param {Object} page
			 * @param {Object} index
			 */
			getVerifyList(type, page, index) {
				if (this.verifyList[index].isLoading || (page != 1 && page > this.verifyList[index].totalPage)) return;

				this.verifyList[index].isLoading = true;
				this.verifyList[index].loadingType = 'loading';
				this.$api.sendRequest({
					url: '/api/verify/lists',
					data: {
						verify_type: type,
						page: page
					},
					success: res => {
						this.verifyList[index].page = page;
						if (page == 1) {
							this.verifyList[index].list = [];
							uni.stopPullDownRefresh();
						}
						if (res.data.list.length) {
							res.data.list.forEach(item => {
								this.verifyList[index].list.push(item);
							});
						}
						this.verifyList[index].totalPage = res.data.page_count;
						this.verifyList[index].isLoading = false;
						this.verifyList[index].loadingType = page == this.verifyList[index].totalPage ? 'nomore' : 'more';
					}
				});
			},
			/**
			 * 滑到底部加载
			 */
			scrolltolower() {
				let index = this.type;
				this.getVerifyList(this.typeList[index].type, this.verifyList[index].page + 1, index);
			},
			/**
			 * 下拉刷新
			 */
			onPullDownRefresh() {
				let index = this.type;
				this.getVerifyList(this.typeList[index].type, 1, index);
			},
			imageError(typeIndex, index, citemIndex) {
				this.verifyList[typeIndex].list[index].item_array[citemIndex].img = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		},
		filters: {
			abs(value) {
				return Math.abs(parseFloat(value)).toFixed(2);
			}
		}
	};
</script>

<style lang="scss">
	.verify-container {
		width: 100vw;
		height: 100vh;
	}

	.align-right {
		text-align: right;
	}

	.verify-type {
		width: 100vw;
		height: 70rpx;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		background: #fff;
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		padding-bottom: 30rpx;

		.uni-tab-item {
			/* #ifndef APP-PLUS */
			display: inline-block;
			/* #endif */
			flex-wrap: nowrap;
			padding-left: 24rpx;
			padding-right: 24rpx;
		}

		.uni-tab-item-title {
			color: #555;
			font-size: 30rpx;
			display: block;
			height: 64rpx;
			line-height: 64rpx;
			border-bottom: 2px solid #fff;
			padding: 0 10rpx;
			flex-wrap: nowrap;
			/* #ifndef APP-PLUS */
			white-space: nowrap;
			/* #endif */
		}

		.uni-tab-item-title-active {
			display: block;
			height: 64rpx;
			border-bottom: 2px solid;
			padding: 0 10rpx;
		}

		::-webkit-scrollbar {
			width: 0;
			height: 0;
			color: transparent;
		}
	}

	.swiper-box {
		width: 100%;
		height: calc(100vh - 100rpx);

		.swiper-item {
			width: 100%;
			height: 100%;

			.verify-list {
				width: 100%;
				height: 100%;
			}
		}
	}

	.verify-list {
		.item {
			margin: $ns-margin;
			padding: $ns-padding;
			border-radius: $ns-border-radius;
			background: #fff;
			position: relative;

			.header {
				display: flex;

				view {
					flex: 1;
					max-width: 50%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.body {
				.content-item {
					display: flex;
					padding-top: 20rpx;

					.img-wrap {
						width: 120rpx;
						height: 120rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.name-wrap {
						flex: 1;
						padding: 0 20rpx;

						.goods-name {
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							line-height: 1.5;
							font-size: 28rpx;
						}
					}

					.money-wrap {
						.unit {
							font-weight: normal;
							font-size: 24rpx;
							margin-right: 2rpx;
						}

						.iconfont {
							line-height: 1;
							font-size: 26rpx;
						}
					}
				}
			}
		}
	}

	.empty {
		padding-top: 200rpx;
		text-align: center;

		.empty-image {
			width: 180rpx;
			height: 180rpx;
		}
	}
</style>
