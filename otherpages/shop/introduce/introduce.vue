<template>
	<view :class="themeStyle">
		<view class="store">
			<!-- 店铺信息 -->
			<diy-shop-info :siteId="siteId" :type="0"></diy-shop-info>
		
			<!-- 店铺描述 -->
			<view class="store-desc">
				<view class="desc-title">店铺介绍</view>
			</view>
			<view class="store-exper">
				<view class="exper-info">
					<view class="exper-desc ns-font-size-sm">{{ shopInfo.seo_description }}</view>
				</view>
			</view>
			<view class="store-eval">
				<view class="eval-li">
					<text class="ns-margin-right">描述相符</text>
					<view class="line ns-margin-right">
						<ns-progress :progress='shopDesccredit'></ns-progress>
					</view>
					<text class="ns-margin-right grade ns-text-color">{{ shopInfo.shop_desccredit }}</text>
				</view>
				<view class="eval-li">
					<text class="ns-margin-right">服务态度</text>
					<view class="line ns-margin-right">
						<ns-progress :progress='shopServicecredit'></ns-progress>
					</view>
					<text class="ns-margin-right grade ns-text-color">{{ shopInfo.shop_servicecredit }}</text>
				</view>
				<view class="eval-li">
					<text class="ns-margin-right">物流服务</text>
					<view class="line ns-margin-right">
						<ns-progress :progress='shopDeliverycredit'></ns-progress>
					</view>
					<text class="ns-margin-right grade ns-text-color">{{ shopInfo.shop_deliverycredit }}</text>
				</view>
			</view>
		
			<!-- 店铺权益 -->
			<block v-if="shopInfo.shop_zhping || shopInfo.shop_qtian || shopInfo.shop_erxiaoshi || shopInfo.shop_xiaoxie">
				<view class="store-desc">
					<view class="desc-title">商家服务</view>
				</view>
				<view class="store-explain">
					<view class="explain-li" v-if="shopInfo.shop_zhping"><button type="primary" size="mini">正品保障</button></view>
					<view class="explain-li" v-if="shopInfo.shop_qtian"><button type="primary" size="mini">七天无理由退换</button></view>
					<view class="explain-li" v-if="shopInfo.shop_erxiaoshi"><button type="primary" size="mini">两小时发货</button></view>
					<view class="explain-li" v-if="shopInfo.shop_xiaoxie"><button type="primary" size="mini">消协保证</button></view>
				</view>
			</block>
		
			<!-- 店铺基础信息 -->
			<view class="store-desc">
				<view class="desc-title">店铺信息</view>
			</view>
			<view class="store-base-info">
				<view class="base-li" v-if="shopInfo.site_name">
					<text>店铺名称</text>
					<text>{{ shopInfo.site_name }}</text>
				</view>
				<view class="base-li" v-if="shopInfo.telephone">
					<text>服务电话</text>
					<text>{{ shopInfo.telephone }}</text>
				</view>
				<view class="base-li" v-if="shopInfo.qq">
					<text>QQ</text>
					<text>{{ shopInfo.qq }}</text>
				</view>
				<view class="base-li" v-if="shopInfo.ww">
					<text>阿里旺旺</text>
					<text>{{ shopInfo.ww }}</text>
				</view>
				<view class="base-li" v-if="workingDay">
					<text>工作日</text>
					<text>{{ workingDay }}</text>
				</view>
			</view>
		
			<view class="store-desc" v-if="shopInfo.latitude && shopInfo.longitude">
				<view class="desc-title">店铺位置</view>
			</view>
			<view class="store-base-info" v-if="shopInfo.latitude && shopInfo.longitude">
				<map :latitude="Number(shopInfo.latitude)" :longitude="Number(shopInfo.longitude)"></map>
				<view class="ns-margin-top">
					<text>{{ shopInfo.full_address }}{{ shopInfo.address }}</text>
				</view>
			</view>
		
		
			<loading-cover ref="loadingCover"></loading-cover>
			<!-- 底部tabBar -->
			<!-- <diy-bottom-nav type="shop" :site-id="siteId"></diy-bottom-nav> -->
		</view>
	</view>
	
</template>

<script>
	import introduce from '../public/js/introduce.js';
	import diyShopInfo from '@/components/diy-shop-info/diy-shop-info.vue';
	import nsProgress from '@/components/ns-progress/ns-progress.vue';
	// import Map from '@/common/js/map/openMap.js'
	export default {
		components: {
			diyShopInfo,
			nsProgress
		},
		data() {
			return {
				siteId: 0
			};
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		mixins: [introduce],
		onLoad(options) {
			if (!options.site_id) {
				this.$util.redirectTo('/otherpages/shop/index/index', {}, 'redirectTo');
				return;
			}
			this.siteId = options.site_id;
			this.getShopInfo();
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		methods: {}
	};
</script>

<style lang="scss">
	@import '../public/css/introduce.scss';
</style>
