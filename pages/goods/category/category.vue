<template>
	<view class="page" :class="themeStyle">
		<view v-for="(item, index) in diyData.value" :key="index">
			<template v-if="item.controller == 'GoodsCategory'">
				<!-- 商品分类 -->
				<diy-goods-level-category :value="item" @netFinish="netFinish" :autoHeight="!1" :bottom="windowHeight"></diy-goods-level-category>
			</template>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>

		<!-- 底部tabBar -->
		<diy-bottom-nav></diy-bottom-nav>
	</view>
</template>

<script>
	import diyGoodsLevelCategory from "@/components/diy-goods-level-category/diy-goods-level-category.vue"
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	export default {
		components: {
			diyBottomNav,
			diyGoodsLevelCategory
		},
		data() {
			return {
				diyData: [],
				windowHeight:0
			};
		},
		computed: {
			// 使用对象展开运算符将此对象混入到外部对象中
			themeStyle(){
				return 'theme-'+this.$store.state.themeStyle
			}
		},
		onLoad() {
			this.getDiyInfo()
			this.getHeight()
		},
		onShow() {
			this.$langConfig.refresh();
			if(this.$refs.goodsLevelCategory) this.$refs.goodsLevelCategory[0].getCartData();
		},
		methods: {
			getHeight(){
				var self = this;
				uni.getSystemInfo({
					success: function (res) {
						self.windowHeight = res.windowHeight - 57;
						// if(self.iphoneX){
						// 	self.windowHeight = self.windowHeight -33;
						// }
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
						name: 'DIYVIEW_GOODS_CATEGORY',
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
					},
				});
			},
		}
	};
</script>

<style lang="scss">
</style>
