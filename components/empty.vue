<template>
	<view class="empty-content" v-if="show">
		<image class="empty-content-image" :src="setSrc" mode="aspectFit"></image>
		<text class="label">暂无记录</text>
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: 'empty'
			},
			show: {
				type: Boolean,
				default: false
			},
		},

		data() {
			return {
				typeSrc: {
					empty: "/static/otc/empty.jpg"
				},
			}
		},

		computed: {
			setSrc() {
				return this.typeSrc[this.src];
			},
		}
	}
</script>

<style lang="scss">
	.empty-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background: #ffffff;
		padding-top: 240upx;

		&-image {
			width: 200upx;
			height: 200upx;
		}
		.label{
			font-size: $font-base;
			color: $font-color-light;
		}
	}
</style>
