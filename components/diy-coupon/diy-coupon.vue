<template>
	<view v-if="couponList.length > 0" :style="{backgroundColor: value.backgroundColor}">
		<template>
			<scroll-view class="coupon-all" :scroll-x="true" :show-scrollbar="false">
				<view class="coupon-box" v-for="(item, index) in couponList" :key="index">
					<view class="coupon ns-bg-color"  @click="couponTap(item, index)" :style="'background-image:url('+ $util.img('upload/uniapp/coupon/coupon1.png') +');background-size:100% 100%'
					">
						<view class="coupon-info">
							<view class="coupon-num" v-if="!item.discount||item.discount == '0.00'">
								<text class="ns-font-size-base coupon-sign">￥</text>
								<text class="coupon-size">{{ Number(item.money) }}</text>
							</view>
							<view class="coupon-num" v-else>
								<text class="coupon-size">{{ Number(item.discount) }}</text>
								<text class="ns-font-size-base coupon-sign">折</text>
							</view>
							<view class="coupon-type">
								<text v-if="item.at_least > 0">满{{ Number(item.at_least) }}元可用</text>
								<text v-else >无门槛优惠券</text>
							</view>
						</view>
						<view class="coupon-get" v-if="item.useState == 0">
							<view>领</view>
							<view>取</view>
						</view>
						<view class="coupon-get" v-if="item.useState == 1">
							<view>去</view>
							<view>使</view>
							<view>用</view>
						</view>
						<view class="coupon-get" v-if="item.useState == 2">
							<view class="">去</view>
							<view class="">使</view>
							<view class="">用</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</template>
	</view>
</template>

<script>
	// 优惠券
	export default {
		components: {},
		name: 'diy-coupon',
		props: {
			value: {
				type: Object,
				default: () => {
					return {};
				}
			},
			siteId: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				token: '',
				couponList: [],
				isHave: true,
				couponBtnSwitch: false,
				couponTab:1				,//优惠券类型   0.店铺优惠券     1.品台优惠券
			};
		},
		created() {
			this.getCanReceiveCouponQuery();
		},
		methods: {
			//获取优惠券列表
			getCanReceiveCouponQuery() {
				this.couponTab=this.siteId?0:1;
				var url;
				if (this.couponTab == 0) {
					url = '/coupon/api/coupon/typepagelists';
				} else {
					url = '/platformcoupon/api/platformcoupon/typepagelists';
				}
				this.$api.sendRequest({
					url: url,
					data: {
						page: 1,
						page_size: 10,
						site_id: this.siteId
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							this.couponList = data.list;
							this.couponList.forEach(v => {
								v.useState = 0;
							});
						}
					}
				});
			},
			// 领取优惠券
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
							let list = this.couponList;
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
							this.$forceUpdate();
						},
						fail: res => {
							this.couponBtnSwitch = false;
						}
					});
				} else {
					this.couponBtnSwitch = false;
					this.$util.redirectTo('/pages/login/login/login');
				}
			},
			couponTap(item, index) {
				if(item.useState == 0) this.receiveCoupon(item, index)
				else this.toGoodList(item);
			},
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
			}
		}
	};
</script>

<style lang="scss">
	/* 样式一 */
	.coupon-all {
		width: 100%;
		flex-direction: row;
		white-space: nowrap;
		padding: 30rpx $ns-padding;
		box-sizing: border-box;
		line-height: 1;
	}

	.coupon-box {
		display: inline-block;
		margin-right: $ns-margin;
		position: relative;
	}

	.coupon {
		width: 320rpx;
		height: 140rpx;
		border-radius: $ns-border-radius;
		overflow: hidden;
		display: flex;
		justify-content: space-between;

		.coupon-info {
			width: 71%;
			height: 100%;
			padding: 10rpx $ns-padding;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.coupon-type {
				color: #ffffff;
				font-size: $ns-font-size-sm;
				text-align: center;
			}

			.coupon-num {
				display: flex;
				align-items: flex-end;
				justify-content: center;
				font-size: 50rpx;
				margin-bottom: 10rpx;

				.coupon-sign {
					margin-bottom: 4rpx;
				}

				text {
					line-height: 1;
					color: #ffffff;
					
				}
			}
		}

		.coupon-get {
			width: 26%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			view {
				line-height: 1.2;
				color: #ffffff;
			}
		}
	}


	/*样式二*/
	.coupon-all2 {
		padding: 10rpx 0 10rpx;
		background: #fff;
		overflow: hidden;
	}

	.coupon-all2 .coupons-style2 {
		width: 31.33%;
		height: 180rpx;
		display: inline-block;
		float: left;
		background-size: 100% 100%;
		margin: 0 0 1.5% 1.5%;
		color: #fff;
		text-align: center;
	}

	.coupon-all2 .coupons-style2 .money-number {
		display: block;
		margin: 0;
		padding-top: 30rpx;
		line-height: 44rpx;
		font-size: 40rpx;
		color: #fff;
		text-align: center;
	}

	.coupon-all2 .coupons-style2 .explanation {
		color: rgba(255, 255, 255, 0.7);
		text-align: center;
	}

	.coupon-all2 .coupons-style2 .get {
		position: relative;
		color: rgba(255, 255, 255, 0.7);
	}
</style>
<style scoped>
	.coupon-all>>>.uni-scroll-view::-webkit-scrollbar {
		display: none;
	}
</style>
