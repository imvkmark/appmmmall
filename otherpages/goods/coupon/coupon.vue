<template>
	<view :class="themeStyle">
		<view class="coupon-tab">
			<view class="tab-item" :class="couponTab == 0 ? 'active ns-text-color ns-bg-before' : ''" @click="couponTabOn(0)">店铺优惠劵</view>
			<view class="tab-item" :class="couponTab == 1 ? 'active ns-text-color ns-bg-before' : ''" @click="couponTabOn(1)">平台优惠劵</view>
		</view>
		<view>
			<view>
				<mescroll-uni ref="mescroll" :top="80" @getData="getMemberCounponList" v-if="addonIsExit.coupon">
					<block slot="list">	
						<view class="coupon-list">
							<view class="coupon-li" v-for="(item, index) in list" :key="index">
								<image :src="$util.img('upload/uniapp/coupon/coupon_ysy.png')" mode="widthFix"></image>
								<view class="li-top" @click="toGoodList(item)">
									<view class="top-content-left">
										<view class="coupon-name">
											{{couponTab == 0 ? item.coupon_name : item.platformcoupon_name}}
											<text v-if="couponTab == 0&&item.site_name" class="ns-text-color-gray">({{ item.site_name }})</text>
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
										<block v-if="couponTab==0">
											<text v-if="item.goods_type==1">全场商品</text>
											<text v-else>指定商品</text>
										</block>
										<block v-if="couponTab==1">
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
										<view class="getCoupon ns-text-color" v-if="item.useState==0" @click="receiveCoupon(item, index)">
											立即领取
										</view>
										<view class="getCoupon ns-text-color" v-if="item.useState==1" @click="toGoodList(item)">
											去使用
										</view>
										<view class="iconfont iconright ns-text-color" v-if="item.useState!=2"></view>
						
										<view class="getCoupon ns-text-color-gary" v-if="item.useState==2">
											去使用
										</view>
										<view class="iconfont iconright ns-text-color-gary" v-if="item.useState==2"></view>
									</view>
								</view>
							</view>
						</view>

						<view v-if="list.length == 0"><ns-empty text="当前没有可以领取的优惠券哦!" :isIndex="!1"></ns-empty></view>
					</block>
				</mescroll-uni>
				<loading-cover ref="loadingCover"></loading-cover>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			couponTab:0,    			//优惠券类型
			list: []
		};
	},
	onShow() {
		if (!this.addonIsExit.coupon) {
			this.$util.showToast({
				title: '优惠券插件未安装',
				mask: true,
				duration: 2000
			});
			setTimeout(() => {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}, 2000);
			return;
		}
		// 刷新多语言
		this.$langConfig.refresh();
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
		couponTabOn(index) {
			this.couponTab = index;
			this.list = [];
			this.$refs.mescroll.refresh(false);
		},
		//领取优惠券
		receiveCoupon(item, index) {
			if (this.couponBtnSwitch) return;
			this.couponBtnSwitch = true;
			let token = uni.getStorageSync('token');
			if (token != '') {
				var url,data = {
					site_id: item.site_id,
					get_type :2
				};
				if (this.couponTab == 0) {
					url = '/coupon/api/coupon/receive';
					data.coupon_type_id = item.coupon_type_id;
				} else {
					url = '/platformcoupon/api/platformcoupon/receive';
					data.platformcoupon_type_id = item.platformcoupon_type_id;
				}
				this.$api.sendRequest({
					url,
					data,
					success: res => {
						var data = res.data;
						let msg = res.message;
						if (res.code == 0) {
							msg = '领取成功';
						}
						let list = this.list;
						if(this.couponTab==0){
							if (res.data.is_exist == 1) {
								for (let i = 0; i < list.length; i++) {
									if (list[i].coupon_type_id == item.coupon_type_id) {
										list[i].useState = 1;
									}
								}
							} else {
								for (let i = 0; i < list.length; i++) {
									if (list[i].coupon_type_id == item.coupon_type_id) {
										list[i].useState = 2;
									}
								}
							}
						}else{
							if (res.data.is_exist == 1) {
								for (let i = 0; i < list.length; i++) {
									if (list[i].platformcoupon_type_id == item.platformcoupon_type_id) {
										list[i].useState = 1;
									}
								}
							} else {
								for (let i = 0; i < list.length; i++) {
									if (list[i].platformcoupon_type_id == item.platformcoupon_type_id) {
										list[i].useState = 2;
									}
								}
							}
						}
						this.$util.showToast({
							title: msg
						});
						this.couponBtnSwitch = false;
					},
					fail: res => {
						this.couponBtnSwitch = false;
					}
				});
			} else {
				this.$util.redirectTo('/pages/login/login/login');
			}
		},
		//获取优惠券列表
		getMemberCounponList(mescroll) {
			var url;
			if (this.couponTab == 0) {
				url = '/coupon/api/coupon/typepagelists';
			} else {
				url = '/platformcoupon/api/platformcoupon/typepagelists';
			}
			this.$api.sendRequest({
				url: url,
				data: {
					page: mescroll.num,
					page_size: mescroll.size
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					if(newArr.length){
						newArr.forEach(v => {
							v.useState = 0;
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//去使用优惠券
		toGoodList(item){
			if(this.couponTab==0){
				if (item.goods_type != 1) {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						couponId: item.coupon_type_id,
						site_id:item.site_id
					})
				} else {
					this.$util.redirectTo('/otherpages/shop/list/list', {
						site_id:item.site_id
					})
				}
			}else{
				if (item.use_scenario != 1) {
					this.$util.redirectTo('/pages/goods/list/list', {
						platformcouponTypeId: item.platformcoupon_type_id
					})
				} else {
					this.$util.redirectTo('/pages/goods/list/list', {})
				}
			}
		},
		imageError(index) {
			this.list[index].logo = this.$util.getDefaultImage().default_shop_img;
			this.$forceUpdate();
		},
		couponImageError(index) {
			this.list[index].image = this.$util.img('upload/uniapp/goods/coupon.png');
			this.$forceUpdate();
		}
	},
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var title = '送您一张优惠券,快来领取吧';
		var path = '/otherpages/goods/coupon/coupon';
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
// [data-theme] {
	.coupon-tab {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 10rpx;
		.tab-item {
			height: 70rpx;
			color: $ns-text-color-black;
			line-height: 70rpx;
			box-sizing: border-box;
		}
		.tab-item.active {
			position: relative;
		}
		.tab-item.active::after {
			content: '';
			display: inline-block;
			width: 100%;
			height: 6rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			background: #ffffff;
			border-radius: 3rpx;
		}
		.tab-item:nth-child(1) {
			margin-right: 25%;
		}
	}
	
	
	.coupon-list {
		width: 100%;
		height: 100%;
		padding: $ns-padding;
		box-sizing: border-box;
		background: #f5f5f5;
	
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

	.empty {
		margin-top: 200rpx;
	}
// }
</style>
