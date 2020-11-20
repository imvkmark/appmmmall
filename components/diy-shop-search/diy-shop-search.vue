<template>
	<view>
		<view class="search-box">
			<view class="search-content" :style="{ backgroundColor: '#F4F4F4' }">
				<input type="text" class="uni-input ns-font-size-base" maxlength="50" placeholder="店内商品搜索" v-model="searchText"
				 confirm-type="search" @confirm="search()" />
				<text class="iconfont iconIcon_search" @click="search()"></text>
			</view>
		</view>
	</view>
</template>

<script>
	// 搜索
	export default {
		name: 'diy-shop-search',
		props: {
			value: {
				type: Object,
				default: () => {
					return {};
				}
			},
			siteId: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				searchText: ''
			};
		},
		created() {},
		methods: {
			search() {
				if (this.searchText.length == 0) {
					this.$util.showToast({
						title: '请输入要搜索的内容'
					});
					return;
				}
				this.$util.redirectTo('/otherpages/shop/list/list', {
					keyword: this.searchText,
					site_id: this.siteId
				});
			}
		}
	};
</script>

<style>
	.search-content {
		border-radius: 40rpx;
	}

	.search-box {
		position: relative;
		padding: 20rpx;
		background: #fff;
	}

	.search-box input {
		display: block;
		height: 80rpx;
		width: 590rpx;
		padding: 0 20rpx 0 40rpx;
		background: #f4f4f4;
		color: #333333;
		border-radius: 40rpx;
	}

	.search-box .iconfont {
		position: absolute;
		top: 50%;
		right: 40rpx;
		transform: translateY(-50%);
		font-size: 40rpx;
		z-index: 10;
		color: #89899a;
		width: 80rpx;
		text-align: center;
	}
</style>
