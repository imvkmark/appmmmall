<template>
	<view :class="themeStyle">
		<view @touchmove.prevent.stop>
			<view>
				<view class="info-head" @click="NavReturn()">
					<view class="head-nav" :class="{active:isIphoneX}"></view>
					<uni-nav-bar left-icon="back" :title="customNavTitle" :border="false"></uni-nav-bar>
				</view>
				<view v-if="indent == 'all'" class="info-wrap">
					<!-- 头像 -->
					<view @click="headImage" class="info-list-cell info-item info-list-con" hover-class="cell-hover">
						<text class="cell-tit">{{ $lang('headImg') }}</text>
						<view class="info-list-head cell-tip">
							<image :src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().default_headimg"
							 @error="memberInfo.headimg = $util.getDefaultImage().default_headimg" mode="aspectFill" />
						</view>
						<text class="cell-more"></text>
					</view>
					<!-- 账号 -->
					<view class="info-list-cell info-list-con" hover-class="cell-hover">
						<text class="cell-tit">{{ $lang('account') }}</text>
						<text class="cell-tip">{{ memberInfoformData.number }}</text>
						<text class="cell-state"></text>
					</view>
					<!-- 昵称 -->
					<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('name')">
						<text class="cell-tit">{{ $lang('nickname') }}</text>
						<text class="cell-tip">{{ memberInfoformData.nickName }}</text>
						<text class="cell-more"></text>
					</view>
					<!-- 密码 -->
					<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('password')">
						<text class="cell-tit">{{ $lang('password') }}</text>
						<text class="cell-more"></text>
					</view>
					<!-- 支付密码 -->
					<view class="info-list-cell" hover-class="cell-hover" @click="modifyInfo('paypassword')">
						<text class="cell-tit">{{ $lang('paypassword') }}</text>
						<text class="cell-more"></text>
					</view>

					<!-- 手机号 -->
					<view class="info-list-cell info-item info-list-con" @click="modifyInfo('mobile')">
						<text class="cell-tit">{{ $lang('mobilePhone') }}</text>
						<text v-if="memberInfoformData.user_tel == ''" class="cell-tip">{{ $lang('bindMobile') }}</text>
						<text v-else class="cell-tip">{{ memberInfoformData.mobile }}</text>
						<text class="cell-more"></text>
					</view>
					<!-- 邮箱 -->
					<view class="info-list-cell" hover-class="cell-hover" @click="modifyInfo('mailBox')">
						<text class="cell-tit">{{ $lang('emial') }}</text>
						<text v-if="memberInfoformData.user_email == ''" class="cell-tip">{{ $lang('bindEmail') }}</text>
						<text v-else class="cell-tip">{{ memberInfoformData.email }}</text>
						<text class="cell-more"></text>
					</view>
					<!-- 实名认证 -->
					<!-- <view class="info-list-cell info-item info-list-con" hover-class="cell-hover" @click="modifyInfo('mailBox')">
						<text class="cell-tit">{{ $lang('shimingrenzheng') }}</text>
						<text v-if="memberInfoformData.user_email == ''" class="cell-tip">{{ $lang('bindEmail') }}</text>
						<text v-else class="cell-tip">{{ memberInfoformData.email }}</text>已认证
						<text class="cell-more"></text>
					</view> -->
					<!-- 语言 -->
					<!-- <view class="info-list-cell info-item info-list-con" hover-class="cell-hover" @click="modifyInfo('language')">
						<text class="cell-tit">{{ $lang('lang') }}</text>
						<text class="cell-tip">{{ langList[langIndex].name }}</text>
						<text class="cell-more"></text>
					</view> -->
					<!-- 退出登录 -->
					<view class="save-item" @click="logout">
						<button type="primary" class="ns-bg-color">{{ $lang('logout') }}</button>
					</view>
				</view>
				<!-- 修改昵称 -->
				<view v-if="indent == 'name'" class="edit-info">
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('nickname') }}</text>
						<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('nickPlaceholder')"
						 v-model="formData.nickName" />
					</view>
					<view class="save-item" @click="save('name')">
						<button type="primary">{{ $lang('save') }}</button>
					</view>
				</view>
				<!-- 修改密码 -->
				<view v-if="indent == 'password'" class="edit-info">
					<view class="edit-info-box" v-if="memberInfo.password">
						<text class="info-name">{{ $lang('nowPassword') }}</text>
						<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('nowPassword')"
						 v-model="formData.currentPassword" />
					</view>
					<block v-else>
						<view class="edit-info-box">
							<text class="info-name">{{ $lang('confirmCode') }}</text>
							<input class="uni-input info-content" type="number" maxlength="4" :placeholder="$lang('confirmCode')" v-model="formData.mobileVercode" />
							<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
						</view>
						<view class="edit-info-box">
							<text class="info-name">{{ $lang('animateCode') }}</text>
							<input class="uni-input info-content" type="number" maxlength="6" :placeholder="$lang('animateCode')" v-model="formData.mobileDynacode" />
							<button type="primary" class="dynacode" @click="passwordMoblieCode()">{{ formData.mobileCodeText }}</button>
						</view>
						<view class="ns-text-color-gray ns-font-size-sm set-pass-tips">
							点击“获取动态码”，将会向您已绑定的手机号{{ memberInfoformData.mobile | mobile }}发送验证码
						</view>
					</block>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('newPassword') }}</text>
						<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('newPassword')"
						 v-model="formData.newPassword" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('confirmPassword') }}</text>
						<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('confirmPassword')"
						 v-model="formData.confirmPassword" />
					</view>

					<view class="save-item" @click="save('password')">
						<button type="primary">{{ $lang('save') }}</button>
					</view>
				</view>
				<!-- 修改手机号 -->
				<view v-if="indent == 'mobile'" class="edit-info">
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('phoneNumber') }}</text>
						<input class="uni-input info-content" type="number" maxlength="11" :placeholder="$lang('phoneNumber')" v-model="formData.mobile" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('confirmCode') }}</text>
						<input class="uni-input info-content" type="number" maxlength="4" :placeholder="$lang('confirmCode')" v-model="formData.mobileVercode" />
						<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('animateCode') }}</text>
						<input class="uni-input info-content" type="number" maxlength="6" :placeholder="$lang('animateCode')" v-model="formData.mobileDynacode" />
						<button type="primary" class="dynacode" @click="bindMoblieCode()">{{ formData.mobileCodeText }}</button>
					</view>

					<view class="save-item" @click="save('mobile')">
						<button type="primary">{{ $lang('save') }}</button>
					</view>
				</view>
				<!-- 修改邮箱 -->
				<view v-if="indent == 'mailBox'" class="edit-info">
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('emial') }}</text>
						<input class="uni-input info-content" type="email" maxlength="20" :placeholder="$lang('emialInput')" v-model="formData.email" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('confirmCode') }}</text>
						<input class="uni-input info-content" type="number" maxlength="4" :placeholder="$lang('confirmCodeInput')"
						 v-model="formData.emailVercode" />
						<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{ $lang('animateCode') }}</text>
						<input class="uni-input info-content" type="number" maxlength="6" :placeholder="$lang('animateCodeInput')"
						 v-model="formData.emailDynacode" />
						<button type="primary" class="dynacode" @click="bingEmailCode()">{{ formData.emailCodeText }}</button>
					</view>
					<view class="save-item" @click="save('email')">
						<button type="primary">{{ $lang('save') }}</button>
					</view>
				</view>
				<loading-cover ref="loadingCover"></loading-cover>
			</view>
		</view>
	</view>


</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import info from '../public/js/info.js';
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {};
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		mixins: [info],
		onShow() {
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo(
					'/pages/login/login/login', {
						back: '/otherpages/member/info/info'
					},
					'redirectTo'
				);
			}
		},
		filters: {
			mobile(mobile) {
				return mobile.substring(0, 4 - 1) + '****' + mobile.substring(6 + 1);
			}
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		.info-head {
			.head-nav {
				width: 100%;
				height: var(--status-bar-height);
				background: #ffffff;
			}

			.head-nav.active {
				padding-top: 40rpx;
			}
		}

		.captcha {
			width: 170rpx;
			height: 50rpx;
		}

		.info-list-cell {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 40rpx;
			position: relative;
			line-height: 50rpx;
			background-color: #fff;

			&.log-out-btn {
				margin-top: 40rpx;

				.cell-tit {
					margin: auto;
				}
			}

			.info-list-head {
				border: 1px solid $ns-bg-color-gray;
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.info-list-head image {
				max-width: 100%;
				max-height: 100%;
			}

			&.info-item {
				margin-top: 16rpx;
			}

			&.info-list-con:after {
				content: '';
				position: absolute;
				left: 30rpx;
				right: 30rpx;
				bottom: 0;
				border-bottom: 1px solid $ns-bg-color-gray;
			}

			.cell-tip {
				margin-left: auto;
				color: #999;
				color: lighten($ns-text-color-gray, 10%);
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				max-width: 470rpx;
			}

			.cell-more {
				margin-left: 10rpx;
				width: 32rpx;
				height: 100%;
			}
			.cell-state{
				margin-left: 10rpx;
				width: 32rpx;
				height: 100%;
			}

			.cell-more:after {
				content: '';
				display: block;
				width: 12rpx;
				height: 12rpx;

				border: 2rpx solid darken($ns-bg-color-gray, 20%) {
					right-color: transparent;
					bottom-color: transparent;
				}

				transform: rotate(135deg);
			}
		}

		.edit-info-box {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 40rpx;
			min-height: 50rpx;
			background-color: #fff;

			.info-name {
				width: 150rpx;
				font-size: $ns-font-size-base;
				text-align: left;
			}

			.info-content {
				&:first-of-type {
					width: auto !important;
				}

				margin-right: auto;
				width: 250rpx;
				font-size: $ns-font-size-base;
				padding: 0;
			}

			.dynacode {
				margin: 0;
				padding: 0 10rpx;
				width: 250rpx;
				height: 60rpx;
				font-size: $ns-font-size-base;
				line-height: 60rpx;
				color: #fff;
				word-break: break-all;
			}

		}

		.set-pass-tips {
			padding: 20rpx 20rpx 0 20rpx;
		}

		.input-len {
			width: 500rpx !important;
		}

		.save-item {
			margin-top: 50rpx;
		}
	// }
</style>
