<template>
	<view class="page" :class="themeStyle">
		<view class="notice-title">{{ detail.title }}</view>
		<view class="notice-content">
			<rich-text :nodes="content"></rich-text>
		</view>
		<view class="notice-meta">
			<text class="notice-time">{{ $lang('time') }}: {{ $util.timeStampTurnTime(detail.create_time) }}</text>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import htmlParser from '@/common/js/html-parser';
	export default {
		data() {
			return {
				noticeId: 0,
				content: '',
				detail: {}
			};
		},
		onLoad(options) {
			options.notice_id ? (this.noticeId = options.notice_id) : this.$util.redirectTo('/otherpages/notice/list/list', {},
				'redirectTo');
			this.$api.sendRequest({
				url: '/api/notice/info',
				data: {
					id: this.noticeId
				},
				success: res => {
					if (res.code == 0) {
						if (res.data) {
							this.detail = res.data;
							this.content = htmlParser(res.data.content);
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.redirectTo('/otherpages/notice/list/list', {}, 'redirectTo');
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
						setTimeout(() => {
							this.$util.redirectTo('/otherpages/notice/list/list', {}, 'redirectTo');
						}, 2000);
					}
				},
				fail: res => {
					this.$util.redirectTo('/otherpages/notice/list/list', {}, 'redirectTo');
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {},
		onShareAppMessage(res) {
			var title = '[公告]' + this.detail.title;
			var path = '/otherpages/notice/detail/detail?notice_id=' + this.noticeId;
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss">
	.page {
		width: 100%;
		height: 100%;
		padding: $ns-padding;
		box-sizing: border-box;
		background-color: #fff;
	}

	// [data-theme] {
		.notice-title {
			font-size: $ns-font-size-lg;
			font-weight: bold;
			text-align: center;
		}

		.notice-content {
			margin-top: $ns-margin;
		}

		.notice-meta {
			text-align: right;
			margin-top: $ns-margin;
			color: #999;
		}

		.empty {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: $ns-padding;
			box-sizing: border-box;
			margin-top: 150rpx;

			.iconfont {
				font-size: 190rpx;
				color: $ns-text-color-gray;
				line-height: 1.2;
			}
		}

		.page {
			width: 100%;
			height: 100%;
			padding: $ns-padding;
			box-sizing: border-box;
			background-color: #fff;
		}

		.notice-title {
			font-size: $ns-font-size-lg;
			font-weight: bold;
			text-align: center;
		}

		.notice-content {
			margin-top: $ns-margin;
		}

		.notice-meta {
			text-align: right;
			margin-top: $ns-margin;
			color: #999;
		}
	// }
</style>
