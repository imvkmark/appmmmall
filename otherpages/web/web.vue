<template>
	<view>
		<view class="iconfont iconshang navigate-back" @click="navigateBack"></view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: ''
			};
		},
		onLoad(event) {
			this.src = event.src;
		},
		methods: {
			navigateBack() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style lang="scss">
	.navigate-back {
		position: absolute;
		top: 34rpx;
		left: 34rpx;
		z-index: 5;
		font-size: $ns-font-size-lg;
	}
</style>
