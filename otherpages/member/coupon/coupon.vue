<template>
	<view :class="themeStyle">
		<view :class="isIphoneX ? 'iphone-x' : ''" v-if="addonIsExit.coupon">
			<view class="cf-container ns-border-color-gray">
				<view class="tab">
					<view @click="changeType(1)"><text :class="couponType == 1 ? 'ns-text-color active ns-border-color-bottom' : ''">店铺优惠劵</text></view>
					<view @click="changeType(2)"><text :class="couponType == 2 ? 'ns-text-color active ns-border-color-bottom' : ''">平台优惠劵</text></view>
				</view>
			</view>
			<view class="tabs-box">
				<view class="status-tab">
					<view class="ns-border-color" :class="state == 1 ? 'active ns-bg-color ' : 'ns-text-color'" @click="changeState(1)">未使用</view>
					<view class="ns-border-color" :class="state == 2 ? 'active ns-bg-color ns-border-color' : 'ns-text-color'" @click="changeState(2)">已使用</view>
					<view class="ns-border-color" :class="state == 3 ? 'active ns-bg-color' : 'ns-text-color'" @click="changeState(3)">已过期</view>
				</view>
			</view>
			<mescroll-uni ref="mescroll" top="170" @getData="getMemberCounponList">
				<block slot="list">
					<view class="coupon-list">
						<view class="coupon-li" v-for="(item, index) in list" :key="index" @click="toGoodList(item)">
							<image :src="$util.img('upload/uniapp/coupon/coupon_ysy.png')" mode="widthFix"></image>
							<view class="li-top">
								<view class="top-content-left">
									<view class="coupon-name">
										{{couponType == 1 ? item.coupon_name : item.platformcoupon_name}}
										<text v-if="couponType == 1&& item.site_name" class="ns-text-color-gray">({{ item.site_name }})</text>
									</view>
									<view class="coupon-desc">
										<text v-if="item.validity_type">领取之日起{{ item.fixed_term }}日内有效</text>
										<text v-else>有效日期至{{ $util.timeStampTurnTime(item.end_time) }}</text>
									</view>
								</view>
								<view class="top-content-right">
									<block v-if="!item.discount||item.discount == '0.00'">
										<text class="font-big ns-text-color">￥</text>
										<text class="font-big ns-text-color">{{ parseInt(item.money) }}</text>
									</block>
									<block v-else>
										<text class="font-big ns-text-color">{{ parseInt(item.discount) }}</text>
										<text class="font-big ns-text-color">折</text>
									</block>
								</view>
							</view>
							<view class="li-bottom">
								<view class="fonts-sm">
									<block v-if="couponType==1">
										<text v-if="item.goods_type==1">全场商品</text>
										<text v-else>指定商品</text>
									</block>
									<block v-if="couponType==2">
										<text v-if="item.use_scenario==1">全场店铺</text>
										<text v-else>指定店铺</text>
									</block>
									<text v-if="item.at_least > 0">满{{ item.at_least }}元可用</text>
									<text v-else>无门槛优惠券</text>
									<text class="ns-text-color" v-if="item.discount_limit && item.discount_limit != '0.00'">
										(最大优惠{{item.discount_limit}}元)
									</text>
								</view>
								<view class="li-bottom-right">
									<view class="getCoupon ns-text-color" v-if="state == '1'">
										去使用
									</view>
									<view class="iconfont iconright ns-text-color"></view>
								</view>
							</view>
						</view>
						<view v-if="!list.length && showEmpty" class="ns-margin-top"><ns-empty :emptyBtn="emptyBtn" :text="text"></ns-empty></view>
					</view>
				</block>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			couponType: 1, //优惠券类型   0，店铺优惠券   1.平台优惠券
			type: '',
			state: 1,
			list: [],
			isIphoneX: false, //判断手机是否是iphoneX以上
			token: '',
			showEmpty: false,
			emptyBtn: {
				text: '去领取',
				url: '/otherpages/goods/coupon/coupon'
			},
			text: '您还没有优惠券哦'
		};
	},
	onLoad(data) {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		if (!this.addonIsExit.coupon) {
			this.$util.showToast({
				title: '优惠券插件未安装',
				mask: true,
				duration: 2000
			});
			setTimeout(() => {
				this.$util.redirectTo('/pages/member/index/index', {}, 'redirectTo');
			}, 2000);
			return;
		}

		this.token = uni.getStorageSync('token');
		if (this.token == '') {
			this.$util.redirectTo('/pages/login/login/login');
			return;
		}
		if (this.$refs.mescroll) this.$refs.mescroll.refresh(false);
	},
	computed: {
		//vueX页面主题
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		},
		addonIsExit() {
			return this.$store.state.addonIsExit;
		}
	},
	methods: {
		//优惠券类型
		changeType(index) {
			this.list = [];
			this.couponType = index;
			this.$refs.mescroll.refresh(false);
		},
		//切换状态
		changeState(state) {
			this.list = [];
			this.state = state;
			this.$refs.mescroll.refresh(false);
			if (this.state == 1) {
				this.text = '您还没有优惠券哦';
			} else if (this.state == 2) {
				this.text = '您还没有使用过优惠券哦';
			} else {
				this.text = '您还没有过期优惠券哦';
			}
		},
		//获取商品列表
		getMemberCounponList(mescroll) {
			var url = this.couponType == 1 ? '/coupon/api/coupon/memberpage' : '/platformcoupon/api/platformcoupon/memberpage';
			this.$api.sendRequest({
				url,
				data: {
					page: mescroll.num,
					page_size: mescroll.size,
					state: this.state,
					is_own: this.type
				},
				success: res => {
					this.showEmpty = true;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//去使用优惠券
		toGoodList(item) {
			if(this.state!=1) return;
			if (this.couponType == 1) {
				if (item.goods_type != 1) {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						couponId: item.coupon_type_id,
						site_id: item.site_id
					});
				} else {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						site_id: item.site_id
					});
				}
			} else {
				if (item.use_scenario != 1) {
					this.$util.redirectTo('/pages/goods/list/list', {
						platformcouponTypeId: item.platformcoupon_type_id
					});
				} else {
					this.$util.redirectTo('/pages/goods/list/list', {});
				}
			}
		},
		imageError(index) {
			this.list[index].logo = this.$util.getDefaultImage().default_shop_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
// [data-theme] {
	.cf-container {
		background: #fff;
		overflow: hidden;
		border-bottom: 2rpx solid;
	}

	.tab {
		display: flex;
		justify-content: center;

		> view {
			text-align: center;
			width: 40%;

			text {
				display: inline-block;
				line-height: 88rpx;
			}
		}
		.active {
			border-bottom: 4rpx solid $base-color;
		}
	}
	.tabs-box {
		overflow: hidden;
	}
	.status-tab {
		border: 2rpx solid #c0c0c0;
		margin: 20rpx auto 0;
		display: flex;
		align-items: center;
		width: 600rpx;
		border-radius: 100rpx;
		overflow: hidden;
		view {
			width: 200rpx;
			text-align: center;
			color: #838383;
			&.active {
				color: #fff;
				border: 2rpx solid;
			}
			&:not(:last-of-type) {
				border-right: 2rpx solid;
			}
		}
	}
	.coupon-list {
		width: 100%;
		height: 100%;
		padding: $ns-padding;
		box-sizing: border-box;

		.coupon-li {
			width: 702rpx;
			height: 206rpx;
			margin: 0 auto;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-bottom: $ns-margin;
			position: relative;

			image {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}

			.li-top {
				width: 652rpx;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				border-bottom: 1px dashed #E1E1E1;
				position: relative;
				margin-top: 39rpx;
				line-height: 1;
				padding: 0 10rpx;
				box-sizing: border-box;
				padding-bottom: 26rpx;

				.top-content-left {
					display: flex;
					flex-direction: column;
					line-height: 1;
					flex:1;
					overflow: hidden;

					.coupon-name {
						width:100%;
						line-height: 1;
						color: #000;
						font-size: $ns-font-size-base;
						overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
					}

					.coupon-desc {
						line-height: 1;
						color: #ABABAB;
						font-size: 20rpx;
						margin-top: 23rpx;
					}
				}

				.top-content-right {
					display: flex;
					justify-content: center;
					align-items: center;
					line-height: 1;

					.font-sm {
						line-height: 1;
						margin-top: 20rpx;
						font-size: $ns-font-size-lg;
						margin-right: 6rpx;
					}

					.font-big {
						line-height: 1;
						font-size: 70rpx;
					}
				}
			}

			.li-bottom {
				flex: 1;
				width: 652rpx;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				z-index: 5;
				padding: 0 10rpx;
				box-sizing: border-box;

				.fonts-sm {
					color: #ABABAB;
					font-size: $ns-font-size-sm;
				}

				.li-bottom-right {
					display: flex;

					.getCoupon {
						font-size: $ns-font-size-sm;
					}

					.iconright {
						margin-left: 10rpx;
						font-size: $ns-font-size-sm;
					}
				}
			}
		}
	}

	.active {
		border-bottom: 4rpx solid;
	}

	.cf-container {
		background: #fff;
		overflow: hidden;
		border-bottom: 2rpx solid;
	}
	.empty{
		margin-top: 100rpx;
	}
// }
</style>
