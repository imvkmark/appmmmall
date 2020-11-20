<template>
	<scroll-view scroll-y="true" class="container" :class="themeStyle">
		<view class="header-wrap ns-gradient-pages-lodin-login-login" :class="themeStyle">
			<image class="header-bg" :src="$util.img('/upload/uniapp/login.png')" mode="widthFix"></image>
			<view class="bottom-wrap"></view>
			<view class="face-wrap" v-if="userInfo.avatarUrl != ''">
				<image :src="$util.img(userInfo.avatarUrl)" @error="userInfo.avatarUrl = $util.getDefaultImage().default_headimg"></image>
			</view>
		</view>
		<view class="body-wrap">
			<view class="form-wrap">
				<view class="input-wrap" v-show="loginMode == 'mobile'">
					<text class="iconfont iconshouji"></text>
					<view class="content">
						<view class="area-code">+86</view>
						<input type="number" placeholder="请输入手机号" placeholder-class="input-placeholder" class="input" maxlength="11" v-model="formData.mobile" />
					</view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'account'">
					<text class="iconfont iconyonghu"></text>
					<view class="content"><input type="text" placeholder="请输入账号" placeholder-class="input-placeholder" class="input" v-model="formData.account" /></view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'account'">
					<text class="iconfont iconmima"></text>
					<view class="content"><input type="password" placeholder="请输入密码" placeholder-class="input-placeholder" class="input" v-model="formData.password" /></view>
				</view>
				<view class="input-wrap">
					<text class="iconfont iconLjianpanyanzhengma-"></text>
					<view class="content">
						<input type="text" placeholder="请输入验证码" placeholder-class="input-placeholder" class="input" v-model="formData.vercode" />
						<image :src="captcha.img" mode="" class="captcha" @click="getCaptcha"></image>
					</view>
				</view>
				<view class="input-wrap" v-show="loginMode == 'mobile'">
					<text class="iconfont iconyuechi"></text>
					<view class="content">
						<input type="text" placeholder="请输入动态码" placeholder-class="input-placeholder" class="input" v-model="formData.dynacode" />
						<view class="dynacode" :class="dynacodeData.seconds == 120 ? 'ns-text-color' : 'ns-text-color-gray'" @click="sendMobileCode">
							{{ dynacodeData.codeText }}
						</view>
					</view>
				</view>
			</view>
			<view class="forget-section">
				<view>
					<text @click="switchLoginMode" v-show="loginMode == 'mobile'">账号登录</text>
					<text @click="switchLoginMode" v-show="loginMode == 'account' && registerConfig.dynamic_code_login == 1">短信快捷登录</text>
				</view>
				<view class="align-right" v-show="loginMode == 'account'"><text @click="forgetPassword">忘记密码</text></view>
			</view>
			<button type="primary" @click="login" class="login-btn ns-border-color ns-bg-color">登录</button>
			<button type="warn" @click="authLogin" v-if="isBind" class="auth-login ns-border-color ns-text-color">一键授权登录</button>
			<view class="regisiter-agreement" v-if="registerConfig.is_enable == 1">
				还没有账号
				<text class="ns-text-color ns-font-size-sm" @click="toRegister">立即去注册</text>
			</view>

			<!-- #ifdef APP-PLUS -->
			<!-- <view class="third-login">
				<view @click="qqLogin">
					<image :src="$util.img('upload/uniapp/QQ.png')" mode=""></image>
					<view>QQ登录</view>
				</view>
				<view @click="wxLogin">
					<image :src="$util.img('upload/uniapp/WX.png')" mode=""></image>
					<view>微信登录</view>
				</view>
			</view> -->
			<!-- #endif -->
		</view>
	</scroll-view>
</template>

<script>
import validate from 'common/js/validate.js';
import auth from 'common/js/auth.js';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	data() {
		return {
			loginMode: 'mobile',
			formData: {
				mobile: '',
				account: '',
				password: '',
				vercode: '',
				dynacode: '',
				key: ''
			},
			captcha: {
				id: '',
				img: ''
			},
			isSub: false, // 提交防重复
			back: '', // 返回页
			redirect: 'redirectTo', // 跳转方式
			openidIsExits: false,
			isBind: false,
			dynacodeData: {
				seconds: 120,
				timer: null,
				codeText: '获取动态码',
				isSend: false
			},
			registerConfig: {
				is_enable: 1
			}
		};
	},
	mixins: [auth,globalConfig],
	onLoad(option) {
		let url = '';
		if (option) {
			url = option.back;
			Object.keys(option).forEach(function(key) {
				if (key != 'back') {
					if (url.indexOf('?') != -1) {
						url += '&' + key + '=' + option[key];
					} else {
						url += '?' + key + '=' + option[key];
					}
				}
			});
			this.back = url;
		}
		this.getCaptcha();
		this.getRegisterConfig();

		if (uni.getStorageSync('authInfo')) {
			let data = uni.getStorageSync('authInfo');
			if (data.authInfo) this.authInfo = data.authInfo;
			if (data.userInfo) this.userInfo = data.userInfo;
			this.checkOpenidIsExits();
		}
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		// #ifdef MP
		this.getCode(() => {
			if (Object.keys(this.authInfo).length) {
				this.$api.sendRequest({
					url: '/api/login/openidisexits',
					data: this.authInfo,
					success: res => {
						if (res.code >= 0 && res.data > 0) {
							this.isBind = true;
						}
					}
				});
			}
		});
		// #endif
		this.getUserInfo();
	},

	methods: {
		/**
		 * 获取注册配置
		 */
		getRegisterConfig() {
			this.$api.sendRequest({
				url: '/api/register/config',
				success: res => {
					if (res.code >= 0) {
						this.registerConfig = res.data.value;
						if (this.registerConfig.dynamic_code_login == 1) this.loginMode = 'mobile';
						else this.loginMode = 'account';
					}
				}
			});
		},
		/**
		 * 切换登录方式
		 */
		switchLoginMode() {
			this.loginMode = this.loginMode == 'mobile' ? 'account' : 'mobile';
		},
		/**
		 * 获取验证码
		 */
		getCaptcha() {
			this.$api.sendRequest({
				url: '/api/captcha/captcha',
				data: {
					captcha_id: this.captcha.id
				},
				success: res => {
					if (res.code >= 0) {
						this.captcha = res.data;
						this.captcha.img = this.captcha.img.replace(/\r\n/g, '');
					}
				}
			});
		},
		/**
		 * 去注册
		 */
		toRegister() {
			if (this.back)
				this.$util.redirectTo('/pages/login/register/register', {
					back: this.back
				});
			else this.$util.redirectTo('/pages/login/register/register');
		},
		/**
		 * 忘记密码
		 */
		forgetPassword() {
			if (this.back)
				this.$util.redirectTo('/otherpages/login/find/find', {
					back: this.back
				});
			else this.$util.redirectTo('/otherpages/login/find/find');
		},
		/**
		 * 登录
		 */
		login() {
			if (this.loginMode == 'account') {
				var url = '/api/login/login';
				data = {
					username: this.formData.account,
					password: this.formData.password
				};
			} else {
				var url = '/api/login/mobile',
					data = {
						mobile: this.formData.mobile,
						key: this.formData.key,
						code: this.formData.dynacode
					};
			}
			if (this.captcha.id != '') {
				data.captcha_id = this.captcha.id;
				data.captcha_code = this.formData.vercode;
			}
			if (Object.keys(this.authInfo).length) {
				data[this.authInfo.auth_tag] = this.authInfo.auth_openid;
			}
			if (this.userInfo.avatarUrl != '') data.headimg = this.userInfo.avatarUrl;
			if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');

			if (this.verify(data)) {
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url,
					data,
					success: res => {
						if (res.code >= 0) {
							uni.setStorage({
								key: 'token',
								data: res.data.token,
								success: () => {
									uni.removeStorageSync('loginLock');
									uni.removeStorageSync('unbound');
									if (this.back != '') {
										this.$util.redirectTo(this.back, {}, this.redirect);
									} else {
										this.$util.redirectTo('/pages/member/index/index', {}, this.redirect);
									}
								}
							});
						} else {
							this.isSub = false;
							this.getCaptcha();
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						this.isSub = false;
						this.getCaptcha();
					}
				});
			}
		},
		/**
		 * 登录验证
		 * @param {Object} data
		 */
		verify(data) {
			let rule = [];
			// 手机号验证
			if (this.loginMode == 'mobile') {
				rule = [
					{
						name: 'mobile',
						checkType: 'required',
						errorMsg: '请输入手机号'
					},
					{
						name: 'mobile',
						checkType: 'phoneno',
						errorMsg: '请输入正确的手机号'
					}
				];
				if (this.captcha.id != '')
					rule.push({
						name: 'captcha_code',
						checkType: 'required',
						errorMsg: this.$lang('captchaPlaceholder')
					});
				rule.push({
					name: 'code',
					checkType: 'required',
					errorMsg: this.$lang('dynacodePlaceholder')
				});
			}

			// 账号验证
			if (this.loginMode == 'account') {
				rule = [
					{
						name: 'username',
						checkType: 'required',
						errorMsg: this.$lang('accountPlaceholder')
					},
					{
						name: 'password',
						checkType: 'required',
						errorMsg: this.$lang('passwordPlaceholder')
					}
				];
				if (this.captcha.id != '')
					rule.push({
						name: 'captcha_code',
						checkType: 'required',
						errorMsg: this.$lang('captchaPlaceholder')
					});
			}

			var checkRes = validate.check(data, rule);
			if (checkRes) {
				return true;
			} else {
				this.$util.showToast({
					title: validate.error
				});
				return false;
			}
		},
		/**
		 * 授权登录
		 */
		authLogin() {
			if (this.isSub) return;
			this.isSub = true;
			this.$api.sendRequest({
				url: '/api/login/auth',
				data: this.authInfo,
				success: res => {
					if (res.code >= 0) {
						uni.setStorage({
							key: 'token',
							data: res.data.token,
							success: () => {
								uni.removeStorageSync('loginLock');
								uni.removeStorageSync('unbound');
								uni.removeStorageSync('authInfo');
								if (this.back != '') {
									this.$util.redirectTo(this.back, {}, this.redirect);
								} else {
									this.$util.redirectTo('/pages/member/index/index', {}, this.redirect);
								}
							}
						});
					} else {
						this.isSub = false;
						this.$util.showToast({
							title: res.message
						});
					}
				},
				fail: res => {
					this.isSub = false;
					this.$util.showToast({
						title: 'request:fail'
					});
				}
			});
		},
		/**
		 * 发送手机动态码
		 */
		sendMobileCode() {
			if (this.dynacodeData.seconds != 120) return;
			var data = {
				mobile: this.formData.mobile,
				captcha_id: this.captcha.id,
				captcha_code: this.formData.vercode
			};
			var rule = [
				{
					name: 'mobile',
					checkType: 'required',
					errorMsg: '请输入手机号'
				},
				{
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: '请输入正确的手机号'
				},
				{
					name: 'captcha_code',
					checkType: 'required',
					errorMsg: '请输入验证码'
				}
			];
			var checkRes = validate.check(data, rule);
			if (!checkRes) {
				this.$util.showToast({
					title: validate.error
				});
				return;
			}
			if (this.dynacodeData.isSend) return;
			this.dynacodeData.isSend = true;
			this.$api.sendRequest({
				url: '/api/login/mobileCode',
				data: data,
				success: res => {
					this.dynacodeData.isSend = false;
					if (res.code >= 0) {
						this.formData.key = res.data.key;

						if (this.dynacodeData.seconds == 120 && this.dynacodeData.timer == null) {
							this.dynacodeData.timer = setInterval(() => {
								this.dynacodeData.seconds--;
								this.dynacodeData.codeText = this.dynacodeData.seconds + 's后可重新获取';
							}, 1000);
						}
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				},
				fail: () => {
					this.$util.showToast({
						title: 'request:fail'
					});
					this.dynacodeData.isSend = false;
				}
			});
		},
		checkOpenidIsExits() {
			if (Object.keys(this.authInfo).length) {
				uni.setStorage({
					key: 'authInfo',
					data: {
						authInfo: this.authInfo,
						userInfo: this.userInfo
					}
				});
				this.$api.sendRequest({
					url: '/api/login/openidisexits',
					data: this.authInfo,
					success: res => {
						if (res.code >= 0 && res.data > 0) {
							this.isBind = true;
						}
					}
				});
			}
		},
		// 获取运营商
		getProvider() {
			uni.getProvider({
				service: 'oauth',
				success: res => {
					this.loginProviderArr = res.provider;
				},
				error: res => {
					this.$util.showToast({
						title: '获取运营商失败'
					});
				}
			});
		},
		// qq登录
		qqLogin() {
			if (~this.loginProviderArr.indexOf('qq')) {
				uni.login({
					provider: 'qq',
					success: loginRes => {
						return;
						this.sendRequest({
							url: 'System.Login.qqOauthLogin',
							data: {
								token: JSON.stringify(loginRes.authResult)
							},
							success: res => {
								if (res.code >= 0) {
									uni.setStorage({
										key: 'token',
										data: res.data.token,
										success: () => {
											uni.removeStorageSync('loginLock');
											uni.removeStorageSync('unbound');
											uni.removeStorageSync('authInfo');
											if (this.back != '') {
												this.$util.redirectTo(this.back, {}, this.redirect);
											} else {
												this.$util.redirectTo('/pages/member/index/index', {}, this.redirect);
											}
										}
									});
								} else {
									this.$util.showToast({
										title: '登录失败'
									});
								}
							}
						});
						// 获取用户信息
						// uni.getUserInfo({
						// 	provider: 'qq',
						// 	success: function(infoRes) {
						// 		console.log('用户昵称为：' + infoRes.userInfo.nickName);
						// 	},
						// 	fail(error){
						// 		console.log(error);
						// 	}
						// });
					},
					fail: error => {
						this.$util.showToast({
							title: error.errMsg
						});
					}
				});
			} else {
				this.$util.showToast({
					title: '未配置qq登录'
				});
			}
		},
		wxLogin() {
			if (~this.loginProviderArr.indexOf('weixin')) {
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						return;
						this.sendRequest({
							url: 'System.Login.wchatOauthLogin',
							data: {
								token: JSON.stringify(loginRes.authResult)
							},
							success: res => {
								if (res.code >= 0) {
									uni.setStorage({
										key: 'token',
										data: res.data.token,
										success: () => {
											uni.removeStorageSync('loginLock');
											uni.removeStorageSync('unbound');
											uni.removeStorageSync('authInfo');
											if (this.back != '') {
												this.$util.redirectTo(this.back, {}, this.redirect);
											} else {
												this.$util.redirectTo('/pages/member/index/index', {}, this.redirect);
											}
										}
									});
								} else {
									this.$util.showToast({
										title: '登录失败'
									});
								}
							}
						});
						// 获取用户信息
						// uni.getUserInfo({
						// 	provider: 'weixin',
						// 	success: function(infoRes) {
						// 		console.log('用户昵称为：' + infoRes.userInfo.nickName);
						// 	},
						// 	fail(error){
						// 		console.log(error);
						// 	}
						// });
					},
					fail: error => {
						this.$util.showToast({
							title: error.errMsg
						});
					}
				});
			} else {
				this.$util.showToast({
					title: '未配置微信登录'
				});
			}
		}
	},
	watch: {
		'dynacodeData.seconds': {
			handler(newValue, oldValue) {
				if (newValue == 0) {
					clearInterval(this.dynacodeData.timer);
					this.dynacodeData = {
						seconds: 120,
						timer: null,
						codeText: '获取动态码',
						isSend: false
					};
				}
			},
			immediate: true,
			deep: true
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/common.scss';
</style>
