<script>
	import auth from 'common/js/auth.js';
	export default {
		mixins: [auth],
		onLaunch: function(data) {
			// #ifdef MP
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
			});

			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});

			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
			});
			// #endif

			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					uni.setStorage({
						key: 'location',
						data: {
							latitude: res.latitude,
							longitude: res.longitude
						}
					})
				}
			})

			//判断是否支持 获取本地位置
			// #ifdef H5
			if (navigator.geolocation) {
				var n = navigator.geolocation.getCurrentPosition(function(res) {
					console.log(res); // 需要的坐标地址就在res中
				});
			} else {
				console.log('该浏览器不支持定位');
			}
			// #endif

			// #ifdef H5
			if (uni.getSystemInfoSync().platform == 'ios') {
				uni.setStorageSync('initUrl', location.href);
			}
			// #endif
		},
		onShow: function() {
			//购物车数量
			this.$store.dispatch('getCartNumber').then((e) => {})
			//全局主题色
			this.$store.dispatch('getThemeStyle')
			//全局插件
			this.$store.dispatch('getAddonIsexit')
			//进货单数量
			this.$store.dispatch('getWholeSaleNumber')
			//判断当前是否为开发状态
			this.$api.sendRequest({
				url: '/api/shop/isshow',
				success: res => {
					this.$store.state.Development = res.data
				}
			});

			// #ifdef MP
			// 小程序端自动登录
			if (!uni.getStorageSync('token') && !uni.getStorageSync('loginLock') && !uni.getStorageSync('unbound')) {
				this.getCode(() => {
					if (Object.keys(this.authInfo).length) {
						this.$api.sendRequest({
							url: '/api/login/auth',
							data: this.authInfo,
							success: res => {
								if (res.code >= 0) {
									uni.setStorage({
										key: 'token',
										data: res.data.token,
										success: () => {}
									});
								} else {
									uni.setStorage({
										key: 'unbound',
										data: 1,
										success: () => {}
									});
								}
							}
						})
					}
				});
			}
			// #endif
		},
		onHide: function() {}
	};
</script>

<style lang="scss">
	/*每个页面公共css */
	/* #ifndef APP-PLUS-NVUE */
	@import url('/common/css/iconfont.css');
	@import url('/common/css/main.css');
	/* #endif */

	/* #ifdef MP-WEIXIN */
	// @import './common/css/theme/theme-blue.scss';
	// @import './common/css/theme/theme-green.scss';
	@import './common/css/theme/theme-common.scss';
	@import './common/css/theme/gradient.scss';
	/* #endif */

	/* #ifdef H5 */
	uni-page[data-page="otherpages/index/city/city"] {
		overflow: hidden !important;
	}

	/* #endif */
</style>