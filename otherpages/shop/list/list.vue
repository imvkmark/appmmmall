<template>
	<view :class="themeStyle">
		<view class="content" :class="{'active':isIphoneX}">
			<view class="head-wrap">
				<!-- 搜索区域 -->
				<view class="search-wrap uni-flex uni-row">
					<view class="flex-item category-wrap" @click="showCategory = true">
						<view class="iconfont iconsort"></view>
					</view>

					<view class="flex-item input-wrap">
						<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()" placeholder="请输入您要搜索的商品" />
						<text class="iconfont iconIcon_search" @click.stop="search()"></text>
					</view>

					<view class="flex-item list-style" @click="changeListStyle()">
						<view class="iconfont" :class="{ iconapps: listStyle == 'largest', iconlist1: listStyle == '' }"></view>
					</view>
				</view>

				<!-- 排序 -->
				<view class="sort-wrap">
					<view class="comprehensive-wrap" :class="{ 'ns-text-color': orderType === '' }" @click="sortTabClick('')">
						<text :class="{ 'ns-text-color': orderType === '' }">默认</text>
					</view>
					<view :class="{ 'ns-text-color': orderType === 'sales' }" @click="sortTabClick('sales')">销量</view>
					<view class="price-wrap" @click="sortTabClick('discount_price')">
						<text :class="{ 'ns-text-color': orderType === 'discount_price' }">价格</text>
						<view class="iconfont-wrap">
							<view class="iconfont iconiconangledown-copy" :class="{ 'ns-text-color': priceOrder === 'asc' && orderType === 'discount_price' }"></view>
							<view class="iconfont iconiconangledown" :class="{ 'ns-text-color': priceOrder === 'desc' && orderType === 'discount_price' }"></view>
						</view>
					</view>
					<view :class="{ 'ns-text-color': orderType === 'screen' }" @click="sortTabClick('screen')" class="screen-wrap">
						<text>筛选</text>
						<view class="iconfont-wrap">
							<view class="iconfont iconshaixuan ns-text-color-gray"></view>
						</view>
					</view>
				</view>
			</view>

			<!-- top:350 -->
			<mescroll-uni top="190" ref="mescroll" @getData="getGoodsList">
				<block slot="list">
					<view class="goods-list" :class="listStyle" v-if="goodsList.length">
						<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
							<view class="image-wrap">
								<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="aspectFill" />
							</view>
							<view class="goods-info">
								<text class="goods-name">{{ item.goods_name }}</text>
								<text class="introduction" v-if="item.introduction">{{ item.introduction }}</text>
								<view class="is_discount ns-text-color ns-border-color" v-if="item.promotion_type == 1 && addonIsExit.discount">
									限时折扣
								</view>
								<view class="price-wrap">
									<text class="unit ns-text-color">¥</text>
									<text class="price ns-text-color">{{ item.discount_price }}</text>
									<text class="sale-num">{{ item.sale_num }}人付款</text>
								</view>
								<view class="other-info"><text v-if="item.is_free_shipping == 1">免运费</text></view>
							</view>
						</view>
					</view>
					<view v-if="!goodsList.length">
						<ns-empty :siteId="siteId"></ns-empty>
					</view>
				</block>
			</mescroll-uni>

			<!-- 商品分类弹出框 -->
			<uni-drawer :visible="showCategory" mode="left" @close="showCategory = false">
				<scroll-view scroll-y class="category-list-wrap">
					<view>
						<text class="first" @click="selectedCategory(0, 0)" :class="{ selected: categoryId == 0 }">全部分类</text>
						<view v-for="(item, index) in categoryList" :key="index" class="list-wrap">
							<text class="first" @click="selectedCategory(item.category_id, item.level)" :class="{ selected: item.category_id == categoryId }">
								{{ item.category_name }}
							</text>
							<view class="third" v-if="item.child_list != ''">
								<view v-for="(third_item, third_index) in item.child_list" :key="third_index">
									<uni-tag :inverted="true" :text="third_item.category_name" :type="third_item.category_id == categoryId ? 'primary' : 'default'"
									 @click="selectedCategory(third_item.category_id, third_item.level)" />
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</uni-drawer>

			<!-- 筛选弹出框 -->
			<uni-drawer :visible="showScreen" mode="right" @close="showScreen = false" class="screen-wrap">
				<view class="title ns-text-color-gray">筛选</view>
				<scroll-view scroll-y>
					<!-- 品牌筛选项 -->
					<view class="item-wrap" v-if="brandList.length > 0">
						<view class="label">
							<text>品牌</text>
							<view class="iconfont" :class="[showBrandMore ? 'iconiconangledown' : 'iconiconangledown-copy']" v-if="brandList.length > 1"
							 @click="showBrandMore = !showBrandMore"></view>
						</view>
						<view class="list">
							<template v-if="showBrandMore">
								<view v-for="(item, index) in brandList" :key="index">
									<uni-tag :inverted="true" :text="item.brand_name" :type="item.brand_id == brandId ? 'primary' : 'default'"
									 @click="brandId == item.brand_id ? (brandId = 0) : (brandId = item.brand_id)" />
								</view>
							</template>
							<template v-else>
								<view v-for="(item, index) in brandList" :key="index" v-if="index < 5">
									<uni-tag :inverted="true" :text="item.brand_name" :type="item.brand_id == brandId ? 'primary' : 'default'"
									 @click="brandId == item.brand_id ? (brandId = 0) : (brandId = item.brand_id)" />
								</view>
							</template>
						</view>
					</view>

					<!-- 包邮 -->
					<view class="item-wrap">
						<view class="label"><text>是否包邮</text></view>
						<view class="list">
							<uni-tag :inverted="true" text="包邮" :type="isFreeShipping>0 ? 'primary' : 'default'" @click="isFreeShipping = isFreeShipping>0?0:1" />
						</view>
					</view>

					<!-- 属性筛选项 -->
					<view class="item-wrap" v-if="attributeList.length > 0">
						<view v-for="(item, index) in attributeList" :key="index">
							<view class="label">
								<text>{{ item.attr_name }}</text>
								<!-- iconiconangledown -->
								<view class="iconfont iconiconangledown-copy" v-if="item.child.length > 3"></view>
							</view>
							<view class="list">
								<view v-for="(child, child_index) in item.child" :key="child_index">
									<uni-tag :inverted="true" :text="child.attr_value_name" :type="isSelectedAttr(item.attr_id, child.attr_value_id) ? 'primary' : 'default'"
									 @click="selectedAttr(item.attr_id, child.attr_value_id)" />
								</view>
							</view>
						</view>
					</view>

					<!-- 价格筛选项 -->
					<view class="item-wrap">
						<view class="label"><text>价格区间(元)</text></view>
						<view class="price-wrap">
							<input class="uni-input" type="digit" v-model="minPrice" placeholder="最低价" />
							<text class="ns-text-color-gray">——</text>
							<input class="uni-input" type="digit" v-model="maxPrice" placeholder="最高价" />
						</view>
					</view>
				</scroll-view>
				<view class="footer safe-area">
					<view class="footer-box" @click="showScreen = false">取消</view>
					<view class="footer-box1 ns-bg-color" @click="screenData">确定</view>
				</view>
			</uni-drawer>

			<!-- 底部tabBar -->
			<diy-bottom-nav type="shop" :site-id="siteId"></diy-bottom-nav>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>

</template>

<script>
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	import list from '../public/js/list.js';

	export default {
		components: {
			uniDrawer,
			uniTag,
			diyBottomNav
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			},
			addonIsExit(){
				return this.$store.state.addonIsExit
			} 
		},
		data() {
			return {};
		},
		mixins: [list]
	};
</script>

<style lang="scss">
	@import '../public/css/list.scss';
</style>
<style lang="scss">
	/deep/ .mescroll-uni-warp scroll-view {
		padding-bottom: 110rpx !important;
	}

	.active /deep/ .mescroll-uni-warp scroll-view {
		padding-bottom: 178rpx !important;
	}
</style>
