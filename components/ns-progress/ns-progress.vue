<template>
	<view class="progress">
		<view class="progress-bar ns-bg-color" ref="progress" :style="{ width: progress + '%' }"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				val:0
			}
		},
		props: {
			progress: {
				type: Number,
				default: 0
			}
		}
	}
</script>

<style lang="scss">
	.progress {
		height: 10px;
		overflow: hidden;
		background-color: #ccc;
		border-radius: 4px;
	}

	.progress-bar {
		float: left;
		height: 100%;
		font-size: 12px;
		line-height: 20px;
		color: #fff;
		text-align: center;
		transition: width 0.6s ease;
	}
</style>
