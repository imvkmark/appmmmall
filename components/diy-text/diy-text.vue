<template>
	<view class="diy-text" :style="{ background: value.backgroundColor }" @click="redirectTo(value.link)">
		<view class="title" :style="{ fontSize: value.fontSize * 2 + 'rpx', textAlign: value.textAlign }">
			<image class="left" :src="$util.img('upload/uniapp/index/title_left.png')" />
			<text>{{ value.title }}</text>
			<image class="right" :src="$util.img('upload/uniapp/index/title_right.png')" />
		</view>
		<text class="sub-title" v-if="value.subTitle" :style="{ textAlign: value.textAlign, fontSize: (value.fontSize - 4) * 2 + 'rpx' }">{{ value.subTitle }}</text>
	</view>
</template>

<script>
	// 标题
	export default {
		name: 'diy-text',
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

<style>
	.diy-text {
		padding: 20rpx;
	}

	.diy-text .title {
		margin: 0;
		font-weight: normal;
		color: #333;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.diy-text .title text {
		padding: 0 15rpx;
	}

	.diy-text .sub-title {
		margin: 20rpx 0 0;
		color: #8f8f94;
		display: block;
	}

	.left {
		transform: translateY(0%);
		width: 30rpx;
		height: 24rpx;
	}

	.right {
		transform: translateY(0%);
		width: 30rpx;
		height: 24rpx;
	}
</style>
