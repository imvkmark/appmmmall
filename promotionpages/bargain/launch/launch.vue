<template>
	<scroll-view scroll-y="true" class="container ns-bg-color" @scrolltolower="scrolltolower">
		<view class="launch-bargain" :style="'background:' + 'url(' + $util.img('upload/uniapp/bargain/bargain_detail_bg.png') + ') no-repeat 0 0/100%'">
			<view class="goods-detail">
				<view class="goods-detail-time" v-if="timeMachine">
					<uni-count-down 
						:day="timeMachine.d"
						:hour="timeMachine.h"
						:minute="timeMachine.i"
						:second="timeMachine.s"
						colorClass="ns-text-color" 
						splitorColor="#000 !important" 
						backgroundColor="transparent"
						border-color="transparent"
					/>后结束
				</view>
				<view class="goods-detail-time" v-else-if="info.status == 1">
					砍价已成功
				</view>
				<view class="goods-detail-time" v-else-if="info.status == 2">
					砍价已失败
				</view>
				<view class="user-info">
					<image :src="info.headimg  == '' ? $util.img($util.getDefaultImage().default_headimg) : $util.img(info.headimg)" mode="aspectFit"></image>
					<view class="info-content">
						<text class="name">{{ info.nickname }}</text>
						<text class="desc">"发现一个好货，邀请好友砍价吧"</text>
					</view>
					<!-- <text class="activity-rules ns-border-color ns-text-color">活动规则</text> -->
				</view>
				<view class="goods-item">
					<image :src="$util.img(info.sku_image,{ size: 'mid' })" mode="aspectFit"></image>
					<view class="goods-item-content">
						<view class="item-title">{{ info.sku_name }}</view>
						<view class="price-box">
							<text class="low-price">{{ $lang('common.currencySymbol') }} {{ info.price }}</text>
							<view class="ns-font-size-sm">底价：<text class="original-price ns-text-color ns-font-size-base">{{ $lang('common.currencySymbol') }}{{ info.floor_price }}</text></view>
						</view>
					</view>
				</view>
				<view class="bargain-course">
					<view class="course-title" v-if="info.status == 0">已有{{ info.curr_num }}人帮助砍掉<text class="ns-text-color">{{ cutMoney|moneyFormat }}</text>元,还剩<text class="ns-text-color">{{ surplusMoney|moneyFormat }}</text>元</view>
					<view class="course-title" v-if="info.status == 1">
						<text v-if="info.curr_price == info.floor_price">恭喜您砍价成功了，您可以以底价购买该商品</text>
						<text v-else>恭喜您砍价成功了，您可以以砍到的价格购买该商品</text>
					</view>
					<view class="course-title" v-if="info.status == 2">您本次砍价未能成功，下次继续努力哦</view>
					<view class="progress-box" v-if="info.status == 0">
						<!-- <progress :percent="progress" activeColor="red" active stroke-width="10"/> -->
						<ns-progress :progress='progress'></ns-progress>
					</view>
				</view>
				<view class="bargain-operation" v-if="info.self">
					<block v-if="info.status == 0">
						<button class="orange" v-if="info.buy_type == 0" @click="buyNow">不砍了，直接购买</button>
						<!-- #ifdef MP-WEIXIN -->
						<button class="ns-bg-color" open-type="share">邀请好友砍价</button>
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN -->
						<button class="ns-bg-color" @click="webShare()">邀请好友砍价</button>
						<!-- #endif -->
					</block>
					<block v-if="info.status == 1">
						<button class="orange"  @click="$util.redirectTo('/promotionpages/bargain/list/list')">低价拿更多商品</button>
						<button class="ns-bg-color" @click="buyNow" v-if="info.order_id == 0">立即购买</button>
					</block>
					<block v-if="info.status == 2">
						<button class="ns-bg-color" @click="$util.redirectTo('/promotionpages/bargain/list/list')">低价拿更多商品</button>
					</block>
				</view>
				<view class="bargain-operation" v-else>
					<block v-if="info.status == 0">
						<button class="ns-bg-color" @click="bargain" v-if="!info.cut">帮好友砍一刀</button>
						<button class="ns-bg-color" @click="$util.redirectTo('/promotionpages/bargain/list/list')" v-else>我也要低价拿</button>
					</block>
					<block v-else>
						<button class="ns-bg-color" @click="$util.redirectTo('/promotionpages/bargain/list/list')">我也要低价拿</button>
					</block>
				</view>
			</view>
			<view class="bargain-detail">
				<view class="detail-title">
					<image :src="$util.img('/upload/uniapp/bargain/title_left.png')" mode="widthFix"></image>
					<text>砍价记录</text>
					<image :src="$util.img('/upload/uniapp/bargain/title_right.png')" mode="widthFix"></image>
				</view>
				<view class="detail-list">
					<block v-if="bargainRecord.length>0">
						<view class="detail-item" v-for="(item, index) in bargainRecord" :key="index" >
							<image :src="item.headimg == '' ? $util.img($util.getDefaultImage().default_headimg) : $util.img(item.headimg)" mode="aspectFit"></image>
							<view class="detail-item-content">
								<view class="content-left">
									<text>{{ item.nickname }}</text>
									<l-time :text="item.bargain_time * 1000"></l-time>
								</view>
								<view class="content-right">
									<image :src="$util.img('/upload/uniapp/bargain/bargain_help.png')" mode="aspectFit"></image>
									<text class="ns-text-color">砍掉{{ item.money }}元</text>
								</view>
							</view> 
						</view>
					</block>
					
					<view v-else class="no-bargain-list">
						还没人砍价哦！
					</view>
				</view>
			</view>
		</view>
		
		<view @touchmove.prevent.stop class="PopWindow">
			<uni-popup ref="sharePopup" type="center" class="wap-floating" :maskClick="false">
				<view class="image-wrap"><image src="https://cs.b2b2c.niuteam.cn/upload/1/common/images/20200615/20200615114005159219240529894.png" mode="widthFix"></image></view>
				<text class="iconfont iconroundclose" @click="closeNum"></text>
			</uni-popup>
		</view>
		
		<uni-popup ref="uniPopup" type="center" :maskClick="false">
			<view class="bargain-popup">
				<image :src="$util.img('upload/uniapp/bargain/coin.png')" mode="widthFix" class="head"></image>
				<view class="title">您已成功帮砍</view>
				<view class="money">
					<text class="num ns-text-color">{{ bargainMoney }}</text>
					<text class="unit">元</text>
				</view>
			</view>
			<text class="iconfont iconroundclose" @click="closePopup"></text>
		</uni-popup>
		
		<loading-cover ref="loadingCover"></loading-cover>
	</scroll-view>
</template>


<script>
import LTime from "@/components/l-time/l-time.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsProgress from '@/components/ns-progress/ns-progress.vue';

export default {
	components:{
		LTime,
		uniPopup,
		nsProgress
	},
	data() {
		return {
			windowHeight: 0,
			id: 0,
			info: {
				headimg: ''
			},
			bargainRecord: [],
			page: 1,
			totalPage: 1,
			load: false,
			timeMachine: null,
			memberId: 0,
			bargainMoney: '0.00'
		};
	},
	onLoad(data) {
		this.getHeight();
		if (data.id) this.id = data.id;
	},
	computed:{
		cutMoney(){
			return this.info.price - this.info.curr_price;
		},
		surplusMoney(){
			return this.info.curr_price - this.info.floor_price;
		},
		progress(){
			let total = this.info.price - this.info.floor_price,
				progress = parseInt(this.cutMoney / total * 100);
			return isNaN(progress) ? 0 : progress;
		}
	},
	onShow() {
		// 刷新多语言
		this.$util.showToast({'title': this.id})
		this.$langConfig.refresh();
		if (uni.getStorageSync('token')) {
			this.getBargainInfo();
			this.getMemberId();
		} else {
			this.$util.redirectTo('/pages/login/login/login', { back: '/promotionpages/bargain/launch/launch',id: this.id },'redirectTo');
		}
	},
	methods: {
		webShare(){
			// #ifdef H5
			var value = window.location.href;
			var oInput = document.createElement('input'); //创建一个隐藏input（重要！）
			oInput.value = value; //赋值
			document.body.appendChild(oInput);
			oInput.select(); // 选择对象
			document.execCommand("Copy"); // 执行浏览器复制命令
			oInput.className = 'oInput';
			oInput.style.display = 'none';  
			this.$util.showToast({
				title: '链接复制成功，快去发给你的好友吧'
			});
			// #endif
		},
		getHeight(){
			var self = this;
			uni.getSystemInfo({
				success: function (res) {
					self.windowHeight = res.windowHeight - 44;
					if(self.iphoneX){
						self.windowHeight = self.windowHeight -33;
					}
				}
			});
		},	
		getBargainInfo(){
			this.$api.sendRequest({
				url: '/bargain/api/bargain/info',
				data: {
					id: this.id
				},
				success: res => {
					if (res.code == 0) {
						this.info = res.data;
						if(this.info.status==0){
							uni.setNavigationBarTitle({
								title: '砍价进行中'
							});
						}else if(this.info.status==1){
							uni.setNavigationBarTitle({
								title: '砍价成功'
							});
						}else if(this.info.status==2){
							uni.setNavigationBarTitle({
								title: '砍价失败'
							});
						}
						
						this.getBargainRecord(1);
						if (this.info.status == 0) {
							this.timeMachine = this.$util.countDown(this.info.end_time - res.timestamp);
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.redirectTo('/promotionpages/bargain/my_bargain/my_bargain');
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			})
		},
		getBargainRecord(page){
			if (this.load) return;
			this.load = true;
			
			this.$api.sendRequest({
				url: '/bargain/api/bargain/record',
				data: {
					page: page,
					id: this.info.launch_id
				},
				success: res => {
					this.load = false;
					this.totalPage = res.data.page_count;
					this.page = page;
					if (res.code == 0 && res.data.list.length) {
						if (page == 1) {
							this.bargainRecord = res.data.list;
						} else {
							this.bargainRecord = this.bargainRecord.concat(res.data.list);
						}
					} 
				},
			})
		},
		scrolltolower(){
			let next = this.page + 1;
			if (!this.load && next <= this.totalPage) {
				this.getBargainRecord(next);
			}
		},
		/**
		 * 立即购买
		 */
		buyNow(){
			uni.setStorage({
				key: 'bargainOrderCreateData',
				data: {
					launch_id: this.info.launch_id
				},
				success: () => {
					this.$util.redirectTo('/promotionpages/bargain/payment/payment');
				}
			});
		},
		/**
		 * 帮好友砍价
		 */
		bargain(){
			this.$api.sendRequest({
				url: '/bargain/api/bargain/bargain',
				data: {
					id: this.info.launch_id
				},
				success: res => {
					if (res.code == 0) {
						this.bargainMoney = parseFloat(res.data.bargain_money).toFixed(2)
						this.$refs.uniPopup.open();
						this.getBargainInfo();
					}
				}
			})
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
		closePopup(){
			this.$refs.uniPopup.close();
		},
		closeNum(){
			this.$refs.sharePopup.close();
		},
	},
	filters: {
		/**
		 * 金额格式化输出
		 * @param {Object} money
		 */
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		},
	},
	/**
	 * 自定义分享内容
	 */
	onShareAppMessage() {
		var path = '/promotionpages/bargain/launch/launch?id=' + this.id;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: '嘿！朋友就差你这一刀了，帮一下忙呗~',
			imageUrl: this.$util.img(this.info.sku_image, { size: 'big' }),
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
	page{
		height: 100%;
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
	.container{
		width: 100vw;
		height: 100vh;
	}
	.launch-bargain{
		min-height: 100%;
		padding: 50rpx 24rpx;
		box-sizing: border-box;
		.goods-detail{
			position: relative;
			overflow: hidden;
			margin-bottom: 24rpx;
			padding: 0 24rpx 56rpx;
			background-color: #fff;
			border-radius: 10rpx;
			box-sizing: border-box;
			.goods-detail-time{
				position: absolute;
				left: 50%;
				top:0;
				padding: 4rpx 16rpx;
				background-color: #f7f7f7;
				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;
				transform: translateX(-50%);
				font-size: $ns-font-size-sm;
			}
		}
		.user-info{
			position: relative;
			display: flex;
			align-items: center;
			margin-top: 72rpx;
			image{
				margin-right: 22rpx;
				width: 80rpx;
				height: 80rpx;
				border: 2rpx solid #f1f1f1;
				border-radius: 50%;
			}
			.info-content{
				display: flex;
				flex-direction: column;
				line-height: 1;
				.name{
					font-size: $ns-font-size-base;
					font-weight:500;
				}
				.desc{
					margin-top: 20rpx;
					font-size: $ns-font-size-sm;
					color: #838383;
				}
			}
			.activity-rules{
				position: absolute;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 120rpx;
				height: 40rpx;
				border: 2rpx solid $base-color;
				font-size: 20rpx;
				border-radius: 20rpx;
			}
		}
		.goods-item{
			display: flex;
			margin-top: 24rpx;
			padding: $ns-padding;
			background-color: #f7f7f7;
			border-radius: 10rpx;
			box-sizing: border-box;
			image{
				margin-right: 20rpx;
				width: 180rpx;
				height: 180rpx;
				border-radius: 6rpx;
			}
			.goods-item-content{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;	
			}
			.item-title{
				font-size: $ns-font-size-sm;
				line-height: 36rpx;
			}
			.price-box{
				display: flex;
				flex-direction: column;
				view{
					line-height: 1;
				}
				.low-price{
					text-decoration: line-through;
					color: #777;
				}
				.original-price{
					font-weight: 500;
				}
			}
		}
		.bargain-course{
			margin-top: 50rpx;
			text-align: center;
		}
		.bargain-operation{
			display: flex;
			justify-content: space-between;
			margin-top: 50rpx;
			
			button{
				flex: 1;
				margin: 0;
				padding: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 72rpx;
				color: #fff;
				font-size: $ns-font-size-sm;
				
				&.orange{
					background: #FF7200!important
				}
				&:nth-child(2){
					margin-left: 30rpx;
				}
			}
		}
		.progress-box{
			margin: 20rpx auto 0;
			width: 550rpx;
			border-radius: 5px;
			overflow: hidden;
		}
	}
	.bargain-detail{
		background-color: #fff;
		padding: 24rpx;
		text-align: center;
		border-radius: 10rpx;
		.detail-title{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
			color: $base-color;
			image{
				width: 200rpx;
			}
			text{
				margin: 0 30rpx;
			}
		}
		.detail-item{
			& ~ .detail-item{
				margin-top: 30rpx;
			}
			display: flex;
			align-items: center;
			image{
				margin-right: 20rpx;
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
			}
		}
		.detail-item-content{
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.content-left{
				display: flex;
				flex-direction: column;
				align-items: baseline;
				text{
					font-size: $ns-font-size-base;
					&:nth-child(2){
						font-size: $ns-font-size-sm;
						color: #A0A0A0;
					}
				}
			}
			.content-right{
				display: flex;
				align-items: center;
				image{
					width: 46rpx;
					height: 46rpx;
				}
			}
		}
		.no-bargain-list{
			width: 100%;
			height: 200rpx;
			text-align: center;
			line-height: 200rpx;
			color: #A0A0A0;
		}
	}
	
	.bargain-popup{
		width: 80vw;
		padding: 60rpx;
		background-color: #fff;
		position: relative;
		box-sizing: border-box;
		border-radius: 20rpx;
		
		.head{
			width: 55%;
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%, -70%);
		}
		
		.title{
			text-align: center;
			font-size: 32rpx;
			margin-top: 40rpx;
		}
		
		.money{
			text-align: center;
			
			.num{
				font-size: 36rpx;
				font-weight: 600;
			}
			
			.unit{
				font-size: $ns-font-size-sm;
				margin-left: 8rpx;
			}
		}
	}
	
	.iconroundclose {
		display: block;
		font-size: 60rpx;
		color: #ffffff;
		text-align: center;
	}
</style>
<style scoped>
.goods-detail-time>>>.uni-countdown__number {
	min-width: 28rpx;
	height: 28rpx;
	text-align: center;
	line-height: 28rpx;
	background: #000;
	/* // #690b08 */
	border-radius: 4px;
	display: inline-block;
	padding: 4rpx;
	margin: 0;
	border: none;
}
.goods-detail-time>>>.uni-countdown__splitor{
	margin: 0 4rpx;
	line-height: 28rpx;
}
>>>.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	overflow-y: unset;
	background: none !important;
}
</style>