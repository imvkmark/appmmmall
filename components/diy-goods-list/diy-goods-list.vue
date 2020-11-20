<template>
	<view class="goods-list" :class="themeStyle" :style="{ backgroundColor: value.backgroundColor, padding: value.paddingUpDown * 2 + 'rpx 0' }">
		<ns-goods-item-row :value="goodsList" @toDetail="toDetail" :showInfor="value"></ns-goods-item-row>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import nsGoodsItemRow from "@/components/ns-goods-item/ns-goods-item-row.vue";
	// 商品列表
	export default {
		name: 'diy-goods-list',
		components:{
			nsGoodsItemRow
		},
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
		mixins:[globalConfig],
		data() {
			return {
				goodsList: []
			};
		},
		computed: {
			Development() {
				return this.$store.state.Development
			},
			addonIsExit(){
				return this.$store.state.addonIsExit
			} 
		},
		created() {
			this.getGoodsList();
		},
		methods: {
			getGoodsList() {
				var data = {
					page: 1,
					page_size: this.value.goodsCount,
					site_id: this.siteId
				};
				if (this.value.sources == 'category') {
					data.category_id = this.value.categoryId;
					data.category_level = 1;
				}
				this.$api.sendRequest({
					url: '/api/goodssku/page',
					data: data,
					success: res => {
						if (res.code == 0 && res.data) {
							let data = res.data;
							this.goodsList = data.list;
						}
					}
				});
			},
			toDetail(item) {
				this.$util.redirectTo('/pages/goods/detail/detail', {
					sku_id: item.sku_id
				});
			},
			imageError(index) {
				this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss"></style>
