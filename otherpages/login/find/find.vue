<template>
	<view :class="themeStyle">
		<view class="find">
			<view class="find-head">
				<!-- 自定义状态栏高度 -->
				<view class="head-nav"></view>
				<view class="head-content ns-bg-color" :style="'background-image:url(' + $util.img('upload/uniapp/authorize_bj.png') + ');'">
					<view class="head-return">
						<text class="iconfont iconback_light" @click="navigateBack"></text>
						{{ $lang('findPassword') }}
					</view>
				</view>
			</view>
			<view class="find-form">
				<!-- 下一步 -->
				<block v-if="stepShow == 0">
					<view class="form-input"><input class="uni-input" type="text" maxlength="17" v-model="formData.mobileOrEmail"
						 :placeholder="$lang('accountPlaceholder')" /></view>
					<button type="primary" class="find-btn" @click="nextStep()">{{ $lang('next') }}</button>
				</block>

				<!-- 输入验证码、动态码 -->
				<block v-if="stepShow == 1">
					<view class="form-input align-type">
						<input class="uni-input info-content" type="number" maxlength="4" :placeholder="$lang('captchaPlaceholder')"
						 v-model="formData.captcha" />
						<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
					</view>

					<view class="form-input align-type">
						<input class="uni-input" type="number" maxlength="6" v-model="formData.dynacode" :placeholder="$lang('dynacodePlaceholder')" />
						<view class="dynacode ns-text-color" @click="sendDynaCode">{{ codeText }}</view>
					</view>
					<view class="form-input">
						<input class="uni-input" type="text" maxlength="30" password="true" :placeholder="$lang('passwordPlaceholder')"
						 v-model="formData.password" />
					</view>

					<view class="form-input">
						<input class="uni-input" type="text" maxlength="30" password="true" :placeholder="$lang('rePasswordPlaceholder')"
						 v-model="formData.rePassword" />
					</view>

					<button type="primary" class="find-btn" @click="save">{{ $lang('save') }}</button>
				</block>
			</view>
		</view>
	</view>

</template>

<script>
	import validate from 'common/js/validate.js';
	export default {
		data() {
			return {
				findMode: 'mobile',
				codeText: '获取动态码',
				seconds: 120,
				timer: null,
				formData: {
					mobileOrEmail: '',
					password: '',
					rePassword: '',
					dynacode: '',
					captcha: ''
				},
				stepShow: 0,
				isSend: false,
				captcha: {
					id: '',
					img: ''
				},
				registerConfig: {}
			};
		},
		onLoad() {
			this.getCaptcha();
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			this.getRegisterConfig();
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			// 导航跳转
			navigateBack() {
				if (this.stepShow == 1) {
					this.stepShow = 0;
				} else if (this.stepShow == 0) {
					this.$util.redirectTo('/pages/login/login/login', '', '', 'reLaunch');
				}
			},
			// 下一步
			async nextStep() {
				let mobileRule = [{
						name: 'mobileOrEmail',
						checkType: 'phoneno',
						errorMsg: ' '
					}], //手机验证
					emailRule = [{
						name: 'mobileOrEmail',
						checkType: 'email',
						errorMsg: ' '
					}], //邮箱验证
					mobileCheckRes,
					emailCheckRes;

				mobileCheckRes = validate.check(this.formData, mobileRule);
				emailCheckRes = validate.check(this.formData, emailRule);

				if (mobileCheckRes) {
					this.findMode = 'mobile';
					let res = await this.$api.sendRequest({
						url: '/api/member/checkmobile',
						data: {
							mobile: this.formData.mobileOrEmail
						},
						async: false
					});
					if (res.code == 0) {
						this.$util.showToast({
							title: '该手机号未注册'
						});
						return false;
					}
				} else if (emailCheckRes) {
					this.findMode = 'email';
					let res = await this.$api.sendRequest({
						url: '/api/member/checkemail',
						data: {
							email: this.formData.mobileOrEmail
						},
						async: false
					});

					if (res.code == 0) {
						this.$util.showToast({
							title: '该邮箱号未注册'
						});
						return false;
					}
				} else {
					this.$util.showToast({
						title: '请输入正确的手机号或邮箱'
					});
					return false;
				}

				this.stepShow = 1;
			},
			// 注册表单验证
			vertify() {
				let regConfig = this.registerConfig;
				let rule = [{
						name: 'captcha',
						checkType: 'required',
						errorMsg: this.$lang('captchaPlaceholder')
					},
					{
						name: 'dynacode',
						checkType: 'required',
						errorMsg: this.$lang('dynacodePlaceholder')
					},
					{
						name: 'password',
						checkType: 'required',
						errorMsg: '请输入密码'
					}
				];
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

				var checkRes = validate.check(this.formData, rule);
				if (checkRes) {
					if (this.formData.password != this.formData.rePassword) {
						this.$util.showToast({
							title: '两次密码不一致'
						});
						return false;
					}
					return true;
				} else {
					this.$util.showToast({
						title: validate.error
					});
					return false;
				}
			},
			// 获取验证码
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
			// 发送动态验证码
			async sendDynaCode() {
				if (this.formData.captcha.length == 0) {
					this.$util.showToast({
						title: this.$lang('captchaPlaceholder')
					});
					return;
				}

				if (this.isSend) return;
				this.isSend = true;

				var url,
					data = {
						captcha_id: this.captcha.id,
						captcha_code: this.formData.captcha
					};
				data[this.findMode] = this.formData.mobileOrEmail;
				if (this.findMode == 'mobile') {
					url = '/api/findpassword/mobilecode';
				} else if (this.findMode == 'email') {
					url = '/api/findpassword/emailcode';
				}

				this.$api.sendRequest({
					url: url,
					data: data,
					success: res => {
						let data = res.data;
						if (data.key) {
							if (this.seconds == 120 && this.timer == null) {
								this.timer = setInterval(() => {
									this.seconds--;
									this.codeText = '已发送(' + this.seconds + 's)';
								}, 1000);
							}
							uni.setStorageSync('forgot_password_token', data.key);
						} else {
							this.$util.showToast({
								title: res.message
							});
							this.isSend = false;
						}
					},
					fail: res => {
						this.isSend = false;
						this.getCaptcha();
					}
				});
			},
			save() {
				if (this.vertify()) {
					var url,
						data = {
							code: this.formData.dynacode,
							key: uni.getStorageSync('forgot_password_token'),
							password: this.formData.password
						};
					data[this.findMode] = this.formData.mobileOrEmail;
					if (this.findMode == 'mobile') {
						url = '/api/findpassword/mobile';
					} else if (this.findMode == 'email') {
						url = '/api/findpassword/email';
					}
					this.$api.sendRequest({
						url: url,
						data: data,
						success: res => {
							this.$util.showToast({
								title: res.message
							});
							if (res.code == 0) {
								setTimeout(() => {
									uni.removeStorage({
										key: 'forgot_password_token'
									});
									this.$util.redirectTo('/pages/login/login/login', {}, 'redirectTo');
								}, 1000);
							} else {
								this.isSend = false;
							}
						}
					});
				}
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
						}
					}
				});
			}
		},
		watch: {
			seconds(value) {
				if (value == 0) {
					this.seconds = 120;
					this.codeText = '获取验证码';
					this.isSend = false;
					clearInterval(this.timer);
				}
			}
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		page {
			background: #ffffff !important;
		}

		.captcha {
			width: 170rpx;
			height: 50rpx;
		}

		.find-head {

			/* 自定义导航 */
			.head-nav {
				width: 100%;
				height: var(--status-bar-height);
			}

			.head-content {
				position: relative;
				width: 750rpx;
				height: 540rpx;
				background-size: contain;

				.head-return {
					padding-left: 30rpx;
					height: 90rpx;
					line-height: 90rpx;
					color: #fff;
					font-size: $ns-font-size-lg;

					text {
						display: inline-block;
						margin-right: 10rpx;
					}
				}
			}
		}

		.find-form {
			padding: 100rpx 80rpx 0;

			.form-input {
				margin-top: 60rpx;
				height: 60rpx;
				border-bottom: 2rpx solid $ns-bg-color-gray;

				input {
					padding: 0;
					font-size: $ns-font-size-base;
				}
			}

			.find-btn {
				margin: 100rpx 0 0;
				border-radius: 40rpx;
				color: #fff;
			}
		}

		.forget-section {
			display: flex;
			flex-direction: row-reverse;
			justify-content: space-between;
			margin-top: 10rpx;
			height: 70rpx;
			line-height: 70rpx;
		}

		.align-type {
			display: flex;
			justify-content: space-between;
		}
	// }
</style>
