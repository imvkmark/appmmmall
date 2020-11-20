<template>
	<view class="content">
		<nav-bar type="transparent" fontColor="#FFF">交易大廳
			<view slot="right">
				<image src="../../static/icon-order.png" @click="navTo('/pages/otc/order/list')" style="width:40upx;height: 40upx;margin-right:30upx;"></image>
			</view>
		</nav-bar>
		<view class="mybg-box">
			<image src="../../static/bg.png" class="my-bg" mode="widthFix"></image>
			<view class="form-box padding mt_top">
				<view class="mt20 radius">
					<view class="nav bg-white">
						<view class="order-list" v-for="(item, index) in list" :key="index">
							<view class="order-item little-line">
								<view class="row user-info">
									<view class="name">
										<view class="profile">幣</view>SV
									</view><!-- {{count}} -->
									<view class="nomarl">{{item.sellername}}</view>
								</view>
								<view class="row">
									<view class="nomarl">數量：{{item.num}} SV</view>
									<view class="nomarl">單價</view>
								</view>
								<view class="row">
									<view class="nomarl">限量：{{item.num_min}}-{{item.num_max}}/個</view>
									<view class="price">￥{{item.price}}</view>
								</view>
								<view class="row">
									<view class="nomarl">說明：{{item.brief}}</view>
								</view>
								<view class="row opt">
									<view class="pay">
										<image v-if="item.aili == 1" src="/static/pay-alipay.png"></image>
										<image  v-if="item.wx == 1" src="/static/pay-wechat.png"></image>
										<image  v-if="item.bank == 1" src="/static/pay-paypal.png"></image>
									</view>
									<view><button class="btn" @click="buy(item)">購買</button></view>
								</view>
							</view>
						
						</view>
						
					</view>
					<view class="bg-white padding flex align-center" v-if="empty">
						<view class="flex-sub text-center text-gray">
							<view class="text-xsl padding">
								<text class="cuIcon-text"></text>
							</view>
							<view class="text-lg">暫无數據</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="box">
				<view class="coin">
					<view>
						<view class="name">購買SV</view>
						<view>單價:<text class="price">￥{{item_buy.price}}</text></view>
					</view>
					<view>
						<image class="icon" src="../../static/jinbi001.png"></image>
					</view>
				</view>
				<view class="type">
					<view class="active">按數量購買</view>
					<!-- <view>按金额购买</view> -->
				</view>
				<view class="input">
					<view><input type="number" placeholder="請輸入購買數量" v-model="num" @input="buy_num($event)"  /></view><!-- @keyup.enter="buy_num" -->
					<view><text class="i cny">SV</text> | <text class="i all" @click="buy_all">全部買入</text></view>
				</view>
				<view class="limit">限額：{{item_buy.num_min}}-{{item_buy.num_max}}/個</view>
				<view class="num">可交易數量：{{item_buy.num}} SV</view>
				<view class="amount">
					<view class="t-p">實付款</view>
					<view class="p">￥{{money}}</view>
				</view>
				<view class="btns">
					<view class="btn cancel"  @click="cancel()">取消</view>
					<view class="btn submit" @click="take_order">下單</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template> 

<script>
	import otcList from "./components/otc-list.vue";
	import {
		uniDrawer
	} from '@dcloudio/uni-ui'
	import Json from '@/Json';
	import util from '@/common/function';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	export default {
		components: {
			otcList,
			uniDrawer,
			uniPopup
		},
		data() {
			return {
				util: util,
				tabCurrentIndex: 0,
				TabCur: 0,
				list: [],
				item_buy: '',
				num: 0,
				money: 0,
				page: 1,
				limit: 7,
				empty: false,
				isBottom: false,
				userinfo: '',
				username: '',
				bol: true
			};
		},
		onReachBottom() {
			/* 到底部加载 */
			this.bol = false
			this.loadData();
		},
		onLoad(options) {
			this.loadData();
		},
		onShow() {
			this.is_author();
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500)
		},
		methods: {
			is_author() {//判断用户是否已认证，未认证则跳转认证
				var that = this
				that.$http.get('/Index/user/verifyStatus').then(res => {
					// console.log(res.status, 'author')
					that.status = res.status
					if(res.status == undefined){
						uni.showToast({
							title:'請先實名認證',
							icon:'none'
						})
						setTimeout(function(){
							uni.reLaunch({
								url:'./reg'
							})
						},1500)
					}
				}).catch(error => {
					console.log(error, 'error')
				})
			},
			take_order() {
				var that = this
				var data = {
					id: that.item_buy.id,
					num: that.num
				}

				that.$http.post('/index/user/addOrder', data).then(function(response) {
					that.$refs.popup.close();
					uni.navigateTo({
						url: 'order/detail?order_id=' + response
					})
					uni.stopPullDownRefresh();
				}).catch(error=>{
					console.log('错误信息：',error)
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					uni.stopPullDownRefresh();
				})
			},
			buy_num(e){
				
				let num = e.detail.value;
				if(num == ''){
					num = 0;
				}
				if(num < 0){
					uni.showToast({
						title:'請輸入正確數量',
						icon:'none'
					})
					return;
				}
				this.num = num;
				this.money =parseFloat(num*this.item_buy.price).toFixed(2); 
			},
			buy_all(){
				this.num = this.item_buy.num
				let e = {
					'detail': {
						'value': this.item_buy.num
					}
				};
				this.buy_num(e)
			},
			buy(item){
				this.$refs.popup.open();
				this.num ='';
				this.item_buy = item;
			},
			cancel(){
				this.$refs.popup.close();
			},
			//切换导航栏
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			loadData(){
				var self = this;
				// if(this.isBottom){
				// 	uni.showToast({
				// 		title:'已加載完畢',
				// 		icon:'none'
				// 	})
				// 	return;
				// }
				self.$http.post('/index/user/advAll', {
					page: self.page,
					limit: self.limit
				}).then(function(response) {
					console.log(response)
					self.list = self.list.concat(response);
					self.page += 1;
					// if(response.length < self.limit){
					// 	self.isBottom = true;
					// }
					if(self.bol){
						if (response.length < 1) {
							self.empty = response.length < 1 ? true : false;
						}
					}
					uni.stopPullDownRefresh();
					//这里只会在接口是成功状态返回
				}).catch(function (error) {
					console.log('错误信息：',error)
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					
					uni.stopPullDownRefresh();
				});
			},
			navTo(url){
				uni.navigateTo({
					url: url
				})
			},
			//获取订单列表
			filter(){
				uni.getSubNVueById('otcFilterDrawer').show('slide-in-right', 200);
			}, 

			// //swiper 切换
			// changeTab(e){
			// 	this.tabCurrentIndex = e.target.current;
			// 	this.loadData('tabChange');
			// },
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			}
			
		},
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		background-color: #EEEEEE !important;
	}
	.content{
		height: 100%;
		background-color: #EEEEEE !important;
	}

	.swiper-box {
		height: calc(100% - 90px);
		// height: 100%;
	}
	.list-scroll-content{
		height: 100%;
	}
	.header{
		/* #ifdef APP-PLUS */
		 padding-top:150upx;
		/* #endif */
		
		/* #ifdef H5 */
		 padding-top:100upx;
		/* #endif */
		
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		.menu{
			image {
				width: 20px;
				height: 20px;
				margin: 0upx 30upx 0upx 10upx;
			}
		}
	}
	.navbar{
		display: flex;
		height: 40px;
		background: #fff;
		position: relative;
		margin: 0 30upx 20upx 30upx;
		padding-bottom: 30upx;
		.nav-item{
			height: 100%;
			font-size: 30upx;
			color: $font-color-light;
			margin-right: 15px;
			display:flex;
			align-items:flex-end;
			&.current{
				color: $font-color-dark;
				font-size: 40upx;
				font-weight: bold;
			}
		}
	}
	.filter{
		padding: 30upx 30upx;
		.uni-title{
			font-size: $font-lg;
			padding: 20upx 0;
		}
		.price{
			border: 1upx solid $border-color-light;
			font-size: $font-sm;
			padding: 30upx 20upx;
		}
	}
	// .tab-content{
	// 	height:600px;
	// }
	.mybg-box {
		width: 100%;
		height: 35vh;
		position: relative;
	}
	.my-bg {
		width: 100%;
		height: 30vh;
		display: block;
	}
	.form-box{
		position: absolute;
		width: 100%;
		left: 0;
		top: 100rpx;
	}
	.car-box{
		border-radius: 30rpx;
	}
	.car-img{
		width: 50rpx;
		height: 150rpx;
		display: block;
	}
	.car-info-tile{
		line-height: 51rpx;
	}
	.flex-jsb{
		justify-content: space-between;
	}

	.if_fuhua {
		border: 1upx solid #FF3637;
		border-radius: 30px;
		padding: 0 10upx;
		color: #FF3637;
		margin-left: 20upx;
	}
	
	
	
	
	
	.box{
		background: #fff;
		display: flex;
		flex-direction: column;
		padding: 30upx 30upx;
		font-size: $font-base;
		color: $font-color-light;
		.coin{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-bottom: 10upx;
			.name{
				font-size: $font-lg;
				color: $font-color-base;
				padding-bottom: 10upx;
			}
			.price{
				color: $font-color-blue;
			}
			.icon{
				width: 40px;
				height: 40px;
			}
		}
		.type{
			display: flex;
			flex-direction: row;
			padding: 10upx 0;
			view{
				margin-right: 30upx;
				position: relative;
				padding: 10upx 0;
				&.active{
					color: $uni-color-blue;
					&:after{
						content: '';
						position: absolute;
						left: 50%;
						bottom: 0;
						transform: translateX(-50%);
						width: 100%;
						height: 0;
						border-bottom: 2px solid $uni-color-blue;
					}
				}
			}
		}
		.input{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
			padding: 14upx 10upx;
			margin: 20upx 0;
			border: 1upx solid #8B9FAA;
			input{
				color: $font-color-light;
				font-size: $font-base;
			}
			.cny{
				margin-right: 20upx;
				color: $font-color-base;
			}
			.all{
				margin-left: 20upx;
				color: $font-color-blue;
			}
		}
		.amount{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 10upx 0;
			.p{
				font-size: $font-lg;
				color: $font-color-blue;
			}
		}
		.btns{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
			padding: 10upx 0;
			.btn{
				display: block;
				width: 48%;
				height: 70upx;
				line-height: 70upx;
				text-align: center;
				color: #fff;
				border-radius: 0;
				font-size: $font-base;
			}
			.cancel{
				background: #96A7BA;
			}
			.submit{
				background: $uni-color-blue;
			}
		}
	}
	.order-list {
		padding-bottom: 10upx;

		.order-item {
			width: 100%;
			padding: 20upx 30upx;
			display: block;
			border:1px solid #CCCCCC;
			.user-info{
				margin: 20upx 0;
				height: 50upx;
				line-height: 50upx;
				.name{
					font-size: $font-md;
					font-weight: bold;
					display: flex;
					flex-direction: row;
				}
				.profile{
					width: 50upx;
					height: 50upx;
					line-height: 50upx;
					border-radius: 50%;
					text-align: center;
					background: $uni-color-blue;
					color: #fff;
					font-weight: 100;
					font-size: $font-sm;
					margin-right: 10upx;
				}
			}
			.opt{
				margin: 20upx 0;
			}
			.row{
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 2upx 0;
				align-items:flex-end;
				.price{
					color: $font-color-blue;
				}
				.nomarl{
					font-size: $font-sm;
					color: $font-color-light;
				}
				.pay{
					image{
						width: 25px;
						height: 25px;
					}
				}
				.btn{
					border: 0;
					background: $uni-color-blue;
					color: #fff;
					font-size: $font-sm;
					height: 60upx;
					line-height: 60upx;
					padding: 0 50upx;
				}
			}
		}
	}

	.mt20 {
		margin-top: 20upx;
	}
	/* #ifdef APP-PLUS */
	.mt_top{
		margin-top: 20upx;
	}
	/* #endif */
</style>
