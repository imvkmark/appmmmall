<template>
 	<view :class="themeStyle">
 		<scroll-view class="order-nav" :scroll-x="true" :show-scrollbar="false">
 			<view v-for="(packageItem, packageIndex) in packageList" :key="packageIndex" class="uni-tab-item" @click="ontabtap(packageIndex)">
 				<text class="uni-tab-item-title" :class="packageIndex == currIndex ? 'uni-tab-item-title-active ns-border-color  ns-text-color' : ''"> {{ packageItem.package_name }}</text>
 			</view>
 		</scroll-view>
 			<view v-for="(packageItem, packageIndex) in packageList" :key="packageIndex" class="swiper-item">
 				<view class="container" v-if="packageIndex == currIndex">
 					<view class="goods-wrap">
 						<view class="body">
 							<view class="goods" v-for="(goodsItem, goodsIndex) in packageItem.goods_list" :key="goodsIndex">
 								<view class="goods-img" @click="toGoodsDetail(goodsItem.sku_id)">
 									<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(packageIndex, goodsIndex)" mode="aspectFill"></image>
 								</view>
 								<view class="goods-info">
 									<view @click="toGoodsDetail(goodsItem.sku_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
 									<view class="goods-sub-section">
 										<view>
 											<text>
 												<text class="iconfont iconclose"></text>
 												{{ goodsItem.num }}
 											</text>
 										</view>
 									</view>
 								</view>
 							</view>
 						</view>
 					</view>

 					<view class="express-company-wrap">
 						<view class="company-logo"><image :src="$util.img(packageItem.express_company_image)" mode=""></image></view>
 						<view class="info">
 							<view class="company">
 								<text>承运公司： {{ packageItem.express_company_name }}</text>
 							</view>
 							<view class="no">
 								<text>
 									运单号：
 									<text class="ns-text-color-gray">{{ packageItem.delivery_no }}</text>
 								</text>
 								<text class="iconfont iconfuzhi" @click="$util.copy(packageItem.delivery_no)"></text>
 							</view>
 						</view>
 					</view>

 					<view class="track-wrap">
 						<block v-if="packageItem.trace.success && packageItem.trace.list.length>0">
 							<view class="track-item" v-for="(traceItem, traceIndex) in packageItem.trace.list" :data-theme="themeStyle" :class="traceIndex==0?'active':''" :key="traceIndex">
 								<view class="dot" :class="traceIndex==0?'ns-text-color':''"></view>
 								<view class="msg">
 									<view class="text" :class="traceIndex==0?'ns-text-color':''">{{ traceItem.remark }}</view>
 									<view class="time" :class="traceIndex==0?'ns-text-color':''">{{ traceItem.datetime }}</view>
 								</view>
 							</view>
 						</block>
 						<block v-else>
 							<view class="fail-wrap ns-font-size-sm">{{ packageItem.trace.reason }}</view>
 						</block>
 					</view>
 				</view>
 			</view>
 		<loading-cover ref="loadingCover"></loading-cover>
 	</view>
 </template>

 <script>
 export default {
 	data() {
 		return {
 			orderId: '',
 			packageList: [],
 			currIndex:0,
 			status:0
 		};
 	},
 	onLoad(option) {
 		if (option.order_id) this.orderId = option.order_id;
 	},
 	onShow() {
 		// 刷新多语言
 		this.$langConfig.refresh();
 		// 判断登录
 		if (!uni.getStorageSync('token')) {
 			this.$util.redirectTo('/pages/login/login/login');
 		} else {
 			this.getPackageInfo();
 		}
 	},
	computed: {
		themeStyle(){
			return 'theme-'+this.$store.state.themeStyle
		}
	},
 	methods: {
 		ontabtap(e) {
 			this.currIndex = e
 			// let index = e.target.dataset.current || e.currentTarget.dataset.current;
 			// this.orderStatus = this.statusList[index].status;
 			// if (this.orderStatus == '') this.mergePayOrder = [];
 			// this.$refs.loadingCover.show();
 			// this.$refs.mescroll.refresh();
 		},
 		getPackageInfo() {
 			this.$api.sendRequest({
 				url: '/api/order/package',
 				data: {
 					order_id: this.orderId
 				},
 				success: res => {
 					if (res.code >= 0) {
 						this.packageList = res.data;
 						this.packageList.forEach(item => {
 							if(item.trace.list){
 								item.trace.list = item.trace.list.reverse()
 							}
 							item.status = this.status++
 						})
 						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
 					} else {
 						this.$util.showToast({
 							title: '未获取到订单包裹信息!！',
 							success: () => {
 								setTimeout(() => {
 									this.$util.redirectTo('/pages/order/list/list', {}, 'redirectTo');
 								}, 1500);
 							}
 						});
 					}
 				},
 				fail: res => {
 					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
 				}
 			});
 		},
 		toGoodsDetail(e){
 			this.$util.redirectTo('/pages/goods/detail/detail',{sku_id:e})
 		},
 		imageError(packageIndex, goodsIndex) {
 			this.packageList[packageIndex].goods_list[goodsIndex].sku_image = this.$util.getDefaultImage().default_goods_img;
 			this.$forceUpdate();
 		}
 	}
 };
 </script>

 <style lang="scss">
 @import '../public/css/logistics.scss';
 /deep/.uni-scroll-view ::-webkit-scrollbar {
 	 /* 隐藏滚动条，但依旧具备可以滚动的功能 */
 	 display: none;
 	 width: 0;
 	 height: 0;
 	 color: transparent;
 	 background: transparent;
 }
 /deep/::-webkit-scrollbar {
 	 display: none;
 	 width: 0;
 	 height: 0;
 	 color: transparent;
 	 background: transparent;
 }
 </style>
