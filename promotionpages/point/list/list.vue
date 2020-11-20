<template>
	<view class="point-wrap" :class="themeStyle" v-if="addonIsExit.pintuan">
		<block v-if="addonIsExit.pointexchange">
			<!-- 头部轮播 -->
			<view class="point-top ns-bg-color" :style="'background-image: url(' + $util.img('/upload/uniapp/point/point-shop.png') + ')'" v-if="isLogin">
				<view class="point-desc">
					<view class="point-num">{{ point ? point : 0 }}</view>
					<view class="point-rule" @click="openPointPopup()">
						<text class="iconfont iconbangzhu1"></text>
						积分兑换规则
					</view>
				</view>
				<view class="point-opection">
					<navigator hover-class="none" url="/otherpages/member/point/point">积分明细</navigator>
					<navigator hover-class="none" url="/promotionpages/point/order_list/order_list">积分兑换记录</navigator>
				</view>
			</view>
			<view class="point-top ns-bg-color active" :style="'background-image: url(' + $util.img('/upload/uniapp/point/point_01.png') + ')'" v-else>
				<view class="point-desc">
					<view class="login ns-margin-bottom" @click="login">立即登录</view>
					<view class="point-rule">登录查看我的积分</view>
				</view>
			</view>

			<view class="point-category">
				<view class="item" :class="item.id == selectCategoryId ? 'active ns-text-color ns-bg-before' : ''" v-for="(item, index) in categoryList" :key="index" @click="categoryChange(item.id)">
					<text>{{ item.name }}</text>
				</view>
			</view>

			<mescroll-uni @getData="getData" top="445" refs="mescroll" :size="10">
				<block slot="list">
					<view class="goods-container">
						<view class="good_list">
							<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="toDetail(item.id)">
								<block v-if="selectCategoryId==1">
									<view class="imgs" v-if="item.image">
										<image :src="$util.img(item.image)" @error="imageError(index)"></image>
									</view>
									<view class="imgs" v-else>
										<image :src="$util.img('upload/uniapp/point/gift.png')"></image>
									</view>
								</block>
								<block v-if="selectCategoryId==2">
									<view class="imgs" v-if="item.image">
										<image :src="$util.img(item.image)" @error="imageError(index)"></image>
									</view>
									<view class="imgs" v-else>
										<image :src="$util.img('upload/uniapp/point/coupon.png')"></image>
									</view>
								</block>
								<block v-if="selectCategoryId==3">
									<view class="imgs" v-if="item.image">
										<image :src="$util.img(item.image)" @error="imageError(index)"></image>
									</view>
									<view class="imgs" v-else>
										<image :src="$util.img('upload/uniapp/point/hongbao.png')"></image>
									</view>
								</block>
								<view class="info">
									<view class="goods-title">
										<view class="ns-text-color-black">{{ item.name }}</view>
									</view>
									<view class="goods-info">
										<view class="goods-info-desc">
											<text class="goods-desc-point ns-text-color">
												<text class="iconfont iconjifen"></text>
												<text>{{ item.point }}</text>
											</text>
											<text class="goods-desc-save">
												<text>库存：{{ item.stock }}</text>
											</text>
										</view>
										<!-- <view class="goods-info-opec ns-margin-top"><text>立即兑换</text></view> -->
									</view>
								</view>
							</view>
						</view>
					</view>

					<view v-if="goodsList.length == 0 && !isloading" style="padding-top:0">
						<ns-empty  :siteId="siteId"
							:fixed="false"
							:text="selectCategoryId == 1 ? '暂时没有可兑换的礼品哦！' : selectCategoryId == 2 ? '暂时没有可兑换的优惠券哦！' : '暂时没有可兑换的红包哦！'"
						></ns-empty>
					</view>
				</block>
			</mescroll-uni>
			<!-- 弹出规则 -->
			<view @touchmove.prevent.stop>
				<uni-popup ref="pointPopup" type="bottom">
					<view class="tips-layer">
						<view class="head"><view class="title">积分说明</view></view>
						<view class="body">
							<view class="detail ns-margin-bottom">
								<view class="uni-bold">积分的获取</view>
								<view class="ns-font-size-sm">1、积分可在注册、签到、分享、消费、充值时获得。</view>
								<view class="ns-font-size-sm">2、在购买部分商品时可获得积分。</view>
								<view class="uni-bold">积分的使用</view>
								<view class="ns-font-size-sm">1、积分可用于兑换积分中心的商品。</view>
								<view class="ns-font-size-sm">2、积分可在参与某些活动时使用。</view>
								<view class="ns-font-size-sm">3、积分不得转让，出售，不设有效期。</view>
								<view class="uni-bold">积分的查询</view>
								<view class="ns-font-size-sm">1、积分可在会员中心中查询具体数额以及明细。</view>
							</view>
						</view>
					</view>
				</uni-popup>
			</view>
		</block>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
	</view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	components: {
		uniPopup,
		nsAdv
	},
	data() {
		return {
			mescroll: null,
			categoryList: [
				{
					id: 1,
					name: '礼品'
				},
				{
					id: 2,
					name: '优惠券'
				},
				{
					id: 3,
					name: '红包'
				}
			],
			selectCategoryId: 1,
			goodsList: [],
			isLogin: false,
			point: 0,
			siteId:0,
			isloading:false
		};
	},
	onLoad(options) {
		this.getAccountInfo();
		if (options.site_id) {
			this.siteId = options.site_id;
		}
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if(!this.addonIsExit.pointexchange){
			this.$util.showToast({
				title:'积分商城插件未安装',
				mask:true,
				duration:2000
			})
			setTimeout(()=>{
				this.$util.redirectTo('/pages/index/index/index',{},'redirectTo')
			},2000);
			return;
		}
		this.getAccountInfo();
	},
	computed:{
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		},
		addonIsExit(){
			return this.$store.state.addonIsExit
		}
	},
	methods: {
		// 打开积分说明弹出层
		openPointPopup() {
			this.$refs.pointPopup.open();
		},
		//获取积分商品详情
		getData(mescroll) {
			this.mescroll = mescroll;
			this.isloading=true;
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					type: this.selectCategoryId,
					site_id: this.siteId
				},
				success: res => {
					this.isloading=false;
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						});
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
					this.goodsList = this.goodsList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					this.isloading=false;
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//分类切换
		categoryChange(e) {
			this.selectCategoryId = e;
			this.goodsList=[];
			this.mescroll.resetUpScroll();
		},
		//跳转至详情页面
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/point/detail/detail', {
				id: e
			});
		},
		//获取个人
		getAccountInfo() {
			if (uni.getStorageSync('token')) {
				this.isLogin = true;
				this.$api.sendRequest({
					url: '/api/memberaccount/info',
					data: {
						account_type: 'point'
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.point = res.data.point;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			} else {
				this.isLogin = false;
			}
		},
		//跳转至登录页面
		login() {
			this.$refs.login.open('/promotionpages/point/list/list');
		},
		imageError(index) {
			let imageUrl=''
			if(this.selectCategoryId==1){
				imageUrl=this.$util.img('upload/uniapp/point/gift.png')
			}else if(this.selectCategoryId==2){
				imageUrl=this.$util.img('upload/uniapp/point/coupon.png')
			}else if(this.selectCategoryId==3){
				imageUrl=this.$util.img('upload/uniapp/point/hongbao.png')
			}
			this.goodsList[index].image = imageUrl;
			this.$forceUpdate();
		}
	},
	onShareAppMessage(res) {
		var title = '积分兑换，好礼带回家哦';
		var path = '/promotionpages/point/list/list';
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
//头部
.point-top {
	width: 100%;
	height: 350rpx;
	padding: 40rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	line-height: 100rpx;
	background-size: cover;
	background-repeat: no-repeat;

	.point-desc {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		.point-num {
			font-size: 60rpx;
			text-align: center;
			color: #fff;
		}

		.login {
			display: inline-block;
			padding: 4rpx $ns-padding;
			border: 1rpx solid $ns-border-color-gray;
			border-radius: $ns-border-radius;
			color: #ffffff;
		}

		.point-rule {
			font-size: $ns-font-size-base;
			text-align: center;
			color: #fff;

			.iconfont {
				margin-right: 10rpx;
			}
		}
	}

	.point-opection {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 50rpx;

		navigator {
			width: 240rpx;
			height: 70rpx;
			border: 1rpx solid #ffffff;
			text-align: center;
			line-height: 70rpx;
			border-radius: 70rpx;
			box-sizing: border-box;
			color: #ffffff;
		}

		navigator:nth-child(2) {
			margin-left: 40rpx;
		}
	}
}

.point-top.active {
	justify-content: center;
}

//分类
.point-category {
	width: 100%;
	height: 80rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #ffffff;
	padding: 0 $ns-padding;
	box-sizing: border-box;

	.item {
		display: inline-block;
		padding: 15rpx $ns-padding;
		margin-right: 20rpx;
		position: relative;
		width: 30%;
		text-align: center;
	}

	.item text {
		display: inline-block;
	}

	.item.active text:after {
		display: flex;
		content: '';
		width: calc(100% - 40rpx);
		height: 6rpx;
		border-radius: 6rpx;
		position: absolute;
		left: 20rpx;
		bottom: 0;
	}

	.item:last-child {
		margin-right: 0;
	}
}

.goods-container .good_list {
	margin: 20rpx 20rpx 0 20rpx;
	display: flex;
	flex-flow: wrap;

	view.goods-item {
		width: calc(50% - 12rpx);
		background: #fff;
		margin: 0 20rpx 20rpx 0;
		border-radius: 20rpx;
		overflow: hidden;

		.imgs {
			width: 100%;
			position: relative;
			overflow: hidden;
			text-align: center;
			height: 325rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	view.goods-item:nth-child(2n + 2) {
		margin-right: 0;
	}
}

.goods-container .good_list > view.goods-item .info {
	padding: $ns-padding;
	box-sizing: border-box;

	.goods-info {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-top: 10rpx;

		.goods-info-desc {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			text {
				line-height: 1.2;
			}

			.goods-desc-point {
				font-size: $ns-font-size-base;

				.iconfont {
					margin-right: 6rpx;
				}
			}

			.goods-desc-save {
				font-size: 20rpx;
				color: $ns-text-color-gray;
				display: flex;
			}
		}
	}
}

.goods-container .good_list > view.goods-item .info view.goods-title navigator {
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
	width: 100%;
	line-height: 40rpx;
	max-height: 80rpx;
	height: 80rpx;
}

.imgs image {
	width: 100%;
}

.goods-container .good_list > view.goods-item .goods_price view.unit {
	font-size: 24rpx;
}

.ns-border-color-gray-shade-20 {
	border-color: #b7b7b7 !important;
}

.goods-title {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;

	view {
		line-height: 1.3;
	}
}

/* 说明弹框 */
.tips-layer {
	background: #fff;
	z-index: 999;
	height: 40%;
	width: 100%;
}

.tips-layer .title {
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	font-size: $ns-font-size-lg;
	font-weight: 700;
}

.tips-layer .body {
	width: 100%;
	height: calc(100% - 80rpx);
	overflow-y: scroll;
}

.tips-layer .body::-webkit-scrollbar {
	display: none;
}

.tips-layer .body .detail {
	padding: 20rpx;
}

.tips-layer .body .detail .ns-font-size-lg {
	margin-bottom: 10rpx;
}
</style>
