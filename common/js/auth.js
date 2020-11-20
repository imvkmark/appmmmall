export default {
	data(){
		return {
			authInfo: {},
			userInfo: {
				avatarUrl: ''
			}
		}
	},
	methods: {
		/**
		 * 获取用户登录凭证code
		 */
		getCode(callback){ 
			// 微信小程序
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				timeout: 3000,
				success: res => {
					if (res.code) {
						this.getOpenid('weapp_openid', res.code, '/weapp/api/weapp/authcodetoopenid', callback);
					}
				}
			})
			// #endif
			// 支付宝小程序
			// #ifdef MP-ALIPAY
			uni.login({
				scopes: 'auth_base',
				success: res => {
					if (res.authCode) {
						this.getOpenid('ali_openid', res.authCode, '', callback);
					}
				}
			})
			// #endif
			// 头条小程序
			// #ifdef MP-TOUTIAO
			uni.login({
				success: res => {
					if (res.code) {
						this.getOpenid('toutiao_openid', res.code, '', callback);
					}
				}
			})
			// #endif
			// 百度小程序
			// #ifdef MP-BAIDU
			uni.login({
				success: res => {
					if (res.code) {
						this.getOpenid('baidu_openid', res.code, '', callback);
					}
				}
			})
			// #endif
		},
		/**
		 * 获取openid
		 * @param {Object} key
		 * @param {Object} code
		 * @param {Object} url
		 * @param {Object} callback
		 */
		getOpenid(key, code, url, callback){
			this.$api.sendRequest({
				url,
				data: {
					code
				},
				success: res => {
					if (res.code >= 0) {
						this.authInfo.auth_tag = key;
						this.authInfo.auth_openid = res.data;
						typeof callback == 'function' && callback();
					}
				}
			})
		},
		/**
		 * 获取第三方用户基础信息
		 */
		getUserInfo(){
			// #ifdef MP
			uni.getUserInfo({
				success: res => {
					if (res.errMsg == 'getUserInfo:ok') {
						this.userInfo = res.userInfo;
					}
				}
			});
			// #endif
		},
		/**
		 * 获取到openid之后的操作
		 */
		handleAuthInfo(){
			try{
				// 检测openid是否绑定
				this.checkOpenidIsExits();
			}catch(e){
			}
		}
	},
	onLoad(option) {
		if (option.code && this.$util.isWeiXin()) {
			this.$api.sendRequest({
				url: '/wechat/api/wechat/authcodetoopenid',
				data: {
					code: option.code
				},
				success: res => {
					if (res.code >= 0) {
						this.authInfo.auth_tag = 'wx_openid';
						this.authInfo.auth_openid = res.data.openid;
						
						this.userInfo = res.data.userinfo;
						
						this.handleAuthInfo();
					}
				}
			})
		}
	}
	
}