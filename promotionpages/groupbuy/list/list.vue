<template>
	<view :class="themeStyle">
		<mescroll-uni @getData="getData" refs="mescroll" :size="10" v-if="addonIsExit.groupbuy">
			<block slot="list">
				<ns-adv keyword="NS_GROUPBUY"></ns-adv>
				<view class="bargain-page" v-if="dataList.length">
					<block v-for="(dataItem, index) in dataList" :key="index">
						<ns-goods-item-col :value="dataItem" @toDetail="toDetail" type="bargain">
							<view class="desc-con">
								<view class="desc-price">
									<text class="ns-text-color ns-font-size-lg ns-margin-right">￥{{ dataItem.groupbuy_price }}</text>
									<text class="old-price">{{ dataItem.price }}</text>
								</view>
								<view class="desc-pin ns-gradient-promotionpages-groupbuy-list-list" :class="themeStyle">{{ $lang('group') }}</view>
							</view>
						</ns-goods-item-col>
					</block>
				</view>
				<view v-if="!dataList.length" :siteId="siteId"><ns-empty :fixed="!1"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniTag from '@/components/uni-tag/uni-tag.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import nsGoodsItemCol from '@/components/ns-goods-item/ns-goods-item-col.vue';
export default {
	components: {
		uniTag,
		nsGoodsItemCol
	},
	data() {
		return {
			dataList: [],
			siteId: 0
		};
	},
	onLoad(options) {
		if (options.site_id) {
			this.siteId = options.site_id;
		}
	},
	computed: {
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		},
		addonIsExit() {
			return this.$store.state.addonIsExit;
		}
	},
	onShow() {
		if (!this.addonIsExit.groupbuy) {
			this.$util.showToast({
				title: '团购插件未安装',
				mask: true,
				duration: 2000
			});
			setTimeout(() => {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}, 2000);
			return;
		}
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		getData(mescroll) {
			this.$api.sendRequest({
				url: '/groupbuy/api/goods/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					site_id: this.siteId
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({ title: msg });
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/groupbuy/detail/detail', {
				id: e
			});
		},
		imageError(index) {
			this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	},
	onShareAppMessage(res) {
		var title = '参加团购，优惠更多哦';
		var path = '/promotionpages/groupbuy/list/list';
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
.desc-con {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;

	.desc-price {
		line-height: 1;
	}

	.old-price {
		text-decoration: line-through;
		color: $ns-text-color-gray;
		font-size: $ns-font-size-sm;
	}

	.desc-pin {
		font-size: $ns-font-size-base;
		color: #fff;
		padding: 0 $ns-padding;
		height: 48rpx;
		line-height: 48rpx;
		border-radius: 48rpx;
	}
}
.empty {
	margin-top: 100rpx;
}
</style>
