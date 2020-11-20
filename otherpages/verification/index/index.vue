<template>
	<view class="container" :class="themeStyle">
		<view class="operation-wrap">
			<view class="record-wrap ns-text-color" @click="$util.redirectTo('/otherpages/verification/list/list')">
				<text class="iconfont iconjilu"></text>
				<text>核销记录</text>
			</view>

			<view class="sweep-code ns-gradient-otherpages-verification-index-index-code" :class="themeStyle" @click="scanCode" v-show="operationType == 'sweepCode'"><text class="iconfont iconsaoma"></text></view>
			<view class="manual-input" v-show="operationType == 'manualInput'">
				<view class="process-wrap">
					<view class="wrap">
						<view class="_icon"><text class="iconfont iconshurutianxiebi"></text></view>
						<view class="_text">输入核销码</view>
					</view>
					<view>
						<view><text class="iconfont iconjiang-copy ns-text-color-gray"></text></view>
					</view>
					<view class="wrap">
						<view class="_icon"><text class="iconfont iconhexiao"></text></view>
						<view class="_text">核销</view>
					</view>
				</view>
				<input type="text" value="" placeholder="请输入核销码" class="_input" placeholder-class="_placeholder" v-model="verify_code" />
				<view class="_btn" @click="confirm"><button type="primary">确认</button></view>
			</view>
		</view>
		<view class="arc-edge"></view>

		<view class="operation-type-wrap">
			<view class="operation" @click="changeOperationType('sweepCode')">
				<view class="_icon"><text class="iconfont iconsaoma"></text></view>
				<view class="_text">扫码核销</view>
			</view>
			<view class="iconfont icontiaoxingmasaomiao ns-gradient-otherpages-verification-index-index-code" :class="themeStyle"></view>
			<view class="operation" @click="changeOperationType('manualInput')">
				<view class="_icon"><text class="iconfont iconshuru"></text></view>
				<view class="_text">手动输入</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// #ifdef H5
				operationType: 'manualInput',
				// #endif
				// #ifndef H5
				operationType: 'sweepCode',
				// #endif
				verify_code: ''
			};
		},
		onLoad() {},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (uni.getStorageSync('token')) this.checkIsVerifier();
			else this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			scanCode() {
				uni.scanCode({
					onlyFromCamera: true,
					success: res => {
						if (res.scanType == 'WX_CODE' && res.errMsg == 'scanCode:ok') {
							try {
								this.$util.redirectTo('/' + res.path);
							} catch (e) {
								this.$util.showToast({
									title: e.message
								});
							}
						} else {
							this.$util.showToast({
								title: res.errorMsg
							});
						}
					}
				});
			},
			changeOperationType(type) {
				// #ifdef H5
				if (type == 'sweepCode') {
					this.$util.showToast({
						title: 'H5端不支持扫码核销'
					});
					return;
				}
				// #endif
				this.operationType = type;
			},
			checkIsVerifier() {
				this.$api.sendRequest({
					url: '/api/verify/checkisverifier',
					success: res => {
						if (!res.data) {
							this.$util.showToast({
								title: '非核销员无此权限'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
							}, 1000);
						}
					}
				});
			},
			confirm() {
				var reg = /[\S]+/;
				if (!reg.test(this.verify_code)) {
					this.$util.showToast({
						title: '请输入核销码'
					});
					return false;
				}
				this.$api.sendRequest({
					url: '/api/verify/verifyInfo',
					data: {
						verify_code: this.verify_code
					},
					success: res => {
						if (res.code >= 0) {
							this.$util.redirectTo('/otherpages/verification/detail/detail', {
								code: this.verify_code
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
	.container {
		width: 100vw;
		height: 100vh;

		.operation-wrap {
			padding: 100rpx 0;
			background: #fff;
			position: relative;
			margin-top: 20rpx;

			.record-wrap {
				position: absolute;
				top: 20rpx;
				right: 20rpx;

				.iconfont {
					font-size: 24rpx;
					margin-right: 10rpx;
				}
			}

			.sweep-code {
				width: 400rpx;
				height: 400rpx;
				box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.03), 0 6px 3px 0 rgba(0, 0, 0, 0.02);
				border-radius: 50%;
				margin: 0 auto;
				text-align: center;
				line-height: 400rpx;

				.iconfont {
					color: #fff;
					font-size: 150rpx;
				}
			}

			.manual-input {
				width: 70%;
				margin: auto;

				.process-wrap {
					height: 150rpx;
					display: flex;
					padding-top: 60rpx;

					.wrap {
						flex: 1;
						text-align: center;

						._icon {
							width: 60rpx;
							height: 60rpx;
							background: #eee;
							border-radius: 50%;
							margin: 0 auto;
							color: #999;

							.iconfont {
								font-size: 32rpx;
							}
						}

						._text {
							font-size: 24rpx;
							margin-top: 10rpx;
							color: #999;
						}
					}
				}

				._input {
					height: 80rpx;
					border: 1px solid #eee;
					border-radius: 8rpx;
					box-sizing: border-box;
					padding: 20rpx;
					font-size: 28rpx;
					text-align: center;
				}

				._placeholder {
					font-size: 28rpx;
					text-align: center;
				}

				._btn {
					margin-top: 40rpx;
				}
			}
		}

		.arc-edge {
			width: 100%;
			height: 80rpx;
			background: #fff;
			border-radius: 400rpx/40rpx;
			/*上下有弧度的边*/
			transform: translateY(-50%);
		}

		.operation-type-wrap {
			width: 70%;
			height: 90rpx;
			background: #fff;
			border-radius: 90rpx;
			display: flex;
			position: relative;
			box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.03), 0 4px 2px 0 rgba(0, 0, 0, 0.04);
			margin: 100rpx auto;

			.operation {
				flex: 1;
				text-align: center;

				._icon {
					line-height: 25px;
					height: 25px;
				}

				._text {
					font-size: 24rpx;
					line-height: 1;
				}
			}

			.icontiaoxingmasaomiao {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
				transform: translateY(-10rpx);
				box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.03), 0 6px 3px 0 rgba(0, 0, 0, 0.02);
				color: #fff;
				text-align: center;
				line-height: 110rpx;
				font-size: 40rpx;
			}
		}
	}
</style>
