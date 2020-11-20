<template>
	<view class="ns-search-box">
		<view class="search-content">
			<input type="text" class="uni-input ns-font-size-base" maxlength="50" placeholder="商品搜索" v-model="searchText"
			 confirm-type="search" @confirm="search()" disabled="true" @click="search()"/>
			<text class="iconfont iconIcon_search" @click="search()"></text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ns-search',
		props: {
			value: {
				type: Object,
				default: () => {
					return {};
				}
			}
		},
		data() {
			return {
				searchText: ''
			};
		},
		methods: {
			search() {
				this.$util.redirectTo('/otherpages/goods/search/search');
			}
		}
	}
</script>

<style lang="scss">
	.ns-search-box {
		position: relative;
		padding: 20rpx;
		// background: #fff;
		display: flex;
		align-items: center;
		
		.location {
			height: 80rpx;
			line-height: 80rpx;
			padding-right: 10rpx;
			font-weight: 600;
		}
		
		.location .iconiconangledown {
			display: inline-block;
			font-weight: bold;
			font-size: 32rpx;
		}
		
		.search-add {
			padding: 0 10rpx;
			display: flex;
			align-items: center;
			margin-right: 20rpx;
			text {
				padding: 0 5rpx;
			}
		}
		
		.search-content {
			position: relative;
			height: 78rpx;
			border-radius: 40rpx;
			flex: 1;
			background-color: #f4f4f4;
		}
		
		.search-content input {
			box-sizing: border-box;
			display: block;
			height: 79rpx;
			width: 100%;
			padding: 0 20rpx 0 40rpx;
			background: #f4f4f4;
			color: #333333;
			border-radius: 40rpx;
		}
		
		.search-content .iconfont {
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
	}
</style>
