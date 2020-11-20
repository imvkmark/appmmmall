<template>
	<view :class="themeStyle">
		<view class="nc-modify-content">
			<view class="modify">
				<view>
					<image v-if="newImg == ''" :src="memberImg ? $util.img(memberImg) : $util.getDefaultImage().default_headimg"
					 @error="memberImg = $util.getDefaultImage().default_headimg" mode="aspectFill"></image>
					<image v-else :src="$util.img(newImg)" @error="newImg = $util.getDefaultImage().default_headimg" mode="aspectFill" />
				</view>
			</view>
			<view class="opection-box">
				<block v-if="newImg == ''"><button type="primary" @click="chooseImage()">更换头像</button></block>
				<block v-else>
					<view class="opec">
						<button size="mini" type="primary" @click="save()">保存</button>
						<button size="mini" type="primary" @click="chooseImage()">重新选择</button>
					</view>
				</block>
			</view>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberImg: '',
				newImg: ''
			};
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		onShow() {
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo(
					'/pages/login/login/login', {
						back: '/otherpages/member/modify_face/modify_face'
					},
					'redirectTo'
				);
			}
			this.$langConfig.refresh();
			this.initGetHeading();
		},
		methods: {
			initGetHeading() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code == 0) {
							this.memberImg = res.data.headimg;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			chooseImage() {
				this.$util.upload(
					1, {
						path: 'headimg'
					},
					res => {
						this.newImg = res[0];
					}
				);
			},
			previewImage() {
				uni.previewImage({
					current: 0,
					urls: this.images
				});
			},
			save() {
				this.$api.sendRequest({
					url: '/api/member/modifyheadimg',
					data: {
						headimg: this.newImg
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: '头像修改成功',
								success: () => {
									setTimeout(() => {
										this.$util.redirectTo('/otherpages/member/info/info', {}, 'redirectTo');
									}, 2000);
								}
							});
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		overflow: hidden;
	}

	// [data-theme] {
		.modify {
			position: relative;
			padding-top: 50rpx;

			view {
				width: 500rpx;
				height: 500rpx;
				margin: 0 auto;
				overflow: hidden;
				background-color: #ffffff;
				border: 4rpx solid #ffffff;
				border-radius: 100%;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.opection-box {
			margin-top: 50rpx;
		}

		.opec {
			width: 100%;
			padding: 0 10%;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
		}
	// }
</style>
