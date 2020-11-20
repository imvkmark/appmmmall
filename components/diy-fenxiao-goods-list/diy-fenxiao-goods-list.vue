<template>
	<view class="diy-fenxiao" :class="themeStyle" v-if="list.length">
		<view class="diy-fenxiao-top">
			<view class="fenxiao-title"><text class="fenxiao-title-name">{{fenxiaoWords.concept}}专区</text></view>
			<view class="fenxiao-more ns-text-color" @click="toMore()">查看更多</view>
		</view>
		<ns-goods-item-row :value="list" @toDetail="toDetail" type="fenxiaoMarket"></ns-goods-item-row>
	</view>
</template>

<script>
	import nsGoodsItemRow from "@/components/ns-goods-item/ns-goods-item-row.vue";
	export default {
		name: 'diy-fenxiao-goods-list',
		components:{
			nsGoodsItemRow
		},
		props: {
			value: {
				type: Object
			},
			siteId: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				list: [],
				fenxiaoWords: {},
				currentRoute: ''
			};
		},
		computed:{
			// 使用对象展开运算符将此对象混入到外部对象中
			themeStyle(){
				return 'theme-'+this.$store.state.themeStyle
			},
			addonIsExit(){
				return this.$store.state.addonIsExit
			} 
		},
		created() {
			let currentPage = getCurrentPages()[getCurrentPages().length - 1];
			this.currentRoute = '/' + currentPage.route;
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo('/pages/login/login/login', {
					back: this.currentRoute
				}, 'redirectTo');
			}
			this.getData();
			if (uni.getStorageSync('fenxiaoWords')) this.fenxiaoWords = uni.getStorageSync('fenxiaoWords');
			this.getFenxiaoWrods();
		},
		methods: {
			followGoods(d, e, f, g) {
				this.$api.sendRequest({
					url: '/fenxiao/api/goodscollect/add',
					data: {
						goods_id: e,
						sku_id: f,
						site_id: g
					},
					success: res => {
						let msg = '';
						if (res.code >= 0) {
							msg = "关注成功"
						} else {
							msg = res.message
						}
						this.$util.showToast({
							title: msg
						})
						this.list[d].is_collect = 1;
					}
				});
			},
			//取消关注
			delFollowTip(e, f) {
				uni.showModal({
					title: '提示',
					content: '确认取消关注该商品吗',
					success: (res) => {
						if (res.confirm) {
							this.delFollow(e, f)
						} else if (res.cancel) {

						}
					}
				});
			},
			delFollow(e, f) {
				this.$api.sendRequest({
					url: '/fenxiao/api/goodscollect/delete',
					data: {
						collect_id: e
					},
					success: res => {
						let msg = "";
						if (res.code == 0) {
							msg = "取消成功"
						} else {
							msg = res.message
						}
						this.$util.showToast({
							title: msg
						})

						let arr = this.list;
						arr[f].is_collect = 0;
						this.list = arr;
					}
				});
			},
			getFenxiaoWrods() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/words',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.fenxiaoWords = res.data;
							uni.setStorageSync('fenxiaoWords', res.data);
						}
					}
				})
			},
			toMore() {
				this.$util.redirectTo('/otherpages/fenxiao/goods_list/goods_list');
			},
			getData() {
				this.$api.sendRequest({
					url: '/fenxiao/api/goods/page',
					data: {
						page: 1,
						page_size: 6,
						site_id: this.siteId
					},
					success: res => {
						if (res.code == 0) {
							this.list = res.data.list;
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
				this.list[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.diy-fenxiao {
		width: 100%;
		padding-top: $ns-padding;
		box-sizing: border-box;
	}

	.diy-fenxiao-top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 $ns-padding;
		box-sizing: border-box;
		.fenxiao-title {
			display: flex;
			align-items: center;

			.fenxiao-title-name {
				font-size: $ns-font-size-base;
				font-weight: bold;
				margin-right: $ns-margin;
			}

			.fenxiao-title-time {
				font-size: $ns-font-size-sm;
			}
		}

		.fenxiao-more {
			font-size: $ns-font-size-sm;
		}

		.fenxiao-more::after {
			font-family: 'iconfont';
			content: '\eb93';
			font-size: $ns-font-size-base;
			line-height: 1;
			position: relative;
			top: 2rpx;
			margin-left: 4rpx;
		}
	}
</style>
