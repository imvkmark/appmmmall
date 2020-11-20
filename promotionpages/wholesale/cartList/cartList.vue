<template>
	<view :class="themeStyle">
		<view class="container" :class="isBottom?'bottom':''">
			<block v-if="isBottom">
				<view class="cart-wrap" v-for="(siteItem, siteIndex) in cartData" :key="siteIndex">
					<view class="cart-header">
						<view class="iconfont" :class="siteItem.checked ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'" @click="siteAllElection(!siteItem.checked, siteIndex)"></view>
						<view class="iconfont icondianpu"></view>
						<view class="shop-info">
							<text>{{ siteItem.siteName }}</text>
						</view>
						<view class="cart-operation" @click="edit(siteIndex)">{{ siteItem.edit ? $lang('complete') : $lang('edit') }}</view>
					</view>
					<block v-for="(item, cartIndex) in siteItem.cartList" :key="cartIndex">
						<view class="cart-goods">
							<view class="goods-wrap" :class="{ edit: siteItem.edit }">
								<view class="iconfont" :class="item.checked ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'" @click="singleElection(siteIndex, cartIndex)"></view>
								<navigator hover-class="none" class="goods-img" :url="'/promotionpages/wholesale/detail/detail?sku_id=' + item.sku_id">
									<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(siteIndex,cartIndex)" mode="aspectFill"></image>
								</navigator>
								<view class="goods-info">
									<navigator hover-class="none" :url="'/promotionpages/wholesale/detail/detail?sku_id=' + item.sku_id" class="goods-name">{{ item.sku_name }}</navigator>
									<text class="sku"></text>
									<view class="goods-sub-section">
										<text class="goods-price ns-text-color">
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											<!-- {{ item.discount_price }} -->
											{{priceDeal(item)}}
										</text>
										<uni-number-box :min="item.min_num" :max="item.stock" :value="item.num" size="small" :modifyFlag="modifyFlag" @change="cartNumChange($event, { siteIndex, cartIndex , minNum:item.min_num})" />
									</view>
								</view>
							</view>
							<view class="item-del ns-bg-color" :class="{ show: siteItem.edit }" @click="deleteCart(siteIndex, cartIndex)">{{ $lang('del') }}</view>
						</view>
					</block>
				</view>

				<view class="cart-wrap" v-if="invalidGoods.length">
					<view class="cart-header">
						<view class="shop-info">
							<text class="ns-font-size-sm">失效商品{{ invalidGoods.length }}件</text>
						</view>
						<view class="cart-operation ns-text-color ns-font-size-sm" @click="clearInvalidGoods">清空失效商品</view>
					</view>
					<block v-for="(goodsItem, goodsIndex) in invalidGoods" :key="goodsIndex">
						<view class="cart-goods invalid-goods">
							<view class="invalid-mark">失效</view>
							<view class="goods-wrap">
								<view class="goods-img">
									<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" mode="aspectFill"></image>
								</view>
								<view class="goods-info">
									<view class="goods-name">{{ goodsItem.sku_name }}</view>
									<text class="sku"></text>
									<view class="goods-sub-section">
										<text class="goods-price ns-text-color">
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											{{ goodsItem.discount_price }}
										</text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
			<block v-else>
				<view class="cart-empty">
					<ns-empty :text="$lang('emptyTips')" v-if="token != ''" :fixed="!1"></ns-empty>
					<ns-empty :text="$lang('emptyTips')" :emptyBtn="emptyBtn1" v-else :fixed="!1"></ns-empty>
				</view>
			</block>
		</view>
		<view class="cart-bottom" v-if="cartData.length||invalidGoods.length">
			<view class="all-election" @click="allElection">
				<view class="iconfont" :class="checkAll ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"></view>
				<text>{{ $lang('allElection') }}</text>
			</view>
			<view class="settlement-info">
				<text>
					{{ $lang('total') }}：
					<text class="ns-text-color">
						{{ $lang('common.currencySymbol') }}
						<text>{{ totalPrice }}</text>
					</text>
				</text>
			</view>
			<view class="operation-btn">
				<button type="primary" size="mini" @click="settlement" v-if="totalCount != 0">{{ $lang('settlement') }}({{ totalCount }})</button>
				<button type="primary" size="mini" @click="settlement" disabled v-else>{{ $lang('settlement') }}({{ totalCount }})</button>
			</view>
		</view>
		<!-- 加载动画 -->
		<loading-cover ref="loadingCover"></loading-cover>
		<!-- 返回顶部 -->
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>

<script>
	import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	import toTop from '@/components/toTop/toTop.vue';
	import scroll from '@/common/js/scroll-view.js';

	export default {
		components: {
			nsGoodsRecommend,
			uniNumberBox,
			diyBottomNav,
			toTop
		},
		mixins: [scroll],
		data() {
			return {
				token: '',
				cartData: [], // 进货单
				checkAll: false,
				totalPrice: '0.00',
				totalCount: 0,
				modifyFlag: false,
				isSub: false,
				invalidGoods: [], // 失效商品集合
				emptyBtn1: {
					text: "去登录",
					url: '/pages/login/login/login'
				}
			};
		},
		onLoad() {},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (uni.getStorageSync('token')) this.getCartData();
		},
		onReady() {
			if (!uni.getStorageSync('token')) {
				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			}
		},
		computed: {
			isBottom() {
				return this.cartData.length > 0 || this.invalidGoods.length > 0
			},
			
			//vueX页面主题
			themeStyle(){
				return 'theme-'+this.$store.state.themeStyle
			},
			
			priceDeal(){
				return function(item){
					let a=JSON.parse(item.price_json);
					let price=0.00;
					for(let i=0;i<a.length;i++){
						if(i!=a.length-1){
							if(item.num>=Number(a[i].num) && item.num<= Number(a[i+1].num)){
								price=a[i].price
							}
						}else if(item.num>= Number(a[i].num)){
							price=a[i].price
						}
					}
					return Number(price).toFixed(2)
				}
			}
		},
		methods: {
			/**
			 * 获取进货单数据
			 */
			getCartData() {
				this.$api.sendRequest({
					url: '/wholesale/api/cart/lists',
					success: res => {
						if (res.code >= 0) {
							this.token = uni.getStorageSync('token');
							if (res.data.length) this.handleCartData(res.data);
							else this.cartData = [];
						} else {
							this.token = '';
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 处理进货单数据结构
			 */
			handleCartData(data) {
				this.invalidGoods = [];
				this.cartData = [];
				var temp = {};
				data.forEach((item, index) => {
					if (item.goods_state == 1 && item.verify_state == 1) {
						item.checked = true;
						if (temp['site_' + item.site_id] != undefined) {
							temp['site_' + item.site_id].cartList.push(item);
						} else {
							temp['site_' + item.site_id] = {
								siteId: item.site_id,
								siteName: item.site_name,
								edit: false,
								checked: true,
								cartList: [item]
							};
						}
					} else {
						this.invalidGoods.push(item);
					}
				});

				this.cartData = [];
				Object.keys(temp).forEach(key => {
					this.cartData.push(temp[key]);
				});
				this.calculationTotalPrice();
			},
			/**
			 * 单选
			 * @param {Object} index
			 */
			singleElection(siteIndex, index) {
				this.cartData[siteIndex].cartList[index].checked = !this.cartData[siteIndex].cartList[index].checked;
				this.calculationTotalPrice();
			},
			/**
			 * 店铺全选
			 * @param {Object} checked
			 */
			siteAllElection(checked, index) {
				this.cartData[index].checked = checked;
				this.cartData[index].cartList.forEach(item => {
					item.checked = checked;
				});
				this.calculationTotalPrice();
			},
			/**
			 * 全选
			 */
			allElection(checked) {
				if (typeof checked == 'boolean') {
					this.checkAll = checked;
				} else {
					this.checkAll = !this.checkAll;
				}
				if (this.cartData.length) {
					this.cartData.forEach(siteItem => {
						siteItem.checked = this.checkAll;
						siteItem.cartList.forEach(item => {
							item.checked = this.checkAll;
						});
					});
				}
				this.calculationTotalPrice();
			},
			/**
			 * 计算进货单总价
			 */
			calculationTotalPrice() {
				if (this.cartData.length) {
					let totalPrice = 0,
						totalCount = 0,
						siteAllElectionCount = 0;

					this.cartData.forEach(siteItem => {
						let siteGoodsCount = 0;
						siteItem.cartList.forEach(item => {
							
							if (item.checked) {
								siteGoodsCount += 1;
								totalCount += 1;
								totalPrice += this.priceDeal(item) * item.num;
							}
						});
						if (siteItem.cartList.length == siteGoodsCount) {
							siteItem.checked = true;
							siteAllElectionCount += 1;
						} else {
							siteItem.checked = false;
						}
					});
					this.totalPrice = totalPrice.toFixed(2);
					this.totalCount = totalCount;
					this.checkAll = this.cartData.length == siteAllElectionCount;
				} else {
					this.totalPrice = '0.00';
					this.totalCount = 0;
				}
				this.modifyFlag = false;
			},
			/**
			 * 删除进货单
			 * @param {Object} siteIndex
			 * @param {Object} cartIndex
			 */
			deleteCart(siteIndex, cartIndex) {
				this.$api.sendRequest({
					url: '/wholesale/api/cart/delete',
					data: {
						cart_id: this.cartData[siteIndex].cartList[cartIndex].cart_id
					},
					success: res => {
						if (res.code >= 0) {
							this.cartData[siteIndex].cartList.splice(cartIndex, 1);
							if (this.cartData[siteIndex].cartList.length == 0) this.cartData.splice(siteIndex, 1);
							this.calculationTotalPrice();
							this.getCartNumber();
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			/**
			 * 变更进货单数量
			 * @param {Object} params
			 */
			cartNumChange(num, params) {
				if(num <=params.minNum) return;
				if (num < 1) num = 1;
				this.modifyFlag = true;
				this.$api.sendRequest({
					url: '/wholesale/api/cart/edit',
					data: {
						num,
						cart_id: this.cartData[params.siteIndex].cartList[params.cartIndex].cart_id
					},
					success: res => {
						if (res.code >= 0) {
							this.cartData[params.siteIndex].cartList[params.cartIndex].num = num;
							this.calculationTotalPrice();
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			/**
			 * 结算
			 */
			settlement() {
				if (this.totalCount > 0) {
					let cart_ids = [];
					this.cartData.forEach(siteItem => {
						siteItem.cartList.forEach(item => {
							if (item.checked) {
								cart_ids.push(item.cart_id);
							}
						});
					});

					if (this.isSub) return;
					this.isSub = true;

					uni.setStorage({
						key: 'orderCreateData',
						data: {
							cart_ids: cart_ids.toString()
						},
						success: () => {
							this.$util.redirectTo('/promotionpages/wholesale/payment/payment');
							this.isSub = false;
						}
					});
				}
			},
			edit(index) {
				this.cartData[index].edit = !this.cartData[index].edit;
			},
			/**
			 * 清空失效商品
			 */
			clearInvalidGoods() {
				var cart_ids = [];
				this.invalidGoods.forEach(goodsItem => {
					cart_ids.push(goodsItem.cart_id);
				});
				if (cart_ids.length) {
					this.$api.sendRequest({
						url: '/api/cart/delete',
						data: {
							cart_id: cart_ids.toString()
						},
						success: res => {
							if (res.code >= 0) {
								this.invalidGoods = [];
								this.getCartNumber()
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						}
					});
				}
			},
			imageError(siteIndex, cartIndex) {
				this.cartData[siteIndex].cartList[cartIndex].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			// 进货单数量
			getCartNumber() {
				if (uni.getStorageSync("token")) {
					this.$store.dispatch('getWholeSaleNumber')
				}
			}
		}
	};
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;
		padding-bottom: 100rpx;
		padding-bottom:  calc(100rpx + constant(safe-area-inset-bottom));
		padding-bottom:  calc(100rpx + env(safe-area-inset-bottom)) ;
	}

	.cart-wrap {
		margin: 20rpx;
		background: #fff;
		border-radius: $ns-border-radius;
		overflow: hidden;
		width: calc(100% - 20px);

		.cart-header {
			padding: 20rpx;
			overflow: hidden;
			display: flex;
			align-items: center;
			line-height: 40rpx;

			.shop-info {
				flex: 1;
				line-height: inherit;
			}

			.iconyuan_checkbox {
				font-size: 36rpx;
				color: #898989;
				margin-right: 14rpx;
				line-height: 1;
			}

			.iconyuan_checked {
				font-size: 36rpx;
				margin-right: 14rpx;
				line-height: 1;
			}

			.icondianpu {
				display: inline-block;
				margin-right: 10rpx;
				line-height: inherit;
			}

			.cart-operation {
				line-height: inherit;
			}
		}

		.cart-goods {
			margin: 0 20rpx 20rpx 20rpx;
			border-radius: 4px;
			background: #fff;
			box-sizing: border-box;
			position: relative;

			.goods-wrap {
				display: flex;
				position: relative;
				padding-left: 52rpx;
				transition: all 0.3s;

				&.edit {
					transform: translateX(-120rpx);
				}

				&>.iconfont {
					font-size: 36rpx;
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
				}

				&>.iconyuan_checkbox {
					color: $ns-text-color-gray;
				}

				.goods-img {
					width: 180rpx;
					height: 180rpx;
					padding: 20rpx 0 0 0;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.goods-info {
					flex: 1;
					position: relative;
					padding: 20rpx 0 0 0;
					max-width: calc(100% - 200rpx);

					.goods-name {
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						line-height: 1.5;
						font-size: 28rpx;
					}

					.sku {
						font-size: 24rpx;
						color: #999;
						display: block;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.goods-sub-section {
						position: absolute;
						left: 0;
						bottom: 0;
						width: 100%;

						.unit {
							font-size: 24rpx;
						}

						.uni-numbox {
							float: right;
						}
					}
				}
			}

			.item-del {
				position: absolute;
				width: 0;
				height: 100%;
				color: #fff;
				right: 0;
				top: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s;
				overflow: hidden;
				white-space: nowrap;

				&.show {
					width: 100rpx;
				}
			}
		}

		.invalid-goods {
			.invalid-mark {
				background: #aaa;
				color: #fff;
				padding: 4rpx 16rpx;
				display: inline-block;
				line-height: 1;
				font-size: 24rpx;
				position: absolute;
				border-radius: 24rpx;
				top: 50%;
				transform: translateY(-50%);
			}

			.goods-wrap {
				padding-left: 100rpx;
			}
		}
	}

	.cart-bottom {
		position: fixed;
		z-index: 5;
		width: 100vw;
		height: 100rpx;
		background: #fff;
		bottom: var(--window-bottom);
		overflow: hidden;
		display: flex;
		bottom: 0;
		bottom: calc(0px + constant(safe-area-inset-bottom));
		bottom: calc(0px + env(safe-area-inset-bottom));

		.all-election {
			height: 100rpx;
			position: relative;
			padding-left: 20rpx;
			display: inline-block;

			&>.iconfont {
				font-size: 36rpx;
				position: absolute;
				top: 50%;
				left: 24rpx;
				transform: translateY(-50%);
			}

			&>text {
				margin-left: 56rpx;
				line-height: 100rpx;
			}
		}

		.settlement-info {
			flex: 1;
			text-align: right;
			padding-right: 20rpx;
			line-height: 100rpx;
		}

		.operation-btn {
			width: 230rpx;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 0;
			margin: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.cart-empty {
		text-align: center;
		font-size: 24rpx;
		padding: 240rpx $ns-padding 80rpx $ns-padding;

		.empty {
			padding-top: 0;
			padding-bottom: 50rpx;
			text-align: center;
		}

		image {
			margin: 10px auto;
			width: 220rpx;
			height: 120rpx;
			display: block;
		}

		navigator {
			display: inline;
		}
	}
</style>
