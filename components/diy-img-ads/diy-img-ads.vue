<template>
	<view>
		<view class="single-graph">
			<!-- 轮播 -->
			<swiper v-if="value.selectedTemplate == 'carousel-posters'" class="swiper" autoplay="true" indicator-dots="true"
			 indicator-active-color="#ffffff" :style="{ height: value.height > 0 ? value.height * 2 + 'rpx' : '350rpx' }">
				<swiper-item class="swiper-item" v-for="(item, index) in value.list" :key="index" v-if="item.imageUrl" @click="redirectTo(item.link)">
					<view class="item">
						<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
						<text v-if="item.title">{{ item.title }}</text>
					</view>
				</swiper-item>
			</swiper>

			<!-- 垂直排列 -->
			<view v-else-if="value.selectedTemplate == 'vertically'">
				<view class="item" v-for="(item, index) in value.list" :key="index" :style="{ marginBottom: index + 1 != value.list.length ? value.imageClearance * 2 + 'rpx' : '0', padding: '0 ' + value.padding * 2 + 'rpx' }"
				 @click="redirectTo(item.link)">
					<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
					<text v-if="item.title">{{ item.title }}</text>
				</view>
			</view>

			<!-- 横向滑动 -->
			<view v-else-if="value.selectedTemplate == 'horizontal-sliding'" class="horizontal-sliding">
				<view class="item active" v-for="(item, index) in value.list" :key="index" :style="{ marginBottom: value.imageClearance * 2 + 'rpx' }"
				 @click="redirectTo(item.link)">
					<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
					<text v-if="item.title">{{ item.title }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'diy-img-ads',
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
		created() {},
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
	.single-graph {
		width: 100%;
		line-height: 0;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.single-graph .item {
		text-align: center;
		position: relative;
	}

	.single-graph text {
		background: rgba(0, 0, 0, 0.3);
		position: absolute;
		bottom: 70rpx;
		color: #ffffff;
		font-size: 24rpx;
		width: 100%;
		left: 0;
		line-height: 40rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		padding: 0 10rpx;
	}

	.item.active text {
		background: rgba(0, 0, 0, 0.3);
		position: absolute;
		bottom: 40rpx;
		color: #ffffff;
		font-size: 24rpx;
		width: 100%;
		left: 0;
		line-height: 40rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		padding: 0 10rpx;
	}

	.single-graph image {
		width: 100%;
		display: block;
	}

	.swiper {
		height: 350rpx;
	}

	.swiper-item {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.horizontal-sliding {
		overflow-x: scroll;
		white-space: nowrap;
	}

	.horizontal-sliding::-webkit-scrollbar {
		display: none;
	}

	.horizontal-sliding .item {
		display: inline-block;
		width: 100%;
		vertical-align: middle;
	}
</style>
