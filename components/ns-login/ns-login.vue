<template>
	<view>
		<view @touchmove.prevent.stop>
			<uni-popup ref="auth" :custom="true" :mask-click="false">
				<view class="uni-tip">
					<view class="uni-tip-title">您还未登录</view>
					<view class="uni-tip-content">请先登录之后再进行操作</view>
					<view class="uni-tip-icon">
						<image :src="$util.img('/upload/uniapp/member/login.png')" mode="widthFix"></image>
					</view>
					<view class="uni-tip-group-button">
						<button type="default" class="uni-tip-button ns-text-color-gray" @click="close">暂不登录</button>
						<!-- #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU -->
						<button type="primary" open-type="getUserInfo" @getuserinfo="bindgetuserinfo" class="uni-tip-button">立即登录</button>
						<!-- #endif  -->
						<!-- #ifdef MP-ALIPAY -->
						<button type="primary" open-type="getAuthorize" scope="userInfo" @getAuthorize="bindgetuserinfo" class="uni-tip-button ns-bg-color">立即登录</button>
						<!-- #endif  -->
						<!-- #ifdef H5 || APP-PLUS -->
						<button type="primary" class="uni-tip-button ns-bg-color" @click="login">立即登录</button>
						<!-- #endif  -->
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniPopup from '../uni-popup/uni-popup.vue';
	import Config from 'common/js/config.js';

	export default {
		name: 'ns-login',
		components: {
			uniPopup
		},
		data() {
			return {
				url: ''
			};
		},
		created() {},
		methods: {
			open(url) {
				if (url) this.url = url;
				this.$refs.auth.open();
			},
			close() {
				this.$refs.auth.close();
			},
			bindgetuserinfo() {
				this.$refs.auth.close();
				if (this.url) this.$util.redirectTo('/pages/login/login/login', {
					back: this.url
				});
				else this.$util.redirectTo('/pages/login/login/login');
			},
			login() {
				this.$refs.auth.close();
				if (this.$util.isWeiXin()) {
					let redirect_url = '';
					if (this.url) redirect_url = Config.h5Domain + '/pages/login/login/login?back=' + encodeURIComponent(this.url);
					else redirect_url = Config.h5Domain + '/pages/login/login/login';

					this.$api.sendRequest({
						url: '/wechat/api/wechat/authcode',
						data: {
							redirect_url
						},
						success: res => {
							if (res.code >= 0) {
								location.href = res.data;
							}
						}
					})
				} else {
					if (this.url) this.$util.redirectTo('/pages/login/login/login', {
						back: this.url
					});
					else this.$util.redirectTo('/pages/login/login/login');
				}
			}
		}
	};
</script>

<style lang="scss">
	.uni-tip {
		width: 600rpx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 20rpx;
		overflow: hidden;
		height: initial;
	}

	.uni-tip-title {
		text-align: center;
		font-weight: bold;
		font-size: $ns-font-size-lg;
		padding-top: $ns-padding;
	}

	.uni-tip-content {
		padding: 0 30rpx;
		color: #666;
		font-size: 24rpx;
		text-align: center;
	}

	.uni-tip-icon {
		width: 100%;
		text-align: center;
	}

	.uni-tip-icon image {
		width: 300rpx;
	}

	.uni-tip-group-button {
		margin-top: 20rpx;
		line-height: 120rpx;
		display: flex;
		border-top: 2rpx solid $ns-border-color-gray;
		button{
			margin: 0;
			border-radius: 0;
		}
	}

	.uni-tip-button {
		width: 100%;
		text-align: center;
		border: none;
		border-radius: 0;
		padding: 0;
		margin: 0;
		background: #fff;
	}

	.uni-tip-button:after {
		border: none;
	}
</style>
