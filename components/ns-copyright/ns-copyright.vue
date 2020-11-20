<template>
	<view>
		<view class="ns-copyright-info" v-if="bottom_info">
			<view class="ns-copyright-pic code-pic" v-if="bottom_info.logo" @click="link(bottom_info.copyright_link)">
				<image :src="$util.img(bottom_info.logo)" mode="widthFix"></image>
			</view>
			<view class="copyright-desc ns-text-color-gary" v-if="bottom_info.company_name" @click="link(bottom_info.copyright_link)">{{ bottom_info.company_name }}</view>
			<view class="copyright-desc ns-text-color-gary" v-else @click="link('#')">M商城提供技术支持</view>
		</view>
		<view class="ns-copyright-info" v-else @click="link('#')">
			<view class="copyright-pic">
				<image :src="$util.img('upload/uniapp/logo_copy.png')" mode="widthFix"></image>
			</view>
			<view class="copyright-desc ns-text-color-gary">M商城提供技术支持</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bottom_info: {}
			};
		},
		created() {
			this.getAdvList();
		},
		methods: {
			//获取版权信息
			getAdvList() {
				this.$api.sendRequest({
					url: '/api/config/copyright',
					success: res => {
						if (res.code == 0 && res.data) {
							this.bottom_info = res.data;
						}
					},
					fail() {}
				});
			},
			link(url) {
				if (url) {
					this.$util.redirectTo('/otherpages/web/web?src=' + url);
				}
			}
		}
	};
</script>

<style lang="scss">
	.ns-copyright-info {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 20rpx;
		margin-bottom: 60rpx;
	}

	.ns-copyright-info .ns-copyright-pic image {
		width: 180rpx;
	}

	.ns-copyright-info text {
		font-size: $ns-font-size-sm;
		height: 100rpx;
		line-height: 100rpx;
		color: $ns-text-color-gray !important;
	}

	.ns-copyright-info .copyright-desc {
		color: lighten($ns-text-color-gray, 30%);
		font-size: $ns-font-size-sm;
		text-shadow: 0 0 1px lighten($ns-text-color-gray, 40%);
	}
</style>
