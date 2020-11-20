<template>
	<view v-if="shopInfo" class="shop-info">
		<view class="shop-image">
			<image v-if="shopInfo.avatar" :src="$util.img(shopInfo.avatar)" @error="shopInfo.avatar = $util.getDefaultImage().default_shop_img"
			 mode="aspectFit" />
			<image v-else :src="$util.getDefaultImage().default_shop_img" mode="aspectFit" />
		</view>
		<view class="shop-con">
			<view class="info-top" @click="toIntroduction()">
				<view class="info-name" :style="value ? 'color:' + value.color : '#333'">
					{{ shopInfo.site_name }}
					<text class="iconfont icongengduo"></text>
				</view>
			</view>
			<view class="info-desc" @click="toIntroduction()">
				<view class="desc-star" :style="value ? 'color:' + value.color : '#333'">
					综合评分：
					<text>
						{{((parseFloat(shopInfo.shop_desccredit) + parseFloat(shopInfo.shop_servicecredit) + parseFloat(shopInfo.shop_deliverycredit)) / 3).toFixed(1) }}
					</text>
				</view>
				<text class="fans" :style="value ? 'color:' + value.color : '#333'">粉丝数：{{ shopInfo.sub_num }}</text>
			</view>
		</view>
		<button type="primary" size="mini" class="info-follow" @click="follow()" v-if="hasFollow">
			<text class="iconfont iconguanzhu active"></text>
			<text>已关注</text>
		</button>
		<button type="warn" size="mini" class="info-follow" @click="follow()" v-if="!hasFollow">
			<text class="iconfont iconguanzhu ns-text-color"></text>
			<text>关注</text>
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shopInfo: {
					logo: '',
					site_name: '',
					sub_num: 0,
					shop_desccredit: 0,
					shop_servicecredit: 0,
					shop_deliverycredit: 0
				},
				hasFollow: false
			};
		},
		props: {
			value: {
				type: Object,
				default: null
			},
			siteId: {
				type: [Number, String],
				default: 0
			},
			type: {
				type: Number,
				default: 0 //0为店铺首页  带图的那种  为其他页面不带图的那种
			}
		},
		watch: {
			siteId() {
				this.getShopInfo();
				this.isFollow();
			}
		},
		created() {
			this.getShopInfo();
			this.isFollow();
		},
		mounted() {},
		methods: {
			//关注与取消
			follow() {
				let vm = this;
				if (!uni.getStorageSync('token')) {
					this.$util.redirectTo('/pages/login/login/login', {});
					return;
				}
				if (vm.hasFollow) {
					uni.showModal({
						title: '提示',
						content: '真的要取消关注嘛',
						success: function(res) {
							if (res.confirm) {
								vm.$api.sendRequest({
									url: '/api/shopmember/delete',
									data: {
										site_id: vm.siteId
									},
									success: res => {
										if (res.code == 0 && res.data) {
											vm.hasFollow = !vm.hasFollow;
											vm.$util.showToast({
												title: '取消成功'
											});
										}
									}
								});
							}
						}
					});
				} else {
					vm.$api.sendRequest({
						url: '/api/shopmember/add',
						data: {
							site_id: vm.siteId
						},
						success: res => {
							if (res.code == 0 && res.data) {
								vm.hasFollow = !vm.hasFollow;
								vm.$util.showToast({
									title: '关注成功'
								});
							}
						}
					});
				}
			},
			//跳转至店铺详细信息页面
			toIntroduction() {
				if (getCurrentPages()[getCurrentPages().length - 1].route != 'otherpages/shop/introduce/introduce') {
					this.$util.redirectTo('/otherpages/shop/introduce/introduce', {
						site_id: this.siteId
					});
				}
			},
			//获取店铺详情
			getShopInfo() {
				this.$api.sendRequest({
					url: '/api/shop/info',
					data: {
						site_id: this.siteId
					},
					success: res => {
						if (res.code == 0) {
							this.shopInfo = res.data;
						}
					}
				});
			},
			//是否关注
			isFollow() {
				this.$api.sendRequest({
					url: '/api/shopmember/issubscribe',
					data: {
						site_id: this.siteId
					},
					success: res => {
						if (res.code == 0) {
							this.hasFollow = res.data;
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.shop-info {
		width: 100%;
		padding: $ns-padding;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		background: #ffffff;
	}

	.shop-image {
		width: 90rpx;
		height: 90rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: $ns-margin;
		border: 1rpx solid $ns-border-color-gray;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.shop-con {
		width: calc(80% - 90rpx - 20rpx);
		color: #ffffff;
	}

	.info-top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4rpx;

		.info-name {
			width: 60%;
			font-size: $ns-font-size-base;
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			.icongengduo {
				font-size: 26rpx;
				margin-top: 2rpx;
				font-weight: normal;
				font-weight: bold;
				margin-left: 10rpx;
			}
		}
	}

	button[size='mini'].info-follow {
		line-height: 1.8 !important;
		padding: 0 $ns-padding !important;

		position: absolute;
		right: $ns-margin;
		top: $ns-margin;

		.iconfont {
			margin-right: 10rpx;
			font-size: $ns-font-size-sm;
		}

		.iconfont.active {
			margin-right: 10rpx;
			font-size: $ns-font-size-sm;
			color: #ffffff;
		}
	}

	.info-desc {
		width: 100%;
		display: flex;
		align-items: center;
		.desc-star {
			display: flex;
			align-items: center;
			font-size: 20rpx;
		}

		.fans {
			margin-left: $ns-margin;
			font-size: 20rpx;
		}
	}
</style>
