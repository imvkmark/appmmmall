<template>
	<view class="goods-sku" @touchmove.prevent.stop>
		<uni-popup ref="skuPopup" type="bottom" class="sku-layer" @change="popupChange()">
			<view class="sku-info" :style="{ height: systemInfo.windowHeight * 1 + 'px' }">
				<view class="header">
					<view class="header-box">
						<view class="img-wrap"><image :src="$util.img(goodsDetail.sku_image, { size: 'mid' })" @error="imageError()" /></view>
						<view class="header-right-wrap">
							<view class="header-right-price-wrap">
								<block v-for="(priceItem,index) in goodsDetail.price_array" :key="index">
									<view class="main">
										<view class="price-wrap">
											<text class="price ns-text-color ns-font-size-lg">￥{{ priceItem.price }}</text>
										</view>
										<view class="start-number">{{priceItem.num}}{{ goodsDetail.unit }}起批</view>
									</view>
								</block>
							</view>
							<view class="ns-font-size-sm">
								<view class="stock">库存{{ goodsDetail.stock }}{{ goodsDetail.unit }}</view>
							</view>
						</view>
					</view>
					<view class="sku-name ns-font-size-sm">
						<template v-if="goodsDetail.sku_spec_format">
							已选择：
							<text v-for="(item, index) in goodsDetail.sku_spec_format" :key="index">{{ item.spec_value_name }}</text>
						</template>
					</view>
					<view class="sku-close iconfont iconclose" @click="closeSkuPopup()"></view>
				</view>

				<view class="body-item">
					<scroll-view scroll-y class="wrap">
						<view class="sku-list-wrap" v-for="(item, index) in goodsDetail.goods_spec_format" :key="index">
							<text class="title ns-font-size-base">{{ item.spec_name }}</text>
							<view
								v-for="(item_value, index_value) in item.value"
								:key="index_value"
								:class="{
									selected: item_value['selected'] || skuId == item_value.sku_id,
									disabled: item_value['disabled'] || (!item_value['selected'] && disabled)
								}"
								class="items ns-border-color-gray ns-bg-color-gray ns-font-size-base"
								@click="change(item_value.sku_id, item_value.spec_id)"
							>
								<image v-if="item_value.image" :src="$util.img(item_value.image, { size: 'small' })" @error="valueImageError(index, index_value)" />
								<text>{{ item_value.spec_value_name }}</text>
							</view>
						</view>

						<view class="number-wrap">
							<view class="number-line">
								<text class="title ns-font-size-base">购买数量</text>
								<text class="limit-txt ns-font-size-sm" v-if="limitNumber > 0">(每人限购{{ limitNumber }}件)</text>
								<text class="limit-txt ns-font-size-sm" v-if="minNumber > 0">({{ minNumber }}件起购)</text>
								<view class="number">
									<button type="default" class="decrease ns-border-color-gray" @click="changeNum('-')">-</button>
									<input
										type="number"
										class="uni-input ns-border-color-gray ns-font-size-sm"
										@blur="blur"
										v-model="number"
										placeholder="0"
									/>
									<button type="default" class="increase ns-border-color-gray" @click="changeNum('+')">+</button>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="footer">
					<button type="primary"  @click="confirm()" v-if="goodsDetail.stock>=number&&number>=minNumber">{{type == 'join_cart'?'加入进货单':'立即购买'}}</button>
					<button type="primary" disabled="true" class="btn-disabled" v-else>库存不足</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup-sku.vue';
import htmlParser from '@/common/js/html-parser';
// 商品SKU
export default {
	name: 'ns-goods-sku',
	components: {
		uniPopup
	},
	props: {
		goodsDetail: {
			type: Object,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	watch:{
		number(newval,oldval){
			console.log(newval,oldval)
		}
	},
	data() {
		return {
			systemInfo: {}, //系统信息
			number: 1,
			token: '',
			btnSwitch: false, //提交按钮防止重复提交
			type: '', //join_cart：加入购物车，buy_now：立即购买
			callback: null, //回调
			skuId: 0,
			pintuanId: 0, // 拼团id
			limitNumber: 0, // 限购
			//是否开启预览，0：不开启，1：开启
			preview: 0,
			minNumber:0
		};
	},
	created() {
		this.systemInfo = uni.getSystemInfoSync();
		this.token = uni.getStorageSync('token');
	},
	watch: {
		goodsDetail(newData, oldData) {
			this.skuId = newData.sku_id;
		}
	},
	methods: {
		//分类加入购物车，重置购买数量
		popupChange() {
			this.number = 1;
		},
		show(type, callback) {
			this.$refs.skuPopup.open();
			this.type = type;
			this.callback = callback;
			this.skuId = this.goodsDetail.sku_id;
			this.preview = this.goodsDetail.preview || 0;
			this.number=this.goodsDetail.min_num;
			this.minNumber=this.goodsDetail.min_num;
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
			this.getWholeSaleGoodsSkuInfo();
		},
		// 获取批发商品详情
		getWholeSaleGoodsSkuInfo() {
			let res = this.$api.sendRequest({
				url: '/wholesale/api/goods/info',
				data: {
					sku_id: this.skuId,
				},
				success: res => {
					let data = res.data;
					if (data != null) {
						this.goodsSkuDetail = data;
						this.number=this.goodsSkuDetail.min_num;
						this.minNumber=this.goodsSkuDetail.min_num;
						this.dealData();
						this.btnSwitch = false;
						this.$emit('refresh', this.goodsSkuDetail);
					} else {
						this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
					}
				},
				fail: res => {
					this.btnSwitch = false;
					this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
				}
			});
		},
		
		dealData() {
			this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.split(',');

			// 当前商品SKU规格
			if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this.goodsSkuDetail.sku_spec_format);

			// 商品SKU格式
			if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this.goodsSkuDetail.goods_spec_format);
			this.$forceUpdate();

			this.keyInput(true);
		},
		changeNum(tag) {
			if (this.goodsDetail.stock == 0) return;

			var stock = this.goodsDetail.stock;
			var min = this.goodsDetail.min_num;
			if(stock<=min) return;
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
					return;
				}
			}
		},
		blur() {
			let newNumber = parseInt(this.number);
			if(newNumber<this.minNumber){
				newNumber=this.minNumber;
			}
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
				} else if (this.type == 'groupbuy' && this.goodsDetail.groupbuy_id && this.number < this.goodsDetail.buy_num) {
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
			if (this.preview) {
				this.$util.showToast({
					title: '预览商品无法购买'
				});
				return;
			}
			if (this.token == '') {
				this.$util.showToast({
					title: '请登录',
					success: () => {
						this.$util.redirectTo('/pages/login/login/login');
					}
				});
				return;
			}

			//纠正数量
			this.keyInput(true, () => {
				if (this.goodsDetail.stock == 0) {
					this.$util.showToast({
						title: '商品已售罄'
					});
					return;
				}

				if (this.number.length == 0 || this.number == 0) {
					this.$util.showToast({
						title: '购买数量不能为0'
					});
					return;
				}

				if (this.btnSwitch) return;
				this.btnSwitch = true;

				if (this.type == 'join_cart') {
					this.$api.sendRequest({
						url: '/wholesale/api/cart/add',
						data: {
							site_id: this.goodsDetail.site_id,
							sku_id: this.goodsDetail.sku_id,
							num: this.number
						},
						success: res => {
							var data = res.data;
							if (data > 0) {
								this.$util.showToast({
									title: '加入进货单成功'
								});
								if (this.callback) this.callback();
								this.$store.dispatch('getWholeSaleNumber')
							}
							this.$refs.skuPopup.close();
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
							this.$util.redirectTo('/promotionpages/wholesale/payment/payment');
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
		}
	}
};
</script>
<style lang="scss">
.sku-layer .sku-info {
	height: 75vh !important;
	position: relative;
	z-index: 999;
}

.sku-layer .sku-info .header {
	padding: 30rpx 25rpx $ns-padding;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.sku-layer .sku-info .header-box{
	display: flex;
}
.sku-layer .sku-info .header .img-wrap {
	width: 160rpx;
	height: 160rpx;
	border-radius: 8rpx;
	overflow: hidden;
	border: 1px solid rgba(0, 0, 0, 0.1);
	padding: 2rpx;
	background-color: #fff;
	line-height: 208rpx;
}
.sku-layer .sku-info .header .header-right-wrap{
	width: calc(100% - 220rpx);
	display: flex;
	flex-direction: column;
	padding-left: 20rpx;
	box-sizing: border-box;
	justify-content: space-between;
}
.sku-layer .sku-info .header .header-right-price-wrap{
	width: 100%;
	display: flex;
}

.sku-layer .sku-info .header .stock{
	color: #838383;
}

.sku-layer .sku-info .header .img-wrap image {
	width: 100%;
	height: 100%;
}
.sku-layer .sku-info .header .main .start-number{
	font-size: $ns-font-size-sm;
	text-align: center;
	color: #838383;
}
.sku-layer .sku-info .main {
	font-size: 12px;
	line-height: 40rpx;
	padding-right: 40rpx;
}

.sku-layer .sku-info .main .price {
	word-wrap: break-word;
}

.sku-layer .sku-info .sku-name {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	margin-top: 10rpx;
}

.sku-layer .sku-info .main .sku-name text {
	margin-right: 10rpx;
}

.sku-layer .sku-info .sku-close {
	position: absolute;
	top: 2rpx;
	right: 30rpx;
	width: 40rpx;
	height: 80rpx;
	font-size: 50rpx;
}

.sku-layer .body-item {
	padding: 0 30rpx;
	height: calc(100% - 330rpx);
	box-sizing: border-box;
	overflow: scroll;
}

.sku-layer .body-item .wrap {
	height: calc(100% - 116rpx);
}

.sku-layer .body-item .sku-list-wrap {
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	padding-bottom: 20rpx;
}

.sku-layer .body-item .sku-list-wrap .title {
	font-weight: 400;
	padding: 26rpx 0;
	margin: 0;
	display: block;
}

.sku-layer .body-item .sku-list-wrap .items {
	position: relative;
	display: inline-block;
	border: 1px solid;
	padding: 4rpx 20rpx;
	border-radius: 16rpx;
	margin: 0 10rpx 10rpx 0;
}

.sku-layer .body-item .sku-list-wrap .items.disabled {
	border: 1px dashed;
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
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
	height: 96rpx;
	width: 100%;
	position: absolute;
	bottom: 60rpx;
	color: #fff;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: flex-start;

	button {
		width: 100%;
	}
}

.position-bottom {
	bottom: 98rpx !important;
}
</style>
