<template>
	<scroll-view scroll-y :class="themeStyle" class="diy-wrap" :style="{ background: bgColor }">
		<view class="index_bg" :style="'background:' + 'url(' + $util.img(bgUrl) + ') no-repeat 0 0/100%'">
			<ns-navbar :is-back="!1" :title="pageTitle" :background="{ background:navBar}" :title-color="!bgUrl && (!bgColor || bgColor == '#ffffff') ? '#000000' : '#ffffff'" :border-bottom="false" z-index="1001"></ns-navbar>
			<view class="page-content" :class="Bulge?'active':''">
				<view v-for="(item, index) in diyData.value" :key="index">
					<template v-if="item.controller == 'Text'">
						<!-- 文本 -->
						<diy-text :value="item"></diy-text>
					</template>

					<template v-if="item.controller == 'TextNav'">
						<!-- 文本导航 -->
						<diy-text-nav :value="item"></diy-text-nav>
					</template>

					<template v-if="item.controller == 'Notice'">
						<!-- 公告 -->
						<diy-notice :value="item"></diy-notice>
					</template>

					<template v-if="item.controller == 'GraphicNav'">
						<!-- 图文导航 -->
						<diy-graphic-nav :value="item"></diy-graphic-nav>
					</template>

					<template v-if="item.controller == 'ImageAds'">
						<!-- 图片广告 -->
						<diy-img-ads :value="item"></diy-img-ads>
					</template>

					<template v-if="item.controller == 'Search'">
						<!-- 搜索 -->
						<diy-search :value="item" :site-id="siteId" :city="city"></diy-search>
					</template>

					<template v-if="item.controller == 'Title'">
						<!-- 顶部标题 -->
						<diy-title :value="item"></diy-title>
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
						<diy-coupon :value="item"></diy-coupon>
					</template>
					
					<template v-if="item.controller == 'Bargain' && addonIsExit.bargain">
						<!-- 砍价 -->
						<diy-bargain :value="item"></diy-bargain>
					</template>

					<template v-if="item.controller == 'GoodsList'">
						<!-- 商品列表 -->
						<diy-goods-list :value="item"></diy-goods-list>
					</template>

					<template v-if="item.controller == 'RubikCube'">
						<!-- 魔方、橱窗 -->
						<diy-rubik-cube :value="item"></diy-rubik-cube>
					</template>

					<template v-if="item.controller == 'Video'">
						<!-- 视频 -->
						<diy-video :value="item"></diy-video>
					</template>

					<template v-if="item.controller == 'Seckill' && addonIsExit.seckill">
						<!-- 秒杀 -->
						<diy-seckill :value="item"></diy-seckill>
					</template>

					<template v-if="item.controller == 'Pintuan' && addonIsExit.pintuan">
						<!-- 拼团 -->
						<diy-pintuan :value="item"></diy-pintuan>
					</template>

					<template v-if="item.controller == 'Groupbuy' && addonIsExit.groupbuy">
						<!-- 团购 -->
						<diy-groupbuy :value="item"></diy-groupbuy>
					</template>

					<template v-if="item.controller == 'GoodsCategory'">
						<!-- 商品分类 -->
						<diy-goods-level-category :value="item" :bottom="windowHeight"></diy-goods-level-category>
					</template>
					<template v-if="item.controller == 'Wholesale' && addonIsExit.wholesale">
						<!-- 批发 -->
						<diy-whole-sale :value="item"></diy-whole-sale>
					</template>
					<template v-if="item.controller == 'LiveInfo'">
						<!-- 小程序直播 -->
						<!-- #ifdef MP-WEIXIN -->
						<diy-live :value="item"></diy-live>
						<!-- #endif -->
					</template>
				</view>
			</view>
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

		<!-- 底部tabBar -->
		<diy-bottom-nav v-if="openBottomNav" @isBulge="isBulge"></diy-bottom-nav>

		<loading-cover ref="loadingCover"></loading-cover>
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
import diyBargain from '@/components/diy-bargain/diy-bargain.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import diyPintuan from '@/components/diy-pintuan/diy-pintuan.vue';
import diyGroupBuy from '@/components/diy-groupbuy/diy-groupbuy.vue';
import diyGoodsLevelCategory from '@/components/diy-goods-level-category/diy-goods-level-category.vue';
import diyLive from '@/components/diy-live/diy-live.vue';
import nsNavbar from '@/components/ns-navbar/ns-navbar.vue'
import WxMap from 'common/js/map-wx-jssdk.js';
import { Weixin } from 'common/js/wx-jssdk.js';
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
		diyBargain,
		uniPopup,
		diySeckill,
		diyBottomNav, 
		diyPintuan,
		diyGroupBuy,
		diyGoodsLevelCategory,
		diyLive,
		nsNavbar,
		diyWholeSale
	},
	data() {
		return {
			diyData: [],
			webSiteInfo: null,
			memberId: 0,
			id: 0,
			city: '',
			siteId: 0,
			windowHeight: 0 ,//分类组件的高度
			isIphoneX: false,
			Bulge:false   //判断底部导航是否凸起
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
		pageTitle() {
			let str = '首页';
			if (this.diyData && this.diyData.global) {
				str = this.diyData.global.title;
			}
			return str;
		},
		openBottomNav() {
			let Bloon = false;
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
		this.getDiyInfo();
	},
	onLoad(data) {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.siteId = parseInt(data.site_id) || 0;
		// 如果传入站点id，则清空地址
		if (this.siteId) uni.removeStorageSync('city');

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
		this.getHeight();
	},
	onShow() {
		this.$langConfig.refresh();

		if (uni.getStorageSync('token')) {
			this.getMemberId();
		}

		this.getWebSitefo();
		this.getDefaultImg();

		if (uni.getStorageSync('city')) {
			this.city = uni.getStorageSync('city').title;
			this.getDiyInfo();
		} else {
			uni.setStorageSync('city', {
				id: 0,
				title: '全国'
			});
			this.city = '全国';
			this.getDiyInfo();
		}
	},
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
					name: 'DIYVIEW_INDEX',
					site_id: this.siteId
				},
				success: res => {
					if (res.code != 0 || !res.data) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						return;
					}
					this.diyData = res.data;
					// if (this.diyData.site_area_id) {
					// 	this.city = this.diyData.site_area_name;
					// 	uni.setStorageSync('city', { id: this.diyData.site_area_id, title: this.diyData.site_area_name });
					// }

					if (this.diyData.value) {
						this.diyData = JSON.parse(this.diyData.value);
						for (var i = 0; i < this.diyData.value.length; i++) {
							if (this.diyData.value[i].controller == 'PopWindow') {
								setTimeout(() => {
									if (uni.getStorageSync('index_wap_floating_layer') != null && uni.getStorageSync('index_wap_floating_layer') != '') {
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
		},
		closeNum() {
			this.$refs.uniPopup[0].close();
			var closeNum = 1;
			if (uni.getStorageSync('index_wap_floating_layer')) {
				var wap_floating_cookie = JSON.parse(uni.getStorageSync('index_wap_floating_layer'));
				closeNum = ++wap_floating_cookie.closeNum;
			}
			uni.setStorageSync(
				'index_wap_floating_layer',
				JSON.stringify({
					closeNum
				})
			);
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
		onShareAppMessage(res) {
			var title = '';
			if (this.webSiteInfo) title = this.webSiteInfo.title;
			var path = '/pages/index/index/index';
			if (this.memberId) path += '?source_member=' + this.memberId;
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	},
	onReady() {
		this.$refs.loadingCover.hide();
		// 微信公众号分享
		// #ifdef H5
		if (this.$util.isWeiXin()) {
			this.$api.sendRequest({
				url: '/wechat/api/wechat/share',
				data: {
					url: window.location.href
				},
				success: res => {
					if (res.code == 0) {
						var wxJS = new Weixin();
						wxJS.init(res.data.jssdk_config);

						let shareConfig = res.data.share_config,
							url = this.$config.h5Domain + '/pages/index/index/index';
						if (this.memberId) url += '?source_member=' + this.memberId;

						wxJS.setShareData({
							title: shareConfig.shop_param_1 + shareConfig.site_name,
							desc: shareConfig.shop_param_2 + '\r\n' + shareConfig.shop_param_3 + '\r\n' + '收藏热度：★★★★★',
							link: url,
							imgUrl: this.$util.img(shareConfig.site_logo)
						});
					}
				}
			});
		}
		// #endif
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
