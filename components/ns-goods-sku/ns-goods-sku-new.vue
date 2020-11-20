<template>
	<view class="goods-sku" @touchmove.prevent.stop :data-theme="themeStyle">
		<uni-popup ref="skuPopup" type="center" class="sku-layer">
			<view class="sku-content">
				<view class="sku-info" :style="{ height: systemInfo.windowHeight * 1 + 'px' }">
					<view class="header">
						<view class="img-wrap"><image :src="$util.img(goodsDetail.sku_image, { size: 'mid' })" @error="imageError()" /></view>
						<view class="main">
							<view class="goodname">{{ goodsDetail.goods_name }}</view>
							<view class="stock ns-text-color-gray">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
						</view>
					</view>
					<view class="body-item">
						<scroll-view scroll-y class="wrap">
							<view class="sku-list-wrap" v-for="(item, index) in goodsDetail.goods_spec_format" :key="index">
								<text class="title ns-font-size-base ns-text-color-gray">{{ item.spec_name }}</text>
								<view class="sku-list_item">
									<view
										v-for="(item_value, index_value) in item.value"
										:key="index_value"
										:class="{
											selected: item_value['selected'] || skuId == item_value.sku_id,
											disabled: item_value['disabled'] || (!item_value['selected'] && disabled)
										}"
										class="items ns-border-color-gray ns-font-size-base"
										@click="change(item_value.sku_id, item_value.spec_id)"
									>
										<image v-if="item_value.image" :src="$util.img(item_value.image, { size: 'small' })" @error="valueImageError(index, index_value)" />
										<text>{{ item_value.spec_value_name }}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="footer">
						<view class="sku-name ns-font-size-sm">
							<template v-if="goodsDetail.sku_spec_format" class="ns-text-color-gray">
								已选择：
								<text class="ns-text-color-gray" v-for="(item, index) in goodsDetail.sku_spec_format" :key="index">
									{{ item.spec_value_name }} {{ index != goodsDetail.sku_spec_format.length - 1 ? '&nbsp;/&nbsp;' : '&nbsp;' }}
								</text>
							</template>
						</view>
						<view class="footer-bottom">
							<view class="footer-left">
								<view class="price-wrap">
									<text class="price ns-text-color ">￥{{ goodsDetail.show_price }}</text>
								</view>
							</view>
							<view class="footer-right">
								<view class="change_num" v-if="number">
									<text class="desc iconfont iconjianshao ns-text-color" @click="changeNum('-')"></text>
									<input type="text" :value="number" />
									<text class="add iconfont iconadd-fill ns-text-color change_hover" @click="changeNum('+')"></text>
								</view>
								<view v-else>
									<button type="primary" v-if="goodsDetail.stock && goodsDetail.stock != 0" @click="confirm()">加入购物车</button>
									<button type="primary" class="btn-disabled" v-else>确定</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="sku-close iconfont iconclose" @click="closeSkuPopup()"></view>
		</uni-popup>
		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup-sku.vue';
import htmlParser from '@/common/js/html-parser';
// 商品SKU
export default {
	name: 'ns-goods-sku-new',
	components: {
		uniPopup
	},
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		pointLimit: {
			type: [Number, String]
		},
		cartList: {
			type: Array
		}
	},
	computed:{
		themeStyle(){
			return 'theme-'+this.$store.state.themeStyle
		}
	},
	data() {
		return {
			systemInfo: {}, //系统信息
			number: 0,
			token: '',
			btnSwitch: false, //提交按钮防止重复提交
			type: '', //join_cart：加入购物车，buy_now：立即购买
			callback: null, //回调
			skuId: 0,
			pintuanId: 0, // 拼团id
			limitNumber: 0, // 限购
			minNumber: 0,
			//是否开启预览，0：不开启，1：开启
			preview: 0,
			cartData: [], //购物车
			cartIdArr: [],
			goodsDetail: {},
			currentRoute:""
		};
	},
	created() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = '/' + currentPage.route;
		this.systemInfo = uni.getSystemInfoSync();
		this.token = uni.getStorageSync('token');
	},
	watch: {
		goodsDetail(newData, oldData) {
			this.skuId = newData.sku_id;
		}
	},
	methods: {
		show(type, goodsDetail, callback) {
			var that = this;
			this.goodsDetail = goodsDetail;
			this.$refs.skuPopup.open();
			this.type = type;
			this.callback = callback;
			this.skuId = this.goodsDetail.sku_id;

			this.preview = this.goodsDetail.preview || 0;
			this.getCartData();
		},
		hide() {
			this.$refs.skuPopup.close();
		},
		change(skuId, spec_id) {
			if (this.disabled) return;
			this.btnSwitch = false;
			this.skuId = skuId;
			// 清空选择
			for (var i = 0; i < this.goodsDetail.goods_spec_format.length; i++) {
				var sku = this.goodsDetail.goods_spec_format[i];
				for (var j = 0; j < sku.value.length; j++) {
					// 排除当前点击的规格值
					if (spec_id == this.goodsDetail.goods_spec_format[i].value[j].spec_id) {
						this.goodsDetail.goods_spec_format[i].value[j].selected = false;
					}
				}
			}

			this.getGoodsSkuInfo();
		},
		// 获取普通商品详情
		getGoodsSkuInfo() {
			this.getCartData()
			var that = this;
			let res = this.$api.sendRequest({
				url: '/api/goodssku/info',
				data: {
					sku_id: this.skuId == undefined ? this.goodsDetail.sku_id : this.skuId
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						that.goodsSkuDetail = data;
						that.dealData();
			
						// 限时折扣
						if (that.goodsSkuDetail.promotion_type == 1) {
							that.goodsSkuDetail.discountTimeMachine = that.$util.countDown(that.goodsSkuDetail.end_time - res.timestamp);
						}
						that.btnSwitch = false;
						var tempInfo = that.goodsSkuDetail;
						tempInfo.num = that.cartData[that.skuId] !== undefined ? that.cartData[that.skuId] : 0;
						that.$emit('refresh', tempInfo);
					} else {
						that.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				},
				fail: res => {
					that.btnSwitch = false;
					that.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
				}
			});
		},

		dealData() {
			this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.split(',');
			if (this.goodsSkuDetail.promotion_type == 1 && this.goodsSkuDetail.discountTimeMachine) {
				if(this.goodsSkuDetail.member_price && this.goodsSkuDetail.member_price <= this.goodsSkuDetail.price){
					this.goodsSkuDetail.show_price = this.goodsSkuDetail.member_price;
				}else{
					this.goodsSkuDetail.show_price = this.goodsSkuDetail.discount_price;
				}
			}else{
				if(this.goodsSkuDetail.member_price){
					this.goodsSkuDetail.show_price = this.goodsSkuDetail.member_price;
				}else{
					this.goodsSkuDetail.show_price = this.goodsSkuDetail.price;
				}
			}

			// 当前商品SKU规格
			if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this.goodsSkuDetail.sku_spec_format);

			// 商品SKU格式
			if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this.goodsSkuDetail.goods_spec_format);

			this.keyInput(false);

			// uni.setNavigationBarTitle({
			// 	title: this.goodsSkuDetail.sku_name
			// });
		},
		changeNum(tag) {
			if (this.goodsDetail.stock == 0) return;

			var stock = this.goodsDetail.stock;
			var min = 1;

			if (this.type == 'pintuan' && this.goodsDetail.pintuan_id) {
				//限购数量大于库存总数取库存
				if (this.goodsDetail.buy_num > this.goodsDetail.stock) {
					stock = this.goodsDetail.stock;
				} else {
					stock = this.goodsDetail.buy_num;
				}
				// min = stock;
			} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id) {
				//限购数量大于库存总数取库存
				if (this.goodsDetail.buy_num > this.goodsDetail.stock) {
					stock = this.goodsDetail.stock;
				} else {
					stock = this.goodsDetail.stock;
				}
				//最低购买数量
				min = this.goodsDetail.buy_num;
			}
			if (tag == '+') {
				// 加
				if (this.number < stock) {
					this.number++;
				} else {
					return;
				}
			} else if (tag == '-') {
				// 减
				if (this.number > min) {
					this.number -= 1;
				} else {
					this.number = 0;
					//return;
				}
			}
			if (this.number > this.limitNumber && this.limitNumber) {
				this.number = this.limitNumber;
			}
			if (this.number) {
				this.cartNumChange(this.number, this.cartIdArr[this.skuId]);
			} else {
				this.deleteCart();
			}
		},
		blur() {
			if (!this.number) {
				this.number = 0;
			}
			if (this.number > this.limitNumber && this.limitNumber) {
				this.number = this.limitNumber;
			}
			if (this.number < this.minNumber && this.minNumber) {
				this.number = this.minNumber;
			}
			let newNumber = parseInt(this.number);
			this.number = 0;
			setTimeout(() => {
				this.number = newNumber;
			}, 0);
		},
		//输入数量
		keyInput(flag, callback) {
			setTimeout(() => {
				var stock = this.goodsDetail.stock;

				// 库存为0
				if (this.goodsDetail.stock == 0) {
					this.number = 0;
					return;
				}

				// 防止空
				if (flag && this.number.length == 0) this.number = 1;

				// 防止输入0和负数、非法输入
				if (flag && (this.number <= 0 || isNaN(this.number))) this.number = 1;

				if (this.type == 'pintuan' && this.goodsDetail.pintuan_id && this.number > this.goodsDetail.buy_num) {
					//限购数量大于库存总数取库存
					this.number = this.goodsDetail.buy_num;
				} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id && this.number > this.goodsDetail.buy_num) {
					//最低购买数量
					this.number = this.goodsDetail.buy_num;
				} else if (this.number > stock) {
					this.number = stock;
				}

				if (flag) this.number = parseInt(this.number);
				if (callback) callback();
			}, 0);
		},

		//提交
		confirm() {
			var that = this;
			if (this.preview) {
				this.$util.showToast({
					title: '预览商品无法购买'
				});
				return;
			}
			if (this.token == '') {
				
				this.$refs.login.open(this.currentRoute);
				// this.$util.showToast({
				// 	title: '请登录',
				// 	success: () => {
				// 		this.$util.redirectTo('/pages/login/login/login');
				// 	}
				// });
				return;
			}
			this.number = 1;
			//纠正数量
			this.keyInput(true, () => {
				if (this.goodsDetail.stock == 0) {
					this.$util.showToast({
						title: '商品已售罄'
					});
					return;
				}

				// if (this.number.length == 0 || this.number == 0) {
				// 	this.$util.showToast({
				// 		title: '购买数量不能为0'
				// 	});
				// 	return;
				// }

				if (this.btnSwitch) return;
				this.btnSwitch = true;

				if (this.type == 'join_cart') {
					this.$api.sendRequest({
						url: '/api/cart/add',
						data: {
							sku_id: this.goodsDetail.sku_id,
							num: this.number,
							site_id:this.goodsDetail.site_id
						},
						success: res => {
							var data = res.data;
							if (data > 0) {
								that.getCartData();
								that.getGoodsSkuInfo();

								if (this.callback) this.callback();
							}
							//this.$refs.skuPopup.close();
							this.btnSwitch = false;
						},
						fail: res => {
							this.$refs.skuPopup.close();
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'buy_now') {
					var data = {
						sku_id: this.skuId,
						num: this.number
					};

					uni.setStorage({
						key: 'orderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/pages/order/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'seckill') {
					// 秒杀
					var data = {
						seckill_goods_id: this.goodsDetail.id,
						num: this.number
					};

					uni.setStorage({
						key: 'seckillOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/seckill/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'pintuan') {
					// 拼团
					var data = {
						pintuan_goods_id: this.goodsDetail.id,
						group_id: this.goodsDetail.group_id,
						num: this.number
					};

					uni.setStorage({
						key: 'pintuanOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/pintuan/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'topic') {
					// 专题
					var data = {
						topic_goods_id: this.goodsDetail.id,
						num: this.number
					};

					uni.setStorage({
						key: 'topicOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/topics/payment/payment');
							this.btnSwitch = false;
						}
					});
				} else if (this.type == 'groupbuy') {
					// 团购
					var data = {
						groupbuy_id: this.goodsDetail.groupbuy_id,
						sku_id: this.skuId,
						num: this.number
					};

					uni.setStorage({
						key: 'groupbuyOrderCreateData',
						data: data,
						success: () => {
							this.$util.redirectTo('/promotionpages/groupbuy/payment/payment');
							this.btnSwitch = false;
						}
					});
				}
			});
		},
		closeSkuPopup() {
			this.$refs.skuPopup.close();
		},
		imageError() {
			this.goodsDetail.sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		valueImageError(index, index_value) {
			this.goodsDetail.goods_spec_format[index].value[index_value].image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		//获取购物车的信息
		getCartData() {
			var that = this;
			this.$api.sendRequest({
				url: '/api/cart/lists',
				success: res => {
					if (res.code >= 0) {
						this.token = uni.getStorageSync('token');
						var skuArr = [];
						var cartArr = [];
						if (res.data.length) {
							for (var index = 0; index < res.data.length; index++) {
								skuArr[res.data[index].sku_id] = res.data[index].num;
								cartArr[res.data[index].sku_id] = res.data[index].cart_id;
							}
						}
						this.cartData = skuArr;
						this.cartIdArr = cartArr;
					} else {
						this.token = '';
					}
					that.number = that.cartData[that.skuId]?that.cartData[that.skuId]:0;
					this.$forceUpdate();
				},
			});
		},
		/**
		 * 变更购物车数量
		 * @param {Object} params
		 */
		cartNumChange(num, cartid) {
			var that = this;
			if (num < 1) num = 1;
			this.modifyFlag = true;
			this.$api.sendRequest({
				url: '/api/cart/edit',
				data: {
					num,
					cart_id: cartid
				},
				success: res => {
					if (res.code >= 0) {
						that.cartData[that.skuId] = num;
						// this.calculationTotalPrice();
					} else {
						// this.$util.showToast({ title: res.message });
					}
				}
			});
		},
		/**
		 * 删除购物车
		 * @param {Object} siteIndex
		 * @param {Object} cartIndex
		 */
		deleteCart() {
			var that = this;
			this.$api.sendRequest({
				url: '/api/cart/delete',
				data: { cart_id: this.cartIdArr[this.skuId] },
				success: res => {
					if (res.code >= 0) {
						this.$store.dispatch('getCartNumber');
						
						that.getCartData();
					} else {
						// this.$util.showToast({ title: res.message });
					}
				}
			});
		}
	}
};
</script>
<style lang="scss">
.sku-content {
	background: #ffffff;
	border-radius: 10px;
	width: 80vw;
	border-radius: 20rpx;
}
.sku-close {
	// position: absolute;
	background: #fff;
	width: 25px;
	height: 25px;
	text-align: center;
	border-radius: 50%;
	margin: 40rpx auto 0;
}
.sku-layer .sku-info {
	height: 60vh !important;
	position: relative;
	z-index: 999;
}

.sku-layer .sku-info .header {
	// padding: 30rpx 0 30rpx 300rpx;
	/* #ifdef MP-ALIPAY */
	// padding: 50rpx 0 50rpx 300rpx;
	/* #endif */
	padding: 30rpx;
	display: flex;
	position: relative;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	z-index: 2;
}

.sku-layer .sku-info .header .img-wrap {
	width: 114rpx;
	height: 114rpx;
	margin-right: 20rpx;
	// position: absolute;
	// top: -56rpx;
	/* #ifdef MP-ALIPAY */
	// top: 20rpx;
	/* #endif */
	// left: 20rpx;
	border-radius: 8rpx;
	overflow: hidden;
	border: 1px solid rgba(0, 0, 0, 0.1);
	padding: 2rpx;
	background-color: #fff;
	line-height: 208rpx;
}

.sku-layer .sku-info .header .img-wrap image {
	width: 100%;
	height: 100%;
}

.sku-layer .sku-info .main {
	font-size: 12px;
	line-height: 40rpx;
	padding-right: 40rpx;
	flex: 1;
}
.sku-layer .sku-info .main .goodname {
	word-wrap: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-height: 1.5;
}
.footer-left .price {
	word-wrap: break-word;
	font-size: 40rpx;
}

.sku-layer .sku-info .main .stock {
	margin-top: 20rpx;
}

.sku-layer .sku-info .main .sku-name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	height: 90rpx;
	overflow: hidden;
}

.sku-layer .sku-info .main .sku-name text {
	margin-right: 10rpx;
}

.sku-layer .sku-info .sku-close {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	width: 40rpx;
	height: 80rpx;
	font-size: 50rpx;
}

.sku-layer .body-item {
	padding: 0 30rpx;
	height: calc(100% - 282rpx);
	box-sizing: border-box;
	overflow: scroll;
}

.sku-layer .body-item .wrap {
	height: calc(100% - 116rpx);
}

.sku-layer .body-item .sku-list-wrap {
}

.sku-layer .body-item .sku-list-wrap .title {
	font-weight: 400;
	padding: 26rpx 0;
	margin: 0;
	display: block;
}
.sku-layer .body-item .sku-list-wrap .sku-list_item {
	display: flex;
	flex-wrap: wrap;
	margin: 0 10rpx;
}
.sku-layer .body-item .sku-list-wrap .items {
	// width: calc(33.3333% - 60rpx - 2px);
	text-align: center;
	position: relative;
	display: inline-block;
	border: 1px solid;
	padding: 4rpx 30rpx;
	margin: 0 10rpx 20rpx;
	background-color: #fff !important;
	border-radius: 30rpx;
}
.sku-layer .body-item .sku-list-wrap .items.disabled {
	border: 1px dashed;
}
[data-theme='theme-green'] .sku-layer .body-item .sku-list-wrap .items{
	background-color: #fff !important;
}

.sku-layer .body-item .sku-list-wrap .items image {
	height: 48rpx;
	width: 48rpx;
	border-radius: 4rpx;
	margin-right: 10rpx;
	display: inline-block;
	vertical-align: middle;
}

.sku-layer .body-item .number-wrap .number-line {
	padding: 20rpx 0;
	line-height: 72rpx;
}

.sku-layer .body-item .number-wrap .title {
	font-weight: 400;
}

.sku-layer .body-item .number-wrap .limit-txt {
}

.sku-layer .body-item .number-wrap .number {
	height: 72rpx;
	border-radius: 6rpx;
	float: right;
}

.sku-layer .body-item .number-wrap .number button {
	display: inline-block;
	line-height: 64rpx;
	height: 68rpx;
	width: 60rpx;
	font-size: 48rpx;
	box-sizing: content-box;
	border: 1px solid;
	padding: 0;
	margin: 0;
	border-radius: 0;
}

.sku-layer .body-item .number-wrap .number button.decrease {
	border-right: 1px solid #fff !important;
}

.sku-layer .body-item .number-wrap .number button.increase {
	border-left: 1px solid #fff !important;
}

.sku-layer .body-item .number-wrap .number button:after {
	border-radius: 0;
	border: none;
}

.sku-layer .body-item .number-wrap .number input {
	display: inline-block;
	line-height: 64rpx;
	height: 68rpx;
	width: 72rpx;
	text-align: center;
	font-weight: 700;
	border: 1px solid;
	margin: 0;
	padding: 0;
	vertical-align: top;
}

.sku-layer .footer {
	width: calc(100% - 60rpx);
	position: absolute;
	bottom: 26rpx;
	color: #fff;
	z-index: 1;
	border-top: 1rpx solid $ns-border-color-gray;
	padding: 30rpx 30rpx 0;

	// button {
	// 	width: 100%;
	// }
}
.sku-layer .footer .footer-bottom {
	margin-top: 24rpx;
	display: flex;
	justify-content: be;
	align-items: center;
	.footer-left {
		flex: 1;
	}
	.footer-right {
		width: 119px;
		text-align: right;
	}
	.footer-right button {
		margin: 0;
	}
}

.position-bottom {
	bottom: 98rpx !important;
}
// 数量加减样式
.change_num {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.change_num > text{
	font-size: 36rpx;
}
.change_num input {
	width: 70rpx;
	height: 36rpx;
	line-height: 36rpx;
	text-align: center;
}
</style>
