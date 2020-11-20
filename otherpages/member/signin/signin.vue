<template>
	<view class="signin" :class="themeStyle">
		<!-- #ifdef H5 -->
		<view class="head-nav ns-bg-color"></view>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="head-nav ns-bg-color" :class="{ active: isIphoneX }"></view>
		<!-- #endif -->
		<view class="head-return ns-bg-color" @click="navigateBack()">
			<text class="iconfont iconback_light"></text>
			签到
		</view>
		<block v-if="isUse">
			<view class="sigin-box">
				<view class="sigin-bg ns-bg-color"></view>
				<view class="sigin-calender">
					<view class="sigin-title">{{ time.slice(0, 7) }}</view>
					<view class="calender-list">
						<view class="list-item item-color" v-for="(item, index) in weeks" :key="index">{{ item }}</view>
					</view>
					<view class="calender-list" v-for="(item, index) in MonthData" :key="index">
						<view class="list-item" v-for="(day, num) in item" :key="num" @click="itemActive(day.date, day.disable)">
							<text
								class="day-bg ns-bg-color"
								v-if="startDate && day.date >= startDate && day.date <= endDate && !day.disable"
								:style="'-webkit-mask-box-image: url(' + $util.img('/upload/uniapp/signin/signReady.png') + ')'"
							></text>
							<text class="day-content">
								<block v-if="!startDate">
									<text class="item-color" v-if="day.disable">{{ day.date }}</text>
									<text v-else>{{ day.date }}</text>
								</block>
								<block v-else>
									<text class="item-color" v-if="day.disable">{{ day.date }}</text>
									<text v-else>{{ day.date }}</text>
								</block>
							</text>
						</view>
					</view>
					<view class="sign-btn ns-bg-color" @click="sign()" :class="hasSign == 1 ? 'btn-active' : ''">{{ hasSign == 1 ? '已签到' : '立即签到' }}</view>
				</view>
			</view>

			<view class="sigin-rule" :class="{ 'iphontX-top': isIphoneX }">
				<image :src="$util.img('/upload/uniapp/signin/sag_lj.png')" mode=""></image>
				<image :src="$util.img('/upload/uniapp/signin/sag_lj.png')" mode=""></image>
				<image :src="$util.img('/upload/uniapp/signin/sag_lj.png')" mode=""></image>
				<text class="rule-day-text">已累计签到</text>
				<view class="rule-days">
					<view class="day-item ns-bg-color">
						{{ signDaysSeriesArray.a }}
						<view class="item-mb"></view>
					</view>
					<view class="day-item ns-bg-color">
						{{ signDaysSeriesArray.b }}
						<view class="item-mb"></view>
					</view>
					<view class="day-item ns-bg-color">
						{{ signDaysSeriesArray.c }}
						<view class="item-mb"></view>
					</view>
					<view class="day-item ns-bg-color">
						{{ signDaysSeriesArray.d }}
						<view class="item-mb"></view>
					</view>
					<text>天</text>
					<!-- {{signDaysSeries}}天 -->
				</view>
				<view class="rules-title">
					<view class="rules-b ns-bg-color"></view>
					签到规则
				</view>
				<view class="rule-content">
					<view class="rule-item" v-for="(item, index) in rule" :key="index">
						{{ index + 1 + '） 连续签到' + item.day + '天可得：' }}
						<text v-if="item.point">{{ item.point + '积分，' }}</text>
						<!-- <text v-if="item.balance">{{ item.balance + '红包,' }}</text> -->
						<text v-if="item.growth">{{ item.growth + '成长值' }}</text>
					</view>
					<view class="rule-item">
						{{ rule.length + 1 }}）
						用户可在签到页进行每日签到一次，签到按设置的每日奖励进行发放，连续签到天数大于设置的天数，按最后一日的奖励进行发放；若签到中断则重新计算；
					</view>
				</view>
			</view>

			<view class="sigin-zhanwei"></view>

			<view @touchmove.prevent.stop>
				<uni-popup ref="uniPopup" type="center" class="wap-floating" :maskClick="false">
					<view class="popup-box" @click="close()">
						<text class="iconfont iconclose" @click="$refs.uniPopup.close()"></text>
						<image class="pic" :src="$util.img('upload/uniapp/signin/bg1.png')" mode="widthFix"></image>
						<view class="popup-content">
							<view class="popup-content-wrap">
								<view class="title">恭喜您获得</view>
								<view class="content-wrap">
									<view class="content" v-if="successTip.point">
										<image class="" :src="$util.img('upload/uniapp/signin/point.png')" mode="widthFix"></image>
										<text class="name">积分</text>
										<text class="point ns-text-color">{{ successTip.point }}</text>
									</view>
									<view class="content" v-if="successTip.growth">
										<image class="" :src="$util.img('upload/uniapp/signin/growth.png')" mode="widthFix"></image>
										<text class="name">成长值</text>
										<text class="point ns-text-color">{{ successTip.growth }}</text>
									</view>
								</view>
							</view>
							<view class="other-info ns-bg-color" @click="$refs.uniPopup.close()">知道了</view>
						</view>
					</view>
				</uni-popup>
			</view>
			<loading-cover ref="loadingCover"></loading-cover>
		</block>
	</view>
</template>
<script>
import uniCalender from '@/components/uni-calendar/uni-calendar.vue';
import nsDatePicker from '@/components/ns-datepicker/ns-datepicker.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import signIn from '../public/js/signin.js';
import globalConfig from '@/common/js/golbalConfig.js';
import Calendar from '@/components/uni-calendar/util.js';
export default {
	components: {
		uniPopup,
		nsDatePicker,
		uniCalender
	},
	data() {
		return {
			isIphoneX: false,
			weeks: ['日', '一', '二', '三', '四', '五', '六'],
			signinStyle: {},
			isUse: false
		};
	},
	onLoad(option) {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (option.back) this.back = option.back;
		if (option.redirect) this.redirect = option.redirect;
	},

	computed: {
		signDaysSeriesArray() {
			let array = {
				a: 0,
				b: 0,
				c: 0,
				d: 0
			};
			let num = this.signDaysSeries;
			array.a = num / 1000 > 0 ? Math.floor(num / 1000) : 0;
			array.b = (num % 1000) / 100 > 0 ? Math.floor((num % 1000) / 100) : 0;
			array.c = (num % 100) / 10 > 0 ? Math.floor((num % 100) / 10) : 0;
			array.d = (num % 10) / 1 > 0 ? Math.floor((num % 10) / 1) : 0;

			return array;
		}
	},
	onShow() {
		this.$langConfig.refresh();
		this.getIsUser();
		this.getRule();
		this.getIsSign();
		this.updateTimeList();
	},
	mixins: [signIn, globalConfig]
};
</script>
<style lang="scss">
uni-page-body,
uni-page-refresh {
	height: 100%;
}
.iphontX-top {
	top: 1160;
}
.signin {
	position: relative;
	height: 100%;

	.head-nav {
		width: 100%;
		height: var(--status-bar-height);
	}

	.head-nav.active {
		padding-top: 40rpx;
	}

	.head-return {
		padding-left: 30rpx;
		height: 90rpx;
		line-height: 90rpx;
		color: #fff;
		font-weight: 600;
		font-size: $ns-font-size-lg;
		text {
			display: inline-block;
			margin-right: 10rpx;
		}
	}
	.sigin-box {
		position: relative;
	}
	.sigin-bg {
		width: 100%;
		height: 400rpx;
	}
	.sigin-calender {
		width: 702rpx;
		display: flex;
		flex-direction: column;
		background: #fff;
		position: absolute;
		top: 30rpx;
		left: 24rpx;
		border-radius: 10rpx;
		padding: 44rpx 23rpx 97rpx 23rpx;
		box-sizing: border-box;
		.sigin-title {
			width: 100%;
			border-bottom: 1px solid #e3e3e3;
			text-align: center;
			padding-bottom: 28rpx;
			font-size: 36rpx;
			color: #000;
		}
		.calender-list {
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 10rpx;
			box-sizing: border-box;
			.list-item {
				width: 80rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: $ns-font-size-base;
				position: relative;
				text {
					display: block;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: $ns-font-size-base;
				}
				.day-bg {
					width: 100%;
					height: 100%;
				}
				.day-content {
					position: absolute;
					left: 0;
					top: 0;
				}
			}
			.item-color {
				color: #b8b8b8;
			}
		}
		.sign-btn {
			width: 448rpx;
			height: 72rpx;
			border-radius: 36rpx;
			margin-bottom: 97rpx;
			margin: 0 auto;
			color: #fff;
			margin-top: 68rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.btn-active {
			background: #d2d2d2 !important;
		}
	}

	.sigin-rule {
		width: 702rpx;
		border-radius: 10rpx;
		padding: 97rpx 24rpx;
		background: #fff;
		box-sizing: border-box;
		position: absolute;
		top: 1070rpx;
		/* #ifdef MP-WEIXIN */
		top: 1110rpx;
		/* #endif */
		left: 24rpx;
		margin-bottom: 50rpx;
		image {
			width: 25rpx;
			height: 84rpx;
			position: absolute;
			&:nth-child(1) {
				left: 50rpx;
				top: -54rpx;
			}
			&:nth-child(2) {
				left: 338rpx;
				top: -54rpx;
			}
			&:nth-child(3) {
				left: 634rpx;
				top: -54rpx;
			}
		}
		.rule-day-text {
			display: block;
			width: 100%;
			text-align: center;
			font-size: $ns-font-size-base;
			color: #000;
		}
		.rule-days {
			width: 450rpx;
			height: 128rpx;
			margin: 0 auto;
			margin-top: 49rpx;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			.day-item {
				width: 82rpx;
				height: 128rpx;
				font-size: 86rpx;
				color: #fff;
				border-radius: 10rpx;
				text-align: center;
				line-height: 128rpx;
				position: relative;
				.item-mb {
					width: 100%;
					height: 50%;
					position: absolute;
					background: rgba(255, 255, 255, 0.1);
					left: 0;
					bottom: 0;
				}
			}
			text {
				font-size: $ns-font-size-base;
				color: #000;
				line-height: 1 !important;
			}
		}
		.rules-title {
			font-size: $ns-font-size-lg;
			color: #000;
			display: flex;
			align-items: center;
			margin-top: 63rpx;
			.rules-b {
				width: 6rpx;
				height: 22rpx;
				margin-right: 12rpx;
				border-radius: 3rpx;
			}
		}
		.rule-content {
			margin-top: 39rpx;
			.rule-item {
				font-size: $ns-font-size-base;
				color: #585757;
				margin-bottom: 26rpx;
			}
		}
	}

	.iphontX-top {
		/* #ifdef MP-WEIXIN */
		top: 1150rpx;
		/* #endif */
	}

	.sigin-zhanwei {
		width: 100%;
		height: 50rpx;
		position: absolute;
		left: 0;
		top: 2000rpx;
	}
}

.popup-box {
	position: relative;
	top: 0;
	display: flex;
	flex-direction: column;
	align-items: center;

	.iconclose {
		display: block;
		width: 42rpx;
		height: 42rpx;
		border: 1px solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: #fff;
		position: absolute;
		top: 70rpx;
		right: 0;
	}

	.pic {
		width: 392rpx;
		height: 286rpx;
		position: relative;
		margin-bottom: -40rpx;
	}

	.popup-content {
		background: #ffffff;
		width: 560rpx;
		height: 544rpx;
		margin-top: -100rpx;
		border-radius: 20rpx;
		// display: flex;
		// justify-content: center;
		padding: 0 $ns-padding;
		padding-bottom: $ns-padding;
		box-sizing: border-box;
		background-size: 100% 100rpx;
	}

	.popup-content-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;

		.title {
			color: #000;
			font-size: $ns-font-size-lg;
			margin-top: 180rpx;
		}

		.content-wrap {
			width: 70%;
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;

			.content {
				display: flex;
				align-items: center;
				margin: 5rpx;
				margin-bottom: 10rpx;

				image {
					width: 30rpx;
					height: 30rpx;
				}

				.name {
					margin: 0 10rpx;
				}

				.point {
				}
			}
		}
	}

	.other-info {
		width: 402rpx;
		height: 72rpx;
		border-radius: 36rpx;
		margin: 0 auto;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 80rpx;
	}
}
</style>

<style scoped>
.wap-floating >>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
	display: flex !important;
	flex-direction: column !important;
	align-items: center !important;
}
</style>
