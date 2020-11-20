<template>
	<view>
		<view class="text-nav" :style="{ backgroundColor: value.backgroundColor }" v-if="value.scrollSetting=='fixed'">
			<view v-for="(item, index) in value.list" :key="index" class="text-item" :style="{ padding: padding * 2 + 'rpx' }"
			 @click="redirectTo(item.link)">
				<image v-if="item.imageUrl" :src="$util.img(item.imageUrl)" :style="{ width: value.imageScale + '%' }" mode="widthFix"></image>
				<text v-if="item.title" :style="{ color: value.textColor }">{{ item.title }}</text>
			</view>
		</view>
		<scroll-view scroll-x="true" class="text-nav-scroll" :style="{ backgroundColor: value.backgroundColor }" v-if="value.scrollSetting=='horizontal-scroll'">
			<view class="text-item-box" v-for="(item, index) in value.list" :key="index">
				<view class="text-item" :style="{ padding: padding * 2 + 'rpx' }"
				 @click="redirectTo(item.link)">
					<image v-if="item.imageUrl" :src="$util.img(item.imageUrl)" :style="{ width: value.imageScale + '%' }" mode="widthFix"></image>
					<text v-if="item.title" :style="{ color: value.textColor }">{{ item.title }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	// 图文导航
	export default {
		name: 'diy-graphic-nav',
		props: {
			value: {
				type: Object
			},
			siteId: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {};
		},
		computed: {
			padding() {
				return this.value.padding == 0 ? 8 : this.value.padding
			}
		},
		methods: {
			redirectTo(link) {
				if (this.siteId) {
					link.site_id = this.siteId;
				}
				this.$util.diyRedirectTo(link);
			}
		}
	};
</script>

<style lang="scss">
	.text-nav {
		display: flex;
		flex-wrap: wrap;
		
		.text-item {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-around;
			align-content: center;
			align-items: center;
			padding: 16rpx;
			box-sizing: border-box;
		}
		
		.text-item image {
			margin-bottom: 10rpx;
			width: 70rpx;
			height: 90rpx;
		}
		
		.text-item text {
			display: block;
			height: 50rpx;
			line-height: 50rpx;
			font-size: 24rpx;
		}
	}
	
	.text-nav-scroll {
		width: 100%;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		.text-item-box{
			width: 20%;
			display: inline-block;
		}
		 .text-item {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-content: center;
			align-items: center;
			padding: 16rpx;
			box-sizing: border-box;
		}
		
		.text-item image {
			margin-bottom: 10rpx;
			width: 70rpx;
			height: 90rpx;
		}
		
		.text-item text {
			display: block;
			height: 50rpx;
			line-height: 50rpx;
			font-size: 24rpx;
		}
		
	}
</style>
