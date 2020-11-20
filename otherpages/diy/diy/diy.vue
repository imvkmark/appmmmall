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

					<template v-if="item.controller == 'Bargain' && addonIsExit.bargain">
						<!-- 砍价 -->
						<diy-bargain :value="item"></diy-bargain>
					</template>

					<template v-if="item.controller == 'Search'">
						<!-- 搜索 -->
						<diy-search :value="item" :site-id="siteId" :city="city"></diy-search>
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

					<template v-if="item.controller == 'Groupbuy' && addonIsExit.groupbuy">
						<!-- 团购 -->
						<diy-groupbuy :value="item" :site-id="siteId"></diy-groupbuy>
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

					<template v-if="item.controller == 'ShopStore'">
						<!-- 门店列表 -->
						<diy-shop-store :value="item" :site-id="siteId"></diy-shop-store>
					</template>

					<template v-if="item.controller == 'GoodsCategory'">
						<!-- 商品分类 -->
						<diy-goods-level-category :value="item" :bottom="windowHeight"></diy-goods-level-category>
					</template>
					
					<template v-if="item.controller == 'Wholesale' && addonIsExit.wholesale">
						<!-- 商品批发 -->
						<diy-whole-sale :value="item"></diy-whole-sale>
					</template>

					<template v-if="item.controller == 'FenxiaoGoodsList' && addonIsExit.fenxiao">
						<!-- 分销商品列表 -->
						<diy-fenxiao-goods-list :value="item" :site-id="siteId"></diy-fenxiao-goods-list>
					</template>
				</view>
				<!-- 站点关闭展示 -->
				<view @touchmove.prevent.stop class="PopWindow">
					<uni-popup ref="uniPopup" type="center" class="wap-floating" :maskClick="false">
						<view class="popup-box">
							<view class="close_title ns-margin-top">站点关闭</view>
							<view class="close_content">
								<scroll-view scroll-y="true" class="close_content_box">{{ webSiteInfo.close_reason }}</scroll-view>
							</view>
						</view>
					</uni-popup>
				</view>

				<template v-if="openBottomNav">
					<!-- 底部tabBar -->
					<diy-bottom-nav @isBulge="isBulge"></diy-bottom-nav>
				</template>

				<loading-cover ref="loadingCover"></loading-cover>
			</view>
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
import diySearch from '@/components/diy-search/diy-search.vue';
import diyTextNav from '@/components/diy-text-nav/diy-text-nav.vue';
import diyTitle from '@/components/diy-title/diy-title.vue';
import diyVideo from '@/components/diy-video/diy-video.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import diySeckill from '@/components/diy-seckill/diy-seckill.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import diyPintuan from '@/components/diy-pintuan/diy-pintuan.vue';
import diyBargain from '@/components/diy-bargain/diy-bargain.vue';
import diyGroupBuy from '@/components/diy-groupbuy/diy-groupbuy.vue';
import diyShopRankList from '@/components/diy-shop-rank-list/diy-shop-rank-list';
import diyShopSearch from '@/components/diy-shop-search/diy-shop-search.vue';
import diyShopInfo from '@/components/diy-shop-info/diy-shop-info';
import nsNavbar from '@/components/ns-navbar/ns-navbar.vue'
import diyShopStore from '@/components/diy-shop-store/diy-shop-store';
import diyFenxiaoGoodsList from '@/components/diy-fenxiao-goods-list/diy-fenxiao-goods-list';
import diyGoodsLevelCategory from '@/components/diy-goods-level-category/diy-goods-level-category.vue';
import WxMap from 'common/js/map-wx-jssdk.js';
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
		diySearch,
		diyTextNav,
		diyTitle,
		diyVideo,
		uniPopup,
		diySeckill,
		diyBottomNav,
		diyPintuan,
		diyGroupBuy,
		diyShopRankList,
		diyShopSearch,
		diyShopInfo,
		diyBargain,
		diyShopStore,
		diyFenxiaoGoodsList,
		diyGoodsLevelCategory,
		nsNavbar,
		diyWholeSale
	},
	data() {
		return {
			diyData: {
				global: {},
				value: []
			},
			webSiteInfo: null,
			memberId: 0,
			name: '',
			siteId: 0,
			city: '',
			windowHeight: 0,
			Bulge:false
		};
	},
	computed: {
		// 使用对象展开运算符将此对象混入到外部对象中
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
			let str = '微页面';
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
	//下拉刷新
	onPullDownRefresh() {
		this.refresh();
	},
	onLoad(data) {
		this.name = data.name || '';
		this.siteId = data.site_id || 0;
		this.isIphoneX=this.$util.uniappIsIPhoneX()
		this.getHeight();
		if (this.name) {
			this.$langConfig.refresh();
			this.refresh();

			if (data.source_member) uni.setStorageSync('source_member', data.source_member);
			// 小程序扫码进入
			if (data.scene) {
				var sceneParams = decodeURIComponent(data.scene);
				sceneParams = sceneParams.split('&');
				if (sceneParams.length) {
					sceneParams.forEach(item => {
						if (item.indexOf('source_member') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
					});
				}
			}
		} else {
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		}
	},
	onShow() {
		if (uni.getStorageSync('token')) {
			this.getMemberId();
		}
	},
	methods: {
		isBulge(e){
			this.Bulge=e;
		},
		navigateBack() {
			let currentPage = getCurrentPages();
			if(currentPage.length>1){
				uni.navigateBack({
					delta:1
				})
			}else{
				this.$util.redirectTo('/pages/index/index/index')
			}
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
					name: this.name,
					site_id: this.siteId
				},
				success: res => {
					if (res.code != 0 || !res.data) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.diyData = [];
						return;
					}
					this.diyData = res.data;
					if (this.diyData.value) {
						this.diyData = JSON.parse(this.diyData.value);
						uni.setNavigationBarTitle({
							title: this.diyData.global.title
						});
						for (var i = 0; i < this.diyData.value.length; i++) {
							if (this.diyData.value[i].controller == 'PopWindow') {
								setTimeout(() => {
									if (uni.getStorageSync('diy_wap_floating_layer') != null && uni.getStorageSync('diy_wap_floating_layer') != '') {
										var wap_floating_cookie = JSON.parse(uni.getStorageSync('diy_wap_floating_layer'));
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
		},
		closeNum() {
			this.$refs.uniPopup[0].close();
			var closeNum = 1;
			if (uni.getStorageSync('diy_wap_floating_layer')) {
				var wap_floating_cookie = JSON.parse(uni.getStorageSync('diy_wap_floating_layer'));
				closeNum = ++wap_floating_cookie.closeNum;
			}
			uni.setStorageSync(
				'diy_wap_floating_layer',
				JSON.stringify({
					closeNum
				})
			);
		},
		refresh() {
			this.getDiyInfo();
			this.getWebSitefo();
			this.getDefaultImg();

			if (uni.getStorageSync('city')) {
				this.city = uni.getStorageSync('city').title;
			} else {
				this.getLocation();
			}
		},
		redirectTo(link) {
			this.$util.diyRedirectTo(link);
		},
		getWebSitefo() {
			this.webSiteInfo = uni.getStorageSync('web_site_info');
			if (this.webSiteInfo) this.webSiteInfo = JSON.parse(this.webSiteInfo);
			this.$api.sendRequest({
				url: '/api/website/info',
				success: res => {
					let data = res.data;
					if (data) {
						this.webSiteInfo = data;
						if (this.webSiteInfo.wap_status) return;
						this.$refs.uniPopup.open();
						uni.setStorageSync('web_site_info', JSON.stringify(this.webSiteInfo));
					}
				}
			});
		},
		// 获取默认图
		getDefaultImg() {
			this.$api.sendRequest({
				url: '/api/config/defaultimg',
				success: res => {
					let data = res.data;
					if (res.code == 0 && data) {
						uni.setStorageSync('default_img', JSON.stringify(data));
					}
				}
			});
		},
		getMemberId() {
			this.$api.sendRequest({
				url: '/api/member/id',
				success: res => {
					if (res.code >= 0) {
						this.memberId = res.data;
					}
				}
			});
		},
		/**
		 * 获取定位城市
		 */
		getLocation() {
			const map = new WxMap({
				key: this.$config.mpKey
			});
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					map.reverseGeocoder({
						location: {
							latitude: res.latitude,
							longitude: res.longitude
						},
						success: res => {
							this.$api.sendRequest({
								url: '/api/address/citybyname',
								data: {
									city: res.result.address_component.city
								},
								success: res => {
									if (res.data) {
										this.city = res.data.title;
										uni.setStorageSync('city', res.data);
									}
								}
							});
						},
						fail: res => {}
					});
				}
			});
		},
		onShareAppMessage(res) {
			var title = '';
			if (this.webSiteInfo) title = this.webSiteInfo.title;
			var path = '/otherpages/diy/diy/diy?name=' + this.name;
			if (this.memberId) path += '&source_member=' + this.memberId;
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	}
};
</script>

<style lang="scss">
	.diy-wrap {
		height: 100vh;
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
	.fenxiao-menu {
		margin: 24rpx;
		height: 124rpx;
		display: flex;
		background-color: #ffffff;
		align-items: center;

		.menu-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding-left: 36rpx;

			.menu-item-tit {
				font-size: 24rpx;
				color: #000000;
			}

			text {
				color: #838383;
				font-size: 20rpx;
			}
		}

		.shu {
			width: 1rpx;
			height: 92rpx;
			border: 1rpx solid #eaeaea;
		}
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

	.popup-box {
		width: 450rpx;
		background: #ffffff;
		border-radius: $ns-border-radius;
		overflow: hidden;

		.close_title {
			width: 100%;
			text-align: center;
			height: 70rpx;
			line-height: 70rpx;
			font-size: $ns-font-size-base;
		}

		.close_content {
			width: 100%;
			max-height: 500rpx;
			padding: $ns-padding;
			box-sizing: border-box;
		}

		.close_content_box {
			width: 100%;
			max-height: 460rpx;
			line-height: 1.3;
		}
	}
</style>

<style scoped>
.wap-floating >>> .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none !important;
}

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
