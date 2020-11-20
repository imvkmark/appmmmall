import validate from '@/common/js/validate.js';
export default {
	data() {
		return {
			registerConfig: {},
			indent: 'all',
			customNavTitle: "",
			memberInfo: {
				headimg: ''
			},
			formData: {
				userHeadImg: '',
				number: '', //账号
				nickName: '', //昵称
				currentPassword: '', //当前密码
				newPassword: '', //新密码
				confirmPassword: '', //确认密码
				mobile: '', //手机号
				mobileVercode: '', //手机验证码
				mobileDynacode: '', //手机动态验证吗
				mobileCodeText: "",
				email: '', //邮箱
				emailVercode: '', //邮箱验证码
				emailDynacode: '', //邮箱动态验证码
				emailCodeText: ""
			},
			memberInfoformData: {
				userHeadImg: '',
				number: '', //账号
				nickName: '', //昵称
				currentPassword: '', //当前密码
				newPassword: '', //新密码
				confirmPassword: '', //确认密码
				mobile: '', //手机号
				mobileVercode: '', //手机验证码
				mobileDynacode: '', //手机动态验证吗
				mobileCodeText: "",
				email: '', //邮箱
				emailVercode: '', //邮箱验证码
				emailDynacode: '', //邮箱动态验证码
				emailCodeText: ""
			},
			langList: [],
			langIndex: 0,
			seconds: 120,
			timer: null,
			isSend: false,
			captcha: {
				id: '',
				img: ''
			},
			isIphoneX: false
		};
	},
	onLoad(option) {
		this.customNavTitle = this.$lang('title');
		this.formData.mobileCodeText = this.$lang('findanimateCode');
		this.formData.emailCodeText = this.$lang('findanimateCode');
		if (option.back) {
			this.back = option.back;
		}
		this.getCaptcha();

		if (option.action == 'mobile') {
			this.indent = 'mobile';
			this.customNavTitle = this.$lang('bindPhone');
		}
		this.getInfo();
		this.getRegisterConfig();
		this.isIphoneX = this.$util.uniappIsIPhoneX()
	},
	onShow() {
		this.initLang();
	},
	onHide() {
		this.seconds = 120;
		this.formData.mobileCodeText = '获取动态码';
		this.formData.emailCodeText = '获取动态码';
		this.isSend = false;
		clearInterval(this.timer);
	},
	watch: {
		seconds(value) {
			if (value == 0) {
				this.seconds = 120;
				this.formData.mobileCodeText = '获取动态码';
				this.formData.emailCodeText = '获取动态码';
				this.isSend = false;
				clearInterval(this.timer);
			}
		}
	},
	methods: {
		// 初始化语言
		initLang() {
			//获取语言列表
			this.langList = this.$langConfig.list();
			if (!uni.getStorageSync("lang")) {
				this.langIndex = 0;
			} else {
				for (let i = 0; i < this.langList.length; i++) {
					if (this.langList[i].value == uni.getStorageSync("lang")) {
						this.langIndex = i;
						break;
					}
				}
			}
			this.$langConfig.refresh();
		},
		// 初始化用户信息
		getInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.memberInfo = res.data;
						this.memberInfoformData.userHeadImg = this.memberInfo.headimg;
						this.memberInfoformData.number = this.memberInfo.username; //账号
						this.memberInfoformData.nickName = this.memberInfo.nickname; //昵称
						this.memberInfoformData.mobile = this.memberInfo.mobile; //手机号
						this.memberInfoformData.email = this.memberInfo.email; //邮箱

						this.formData.nickName = this.memberInfo.nickname; //昵称
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		// 切换编辑项
		modifyInfo(type) {
			let vm = this;
			if (type == 'name') {
				this.indent = type;
				this.customNavTitle = this.$lang('modifyNickname');
			}
			if (type == 'password') {
				this.indent = type;
				this.customNavTitle = this.$lang('modifyPassword');
			}
			if (type == 'paypassword') {
				if (this.memberInfo.mobile == '') {
					uni.showModal({
						title: '提示',
						content: '设置支付密码需要先绑定手机号,是否立即绑定?',
						success: res => {
							if (res.confirm) {
								this.indent = 'mobile';
								this.getCaptcha();
								this.customNavTitle = this.$lang('bindPhone');
							}
						}
					})
				} else {
					this.$util.redirectTo('/otherpages/member/pay_password/pay_password', {
						back: '/otherpages/member/info/info'
					});
				}
			}
			if (type == 'mobile') {
				this.indent = type;
				this.getCaptcha();
				this.customNavTitle = this.$lang('bindPhone');
			}
			if (type == 'mailBox') {
				this.indent = type;
				this.getCaptcha();
				this.customNavTitle = this.$lang('bindEmail');
			}
			if (type == 'language') {
				// this.customNavTitle = this.$lang('lang');
				let newArray = [];
				for (let i = 0; i < this.langList.length; i++) {
					newArray.push(this.langList[i].name)
				}
				uni.showActionSheet({
					itemList: newArray,
					success: function(res) {
						if (vm.langIndex != res.tapIndex) {
							vm.$langConfig.change(vm.langList[res.tapIndex].value)
						}
					}
				});
			}
		},
		// 导航返回
		NavReturn() {
			if (this.indent == 'all') {
				if (this.back) {
					this.$util.redirectTo(this.back, {}, 'redirectTo');
				} else {
					this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
				}
			} else {
				this.indent = 'all';
				this.customNavTitle = this.$lang('title');
				this.initFormData();
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
		// 退出登录
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorage({
							key: 'token',
							success: res => {
								uni.removeStorage('userInfo');
								this.$util.showToast({
									title: "退出成功",
									success: () => {
										uni.setStorageSync('loginLock', 1);
										setTimeout(() => {
											this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
										}, 1000);
									}
								});
							}
						});
					}
				}
			});
		},
		headImage() {
			this.$util.redirectTo("/otherpages/member/modify_face/modify_face");
		},
		// 检测手机或邮箱是否已绑定
		async testBinding(type) {
			var res = true;
			if (type == 'email') {
				res = await this.checkEmail();
			} else if (type == 'mobile') {
				res = await this.checkMobile();
			}
			return res;
		},

		save(type) {
			switch (type) {
				case 'name':
					this.modifyNickName();
					break;
				case 'password':
					this.modifyPassword();
					break;
				case 'mobile':
					this.modifyMobile();
					break;
				case 'email':
					this.modifyEmail();
					break;
			}
		},

		// ------------------------修改昵称------------------------------

		modifyNickName() {
			if (this.formData.nickName == this.memberInfo.nickname) {
				this.$util.showToast({
					title: this.$lang('alikeNickname')
				});
				return;
			}
			var rule = [{
				name: 'nickName',
				checkType: 'required',
				errorMsg: this.$lang('noEmityNickname')
			}];
			if (!rule.length) return;
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				this.$api.sendRequest({
					url: '/api/member/modifynickname',
					data: {
						nickname: this.formData.nickName
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang("updateSuccess")
							});
							this.NavReturn();
							this.getInfo();
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},

		// ------------------------修改密码------------------------------
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
		},
		modifyPassword() {
			if (this.memberInfo.password) {
				var rule = [{
						name: 'currentPassword',
						checkType: 'required',
						errorMsg: this.$lang("pleaseInputOldPassword")
					},
					{
						name: 'newPassword',
						checkType: 'required',
						errorMsg: this.$lang("pleaseInputNewPassword")
					}
				];
			} else {
				var rule = [{
						name: 'mobileVercode',
						checkType: 'required',
						errorMsg: this.$lang("confirmCodeInput")
					},
					{
						name: 'mobileDynacode',
						checkType: 'required',
						errorMsg: this.$lang("animateCodeInput")
					},
					{
						name: 'newPassword',
						checkType: 'required',
						errorMsg: this.$lang("pleaseInputNewPassword")
					}
				];
			}

			let regConfig = this.registerConfig;
			if (regConfig.pwd_len > 0) {
				rule.push({
					name: 'newPassword',
					checkType: 'lengthMin',
					checkRule: regConfig.pwd_len,
					errorMsg: '新密码长度不能小于' + regConfig.pwd_len + '位'
				});
			}
			if (regConfig.pwd_complexity) {
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
					name: 'newPassword',
					checkType: 'reg',
					checkRule: reg,
					errorMsg: passwordErrorMsg
				});
			}
			var checkRes = validate.check(this.formData, rule);
			if (checkRes) {
				if (this.formData.currentPassword == this.formData.newPassword) {
					this.$util.showToast({
						title: '新密码不能与原密码相同'
					});
					return;
				}
				if (this.formData.newPassword != this.formData.confirmPassword) {
					this.$util.showToast({
						title: '两次密码不一致'
					});
					return;
				}
				this.$api.sendRequest({
					url: '/api/member/modifypassword',
					data: {
						new_password: this.formData.newPassword,
						old_password: this.formData.currentPassword,
						code: this.formData.mobileDynacode,
						key: uni.getStorageSync("password_mobile_key"),
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang('updateSuccess')
							});
							this.NavReturn();
							this.getInfo();
							uni.removeStorageSync('password_mobile_key');
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},

		// ------------------------修改手机号------------------------------
		// 验证手机号
		vertifyMobile() {
			var rule = [{
				name: 'mobile',
				checkType: 'required',
				errorMsg: '请输入手机号'
			}, {
				name: 'mobile',
				checkType: 'phoneno',
				errorMsg: '请输入正确的手机号'
			}];
			var checkRes = validate.check(this.formData, rule);
			if (!checkRes) {
				this.$util.showToast({
					title: validate.error
				});
				return false;
			}
			return true;
		},
		// 检测手机号是否存在
		async checkMobile() {
			if (!this.vertifyMobile()) return;
			let res = await this.$api.sendRequest({
				url: '/api/member/checkmobile',
				data: {
					mobile: this.formData.mobile
				},
				async: false
			});
			if (res.code != 0) {
				this.$util.showToast({
					title: res.message
				});
				return false;
			}
			return true;
		},

		// 发送短信动态码
		async bindMoblieCode() {
			if (this.seconds != 120) return;
			var rule = [{
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: this.$lang("surePhoneNumber")
				},
				{
					name: 'mobileVercode',
					checkType: 'required',
					errorMsg: this.$lang("confirmCodeInput")
				},
			];

			var checkRes = validate.check(this.formData, rule);

			if (checkRes && !this.isSend) {
				this.isSend = true;
				this.$api.sendRequest({
					url: '/api/member/bindmobliecode',
					data: {
						mobile: this.formData.mobile,
						captcha_id: this.captcha.id,
						captcha_code: this.formData.mobileVercode
					},
					success: res => {
						let data = res.data;
						if (data.key) {
							if (this.seconds == 120 && this.timer == null) {
								this.timer = setInterval(() => {
									this.seconds--;
									this.formData.mobileCodeText = '已发送(' + this.seconds + 's)';
								}, 1000);
							}
							uni.setStorageSync('mobile_key', data.key);
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
			} else {
				this.$util.showToast({
					title: validate.error ? validate.error : '请勿重复点击'
				});
			}
		},
		async modifyMobile() {

			var mobileRule = [{
					name: 'mobile',
					checkType: 'phoneno',
					errorMsg: this.$lang("surePhoneNumber")
				},
				{
					name: 'mobileVercode',
					checkType: 'required',
					errorMsg: this.$lang("confirmCodeInput")
				},
				{
					name: 'mobileDynacode',
					checkType: 'required',
					errorMsg: this.$lang("animateCodeInput")
				},
			];
			var checkRes = validate.check(this.formData, mobileRule);

			if (checkRes) {
				if (this.formData.mobile == this.memberInfo.mobile) {
					this.$util.showToast({
						title: this.$lang("alikePhone")
					});
					return;
				}
				this.$api.sendRequest({
					url: '/api/member/modifymobile',
					data: {
						mobile: this.formData.mobile,
						captcha_id: this.captcha.id,
						captcha_code: this.formData.mobileVercode,
						code: this.formData.mobileDynacode,
						key: uni.getStorageSync("mobile_key"),
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang("updateSuccess")
							});
							if (this.back) {
								this.$util.redirectTo('/otherpages/member/pay_password/pay_password', {
									'back': this.back
								}, 'redirectTo')
							} else {
								this.NavReturn();
								this.getInfo();
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						this.isSend = false;
						this.getCaptcha();
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},

		// ------------------------修改邮箱------------------------------
		// 验证邮箱号
		vertifyEmail() {
			var emailRule = [{
					name: 'email',
					checkType: 'email',
					errorMsg: this.$lang("emialInputSure")
				},
				{
					name: 'emailVercode',
					checkType: 'required',
					errorMsg: this.$lang("confirmCodeInput")
				},
			];
			var checkRes = validate.check(this.formData, emailRule);
			if (checkRes) {
				return true;
			} else {
				this.$util.showToast({
					title: validate.error
				});
				return false;
			}
		},
		// 检测邮箱是否存在
		async checkEmail() {
			if (!this.vertifyEmail()) return false;
			let res = await this.$api.sendRequest({
				url: '/api/member/checkemail',
				data: {
					email: this.formData.email
				},
				async: false
			});
			if (res.code != 0) {
				this.$util.showToast({
					title: res.message
				});
				return false;
			}
			return true;
		},
		// 发送邮箱动态码
		async bingEmailCode() {
			var test = await this.testBinding('email');
			if (!test) return;
			if (this.seconds != 120) return;
			var rule = [{
					name: 'email',
					checkType: 'required',
					errorMsg: '请输入邮箱号'
				},
				{
					name: 'email',
					checkType: 'email',
					errorMsg: '请输入正确的邮箱号'
				},
				{
					name: 'emailVercode',
					checkType: 'required',
					errorMsg: '请输入验证码'
				}
			];

			var checkRes = validate.check(this.formData, rule);

			if (checkRes && !this.isSend) {
				this.isSend = true;
				this.$api.sendRequest({
					url: '/api/member/bingemailcode',
					data: {
						email: this.formData.email,
						captcha_id: this.captcha.id,
						captcha_code: this.formData.emailVercode
					},
					success: res => {
						let data = res.data;
						if (data.key) {
							if (this.seconds == 120 && this.timer == null) {
								this.timer = setInterval(() => {
									this.seconds--;
									this.formData.emailCodeText = '已发送(' + this.seconds + 's)';
								}, 1000);
							}
							uni.setStorageSync('email_key', data.key);
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
			} else {
				this.$util.showToast({
					title: validate.error ? validate.error : '请勿重复点击'
				});
			}
		},
		async modifyEmail() {
			var emailRule = [{
					name: 'email',
					checkType: 'email',
					errorMsg: this.$lang("emialInputSure")
				},
				{
					name: 'emailVercode',
					checkType: 'required',
					errorMsg: this.$lang("confirmCodeInput")
				},
				{
					name: 'emailDynacode',
					checkType: 'required',
					errorMsg: this.$lang("animateCodeInput")
				},
			];
			var checkRes = validate.check(this.formData, emailRule);

			if (checkRes) {
				if (this.formData.email == this.memberInfo.email) {
					this.$util.showToast({
						title: this.$lang("alikeMail")
					});
					return;
				}
				this.$api.sendRequest({
					url: '/api/member/modifyemail',
					data: {
						email: this.formData.email,
						captcha_id: this.captcha.id,
						captcha_code: this.formData.emailVercode,
						code: this.formData.emailDynacode,
						key: uni.getStorageSync("email_key"),
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang("updateSuccess")
							});
							this.NavReturn();
							this.getInfo();
							uni.removeStorageSync('email_key');
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						this.isSend = false;
						this.getCaptcha();
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},
		/**
		 * 修改密码发送动态码
		 */
		passwordMoblieCode() {
			if (this.seconds != 120) return;

			if (this.formData.mobileVercode == '') {
				this.$util.showToast({
					title: this.$lang("confirmCodeInput")
				});
				return;
			}

			if (!this.isSend) {
				this.isSend = true;
				this.$api.sendRequest({
					url: '/api/member/pwdmobliecode',
					data: {
						captcha_id: this.captcha.id,
						captcha_code: this.formData.mobileVercode
					},
					success: res => {
						let data = res.data;
						if (data.key) {
							if (this.seconds == 120 && this.timer == null) {
								this.timer = setInterval(() => {
									this.seconds--;
									this.formData.mobileCodeText = '已发送(' + this.seconds + 's)';
								}, 1000);
							}
							uni.setStorageSync('password_mobile_key', data.key);
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
			} else {
				this.$util.showToast({
					title: '请勿重复点击'
				});
			}
		},
		initFormData() {
			this.formData.currentPassword = '';
			this.formData.newPassword = '';
			this.formData.confirmPassword = '';
			this.formData.mobileVercode = '';
			this.formData.mobileDynacode = '';
			this.formData.emailVercode = '';
			this.formData.emailDynacode = '';
			this.formData.mobile = '';
			this.formData.email = '';
		}
	}
};
