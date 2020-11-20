<template>
	<view :class="themeStyle">
		<mescroll-uni @getData="getData" refs="mescroll" :size="10" v-if="addonIsExit.pintuan">
			<block slot="list">
				<ns-adv keyword="NS_PINTUAN"></ns-adv>
				<view class="ns-padding-top">
					<block v-for="(dataItem, index) in dataList" :key="index">
						<ns-goods-item-col :value="dataItem" @toDetail="toDetail" type="bargain">
							<view class="wholesale-option">
								<view class="sale ns-font-size-sm">已售{{dataItem.sale_num}}件</view>
								<view class="wholesale-price ns-font-size-sm">
									<block v-if="dataItem.min_price==dataItem.max_price">
										<text class="ns-text-color">￥{{dataItem.min_price}}</text>
									</block>
									<block v-else>
										<text class="ns-text-color">￥{{dataItem.min_price}} ~ ￥{{dataItem.max_price}}</text>
									</block>
									<text class="ns-margin-left">{{Number(dataItem.min_num)}}件起批</text>
								</view>
							</view>
						</ns-goods-item-col>
					</block>
				</view>
				<view v-if="!dataList.length"><ns-empty :siteId="siteId" :fixed="false"></ns-empty></view>
			</block>
		</mescroll-uni>
		<drag-button :isDock="true" :existTabBar="true" @btnClick="btnClick" />
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import nsAdv from '@/components/ns-adv/ns-adv.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import nsGoodsItemCol from '@/components/ns-goods-item/ns-goods-item-col.vue';
import dragButton from '@/components/drag-button/drag-button.vue';
export default {
	components: {
		nsAdv,
		nsGoodsItemCol,
		dragButton
	},
	data() {
		return {
			dataList: [],
			siteId: 0
		};
	},
	mixins: [globalConfig],
	onLoad(options) {
		if (options.site_id) {
			this.siteId = options.site_id;
		}
	},
	onShow() {
		if (!this.addonIsExit.pintuan) {
			this.$util.showToast({
				title: '拼团插件未安装',
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
				url: '/wholesale/api/goods/page',
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
			this.$util.redirectTo('/promotionpages/wholesale/detail/detail', {
				sku_id: e.sku_id
			});
		},
		btnClick(){
			this.$util.redirectTo('/promotionpages/wholesale/cartList/cartList')
		}
	}
};
</script>
<style lang="scss"></style>
