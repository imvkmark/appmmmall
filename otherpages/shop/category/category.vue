<template>
	<view class="page">
		<diy-shop-info :site-id="siteId"></diy-shop-info>
		<view v-for="(item, index) in diyData.value" :key="index">
			<template v-if="item.controller == 'GoodsCategory'">
				<!-- 商品分类 -->
				<view :class="iphoneX?'active' : 'no'">
					<diy-goods-level-category :value="item" :siteId="siteId" @netFinish="netFinish" :autoHeight="!1" :bottom="windowHeight"></diy-goods-level-category>
				</view>
			</template>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>

		<!-- 底部tabBar -->
		<diy-bottom-nav type="shop" :site-id="siteId"></diy-bottom-nav>
	</view>
</template>

<script>
	import diyShopInfo from '@/components/diy-shop-info/diy-shop-info';
	import diyGoodsLevelCategory from "@/components/diy-goods-level-category/diy-goods-level-category.vue"
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	export default {
		components: {
			diyBottomNav,
			diyShopInfo
		},
		data() {
			return {
				siteId: 0,
				diyData: [],
				isIphoneX: false, //判断手机是否是iphoneX以上,
				windowHeight:0
			};
		},
		onLoad(options) {
			this.iphoneX = this.$util.uniappIsIPhoneX()
			if (!options.site_id) {
				this.$util.redirectTo('/otherpages/shop/index/index', {}, 'redirectTo');
				return;
			}
			this.siteId = options.site_id;
			this.getDiyInfo();
			this.getHeight();
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		methods: {
			getHeight(){
				var self = this;
				uni.getSystemInfo({
					success: function (res) {
						self.windowHeight = res.windowHeight - 57 - 68;
						if(self.iphoneX){
							self.windowHeight = self.windowHeight -33 - 68;
						}
					}
				});
			},	
			//监听子组件分类列表是否请求完成
			netFinish(e) {
				if (e) {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
				setTimeout(() => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}, 1000)
			},
			getDiyInfo() {
				this.$api.sendRequest({
					url: '/api/diyview/info',
					data: {
						site_id:this.siteId,
						name: 'DIYVIEW_SHOP_GOODS_CATEGORY',
						site_id: this.siteId
					},
					success: res => {
						if (res.code != 0 || !res.data) {
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
							return;
						}
						this.diyData = res.data;

						if (this.diyData.value) {
							this.diyData = JSON.parse(this.diyData.value);
							for (var i = 0; i < this.diyData.value.length; i++) {
								if (this.diyData.value[i].controller == 'PopWindow') {
									setTimeout(() => {
										if (uni.getStorageSync('index_wap_floating_layer') != null && uni.getStorageSync(
												'index_wap_floating_layer') != '') {
											var wap_floating_cookie = JSON.parse(uni.getStorageSync('index_wap_floating_layer'));
											if (wap_floating_cookie.closeNum < 3) {
												this.$refs.uniPopup[0].open();
											}
										} else {
											this.$refs.uniPopup[0].open();
										}
									}, 500);
									break;
								}
							}
						}
						uni.stopPullDownRefresh();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	/* #ifdef H5 || APP-PLUS */
	.active /deep/ .newpage1 {
		height: calc(100vh - 134px) !important;
	}

	.no /deep/ .newpage1 {
		height: calc(100vh - 100px) !important;
	}

	/* #endif */

	/* #ifdef MP */
	.active /deep/ .newpage1 {
		height: calc(100vh - 144px) !important;
	}

	.no /deep/ .newpage1 {
		height: calc(100vh - 110rpx) !important;
	}

	/* #endif */
</style>
