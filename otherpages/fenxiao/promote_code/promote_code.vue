<template>
	<view :class="themeStyle">
		<view class="container">
			<swiper class="swiper">
				<swiper-item>
					<view class="swiper-item">
						<view class="poster-wrap">
							<image :src="$util.img(poster)" mode="widthFix"></image>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<!-- #ifdef H5 -->
			<view class="tips">长按识别图中二维码</view>
			<!--  #endif -->
			<!-- #ifdef MP || APP-PLUS -->
			<view class="btn ns-bg-color ns-border-color" @click="save">保存海报</view>
			<!--  #endif -->
		</view>
	</view>
</template>

<script>
	import {
		Weixin
	} from 'common/js/wx-jssdk.js';
	import config from '../../../utils/config.js'
	export default {
		data() {
			return {
				poster: '',
				fenxiaoInfo: {}
			}
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			/**
			 * 获取分销海报
			 */
			getPoster() {
				uni.showLoading({
					title: '获取中'
				});
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/poster',
					data: {
						page: '/pages/index/index/index',
						qrcode_param: JSON.stringify({}),
						// #ifdef APP-PLUS
						app_type: 'h5',
						app_type_name: 'H5',
						// #endif
					},
					success: res => {
						console.log(res,this.$api)
						uni.hideLoading();
						if (res.code >= 0) {
							this.poster = res.data.path;
						} else {
							this.$util.showToast({
								title: '海报生成失败'
							});
						}
					},
					fail: res => {
						uni.hideLoading();
						this.$util.showToast({
							title: '海报生成失败'
						});
					}
				})
			},
			save() {
				// console.log(config.url+'/'+this.poster)
				// #ifdef MP || APP-PLUS
				uni.saveImageToPhotosAlbum({
					filePath: config.url+'/'+this.poster,
					success: function () {
						uni.showToast({
							title: '下载成功'
						});
					},fail() {
						uni.showToast({
							title: '下载失败',
							icon:'none'
						});
					}
				});
				// #endif
			},
			getFenxiaoDetail() {
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/detail',
					success: res => {
						if (res.data) {
							this.fenxiaoInfo = res.data;
							this.getPoster();
							this.setShareData();
						} else {
							this.$util.redirectTo('/otherpages/fenxiao/apply/apply', {}, 'redirectTo');
						}
					}
				});
			},
			setShareData() {
				// #ifdef H5
				if (this.$util.isWeiXin()) {
					this.$api.sendRequest({
						url: '/wechat/api/wechat/share',
						data: {
							url: window.location.href
						},
						success: res => {
							if (res.code == 0) {
								var wxJS = new Weixin();
								wxJS.init(res.data.jssdk_config);

								let shareConfig = res.data.share_config,
									url = this.$config.h5Domain + '/pages/index/index/index';
								if (this.fenxiaoInfo.member_id) url += '?source_member=' + this.fenxiaoInfo.member_id;

								wxJS.setShareData({
									title: '快来加入我的团队吧，一起得佣金哦',
									desc: shareConfig.qrcode_param_1 + '\r\n' + shareConfig.qrcode_param_2 + '\r\n' + '收藏热度：★★★★★',
									link: url,
									imgUrl: this.$util.img(this.fenxiaoInfo.headimg)
								})
							}
						}
					})
				}
				// #endif
			}
		},
		onLoad() {
			// console.log(config.url)
			// 刷新多语言
			this.$langConfig.refresh();

			if (uni.getStorageSync('token')) {
				this.getFenxiaoDetail();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/otherpages/fenxiao/promote_code/promote_code'
				});
			}
		},
		/**
		 * 自定义分享内容
		 * @param {Object} res
		 */
		onShareAppMessage(res) {
			var path = '/pages/index/index/index';
			if (this.fenxiaoInfo.member_id) path += '?source_member=' + this.fenxiaoInfo.member_id;
			return {
				title: '快来加入我的团队吧，一起得佣金哦',
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	}
</script>

<style lang="scss">
	// [data-theme] {
		.container {
			width: 100vw;
			min-height: 100vh;
			background-color: #ddd;
		}

		.poster-wrap {
			padding: 40rpx 0;
			width: calc(100vw - 160rpx);
			margin: 0 80rpx;
			line-height: 1;

			image {
				border-radius: 20rpx;
				overflow: hidden;
				width: 100%;
			}
		}

		.swiper {
			height: 1040rpx;
		}

		.btn {
			margin: 0 80rpx;
			margin-top: 30rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 80rpx;
			color: #fff;
			text-align: center;
		}

		.tips {
			text-align: center;
			font-size: 28rpx;
			color: #999;
			font-weight: 600;
			margin-top: 20rpx;
		}
	// }
</style>
