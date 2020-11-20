<template>
	<view class="point-detail" :class="themeStyle">
		<view class="detail-top">
			<block v-if="pointInfo.type == 1">
				<image class="adv-pic" :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imageError()" mode="widthFix"></image>
				<image class="adv-pic" :src="$util.img('upload/uniapp/point/gift.png')" v-else mode="widthFix"></image>
			</block>
			<block v-if="pointInfo.type == 2">
				<image class="adv-pic" :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imageError()" mode="widthFix"></image>
				<image class="adv-pic" :src="$util.img('upload/uniapp/point/coupon.png')" v-else mode="widthFix"></image>
			</block>
			<block v-if="pointInfo.type == 3">
				<image class="adv-pic" :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imageError()" mode="widthFix"></image>
				<image class="adv-pic" :src="$util.img('upload/uniapp/point/hongbao.png')" v-else mode="widthFix"></image>
			</block>
			<!-- <image class="adv-pic" :src="$util.img(pointInfo.image)" @error="imageError()" mode="widthFix"></image> -->
			<view class="detail-desc">
				<view class="desc-point ns-text-color">
					<view class="desc-point-left ns-text-color">
						<view class="desc-point-left-con ns-text-color">
							<text class="point-num">{{ pointInfo.point }}</text>
							<text>积分</text>
						</view>
						<view class="ns-margin-left desc-point-left-oldPrice">
							<text>￥</text>
							<text>{{ pointInfo.market_price }}</text>
						</view>
					</view>
					<view class="desc-point-right ns-text-color-gary">
						<text>库存:</text>
						<text class="point-num">{{ pointInfo.stock }}</text>
					</view>
				</view>
				<view class="desc-name">{{ pointInfo.name }}</view>
			</view>
			<view class="coupon-desc" v-if="pointInfo.type == 2">
				<text>{{ pointInfo.at_least == 0 ? '无门槛优惠券' : '满' + pointInfo.at_least + '减' + pointInfo.money }}</text>
				<text class="time">
					有效期：{{ pointInfo.validity_type == 1 ? '领取之日起' + pointInfo.fixed_term + '天内有效' : $util.timeStampTurnTime(pointInfo.end_time) + '到期' }}
				</text>
			</view>
		</view>

		<view class="detail-content">
			<view class="content-title">
				<text v-if="pointInfo.type == 1">礼品详情</text>
				<text v-else-if="pointInfo.type == 2">优惠券详情</text>
				<text v-else>红包详情</text>
			</view>
			<rich-text :nodes="pointInfo.content"></rich-text>
		</view>
		<view class="detail-swap" @click="login()" v-if="!isLogin">
			<button type="primary" class="btn-disabled">登录之后方可兑换</button>
		</view>
		<view class="detail-swap" @click="makeSure()" v-else>
			<button type="primary" :class="Max == 0 ? 'btn-disabled' : ''">{{ isLogin ? '兑换' : '登录之后方可兑换' }}</button>
		</view>
		<!-- 弹出规则 -->
		<view @touchmove.prevent.stop>
			<uni-popup ref="pointPopup" type="bottom">
				<view class="tips-layer">
					<view class="tips-layer-info">
						<view class="info-img">
							<block v-if="pointInfo.type == 1">
								<image :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imageError()"></image>
								<image :src="$util.img('upload/uniapp/point/gift.png')" v-else></image>
							</block>
							<block v-if="pointInfo.type == 2">
								<image :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imageError()"></image>
								<image :src="$util.img('upload/uniapp/point/coupon.png')" v-else></image>
							</block>
							<block v-if="pointInfo.type == 3">
								<image :src="$util.img(pointInfo.image)" v-if="pointInfo.image" @error="imageError()"></image>
								<image :src="$util.img('upload/uniapp/point/hongbao.png')" v-else></image>
							</block>
						</view>
						<view class="info-desc">
							<view class="desc-name">{{ pointInfo.name }}</view>
							<view class="desc-con">
								<text>库存:</text>
								<text class="ns-text-color">{{ pointInfo.stock }}</text>
							</view>
							<view class="desc-con">
								<text>积分:</text>
								<text class="ns-text-color">{{ pointInfo.point }}</text>
							</view>
						</view>
					</view>
					<view class="tips-layer-item">
						<text>兑换数量</text>
						<uni-number-box :min="1" :max="Max" :value="number" @change="numChange($event, {})"></uni-number-box>
					</view>
					<view class="footer"><button type="primary" @click="confirm()">确定</button></view>

					<view class="close iconfont iconroundclose" @click="close()"></view>
				</view>
			</uni-popup>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import htmlParser from '@/common/js/html-parser';
export default {
	components: {
		uniPopup,
		uniNumberBox
	},
	data() {
		return {
			id: 0,
			pointInfo: {
				image: ''
			},
			isLogin: false,
			Max: 0, //最大兑换数量
			number: 1
		};
	},
	onLoad(options) {
		if (uni.getStorageSync('token')) {
			this.isLogin = true;
		}
		if (options.id) {
			this.id = options.id;
		} else {
			this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
		}
		this.getPointInfo();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	computed: {
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	methods: {
		//获取该详情
		getPointInfo() {
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/detail',
				data: {
					id: this.id
				},
				success: res => {
					this.$refs.loadingCover.hide();
					if (res.code == 0 && res.data) {
						
						if (res.data.type == 2 && !res.data.platformcoupon_type_id) {
							this.$util.showToast({
								title: '该礼品已过期'
							});
							setTimeout(() => {
								this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
							}, 2000);
							return;
						} else if (res.data.type == 1 && !res.data.gift_id) {
							this.$util.showToast({
								title: '该优惠券已过期'
							});
							setTimeout(() => {
								this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
							}, 2000);
							return;
						} else {
							this.pointInfo = res.data;
							if (this.pointInfo.content) this.pointInfo.content = htmlParser(this.pointInfo.content);
							uni.setNavigationBarTitle({
								title: this.pointInfo.name
							});
							let save = this.pointInfo.type == 2 ? this.pointInfo.count : this.pointInfo.stock;
							let point = this.pointInfo.point;
							this.Max = save;
						}
					} else {
						this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
					}
				}
			});
		},
		// 打开积分说明弹出层
		openPointPopup() {
			this.$refs.pointPopup.open();
		},
		close() {
			this.$refs.pointPopup.close();
		},
		numChange(num, params) {
			if (num < 1) num = 1;
			this.number = num;
		},
		//确认兑换后执行操作
		confirm() {
			var data = {
				id: this.id,
				num: this.number
			};

			uni.setStorage({
				key: 'exchangeOrderCreateData',
				data: data,
				success: () => {
					if (!uni.getStorageSync('token')) {
						this.$refs.login.open('/promotionpages/point/payment/payment');
						return;
					}
					this.$util.redirectTo('/promotionpages/point/payment/payment');
				}
			});
		},
		//登录
		login() {
			this.$refs.login.open('/promotionpages/point/detail/detail?id=' + this.id);
		},
		//点击去兑换
		makeSure() {
			if (this.Max > 0) {
				// this.openPointPopup();
				this.confirm();
			} else {
				this.$util.showToast({
					title: '库存不足'
				});
			}
		},
		imageError() {
			let imageUrl = '';
			if (this.selectCategoryId == 1) {
				imageUrl = this.$util.img('upload/uniapp/point/gift.png');
			} else if (this.selectCategoryId == 2) {
				imageUrl = this.$util.img('upload/uniapp/point/coupon.png');
			} else if (this.selectCategoryId == 3) {
				imageUrl = this.$util.img('upload/uniapp/point/hongbao.png');
			}
			// this.pointInfo.image = this.$util.getDefaultImage().default_goods_img;
			this.pointInfo.image = imageUrl;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
.point-detail {
	padding-bottom: 110rpx;
	padding-bottom: calc(110rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(110rpx + env(safe-area-inset-bottom));  

	.detail-top {
		width: 100%;
		background: #ffffff;
		padding-bottom: $ns-padding;

		.adv-pic {
			width: 100%;
			display: block;
		}

		.detail-desc {
			width: 100%;
			// height: 80rpx;
			background: #ffffff;
			padding: $ns-padding $ns-padding 0;
			box-sizing: border-box;

			.desc-name {
				width: 100%;
				height: 100%;
				font-size: $ns-font-size-base;
			}

			.desc-point {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				height: 100%;

				.desc-point-left {
					display: flex;
					align-items: flex-end;

					.desc-point-left-con {
						font-weight: 700;
						font-size: $ns-font-size-lg;
						line-height: 1;
					}

					.desc-point-left-oldPrice {
						color: $ns-text-color-gray;
						text-decoration: line-through;
						font-size: $ns-font-size-sm;
						line-height: 1;
					}
				}

				.desc-point-right {
					color: $ns-text-color-gray;
				}
			}
		}

		.coupon-desc {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 0 $ns-padding;
			box-sizing: border-box;
		}
	}

	.detail-content {
		width: 100%;
		padding: $ns-padding;
		box-sizing: border-box;
		padding-bottom: 80rpx;
		margin-top: $ns-margin;
		background: #ffffff;

		.content-title {
			width: 100%;
			text-align: center;
			font-size: $ns-font-size-lg;
			font-weight: 700;
		}
	}

	.detail-swap {
		box-sizing: border-box;
		background: #ffffff;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 20rpx 0;

		// button {
		// 	width: 100%;
		// 	margin: 0;
		// 	border-radius: 0;
		// }

		// button::after {
		// 	border: none;
		// 	border-radius: 0;
		// }

		// button.active {
		// 	background: #cccccc !important;
		// }
	}
}

.tips-layer {
	width: 100%;
	height: 500rpx;
	background: #ffffff;
	border-top-left-radius: $ns-border-radius;
	border-top-right-radius: $ns-border-radius;
	position: relative;
	padding-top: $ns-padding;
	box-sizing: border-box;

	.tips-layer-info {
		width: 100%;
		height: 200rpx;
		padding: $ns-padding;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;

		.info-img {
			width: 148rpx;
			height: 148rpx;
			border: 2rpx solid $ns-border-color-gray;
			box-sizing: border-box;
			border-radius: $ns-border-radius;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-desc {
			width: calc(100% - 170rpx);
			height: 150rpx;

			.desc-name {
				width: 80%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: $ns-font-size-lg;
				font-weight: 700;
			}

			.desc-con {
			}
		}
	}

	.tips-layer-item {
		width: 100%;
		height: 80rpx;
		padding: 0 $ns-padding;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.close {
		position: absolute;
		right: 20rpx;
		top: 0rpx;
		font-size: 46rpx;
	}

	.footer {
		margin: 0;
		height: 96rpx;
		text-align: center;
		line-height: 96rpx;
		width: 100%;
		position: absolute;
		bottom: 0;
		color: #fff;
		z-index: 1;
		border-radius: 0;
	}

	.footer.disabled {
		cursor: not-allowed !important;
		pointer-events: none !important;
		opacity: 0.5 !important;
		box-shadow: none !important;
		filter: grayscale(100%);
	}
}

.position-bottom {
	padding-bottom: 0;  
	padding-bottom: constant(safe-area-inset-bottom);  
	padding-bottom: env(safe-area-inset-bottom);  
}
</style>
