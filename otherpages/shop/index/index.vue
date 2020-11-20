<template>
	<scroll-view scroll-y :class="themeStyle" class="diy-wrap" :style="{ background: bgColor }">
		<view class="index_bg" :style="'background:' + 'url(' + $util.img(bgUrl) + ') no-repeat 0 0/100%'">
			<ns-navbar :title="pageTitle" :background="{ background:navBar}" :title-color="!bgUrl && (!bgColor || bgColor == '#ffffff') ? '#000000' : '#ffffff'" :border-bottom="false" z-index="1001"></ns-navbar>
			<view class="page-content" :class="Bulge?'active':''">
				<view v-for="(item, index) in diyData.value" :key="index">
					<template v-if="item.controller == 'Text'">
						<!-- 文本 -->
						<diy-text :value="item" :site-id="siteId"></diy-text>
					</template>

					<template v-if="item.controller == 'TextNav'">
						<!-- 文本导航 -->
						<diy-text-nav :value="item" :site-id="siteId"></diy-text-nav>
					</template>

					<template v-if="item.controller == 'Notice'">
						<!-- 公告 -->
						<diy-notice :value="item" :site-id="siteId"></diy-notice>
					</template>

					<template v-if="item.controller == 'GraphicNav'">
						<!-- 图文导航 -->
						<diy-graphic-nav :value="item" :site-id="siteId"></diy-graphic-nav>
					</template>

					<template v-if="item.controller == 'ImageAds'">
						<!-- 图片广告 -->
						<diy-img-ads :value="item" :site-id="siteId"></diy-img-ads>
					</template>

					<template v-if="item.controller == 'Title'">
						<!-- 顶部标题 -->
						<diy-title :value="item" :site-id="siteId"></diy-title>
					</template>

					<template v-if="item.controller == 'RichText'">
						<!-- 富文本 -->
						<diy-rich-text :value="item"></diy-rich-text>
					</template>

					<template v-if="item.controller == 'PopWindow'">
						<!-- 弹出广告 -->
						<view @touchmove.prevent.stop class="PopWindow">
							<uni-popup ref="uniPopup" type="center" class="wap-floating" :maskClick="false">
								<view class="image-wrap"><image :src="$util.img(item.image_url)" mode="widthFix" @click="redirectTo(item.link)"></image></view>
								<text class="iconfont iconroundclose" @click="closeNum"></text>
							</uni-popup>
						</view>
					</template>

					<template v-if="item.controller == 'HorzLine'">
						<!-- 辅助线 -->
						<diy-horz-line :value="item"></diy-horz-line>
					</template>

					<template v-if="item.controller == 'HorzBlank'">
						<!-- 辅助空白 -->
						<diy-horz-blank :value="item"></diy-horz-blank>
					</template>

					<template v-if="item.controller == 'AdminCoupon' && addonIsExit.coupon">
						<!-- 优惠券 -->
						<diy-coupon :value="item" :site-id="siteId"></diy-coupon>
					</template>

					<template v-if="item.controller == 'GoodsList'">
						<!-- 商品列表 -->
						<diy-goods-list :value="item" :site-id="siteId"></diy-goods-list>
					</template>

					<template v-if="item.controller == 'RubikCube'">
						<!-- 魔方、橱窗 -->
						<diy-rubik-cube :value="item" :site-id="siteId"></diy-rubik-cube>
					</template>

					<template v-if="item.controller == 'Video'">
						<!-- 视频 -->
						<diy-video :value="item"></diy-video>
					</template>

					<template v-if="item.controller == 'Seckill' && addonIsExit.seckill">
						<!-- 秒杀 -->
						<diy-seckill :value="item" :site-id="siteId"></diy-seckill>
					</template>

					<template v-if="item.controller == 'Pintuan' && addonIsExit.pintuan">
						<!-- 拼团 -->
						<diy-pintuan :value="item" :site-id="siteId"></diy-pintuan>
					</template>

					<template v-if="item.controller == 'ShopInfo'">
						<!-- 店铺信息 -->
						<diy-shop-info :value="item" :site-id="siteId" :type="1"></diy-shop-info>
					</template>

					<template v-if="item.controller == 'ShopSearch'">
						<!-- 店内搜索 -->
						<diy-shop-search :value="item" :site-id="siteId"></diy-shop-search>
					</template>

					<template v-if="item.controller == 'RankList'">
						<!-- 店铺排行榜 -->
						<diy-shop-rank-list :value="item" :site-id="siteId"></diy-shop-rank-list>
					</template>

					<template v-if="item.controller == 'Groupbuy' && addonIsExit.groupbuy">
						<!-- 团购 -->
						<diy-groupbuy :value="item" :site-id="siteId"></diy-groupbuy>
					</template>
					
					<template v-if="item.controller == 'Bargain' && addonIsExit.bargain">
						<!-- 砍价 -->
						<diy-bargain :value="item"></diy-bargain>
					</template>

					<template v-if="item.controller == 'ShopStore'">
						<!-- 门店列表 -->
						<diy-shop-store :value="item" :site-id="siteId"></diy-shop-store>
					</template>

					<template v-if="item.controller == 'GoodsCategory'">
						<!-- 商品分类 -->
						<diy-goods-level-category :value="item" :bottom="windowHeight" :site-id="siteId"></diy-goods-level-category>
					</template>
					
					<template v-if="item.controller == 'Wholesale' && addonIsExit.wholesale">
						<!-- 商品批发 -->
						<diy-whole-sale :site-id="siteId" :value="item"></diy-whole-sale>
					</template>
					
					<template v-if="item.controller == 'LiveInfo'">
						<!-- 小程序直播 -->
						<!-- #ifdef MP-WEIXIN -->
						<diy-live :value="item" :site-id="siteId"></diy-live>
						<!-- #endif -->
					</template>
				</view>
			</view>
			<view v-if="diyData.length == 0" class="empty"><ns-empty text="当前站点尚未配置自定义首页"></ns-empty></view>

			<!-- 底部tabBar -->
			<diy-bottom-nav type="shop" :site-id="siteId" v-if="openBottomNav"  @isBulge="isBulge"></diy-bottom-nav>

			<loading-cover ref="loadingCover"></loading-cover>

			<view class="shop-index-mark" v-if="preview" @click="previewPage()"></view>
		</view>
	</scroll-view>
</template>

<script>
import diyHorzBlank from '@/components/diy-horz-blank/diy-horz-blank.vue';
import diyHorzLine from '@/components/diy-horz-line/diy-horz-line.vue';
import diyCoupon from '@/components/diy-coupon/diy-coupon.vue';
import diyGoodsList from '@/components/diy-goods-list/diy-goods-list.vue';
import diyImgAds from '@/components/diy-img-ads/diy-img-ads.vue';
import diyGraphicNav from '@/components/diy-graphic-nav/diy-graphic-nav.vue';
import diyNotice from '@/components/diy-notice/diy-notice.vue';
import diyRichText from '@/components/diy-rich-text/diy-rich-text.vue';
import diyRubikCube from '@/components/diy-rubik-cube/diy-rubik-cube';
import diyTextNav from '@/components/diy-text-nav/diy-text-nav.vue';
import diyTitle from '@/components/diy-title/diy-title.vue';
import diyVideo from '@/components/diy-video/diy-video.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import diySeckill from '@/components/diy-seckill/diy-seckill.vue';
import diyBargain from '@/components/diy-bargain/diy-bargain.vue';
import diyShopSearch from '@/components/diy-shop-search/diy-shop-search.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import diyShopRankList from '@/components/diy-shop-rank-list/diy-shop-rank-list';
import diyPintuan from '@/components/diy-pintuan/diy-pintuan.vue';
import diyGroupBuy from '@/components/diy-groupbuy/diy-groupbuy.vue';
import diyLive from '@/components/diy-live/diy-live.vue';
import diyShopInfo from '@/components/diy-shop-info/diy-shop-info';
import diyShopStore from '@/components/diy-shop-store/diy-shop-store';
import diyGoodsLevelCategory from '@/components/diy-goods-level-category/diy-goods-level-category.vue';
import nsNavbar from '@/components/ns-navbar/ns-navbar.vue'
import diyWholeSale from '@/components/diy-wholesale/diy-wholesale.vue'

export default {
	components: {
		diyHorzBlank,
		diyHorzLine,
		diyCoupon,
		diyGoodsList,
		diyImgAds,
		diyGraphicNav,
		diyNotice,
		diyRichText,
		diyRubikCube,
		diyTextNav,
		diyTitle,
		diyVideo,
		uniPopup,
		diySeckill,
		diyShopSearch,
		diyBottomNav,
		diyShopRankList,
		diyPintuan,
		diyBargain,
		diyGroupBuy,
		diyShopInfo,
		diyShopStore,
		diyGoodsLevelCategory,
		diyLive,
		nsNavbar,
		diyWholeSale
	},
	data() {
		return {
			diyData: [],
			siteId: 0,
			preview: 0, //页面是否为预览  1为是，0为否
			windowHeight: 0,
			isIphoneX: false,
			Bulge:false
		};
	},
	//下拉刷新
	onPullDownRefresh() {
		this.refresh();
	},
	onLoad(data) {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.siteId = parseInt(data.site_id) || 0;
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('site_id') != -1) this.siteId = item.split('-')[1];
				});
			}
		}
		this.refresh();
		this.getHeight();
	},
	computed: {
		//vueX页面主题
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		},
		addonIsExit() {
			return this.$store.state.addonIsExit;
		},
		bgColor() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.bgColor;
			}
			return str;
		},
		bgUrl() {
			let str = '';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.bgUrl;
			}
			return str;
		},
		pageTitle(){
			let str = '店铺首页';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.title;
			}
			return str;
		},
		openBottomNav(){
			let Bloon=false;
			if (this.diyData && this.diyData.global) {
				Bloon = this.diyData.global.openBottomNav;
			}
			return Bloon;
		},
		navBar(){
			let str="#ffffff"
			if(this.bgUrl){
				str='url(' + this.$util.img(this.bgUrl) + ') no-repeat 0 0/100%'
			}else if(this.bgColor){
				str=this.bgColor;
			}else{
				str="rgba(0,0,0,0)"
			}
			return str;
		}
	},
	onShow() {},
	methods: {
		isBulge(e){
			this.Bulge=e;
		},
		getHeight() {
			var self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.windowHeight = res.windowHeight - 57;
					if (self.iphoneX) {
						self.windowHeight = self.windowHeight - 33;
					}
				}
			});
		},
		getDiyInfo() {
			this.$api.sendRequest({
				url: '/api/diyview/info',
				data: {
					name: 'DIYVIEW_SHOP_INDEX',
					site_id: this.siteId
				},
				success: res => {
					if (res.data) {
						this.diyData = res.data;
						if (this.diyData.value) {
							this.diyData = JSON.parse(this.diyData.value);
							for (var i = 0; i < this.diyData.value.length; i++) {
								if (this.diyData.value[i].controller == 'PopWindow') {
									setTimeout(() => {
										if (uni.getStorageSync('shop_index_wap_floating_layer') != null && uni.getStorageSync('shop_index_wap_floating_layer') != '') {
											var wap_floating_cookie = JSON.parse(uni.getStorageSync('shop_index_wap_floating_layer'));
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
					}
					uni.stopPullDownRefresh();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					uni.stopPullDownRefresh();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		closeNum() {
			this.$refs.uniPopup[0].close();
			var closeNum = 1;
			if (uni.getStorageSync('shop_index_wap_floating_layer')) {
				var wap_floating_cookie = JSON.parse(uni.getStorageSync('shop_index_wap_floating_layer'));
				closeNum = ++wap_floating_cookie.closeNum;
			}
			uni.setStorageSync(
				'shop_index_wap_floating_layer',
				JSON.stringify({
					closeNum
				})
			);
		},
		refresh() {
			if (this.siteId) {
				// 刷新多语言
				this.$langConfig.refresh();
				this.getDiyInfo();
			} else {
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			}
		},
		redirectTo(link) {
			if (this.siteId) {
				link = link + '?site_id=' + this.this.siteId;
			}
			this.$util.diyRedirectTo(link);
		},
		// 页面预览提示
		previewPage() {
			this.$util.showToast({
				title: '预览模式无法操作'
			});
		}
	}
};
</script>

<style lang="scss">

.diy-wrap {
	height: 100vh;
}
.page-content{
	padding-bottom:55px;
	padding-bottom: calc(55px + constant(safe-area-inset-bottom));
	padding-bottom: calc(55px + env(safe-area-inset-bottom));
}
.page-content.active{
	padding-bottom:90px;
	padding-bottom: calc(90px + constant(safe-area-inset-bottom));
	padding-bottom: calc(90px + env(safe-area-inset-bottom));
}
.index_bg {
	width: 100%;
	height: 100%;
}

.head-nav {
	width: 100%;
	height: var(--status-bar-height);
}

.head-nav.active {
	padding-top: 40rpx;
}

.head-return {
	padding-left: 30rpx;
	padding-right: 30rpx;
	height: 90rpx;
	line-height: 90rpx;
	text-align: center;
	color: #fff;
	font-weight: 600;
	font-size: $ns-font-size-lg;
	display: flex;
	justify-content: space-between;

	text {
		display: inline-block;
		margin-right: 10rpx;
	}
}

.wap-floating {
	.image-wrap {
		width: 480rpx;

		image {
			width: 100%;
			border-radius: 40rpx;
		}
	}

	text {
		display: block;
		font-size: 60rpx;
		color: #ffffff;
		text-align: center;
	}
}


.shop-index {
	position: relative;
}

.shop-index-mark {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0);
	position: absolute;
	left: 0;
	top: 0;
	z-index: 999;
}

.empty {
	margin-top: 200rpx;
}

.PopWindow {
	.wap-floating,
	.uni-popup__wrapper-box {
		.image-wrap {
			width: 480rpx;

			image {
				width: 100%;
				border-radius: 40rpx;
			}
		}

		text {
			display: block;
			font-size: 60rpx;
			color: #ffffff;
			text-align: center;
		}
	}

	.uni-popup__wrapper-box {
		text-align: center;
		overflow: initial !important;
		background: none !important;
		vertical-align: middle;
		background: none;
	}
}

::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}
</style>

<style scoped>
.wap-floating >>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
}
</style>

<style lang="scss">
//去掉默认的最小高度
/deep/ .mescroll-body {
	min-height: 0 !important;
}

//如果页面本身存在返回顶部
/deep/ .mescroll-totop {
	display: none !important;
}

//解决sku图片展示不全
.poster-layer /deep/ .uni-popup__wrapper-box {
	max-height: initial !important;
}

/deep/ .sku-layer .uni-popup__wrapper-box {
	overflow-y: initial !important;
}

/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	max-height: unset !important;
}
</style>
