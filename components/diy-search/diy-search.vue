<template>
	<view class="diy-search">
		<view class="search-box" :style="{backgroundColor: value.backgroundColor}">
			<view class="location" @click="$util.redirectTo('/otherpages/index/city/city')" v-if="city.length">
				<text>{{ city }}</text>
				<text class="iconfont iconiconangledown"></text>
			</view>	
			<view class="search-content" :style="{ backgroundColor: '#F4F4F4' }" @click="search()">
				<input
					type="text"
					class="uni-input ns-font-size-base"
					maxlength="50"
					placeholder="商品搜索"
					v-model="searchText"
					confirm-type="search"
					@confirm="search()"
					disabled="true"
				/>
				<text class="iconfont iconIcon_search" @click="search()"></text>
			</view>
		</view>
	</view>
</template>

<script>
// 搜索
export default {
	name: 'diy-search',
	props: {
		value: {
			type: Object,
			default: () => {
				return {};
			}
		},
		city: {
			type: String,
			value: ''
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			searchText: '',
			cityAddon: 0
		};
	},
	created() {
	},
	methods: {
		search() {
			this.$util.redirectTo('/otherpages/goods/search/search');
		}
	}
};
</script>

<style lang="scss">
.diy-search{
	.search-box {
		position: relative;
		padding: 20rpx;
		display: flex;
	}
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
	.search-content {
		border-radius: 40rpx;
		flex: 1;
	}
	.search-content input {
		box-sizing: border-box;
		display: block;
		height: 80rpx;
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
