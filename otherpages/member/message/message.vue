<template>
	<view :class="themeStyle">
		<view class="container">
			<view class="message-list">
				<view class="message-item">
					<view class="message-title">
						<view class="iconfont iconxiaoxi"></view>
						<text>系统消息</text>
					</view>
					<view class="content">
						<text>恭喜，您已成功注册为本商城会员！</text>
						<view class="receiving-time"><text class="ns-font-size-sm ns-text-color-gray">2019-12-20 15:03:02</text></view>
					</view>
				</view>
				<view class="message-item">
					<view class="message-title">
						<view class="iconfont icondingdan"></view>
						<text>订单消息</text>
					</view>
					<view class="content">
						<text>你有订单尚未支付，如果未在24小时内支付，订单将自动关闭。</text>
						<view class="receiving-time">
							<text class="ns-font-size-sm ns-text-color-gray">2019-12-20 15:03:02</text>
							<navigator hover-class="none" url="" class="ns-text-color ns-font-size-sm">查看详情</navigator>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		methods: {}
	};
</script>

<style lang="scss">
	// [data-theme] {
		.container {
			width: 100vw;
			height: 100vh;
		}

		.message-item {
			margin: 20rpx;
			background: #fff;
			border-radius: $ns-border-radius;

			.message-title {
				padding: 0 30rpx;
				height: 90rpx;
				border-bottom: 1px solid #eee;
				display: flex;
				align-items: center;

				.iconfont {
					display: inline-block;
					line-height: 1;
					font-size: 32rpx;
					margin-right: 10rpx;
				}

				.iconxiaoxi {
					color: #3bd8e1;
				}

				.icondingdan {
					color: #437bff;
				}
			}

			.content {
				padding: 20rpx 30rpx;
				color: #666;

				.receiving-time {
					display: flex;
					align-items: center;

					navigator {
						display: inline-block;
						margin: 0 4rpx;
						flex: 1;
						text-align: right;
					}
				}
			}
		}
	// }
</style>
