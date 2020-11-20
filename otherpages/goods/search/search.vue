<template>
	<view :class="themeStyle">
		<view class="content">
			<view class="cate-search">
				<view class="search-box">
					<input class="uni-input" maxlength="50" v-model="inputValue" confirm-type="search" @focus="inputFocus" @input="inputInput"
					 @confirm="search()" :placeholder="$lang('inputPlaceholder')" />
					<text class="iconfont iconIcon_search" @click="search()"></text>
				</view>
			</view>
			<view class="search-content">
				<!-- 历史搜索 -->
				<view class="history" v-if="historyList.length">
					<view class="history-box">
						<view class="history-top">
							<view class="title ns-font-size-base">{{ $lang('history') }}</view>
							<view class="icon iconfont iconicon7" @click="deleteHistoryList"></view>
						</view>
						<view class="history-bottom">
							<view class="history-li" v-for="(item, index) in historyList" :key="index" @click="otherSearch(item)" @longtap="deleteItem(item)">
								<button type="primary" class="btn-disabled" size="mini">{{ item }}</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputValue: '', //搜索框的值
				historyList: [], //历史搜索记录
				searchList: [], //搜索发现列表
				showSearch: true, //是否展示搜索发现
				alikeList: []
			};
		},
		onLoad(options) {
			if (options.keyword) this.inputValue = options.keyword;
			uni.getStorageSync('search') ? '' : uni.setStorageSync('search', []);
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.findHistoryList();
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			//获取历史搜索记录
			findHistoryList() {
				this.historyList = uni.getStorageSync('search').reverse();
			},
			//删除所有历史记录
			deleteHistoryList() {
				uni.showModal({
					title: '提示',
					content: '确认删除全部历史记录？',
					success: res => {
						if (res.confirm) {
							uni.setStorageSync('search', []);
							this.findHistoryList();
						}
					}
				});
			},
			//删除历史记录的某一项
			deleteItem(e) {
				uni.showModal({
					title: '提示',
					content: '确认删除该条历史记录？',
					success: res => {
						if (res.confirm) {
							let array = uni.getStorageSync('search');
							let newArr = array.filter(v => {
								return v != e;
							});
							uni.setStorageSync('search', newArr);
							this.findHistoryList();
						}
					}
				});
			},
			//input框获取焦点事件
			inputFocus(e) {
				this.showScroll = false;
				if (this.inputValue.trim() != '') this.dataList = [];
			},
			//input框输入事件
			inputInput(e) {
				if (e.detail.value) {}
			},
			//点击其他列表搜索
			otherSearch(e) {
				this.inputValue = e;
				this.search();
			},
			//搜索
			search() {
				if (this.inputValue.trim() != '') {
					this.showScroll = true;

					// 对历史搜索处理,判断有无,最近搜索显示在最前
					let historyList = uni.getStorageSync('search');
					let array = [];
					if (historyList.length) {
						array = historyList.filter(v => {
							return v != this.inputValue.trim();
						});
						array.push(this.inputValue.trim());
					} else {
						array.push(this.inputValue.trim());
					}
					uni.setStorageSync('search', array);

					this.$util.redirectTo('/pages/goods/list/list', {
						keyword: this.inputValue.trim()
					});
				} else {
					this.$util.showToast({
						title: '搜索内容不能为空哦'
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		.content {
			width: 100vw;
			/* #ifdef MP */
			height: 100vh;
			/* #endif */
			/* #ifdef H5 */
			height: calc(100vh - 44px - 50px - env(safe-area-inset-bottom) - var(--status-bar-height));
			/* #endif */
			/* #ifdef APP-PLUS */
			height: calc(100vh - 44px - env(safe-area-inset-bottom));
			/* #endif */
			background: #ffffff;
		}

		.cate-search {
			width: 100%;
			height: 100rpx;
			background: #ffffff;
			padding: 10rpx $ns-padding;
			box-sizing: border-box;

			input {
				font-size: $ns-font-size-base;
				height: 60rpx;
				padding: 15rpx 25rpx 15rpx 40rpx;
				line-height: 60rpx;
				width: calc(100% - 120rpx);
			}

			text {
				font-size: 50rpx;
				color: $ns-text-color-gray;
				width: 120rpx;
				text-align: center;
			}

			.search-box {
				width: 100%;
				height: 100%;
				background: $uni-bg-color-grey;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 40rpx;
			}
		}

		.search-content {
			box-sizing: border-box;
			background: #ffffff;
		}

		.history {
			width: 100%;
			padding: 0 $ns-padding;
			margin-bottom: 20rpx;
			box-sizing: border-box;

			.history-box {
				width: 100%;
				height: 100%;
				background: #ffffff;
				border-radius: 15rpx;
				padding: 10rpx 0;
				box-sizing: border-box;
				overflow: hidden;

				.history-top {
					width: 100%;
					height: 60rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.title {
						font-weight: bold;
					}

					.iconfont {
						color: $ns-text-color-gray;
						font-size: 40rpx;
					}
				}

				.history-bottom {
					width: 100%;

					.history-li {
						display: inline-block;
						margin-right: 20rpx;
						margin-bottom: 15rpx;

						button[type='primary'] {
							line-height: 1.8;
							background: #f5f5f5 !important;
						}
					}
				}
			}

			.hidden-show {
				width: 100%;
				height: 70rpx;
				text-align: center;
				line-height: 70rpx;
			}
		}

		.search-alike {
			width: 100%;
			height: calc(100vh - 100rpx);

			padding: 0 $ns-padding;
			box-sizing: border-box;

			.alike-box {
				width: 100%;
				height: 100%;
				background: #ffffff;
				border-radius: $ns-padding;
				overflow: hidden;
			}

			.alike-li {
				width: 100%;
				height: 80rpx;
				padding: 0 $ns-padding;
				box-sizing: border-box;
				border-bottom: 2rpx solid #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.iconjiantou-copy-copy-copy {
				font-size: 40rpx;
				transform: rotate(15deg);
			}
		}
	// }
</style>
