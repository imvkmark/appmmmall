<template>
	<scroll-view scroll-y="true" class="container" :class="themeStyle" v-if="addonIsExit.memberregister">
		<view class="header-wrap ns-gradient-pages-lodin-login-login" :class="themeStyle">
			<image class="header-bg" :src="$util.img('/upload/uniapp/login.png')" mode="widthFix"></image>
			<view class="bottom-wrap"></view>
			<view class="face-wrap" v-if="userInfo.avatarUrl != ''">
				<image :src="$util.img(userInfo.avatarUrl)"></image>
			</view>
		</view>
		<view class="body-wrap">
			<view class="form-wrap">
				<view class="input-wrap" v-show="registerMode == 'account'">
					<text class="iconfont iconyonghu"></text>
					<view class="content"><input type="text" placeholder="请输入用户名" placeholder-class="input-placeholder" class="input"
						 v-model="formData.account" /></view>
				</view>
				<view class="input-wrap">
					<text class="iconfont iconmima"></text>
					<view class="content"><input type="password" placeholder="请输入密码" placeholder-class="input-placeholder" class="input"
						 v-model="formData.password" /></view>
				</view>
				<view class="input-wrap">
					<text class="iconfont iconmima"></text>
					<view class="content">
						<input type="password" placeholder="请确认密码" placeholder-class="input-placeholder" class="input" v-model="formData.rePassword" />
					</view>
				</view>
				<view class="input-wrap">
					<text class="iconfont iconLjianpanyanzhengma-"></text>
					<view class="content">
						<input type="text" placeholder="请输入验证码" placeholder-class="input-placeholder" class="input" v-model="formData.vercode" />
						<image :src="captcha.img" mode="" class="captcha" @click="getCaptcha"></image>
					</view>
				</view>
			</view>
			<view class="forget-section">
				<view></view>
				<view class="align-right"><text @click="toLogin">已有账号，立即登录</text></view>
			</view>
			<button type="primary" @click="register" class="login-btn  ns-border-color ns-bg-color">注册</button>
			<view class="regisiter-agreement">
				点击注册即代表您已同意
				<text class="ns-text-color ns-font-size-sm" @click="openPopup">《注册协议》</text>
			</view>
		</view>

		<view @touchmove.stop>
			<uni-popup ref="registerPopup" type="center" class="wap-floating">
				<view class="conten-box">
					<view class="title ns-text-color">{{ regisiterAgreement.title }}</view>
					<view class="con">
						<rich-text :nodes="regisiterAgreement.content"></rich-text>
					</view>
				</view>
			</uni-popup>
		</view>
	</scroll-view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import validate from 'common/js/validate.js';
	import auth from 'common/js/auth.js';

	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				allowRegister: true, // 是否允许注册
				registerMode: 'account',
				formData: {
					mobile: '',
					account: '',
					password: '',
					rePassword: '',
					vercode: '',
					dynacode: '',
					key: ''
				},
				regisiterAgreement: {
					// 注册协议
					title: '',
					content: ''
				},
				captcha: {
					// 验证码
					id: '',
					img: ''
				},
				isSub: false,
				back: '' // 返回页
			};
		},
		mixins: [auth],
		onLoad(option) {
			if (option.back) this.back = option.back;
			this.getCaptcha();

			if (uni.getStorageSync('authInfo')) {
				let data = uni.getStorageSync('authInfo');
				if (data.authInfo) this.authInfo = data.authInfo;
				if (data.userInfo) this.userInfo = data.userInfo;
			}
		},
		computed: {
			// 使用对象展开运算符将此对象混入到外部对象中
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			},
			addonIsExit(){
				return this.$store.state.addonIsExit
			} 
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if(!this.addonIsExit.memberregister){
				this.$util.showToast({
					title:'注册插件未安装',
					mask:true,
					duration:2000
				})
				setTimeout(()=>{
					this.$util.redirectTo('/pages/index/index/index',{},'redirectTo')
				},2000);
				return;
			}
			
			// #ifdef MP
			this.getCode();
			// #endif
			this.getRegisiterAggrement();
			this.getRegisterConfig();
			this.getUserInfo();
		},
		methods: {
			/**
			 * 切换注册方式
			 */
			switchRegisterMode() {
				if (this.registerMode == 'mobile') {
					if (this.registerConfig.type.indexOf('plain') != -1) this.registerMode = 'account';
				} else if (this.registerMode == 'account') {
					if (this.registerConfig.type.indexOf('mobile') != -1) this.registerMode = 'mobile';
				}
			},
			/**
			 * 展示注册协议
			 */
			openPopup() {
				if (this.regisiterAgreement.content != '') {
					this.$refs.registerPopup.open();
				}
			},
			/**
			 * 获取注册协议
			 */
			getRegisiterAggrement() {
				this.$api.sendRequest({
					url: '/api/register/aggrement',
					success: res => {
						if (res.code >= 0) {
							this.regisiterAgreement = res.data;
						}
					}
				});
			},
			/**
			 * 获取注册配置
			 */
			getRegisterConfig() {
				this.$api.sendRequest({
					url: '/api/register/config',
					success: res => {
						if (res.code >= 0) {
							this.registerConfig = res.data.value;
							if (this.registerConfig.is_enable != 1) {
								this.$util.showToast({
									title: '平台未启用注册!',
									success: () => {
										setTimeout(() => {
											this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
										}, 1500);
									}
								});
							}
						}
					}
				});
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
			 * 注册
			 */
			register() {
				var data = {
					username: this.formData.account.trim(),
					password: this.formData.password
				};
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
						url: '/api/register/username',
						data,
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
											this.$util.redirectTo(this.back, {}, 'reLaunch');
										} else {
											this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
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
			verify(data) {
				let rule = [{
							name: 'username',
							checkType: 'required',
							errorMsg: '请输入用户名'
						},
						{
							name: 'password',
							checkType: 'required',
							errorMsg: '请输入密码'
						}
					],
					regConfig = this.registerConfig;

				if (regConfig.pwd_len > 0) {
					rule.push({
						name: 'password',
						checkType: 'lengthMin',
						checkRule: regConfig.pwd_len,
						errorMsg: '密码长度不能小于' + regConfig.pwd_len + '位'
					});
				}
				if (regConfig.pwd_complexity != '') {
					let passwordErrorMsg = '密码需包含',
						reg = '';
					if (regConfig.pwd_complexity.indexOf('number') != -1) {
						reg += '(?=.*?[0-9])';
						passwordErrorMsg += '数字';
					}
					if (regConfig.pwd_complexity.indexOf('letter') != -1) {
						reg += '(?=.*?[a-z])';
						passwordErrorMsg += '、小写字母';
					}
					if (regConfig.pwd_complexity.indexOf('upper_case') != -1) {
						reg += '(?=.*?[A-Z])';
						passwordErrorMsg += '、大写字母';
					}
					if (regConfig.pwd_complexity.indexOf('symbol') != -1) {
						reg += '(?=.*?[#?!@$%^&*-])';
						passwordErrorMsg += '、特殊字符';
					}
					rule.push({
						name: 'password',
						checkType: 'reg',
						checkRule: reg,
						errorMsg: passwordErrorMsg
					});
				}
				if (this.formData.password != this.formData.rePassword) {
					this.$util.showToast({
						title: '两次密码不一致'
					});
					return false;
				}

				if (this.captcha.id != '') {
					rule.push({
						name: 'captcha_code',
						checkType: 'required',
						errorMsg: '请输入验证码'
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
			 * 去登录
			 */
			toLogin() {
				if (this.back) this.$util.redirectTo('/pages/login/login/login', {
					back: this.back
				});
				else this.$util.redirectTo('/pages/login/login/login');
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/common.scss';
</style>
