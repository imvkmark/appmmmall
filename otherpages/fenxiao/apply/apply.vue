<template>
	<view :class="themeStyle">
		<view class="apply">
			<view v-if="status === ''">
				<image v-if="fenXiaoAgreement.agreement.img" class="apply-adv" :src="$util.img(fenXiaoAgreement.agreement.img)"
				 mode="widthFix"></image>
				<view class="bg ns-gradient-otherpages-fenxiao-apply-apply-bg" :class="themeStyle" v-else>
					<view class="bg-title"><text>请填写申请信息</text></view>
					<view class="bg-img">
						<image :src="$util.img('upload/uniapp/fenxiao/apply/edit.png')" mode="scaleToFill"></image>
					</view>
				</view>

				<view class="apply-wrap">
					<view class="app-info">
						<view class="info">
							<view class="apply-item">
								<view class="title ns-text-color">邀请人</view>
								<text class="shuru">{{ sourceMemberInfo.fenxiao_name }}</text>
							</view>
							<view class="apply-item">
								<view class="title">{{ fenxiaoWords.fenxiao_name }}名称</view>
								<input class="input" type="text" maxlength="30" :placeholder="'请输入' + fenxiaoWords.fenxiao_name + '名称'" v-model="formData.fenXiaoName" />
							</view>
							<view class="apply-item">
								<view class="title">手机号</view>
								<input class="input" type="number" placeholder="请输入手机号" maxlength="11" v-model="formData.mobile" />
							</view>
							<view class="apply-xy" v-if="isAgreement" @click="ckeckedRuler()">
								<view class="iconfont" :class="isChecked ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"></view>
								我已阅读并了解
								<text class="ns-text-color" @click.stop="openPopup">【{{ fenxiaoWords.fenxiao_name }}申请协议】</text>
							</view>
						</view>
					</view>
					<view class="apply-btn">
						<button @click="applyFenXiao" class="ns-gradient-otherpages-fenxiao-apply-apply-bg" :class="themeStyle">申请成为{{ fenxiaoWords.fenxiao_name }}</button>
					</view>
					<view class="apply-message-wrap" v-if="fenxiaoConfig.fenxiao_condition == 2 || fenxiaoConfig.fenxiao_condition == 3">
						<view class="apply-message">
							<view class="apply-message-title ns-bg-before">推广员申请条件</view>
							<text class="apply-message-info ns-font-size-sm" v-if="fenxiaoConfig.fenxiao_condition == 2">
								申请成为{{ fenxiaoWords.fenxiao_name }},需要您的消费次数需要达到{{ fenxiaoConfig.consume_count }}次
							</text>
							<text class="apply-message-info ns-font-size-sm" v-if="fenxiaoConfig.fenxiao_condition == 3">
								申请成为{{ fenxiaoWords.fenxiao_name }},需要您的消费金额需要达到{{ fenxiaoConfig.consume_money }}元
							</text>
						</view>
					</view>
				</view>
			</view>
			<view class="empty" v-else>
				<image :src="$util.img('upload/uniapp/fenxiao/index/no-fenxiao.png')" mode="widthFix"></image>
				<text v-if="status == 1">您已提交{{ fenxiaoWords.fenxiao_name }}申请，等待平台审核</text>
				<block v-else-if="status == -1">
					<text>您提交的{{ fenxiaoWords.fenxiao_name }}申请，已被拒绝，请再接再厉</text>
					<view class="again-btn">
						<button @click="againApply" class="ns-gradient-otherpages-fenxiao-apply-apply-bg" :class="themeStyle">重新申请</button>
					</view>
				</block>
			</view>
			<view @touchmove.prevent v-if="fenXiaoAgreement.document">
				<uni-popup ref="applyPopup" type="center" class="wap-floating">
					<view class="conten-box">
						<view class="title">{{ fenXiaoAgreement.document.title }}</view>
						<view class="content-con">
							<scroll-view scroll-y="true" class="con">
								<rich-text :nodes="fenXiaoAgreement.document.content"></rich-text>
							</scroll-view>
						</view>
						<view class="sure" @click="closePopup">
							<view class="sure-btn ns-bg-color">
								确定
							</view>
						</view>

					</view>
				</uni-popup>
			</view>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
	import validate from 'common/js/validate.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import fenxiaoWords from 'common/js/fenxiao-words.js';

	export default {
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		data() {
			return {
				isChecked: false,
				isShow: true,

				// 推荐人信息
				sourceMemberInfo: {
					fenxiao_name: '无'
				},
				formData: {
					fenXiaoName: '',
					mobile: ''
				},
				fenXiaoAgreement: {
					agreement: {},
					document: {}
				},
				isAgreement: false,
				back: '',
				isAbled: false,
				status: '',
				isSub: false,
				fenxiaoConfig: {
					fenxiao_condition: 0
				},
				basicsConfig: {}
			};
		},
		mixins: [fenxiaoWords],
		onLoad(option) {
			this.getAgreement();
			if (option.back) this.back = option.back;
		},
		async onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			uni.setNavigationBarTitle({
				title: this.fenxiaoWords.fenxiao_name + '申请'
			});

			if (uni.getStorageSync('token')) {
				this.applyStatus()
				this.getSourceMemberInfo();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/otherpages/fenxiao/apply/apply'
				}, 'redirectTo');
			}

			this.getFenxiaoConfig();
			this.getFenxiaoBasicsConfig();
		},
		methods: {
			ckeckedRuler() {
				this.isChecked = !this.isChecked;
			},
			applyStatus() {
				this.$api.sendRequest({
					url: '/fenxiao/api/apply/status',
					data: {},
					success: res => {
						if (res.code >= 0 && res.data) {
							this.status = res.data.status

							if (this.status == 2) {
								this.$util.redirectTo('/otherpages/fenxiao/index/index');
							}
						}
						this.$refs.loadingCover.hide();
					}
				});
			},
			applyFenXiao() {
				if (!this.fenXiaoValidata()) return;
				if (this.isAgreement && !this.isChecked) {
					this.$util.showToast({
						title: '请仔细阅读协议，并勾选'
					});
					return;
				}
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url: '/fenxiao/api/apply/applyfenxiao',
					data: {
						fenxiao_name: this.formData.fenXiaoName,
						mobile: this.formData.mobile
					},
					success: res => {
						if (res.code >= 0 && res.data) {
							if (this.basicsConfig.is_examine == 1) {
								this.applyStatus()
							} else {
								this.$util.redirectTo('/otherpages/fenxiao/index/index');
							}
						} else {
							this.isSub = false;
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			// 申请协议
			getAgreement() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/agreement',
					success: res => {
						if (res.code === 0) {
							this.fenXiaoAgreement = res.data;
							if (this.fenXiaoAgreement.agreement.is_agreement === '1') {
								this.isAgreement = true;
							}
						}
					}
				});
			},
			openPopup() {
				if (this.isAgreement) this.$refs.applyPopup.open();
			},
			closePopup() {
				this.$refs.applyPopup.close();
			},
			fenXiaoValidata() {
				let rule = [];
				// 手机号验证
				rule = [{
						name: 'fenXiaoName',
						checkType: 'required',
						errorMsg: '请输入' + this.fenxiaoWords.fenxiao_name + '名称'
					},
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
				var checkRes = validate.check(this.formData, rule);
				if (checkRes) {
					return true;
				} else {
					this.$util.showToast({
						title: validate.error
					});
					return false;
				}
			},
			// 获取推广人信息
			getSourceMemberInfo() {
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/sourceinfo',
					success: res => {
						if (res.code == 0 && res.data) {
							this.sourceMemberInfo = res.data;
						}
					}
				});
			},
			/**
			 * 重新申请
			 */
			againApply() {
				this.status = '';
			},
			/**
			 * 获取申请条件
			 */
			getFenxiaoConfig() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/fenxiao',
					data: {},
					success: res => {
						if (res.code >= 0 && res.data) {
							this.fenxiaoConfig = res.data;
						}
					}
				});
			},
			/**
			 * 获取分销基本配置
			 */
			getFenxiaoBasicsConfig() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/basics',
					data: {},
					success: res => {
						if (res.code >= 0 && res.data) {
							this.basicsConfig = res.data;
						}
					}
				});
			}
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch')
			return true;
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		input::placeholder {
			text-align: right;
			color: #BABBC1;
			font-size: 28rpx;
		}

		.apply {
			.bg {
				height: 160rpx;
				display: flex;
				justify-content: space-between;
				padding: 30rpx 80rpx 44rpx 80rpx;
				align-items: center;

				.bg-title {
					color: #ffffff;
					font-size: 36rpx;
				}

				.bg-img {
					width: 150rpx;
					height: 150rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.apply-adv {
				width: 100%;
			}

			.apply-wrap {
				position: relative;
				display: flex;
				justify-content: center;
				background-color: #e5e5e5;
				align-items: center;
				box-shadow: 0rpx 20rpx 0rpx 0rpx #ffffff;

				.app-info {
					position: absolute;
					top: -140rpx;
					width: 93%;
					border-radius: 30rpx;
					background-color: #ffffff;

					.info {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						.apply-item {
							display: flex;
							align-items: center;
							justify-content: space-between;
							width: 90%;
							background-color: #f8f8f8;
							padding: 20rpx 10rpx;
							margin: 15rpx 10rpx;
							background-color: #FFFFFF;
							border-bottom: 1rpx solid #f1f1f1;

							.title {
								color: #000000;
								font-size: 28rpx;
							}

							.input {
								width: 70%;
								text-align: right;
								height: 40rpx;
								padding-left: 30rpx;
								font-size: $ns-font-size-base;
								color: #a7a7a7;
							}

							.shuru {
								padding-left: 30rpx;
							}
						}

						.apply-xy {
							display: flex;
							margin: 30rpx 0;
							color: $ns-text-color-gray;
							align-items: center;

							text {
								color: #a7a7a7;
								font-size: 26rpx;
							}

							.iconyuan_checkbox {
								font-size: 28rpx;
								color: #898989;
								margin-right: 14rpx;
								line-height: 1;
							}

							.iconyuan_checked {
								font-size: 28rpx;
								margin-right: 14rpx;
								line-height: 1;
							}
						}
					}
				}

				.apply-btn {
					position: absolute;
					top: 400rpx;
					display: flex;
					justify-content: center;
					width: 100%;
					margin: 60rpx 0 30rpx 0;
					border-radius: 40rpx;

					.apply-btn1 {
						background: $btn-disabled-color;
					}

					button {
						color: #ffffff;
						width: 100%;
					}
				}

				.apply-message-wrap {
					position: absolute;
					margin-bottom: 100rpx;
					top: 570rpx;
					width: 100%;
					padding: 10rpx;
					display: flex;
					justify-content: center;

					.apply-message {
						width: 85%;
						display: flex;
						flex-direction: column;

						.apply-message-title {
							line-height: 1;
							font-size: $ns-font-size-base;
							position: relative;
							padding-left: $ns-padding;
							box-sizing: border-box;
						}

						.apply-message-title::before {
							content: '';
							display: block;
							position: absolute;
							width: 6rpx;
							height: 100%;
							left: 0;
							top: 0;
							border-radius: 6rpx;
						}


						.apply-message-info {
							padding-top: $ns-padding;
							line-height: 1.2;
							color: $ns-text-color-gray;
						}
					}
				}
			}

			.again-btn {
				display: flex;
				justify-content: center;
				width: auto;
				margin: 20rpx 0 30rpx 0;
				border-radius: 40rpx;

				button {
					color: #ffffff;
					width: 100%;
					padding: 0 40rpx;
				}
			}

			.conten-box {
				padding: 0 $ns-padding;
				height: 70vh;
				width: 530rpx;
				border-radius: 15rpx;

				.title {
					width: 100%;
					height: 100rpx;
					line-height: 100rpx;
					font-size: $ns-font-size-lg + 4rpx;
					font-weight: bold;
					text-align: center;
					border-bottom: 2rpx solid $ns-border-color-gray;
				}

				.content-con {
					width: 100%;
					height: calc(100% - 200rpx);

					padding-top: $ns-padding;
					box-sizing: border-box;
				}

				.con {
					width: 100%;
					height: 100%;
				}

				.sure {
					width: 100%;
					height: 100rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					.sure-btn {
						width: 100%;
						height: 60rpx;
						border-radius: 60rpx;
						color: #ffffff;
						text-align: center;
						line-height: 60rpx;
					}
				}
			}

			.empty {
				width: 100%;
				height: 400rpx;
				margin-top: 200rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				image {
					width: 300rpx;
					margin-bottom: 50rpx;
				}

				text {
					font-size: $ns-font-size-sm;
					font-weight: 600;
				}
			}
		}
	// }
</style>

<style>
	/deep/ .uni-popup__wrapper-box {
		border-radius: 20rpx;
	}
</style>
