<template>
	<view :class="themeStyle">
		<view>
			<view class="combo-package">
				<view class="combo-package-list">
					<view class="combo-package-content">
						<view class="combo-package-name ns-text-color-black ns-bg-color-gray-fadeout-60">
							<view class="iconfont iconyuan_checked ns-text-color"></view>
							<text class="ns-margin-right">{{ combo.bl_name }}</text>
						</view>

						<navigator
							hover-class="none"
							v-for="(item, index) in combo.bundling_goods"
							:key="index"
							class="goods-info"
							:url="'/pages/goods/detail/detail?sku_id=' + item.sku_id"
						>
							<view class="goods-img">
								<view class="img-wrap"><image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="aspectFit" /></view>
							</view>
							<view class="data-info">
								<view class="goods-name">{{ item.sku_name }}</view>
								<view class="price-wrap">
									<text class="uni-bold ns-text-color">{{ $lang('common.currencySymbol') }} {{ item.price }}</text>
									<text class="num">x1</text>
								</view>
								<view class="stock-tips ns-text-color" v-show="item.stock < num">
									{{ $lang('stock') }}：{{ item.stock }}
									<block v-if="item.unit">{{ item.unit }}</block>
									<block v-else>{{ $lang('num') }}</block>
								</view>
							</view>
						</navigator>
					</view>
				</view>

				<view class="footer padding-bottom">
					<view class="combo-package-info padding-bottom">
						<view class="num">
							<text>{{ $lang('shopNum') }}：</text>
							<input class="uni-input" type="number" v-model="num" @input="numberChange(false)" />
						</view>
						<view class="ns-text-color uni-bold ns-font-size-lg">
							<text class="package-price ns-text-color-black">{{ $lang('price') }}：</text>
							<text>{{ $lang('common.currencySymbol') }} {{ packagePrice }}</text>
						</view>
						<view class="ns-font-size-sm">
							<text class="save-the-price">{{ $lang('saveThePrice') }}：{{ $lang('common.currencySymbol') }} {{ saveThePrice }}</text>
						</view>
					</view>
					<view class="button">
						<button type="primary" size="mini" :class="!isDisabled ? '' : 'btn-disabled'" @click="comboBuy()">{{ $lang('shopping') }}</button>
					</view>
				</view>
			</view>

			<loading-cover ref="loadingCover"></loading-cover>
			<ns-login ref="login"></ns-login>
		</view>
	</view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
export default {
	components: {
		uniNumberBox
	},
	data() {
		return {
			num: 1, //购买数量
			blId: 0, //商品id
			combo: [],
			packagePrice: 0, //套餐价
			saveThePrice: 0, //节省价格
			isDisabled: false, //按钮失效
		};
	},
	onLoad(e) {
		this.blId = e.bl_id || 0;
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		this.getList();
	},
	onHide() {
		this.btnSwitch = true;
	},
	computed: {
		//vueX页面主题
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	methods: {
		// 获取套餐列表
		getList() {
			this.$api.sendRequest({
				url: '/bundling/api/bundling/detail',
				data: {
					bl_id: this.blId
				},
				success: res => {
					if (res.data) {
						this.combo = res.data;
						this.numberChange();
					} else {
						this.$util.showToast({ title: res.message });
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		numberChange(flag, callback) {
			setTimeout(() => {
				var disabledCount = 0;

				// 防止空
				if (flag && this.num.length == 0) {
					this.num = 1;
					disabledCount++;
				}

				// 防止输入0和负数、非法输入
				if (flag && (this.num <= 0 || isNaN(this.num))) {
					this.number = 1;
					disabledCount++;
				}

				if (flag) this.num = parseInt(this.num);

				var price = 0;
				for (var i = 0; i < this.combo.bundling_goods.length; i++) {
					price += parseFloat(this.combo.bundling_goods[i].price);
					//检测库存
					if (this.combo.bundling_goods[i].stock < this.num) disabledCount++;
				}
				this.isDisabled = disabledCount > 0;
				this.saveThePrice = ((price - this.combo.bl_price) * this.num).toFixed(2);
				this.packagePrice = (this.combo.bl_price * this.num).toFixed(2);
				if (callback) callback();
			}, 0);
		},
		// 套餐立即购买点击
		async comboBuy() {
			if (this.isDisabled) return;

			//纠正数量
			this.numberChange(true, () => {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open('/promotionpages/combo/detail/detail?bl_id=' + this.blId);
					return;
				}

				if (this.btnSwitch == false) return;

				this.btnSwitch = false;

				var data = {
					bl_id: this.blId,
					num: this.num
				};

				uni.setStorage({
					key: 'comboOrderCreateData',
					data: data,
					success: () => {
						this.$util.redirectTo('/promotionpages/combo/payment/payment');
						this.btnSwitch = false;
					}
				});
			});
		},
		imageError(index) {
			this.combo.bundling_goods[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	},
	onShareAppMessage(res) {
		var title = '购买套餐，优惠多多哦';
		var path = '/promotionpages/combo/detail/detail?bl_id=' + this.blId;
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
.uni-bold {
	font-weight: bold;
}
.placeholder {
	height: 55px;
}
.combo-package {
	padding-bottom: 160rpx;
	padding-bottom: calc(160rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	.footer {
		width: 100%;
		height: 180rpx;
		background: #fff;
		position: fixed;
		bottom: 0;
		.combo-package-info {
			width: 68%;
			position: absolute;
			bottom: 0;
			.uni-numbox {
				height: 50rpx;
				padding: 0;
			}
			.num {
				text {
					vertical-align: middle;
				}
				input {
					display: inline-block;
					width: 100rpx;
					vertical-align: middle;
					text-align: left;
					width: 300rpx;
				}
			}
			view {
				padding-right: 20rpx;
				padding-left: $ns-padding;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.package-price {
					margin-top: 10rpx;
					display: inline-block;
				}
				.save-the-price {
					display: inline-block;
					color: $ns-text-color-gray;
				}
			}
		}
		.button {
			width: 30%;
			line-height: 120rpx;
			height: 120rpx;
			margin: 0;
			border-radius: 0;
			position: absolute;
			right: 0;
			bottom: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
.combo-package-content {
	padding-bottom: 40rpx;
	.combo-package-name {
		padding: 16rpx 20rpx;
		background: #ffffff;
		.iconfont {
			display: inline-block;
			font-size: 50rpx;
			vertical-align: middle;
			margin-right: 20rpx;
		}
	}
	.goods-info {
		overflow: hidden;
		margin: $ns-margin;
		padding: $ns-padding;
		background: #ffffff;
		border-radius: $ns-border-radius;
		border-bottom: 1px solid rgba(229, 229, 229, 0.5);
		&:last-child {
			margin-bottom: 0;
		}
		.data-info {
			display: inline-block;
			width: 66%;
			float: left;
			position: relative;
			margin-left: $ns-margin;
			.goods-name {
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				display: -webkit-box;
				line-height: 150%;
				margin-bottom: $ns-margin;
			}
			.price-wrap {
				height: 50rpx;
				line-height: 50rpx;
				.num {
					float: right;
				}
			}
		}
		.goods-img {
			display: inline-block;
			width: 30%;
			text-align: center;
			line-height: 100%;
			float: left;
			.img-wrap {
				display: inline-block;
				width: 100%;
				height: 140rpx;
				text-align: center;
				image {
					height: 140rpx;
					width: 100%;
					vertical-align: middle;
				}
			}
		}
	}
}
.padding-bottom {
	padding-bottom: 0 !important;
	padding-bottom: constant(safe-area-inset-bottom) !important;
	padding-bottom: env(safe-area-inset-bottom) !important;
}
.margin-bottom {
	margin-bottom: 0 !important;
	margin-bottom: constant(safe-area-inset-bottom) !important;
	margin-bottom: env(safe-area-inset-bottom) !important;
}
</style>
