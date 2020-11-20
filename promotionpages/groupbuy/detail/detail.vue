<template>
	<view :class="themeStyle">
		<view>
			<view scroll-y="true" class="goods-detail">
				<view class="go-top ns-border-color-gray">
					<view class="goods-share ns-text-color-gray" @click="openSharePopup()">
						<view class="iconfont iconfenxiang"></view>
						<text>{{ $lang('share') }}</text>
					</view>
					<view class="collection ns-text-color-gray" @click="editCollection()">
						<view class="iconfont" :class="whetherCollection == 1 ? 'iconlikefill ns-text-color' : 'iconlike'"></view>
						<text>{{ $lang('like') }}</text>
					</view>
					<view class="iconfont icontop ns-text-color-gray ns-border-color-gray" @click="scrollToTopNative()"></view>
				</view>
		
				<view class="goods-container">
					<!-- 商品媒体信息 -->
					<view class="goods-media">
						<!-- 商品图片 -->
						<view class="goods-img" :class="{ show: switchMedia == 'img' }">
							<swiper class="swiper" @change="swiperChange" :interval="swiperInterval" :autoplay="swiperAutoplay">
								<swiper-item v-for="(item, index) in goodsSkuDetail.sku_images" :key="index">
									<view class="item" @click="previewMedia(index)">
										<image :src="$util.img(item, { size: 'big' })" @error="swiperImageError(index)" mode="aspectFit" />
									</view>
								</swiper-item>
							</swiper>
							<view class="img-indicator-dots">
								<text>{{ swiperCurrent }}</text>
								<text v-if="goodsSkuDetail.sku_images">/{{ goodsSkuDetail.sku_images.length }}</text>
							</view>
						</view>
						<!-- 商品视频 -->
						<view class="goods-video" :class="{ show: switchMedia == 'video' }">
												<!-- #ifndef H5 -->
												<video :src="$util.img(goodsSkuDetail.video_url)" :poster="$util.img(goodsSkuDetail.sku_image, { size: 'big' })"
												 objectFit="cover"></video>
												<!-- #endif -->
												<!-- #ifdef H5 -->
												<view class="video-img">
													<image :src="$util.img(goodsSkuDetail.sku_image, { size: 'big' })" mode=""></image>
													<view class="video-open">
														<view class="iconfont iconarrow-" @click="openVideo"></view>
													</view>
												</view>
												<!-- #endif -->
											</view>
		
						<!-- 切换视频、图片 -->
						<view class="media-mode" v-if="goodsSkuDetail.video_url != ''">
							<text :class="{ 'active ns-bg-color': switchMedia == 'video' }" @click="switchMedia = 'video'">{{ $lang('video') }}</text>
							<text :class="{ 'active ns-bg-color': switchMedia == 'img' }" @click="switchMedia = 'img'">{{ $lang('image') }}</text>
						</view>
					</view>
		<!-- 播放视频 -->
						<view @touchmove.prevent.stop class="videoPopup-box">
							<uni-popup ref="videoPopup" type="center">
								<view class="pop-video">
									<video :src="$util.img(goodsSkuDetail.video_url)" :poster="$util.img(goodsSkuDetail.sku_image, { size: 'big' })" objectFit="cover"></video>
								</view>
							</uni-popup>
						</view>
					<view class="goods-groupbuy" v-if="goodsSkuDetail.timeMachine">
						<view class="price-info">
							<view class="discount-price">
								<text class="symbol">{{ $lang('common.currencySymbol') }}</text>
								<text>{{ goodsSkuDetail.show_price }}</text>
								<text class="groupbuy-flag">{{ $lang('group') }}</text>
							</view>
							<view class="original-price">
								<text class="price ns-text-color">{{ $lang('common.currencySymbol') }} {{ goodsSkuDetail.price }}</text>
							</view>
						</view>
		
						<view class="countdown">
							<view class="txt">{{ $lang('end') }}</view>
							<view class="clockrun">
								<uni-count-down
									:day="goodsSkuDetail.timeMachine.d"
									:hour="goodsSkuDetail.timeMachine.h"
									:minute="goodsSkuDetail.timeMachine.i"
									:second="goodsSkuDetail.timeMachine.s"
									color="#fff"
									splitorColor="#000"
									background-color="#000"
								/>
							</view>
						</view>
					</view>
		
					<view class="group-wrap">
						<view class="goods-module-wrap">
							<view>
								<text class="sku-name">{{ goodsSkuDetail.sku_name }}</text>
								<text class="introduction ns-text-color" v-if="goodsSkuDetail.introduction">{{ goodsSkuDetail.introduction }}</text>
							</view>
							<view class="adds-wrap">
								<block v-if="Development">
									<text v-if="goodsSkuDetail.is_free_shipping">快递免邮{{ $lang('video') }}</text>
									<text v-else>快递不免邮{{ $lang('video') }}</text>
								</block>
								<text>月销量{{ $lang('video') }} {{ goodsSkuDetail.sale_num }} {{ goodsSkuDetail.unit }}</text>
							</view>
						</view>
					</view>
		
					<view class="group-wrap">
						<!-- 已选规格 -->
						<view class="goods-cell selected-sku-spec" v-if="goodsSkuDetail.sku_spec_format">
							<view class="box">
								<text class="tit">已选择{{ $lang('video') }}</text>
								<text v-for="(item, index) in goodsSkuDetail.sku_spec_format" :key="index">{{ item.spec_name }}/{{ item.spec_value_name }}</text>
							</view>
						</view>
		
						<!-- 商品属性 -->
						<view class="goods-cell" @click="openAttributePopup()" v-if="goodsSkuDetail.goods_attr_format && goodsSkuDetail.goods_attr_format.length > 0">
							<view class="box">
								<text class="tit">规格参数{{ $lang('video') }}</text>
								<!-- 	<text>{{ goodsSkuDetail.goods_attr_format[0].attr_name }} {{ goodsSkuDetail.goods_attr_format[0].attr_value_name }}...</text> -->
							</view>
							<text class="iconfont iconright"></text>
						</view>
		
						<view @touchmove.prevent.stop>
							<uni-popup ref="attributePopup" type="bottom">
								<view class="goods-attribute-popup-layer">
									<text class="title">规格参数{{ $lang('video') }}</text>
									<scroll-view scroll-y class="goods-attribute-body">
										<view class="item ns-border-color-gray" v-for="(item, index) in goodsSkuDetail.goods_attr_format" :key="index">
											<text class="ns-text-color-gray">{{ item.attr_name }}</text>
											<text class="value">{{ item.attr_value_name }}</text>
										</view>
									</scroll-view>
									<view class="button-box"><button type="primary" @click="closeAttributePopup()">确定{{ $lang('video') }}</button></view>
								</view>
							</uni-popup>
						</view>
					</view>
		
					<!-- 营销活动 -->
					<view class="group-wrap">
						<!-- 商家服务 -->
						<view
							class="goods-cell service"
							@click="openMerchantsServicePopup()"
							v-show="
								shopInfo.shop_baozh == 1 ||
									shopInfo.shop_qtian == 1 ||
									shopInfo.shop_zhping == 1 ||
									shopInfo.shop_erxiaoshi == 1 ||
									shopInfo.shop_tuihuo == 1 ||
									shopInfo.shop_shiyong == 1 ||
									shopInfo.shop_shiti == 1 ||
									shopInfo.shop_xiaoxie == 1
							"
						>
							<view class="box">
								<text class="tit">{{ $lang('service') }}</text>
								<text v-if="shopInfo.shop_baozh == 1">保证服务</text>
								<text v-if="shopInfo.shop_qtian == 1">7天退换</text>
								<text v-if="shopInfo.shop_zhping == 1">正品保障</text>
								<text v-if="shopInfo.shop_erxiaoshi == 1">两小时发货</text>
								<text v-if="shopInfo.shop_tuihuo == 1">退货承诺</text>
								<text v-if="shopInfo.shop_shiyong == 1">试用中心</text>
								<text v-if="shopInfo.shop_shiti == 1">实体验证</text>
								<text v-if="shopInfo.shop_xiaoxie == 1">消协保证</text>
							</view>
							<text class="iconfont iconright"></text>
						</view>
		
						<view
							@touchmove.prevent.stop
							v-show="
								shopInfo.shop_baozh == 1 ||
									shopInfo.shop_qtian == 1 ||
									shopInfo.shop_zhping == 1 ||
									shopInfo.shop_erxiaoshi == 1 ||
									shopInfo.shop_tuihuo == 1 ||
									shopInfo.shop_shiyong == 1 ||
									shopInfo.shop_shiti == 1 ||
									shopInfo.shop_xiaoxie == 1
							"
						>
							<uni-popup ref="merchantsServicePopup" type="bottom">
								<view class="goods-merchants-service-popup-layer">
									<text class="tax-title ns-text-color-black">{{ $lang('service') }}</text>
									<scroll-view scroll-y>
										<view class="item" v-if="shopInfo.shop_baozh == 1">
											<view class="iconfont icondui ns-text-color"></view>
											<view class="info-wrap">
												<text class="title">保证服务</text>
												<text class="describe">保证服务</text>
											</view>
										</view>
										<view class="item" v-if="shopInfo.shop_qtian == 1">
											<view class="iconfont icondui ns-text-color"></view>
											<view class="info-wrap">
												<text class="title">7天退换</text>
												<text class="describe">满足7天无理由退换货申请的前提下，包邮商品需要买家承担退货邮费，非包邮商品需要买家承担发货和退货邮费</text>
											</view>
										</view>
										<view class="item" v-if="shopInfo.shop_zhping == 1">
											<view class="iconfont icondui ns-text-color"></view>
											<view class="info-wrap">
												<text class="title">正品保障</text>
												<text class="describe">商品支持正品保障服务</text>
											</view>
										</view>
										<view class="item" v-if="shopInfo.shop_erxiaoshi == 1">
											<view class="iconfont icondui ns-text-color"></view>
											<view class="info-wrap">
												<text class="title">两小时发货</text>
												<text class="describe">付款后2小时内发货</text>
											</view>
										</view>
										<view class="item" v-if="shopInfo.shop_tuihuo == 1">
											<view class="iconfont icondui ns-text-color"></view>
											<view class="info-wrap">
												<text class="title">退货承诺</text>
												<text class="describe">退货承诺</text>
											</view>
										</view>
										<view class="item" v-if="shopInfo.shop_shiyong == 1">
											<view class="iconfont icondui ns-text-color"></view>
											<view class="info-wrap">
												<text class="title">试用中心</text>
												<text class="describe">试用中心</text>
											</view>
										</view>
										<view class="item" v-if="shopInfo.shop_shiti == 1">
											<view class="iconfont icondui ns-text-color"></view>
											<view class="info-wrap">
												<text class="title">实体验证</text>
												<text class="describe">实体验证</text>
											</view>
										</view>
										<view class="item" v-if="shopInfo.shop_xiaoxie == 1">
											<view class="iconfont icondui ns-text-color"></view>
											<view class="info-wrap">
												<text class="title">消协保证</text>
												<text class="describe">如有商品质量问题、描述不符或未收到货等，您有权申请退款或退货，来回邮费由卖家承担</text>
											</view>
										</view>
									</scroll-view>
									<view class="button-box"><button type="primary" @click="closeMerchantsServicePopup()">确定</button></view>
								</view>
							</uni-popup>
						</view>
					</view>
		
					<!-- 店铺信息 -->
					<block v-if="Development">
						<view class="group-wrap">
							<view class="shop-wrap">
								<navigator hover-class="none" :url="'/otherpages/shop/index/index?site_id=' + shopInfo.site_id" class="box">
									<view class="shop-logo">
										<image v-if="shopInfo.avatar" :src="$util.img(shopInfo.avatar)" @error="shopInfo.avatar = $util.getDefaultImage().default_shop_img" mode="aspectFit" />
										<image v-else :src="$util.getDefaultImage().default_shop_img" mode="aspectFit" />
									</view>
									<view class="shop-info">
										<text>{{ shopInfo.site_name }}</text>
										<view class="description" v-if="shopInfo.seo_description">{{ shopInfo.seo_description }}</view>
									</view>
								</navigator>
								<navigator hover-class="none" :url="'/otherpages/shop/index/index?site_id=' + shopInfo.site_id" class="box shop-score">
									<text>商品描述{{ shopInfo.shop_desccredit }}</text>
									<text>卖家服务{{ shopInfo.shop_servicecredit }}</text>
									<text>发货速度{{ shopInfo.shop_deliverycredit }}</text>
								</navigator>
								<view class="box">
									<view class="goods-action">
										<navigator class="ns-border-color ns-text-color" hover-class="none" :url="'/otherpages/shop/list/list?site_id=' + shopInfo.site_id">全部商品</navigator>
										<navigator class="ns-border-color ns-text-color" hover-class="none" :url="'/otherpages/shop/index/index?site_id=' + shopInfo.site_id">查看店铺</navigator>
									</view>
								</view>
							</view>
						</view>
					</block>
					
					
					<!-- 商品评价 -->
					<view class="group-wrap">
						<view class="goods-evaluate">
							<view class="tit">
								<view>
									<text>商品评价（{{ goodsSkuDetail.evaluate }}）</text>
								</view>
								<navigator class="ns-text-color" hover-class="none" :url="'/otherpages/goods/evaluate/evaluate?goods_id=' + goodsSkuDetail.goods_id">
									<text>查看更多</text>
									<text class="iconfont iconright"></text>
								</navigator>
							</view>
							<view class="evaluate-item" v-if="goodsEvaluate.content">
								<view class="evaluator">
									<view class="evaluator-face">
										<image
											v-if="goodsEvaluate.member_headimg"
											:src="$util.img(goodsEvaluate.member_headimg)"
											@error="goodsEvaluate.member_headimg = $util.getDefaultImage().default_headimg"
											mode="aspectFill"
										/>
										<image
											v-else
											:src="$util.getDefaultImage().default_headimg"
											@error="goodsEvaluate.member_headimg = $util.getDefaultImage().default_headimg"
											mode="aspectFill"
										/>
									</view>
									<text class="evaluator-name">{{ goodsEvaluate.member_name }}</text>
								</view>
								<view class="cont">{{ goodsEvaluate.content }}</view>
								<view class="evaluate-img" v-if="goodsEvaluate.images">
									<view class="img-box" v-for="(item, index) in goodsEvaluate.images" :key="index" @click="previewEvaluate(index, 'images')">
										<image :src="$util.img(item)" mode="aspectFit" />
									</view>
								</view>
								<view class="time">
									<text>{{ $util.timeStampTurnTime(goodsEvaluate.create_time) }}</text>
									<text>{{ goodsEvaluate.sku_name }}</text>
								</view>
							</view>
							<view class="evaluate-item-empty" v-else>该商品暂无评价哦</view>
						</view>
					</view>
		
					<!-- 详情 -->
					<view class="goods-detail-tab">
						<view class="detail-tab">
							<view class="tab-item" :class="detailTab == 0 ? 'active ns-text-color ns-bg-before' : ''" @click="detailTab = 0">商品详情</view>
							<view class="tab-item" :class="detailTab == 1 ? 'active ns-text-color ns-bg-before' : ''" @click="detailTab = 1">售后保障</view>
						</view>
						<view class="detail-content" :class="detailTab == 1 ? 'active' : ''">
							<view class="detail-content-item" v-show="detailTab == 0">
								<view class="goods-details" v-if="goodsSkuDetail.goods_content"><rich-text :nodes="goodsSkuDetail.goods_content"></rich-text></view>
								<view class="goods-details active" v-else>该商家暂无上传相关详情哦！</view>
							</view>
							<view class="detail-content-item" v-show="detailTab == 1">
								<view class="goods-details" v-if="service"><rich-text :nodes="service"></rich-text></view>
								<view class="goods-details active" v-else>该商品暂无相关售后哦！</view>
							</view>
						</view>
					</view>
		
					<nsGoodsRecommend ref="goodrecommend"></nsGoodsRecommend>
		
					<!-- SKU选择 -->
					<ns-goods-sku ref="goodsSku" @refresh="refreshGoodsSkuDetail" :goods-detail="goodsSkuDetail"></ns-goods-sku>
		
					<!-- 海报 -->
					<view @touchmove.prevent.stop>
						<uni-popup ref="posterPopup" type="bottom" class="poster-layer">
							<template v-if="poster != '-1'">
								<view :style="{ height: posterHeight > 0 ? posterHeight + 80 + 'px' : '' }">
									<view class="image-wrap"><image :src="$util.img(poster)" :style="{ height: posterHeight > 0 ? posterHeight + 'px' : '' }" /></view>
									<!-- #ifdef MP || APP-PLUS -->
									<view class="save" @click="saveGoodsPoster()">保存图片</view>
									<!-- #endif -->
									<!-- #ifdef H5 -->
									<view class="save">长按保存图片</view>
									<!-- #endif -->
								</view>
								<view class="close iconfont iconclose" @click="closePosterPopup()"></view>
							</template>
							<view v-else class="msg">{{ posterMsg }}</view>
						</uni-popup>
					</view>
		
					<!-- 分享弹窗 -->
					<view @touchmove.prevent.stop>
						<uni-popup ref="sharePopup" type="bottom" class="share-popup">
							<view>
								<view class="share-title">分享</view>
								<view class="share-content">
									<!-- #ifdef MP -->
									<view class="share-box">
										<button class="share-btn" :plain="true" open-type="share">
											<view class="iconfont iconiconfenxianggeihaoyou"></view>
											<text>分享给好友</text>
										</button>
									</view>
									<!-- #endif -->
									<view class="share-box" @click="openPosterPopup">
										<button class="share-btn" :plain="true">
											<view class="iconfont iconpengyouquan"></view>
											<text>生成分享海报</text>
										</button>
									</view>
								</view>
								<view class="share-footer" @click="closeSharePopup"><text>取消分享</text></view>
							</view>
						</uni-popup>
					</view>
				</view>
			</view>
		
			<loading-cover ref="loadingCover"></loading-cover>
		
			<ns-login ref="login"></ns-login>
		
			<!-- 商品底部导航 -->
			<ns-goods-action>
				<template v-if="goodsSkuDetail.goods_state == 1 && goodsSkuDetail.verify_state == 1">
					<ns-goods-action-icon text="首页" icon="iconshouye" @click="goHome" />
					<ns-goods-action-icon text="客服" icon="iconkefu" v-if="addonIsExit.servicer" @click="goConnect" />
					<ns-goods-action-icon text="客服" icon="iconkefu" v-else open-type="contact" :send-data="contactData" />
					<ns-goods-action-icon text="购物车" icon="icongouwuche" :corner-mark="cartCount > 0 ? cartCount + '' : ''" @click="goCart" />
					<ns-goods-action-button class="goods-action-button active1" text="立即抢购" @click="groupbuy" />
				</template>
				<template v-else>
					<ns-goods-action-button class="goods-action-button active2" disabled-text="该商品已下架" :disabled="true" />
				</template>
			</ns-goods-action>
		</view>
	</view>
</template>

<script>
import nsGoodsAction from '@/components/ns-goods-action/ns-goods-action.vue';
import nsGoodsActionIcon from '@/components/ns-goods-action-icon/ns-goods-action-icon.vue';
import nsGoodsActionButton from '@/components/ns-goods-action-button/ns-goods-action-button.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
import detail from '../public/js/detail.js';
import scroll from '@/common/js/scroll-view.js';
	import globalConfig from '@/common/js/golbalConfig.js';

export default {
	components: {
		nsGoodsAction,
		nsGoodsActionIcon,
		nsGoodsActionButton,
		uniPopup,
		nsGoodsSku,
		nsGoodsRecommend,
		uniCountDown
	},
	data() {
		return {};
	},
	computed:{
		Development(){
			return this.$store.state.Development
		},
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		}
	},
	onShow() {},
	mixins: [detail, scroll,globalConfig],
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path = '/promotionpages/groupbuy/detail/detail?id=' + this.id;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: this.goodsSkuDetail.sku_name,
			imageUrl: this.$util.img(this.goodsSkuDetail.sku_image, { size: 'big' }),
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
@import '../public/css/detail.scss';
</style>
<style scoped>
/deep/ .uni-video-cover {
	background: none;
}

/deep/ .uni-video-cover-duration {
	display: none;
}

/deep/ .uni-video-cover-play-button {
	border-radius: 50%;
	border: 4rpx solid #fff;
	width: 120rpx;
	height: 120rpx;
	background-size: 30%;
}

.poster-layer >>> .uni-popup__wrapper-box {
	max-height: initial !important;
}

/deep/ .sku-layer .uni-popup__wrapper-box {
	overflow-y: initial !important;
}

.goods-groupbuy .countdown .clockrun >>> .uni-countdown__number {
	min-width: 32rpx;
	height: 32rpx;
	text-align: center;
	line-height: 32rpx;
	background: #000;
	/* // #690b08 */
	border-radius: 4px;
	display: inline-block;
	padding: 4rpx;
	margin: 0;
	border: none;
}
.goods-groupbuy .countdown .clockrun >>> .uni-countdown__splitor {
	width: 10rpx;
	height: 32rpx;
	line-height: 36rpx;
	text-align: center;
	display: inline-block;
	color: #000;
}
.goods-groupbuy .countdown .clockrun >>> .uni-countdown__splitor.day {
	width: initial;
}

.sku-layer >>> .uni-popup__wrapper-box {
	overflow-y: initial !important;
}

.poster-layer >>> .uni-popup__wrapper-box {
	max-height: initial !important;
}

.pintuan-popup-layer >>> .uni-popup__wrapper-box {
	overflow-y: initial !important;
	border-radius: 10rpx;
}

.pintuan-popup-layer >>> .uni-countdown__number {
	padding: 0;
	margin: 0;
}

/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	max-height: unset !important;
}

/deep/ .goods-action-button.active1 {
	padding: 0 10px;
}
/deep/ .goods-action-button.active1 .action-buttom-wrap {
	height: 36px;
	line-height: 36px;
	border-radius: 36px;
}
/deep/ .goods-action-button.active2 {
	padding: 0 30px;
}
/deep/ .goods-action-button.active2 .action-buttom-wrap {
	height: 36px;
	line-height: 36px;
	border-radius: 36px;
	margin: 10px 0;
}
</style>
