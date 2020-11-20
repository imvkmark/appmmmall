<template>
	<view class="container">
		<nav-bar type="transparent" fontColor="#FFF">訂單信息</nav-bar>
		<view class="mybg-box">
			<image src="../../../static/bg.png" class="my-bg" mode="widthFix"></image>
			<view class="form-box padding mt_top">
				<view class="nav bg-gradual-reds margin-bottom radius text-center">
					<view class="cu-item" :class="0==TabCur?'cur':''" @tap="tabSelect" :data-id="0">購買</view>
					<view class="cu-item" :class="1==TabCur?'cur':''" @tap="tabSelect" :data-id="1">出售</view>
				</view>
				<view class="radius mt_list"><!-- margin-top -->
					<view class="nav bg-white">
						<view v-if="TabCur==0" >
							<!-- 购买 -->
							<view class="coin-section m-t" v-for="(item, index) in myBuy" :key="index">
								<view class="block little-line" @click="navTo2(item.order_id)">
									<view class="s-row">
										<view class="col">
											<text class="buy coin">購買</text>
											<text class="coin">SV</text>
										</view>
										<view class="col r light">
											<text class="status" v-if="item.status == 3">已完成</text>
											<text class="status" v-if="item.status == 1">待支付</text>
											<text class="status" v-if="item.status == 2">已支付</text>
											<text class="status" v-if="item.status == 4">已取消</text>
											<uni-icons type="forward" size="20" class="gt"></uni-icons>
										</view>
									</view>
									<view class="s-row">
										<view class="col subtitle row-title">時間</view>
										<view class="col subtitle row-title">數量(SV)</view>
										<view class="col r subtitle row-title">交易總和(CNY)</view>
									</view>
									<view class="s-row">
										<view class="col subtitle row-amount">{{item.ctime}} </view>
										<view class="col subtitle row-amount">{{item.num}}</view>
										<view class="col r subtitle row-amount">{{item.money}}</view>
									</view>
								</view>
							</view>
							<view class="bg-white padding flex align-center margin-tb radius" v-if="empty">
								<view class="flex-sub text-center text-gray">
									<view class="text-xsl padding">
										<text class="cuIcon-text"></text>
									</view>
									<view class="text-lg">暫時冇數據</view>
								</view>
							</view>
						</view>
						<view v-if="TabCur==1">
							<!-- 出售 -->
							<view class="coin-section m-t"  v-for="(item, index) in myOut" :key="index">
								<view class="block little-line" @click="navTo1(item.order_id)">
									<view class="s-row">
										<view class="col">
											<text class="sell coin">出售</text>
											<text class="coin">SV</text>
										</view>
										<view class="col r light">
											<text class="status" v-if="item.status == 3">已完成</text>
											<text class="status" v-if="item.status == 1">待支付</text>
											<text class="status" v-if="item.status == 2">已支付</text>
											<text class="status" v-if="item.status == 4">已取消</text>
											<uni-icons type="forward" size="20" class="gt"></uni-icons>
										</view>
									</view>
									<view class="s-row">
										<view class="col subtitle row-title">時間</view>
										<view class="col subtitle row-title">數量(SV)</view>
										<view class="col r subtitle row-title">交易總和(CNY)</view>
									</view>
									<view class="s-row">
										<view class="col subtitle row-amount">{{item.ctime}} </view>
										<view class="col subtitle row-amount">{{item.num}}</view>
										<view class="col r subtitle row-amount">{{item.money}}</view>
									</view>
								</view>
							</view>
							<view class="bg-white padding flex align-center margin-tb radius" v-if="empty2">
								<view class="flex-sub text-center text-gray">
									<view class="text-xsl padding">
										<text class="cuIcon-text"></text>
									</view>
									<view class="text-lg">暫時冇數據</view>
								</view>
							</view>
						</view>
					</view>	
				</view>
			</view>
		</view>

		<uni-popup ref="popup" type="top">
			<view class="filter-wrapper">
				<view class="filter">
					<view class="filter-title">交易类型</view>
					<view class="filter-pay">
						<text class="filter-pay-item filter-active">购买</text>
						<text class="filter-pay-item">出售</text>
						<text class="placeholder"></text>
					</view>
					<view class="filter-title">订单状态</view>
					<view class="filter-pay">
						<text class="filter-pay-item filter-active">未付款</text>
						<text class="filter-pay-item">已付款</text>
						<text class="filter-pay-item">已完成</text>
						<text class="filter-pay-item">已取消</text>
						<text class="filter-pay-item">申诉中</text>
						<text class="filter-pay-item">申诉完成</text>
					</view>
				</view>
				
				<view class="btn-wrapper">
					<view class="btn">重置</view>
					<view class="btn submit">筛选</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		uniPopup,
		uniIcons
	} from '@dcloudio/uni-ui'
	import util from '@/common/function';
	export default {
		components: {
			uniPopup,
			uniIcons
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				cartList: [],
				TabCur: 0,
				myBuy: [],
				myOut: [],
				page: 1,
				limit: 10,
				isBottom: false,
				page2: 1,
				limit2: 10,
				empty2: false,
				isBottom2: false,
				empty: false, //空白页现实  true|false
				util:util,
				bol:true,
				bol2:true
			};
		},
		onLoad(){
			// this.refreshing = true;
			this.buyList();
		},
		onShow() {
			this.is_author();
		},
		onPullDownRefresh() {
			// 下拉刷新
			this.empty2 = false
			this.empty = false
			this.refreshing = true;
			if(this.TabCur == 0){
				this.buyList();
			}else{
				this.outList();
			}
		},
		onReachBottom() {
			/* 到底部加载 */
			this.bol = false
			this.bol2 = false
			if (this.TabCur == 0) {
				this.buyList();
			}else{
				this.outList();
			}
			
		},
		onNavigationBarButtonTap(e) {
			this.$refs.popup.open()
		},
		computed:{
			...mapState(['hasLogin'])
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
								url:'../reg'
							})
						},1500)
					}
				}).catch(error => {
					console.log(error, 'error')
				})
			},
			//切换导航栏
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				if (this.TabCur == 0) {
					this.buyList();
				}else{
					this.outList();
				}
			},
			//请求数据
			// async loadData(){
			// 	let list = await this.$api.json('cartList'); 
			// 	let cartList = list.map(item=>{
			// 		item.checked = true;
			// 		return item;
			// 	});
			// },
			navTo(url){
				uni.navigateTo({
					url: url
				})
			},
			navTo1(id){
				uni.navigateTo({
					url: '/pages/otc/order/seller_detail?order_id=' +id
				})
			},
			navTo2(id){
				uni.navigateTo({
					url: '/pages/otc/order/detail?order_id=' +id
				})
			},
			buyList() {
				var self = this;
				// if (this.isBottom) {
				// 	uni.showToast({
				// 		title: '已加載完畢',
				// 		icon: 'none'
				// 	})
				// 	return;
				// }
				this.$http.post('/index/user/order_list', {
					type: 1,
					page: self.page,
					limit: self.limit
				}).then(function(response) {
					uni.stopPullDownRefresh();
					self.myBuy = self.myBuy.concat(response);
					self.page += 1;
					// if (response.length < self.limit) {
					// 	self.isBottom = true;
					// }
					// console.log(response,6666)
					if(self.bol){
						if (response.length < 1) {
							self.empty = response.length < 1 ? true : false;
						}
					}
					// console.log(self.empty);
					//这里只会在接口是成功状态返回
				}).catch(function (error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					console.log(error,'fail...')
					
					uni.stopPullDownRefresh();
				});
			},
			outList(bol) {
				var self = this;
				// if (this.isBottom2) {
				// 	uni.showToast({
				// 		title: '已加載完畢',
				// 		icon: 'none'
				// 	})
				// 	return;
				// }
				this.$http.post('/index/user/order_list', {
					type: 2,
					page: self.page2,
					limit: self.limit2
				}).then(function(response) {

					uni.stopPullDownRefresh();
					self.myOut = self.myOut.concat(response);
					self.page2 += 1;
					// if (response.length < self.limit2) {
					// 	self.isBottom2 = true;
					// }
					// console.log(response.length)
					if(self.bol2){
						if (response.length < 1) {
							self.empty2 = response.length < 1 ? true : false;
						}
					}
					//这里只会在接口是成功状态返回
				}).catch(function (error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					
					uni.stopPullDownRefresh();
				});
			}
		}
	}
</script>

<style lang='scss' scoped>
	.container{
		padding: 0upx 0upx;
	}
	.filter-wrapper{
		background-color: #ffffff;
	}
	.btn-wrapper{
		display: flex;
		flex-direction: row;
		padding-top: 30upx;
		.btn{
			width: 50%;
			height: 90upx;
			line-height: 90upx;
			text-align: center;
			border-radius: 0upx;
			border: 0upx;
			background: #F8F8F8;
			font-size: $font-lg;
		}
		.submit{
			color: #ffffff;
			background-color: $uni-color-blue;
		}
	}
	.filter{
		display: flex;
		flex-direction: column;
		padding: 40upx 30upx 30upx 30upx;
		width: 100%;
		.filter-title{
			font-size: $font-md;
			padding-bottom: 20upx;
			padding-top: 30upx;
		}
		.filter-pay{
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			width: 100%;
			.filter-pay-item{
				display: block;
				width: 30%;
				background-color: $border-color-base;
				height: 70upx;
				line-height: 70upx;
				font-size: $font-sm;
				text-align: center;
				margin-top: 10upx;
				margin-bottom: 10upx;
				
			}
			.placeholder{
				width: 30%;
				height: 0;
			}
		}
	}
	.coin-section{
		background: #fff;
		.block{
			padding: 20upx 0;
			.s-row{
				display:flex;
				align-items:center;
				padding: 10upx 30upx 0upx 30upx;
				.subtitle{
					padding: 4upx 0 10upx 0;
				}
				.col{
					font-size: $font-base;
					color: $font-color-dark;
					flex:1;
					.coin{
						font-weight: bold;
						padding-right: 10upx;
					}
					.buy{
						color: $font-color-blue;
					}
					.sell{
						color: $font-color-red;
					}
					.status{
						font-size: $font-base;
						font-weight: 10;
					}
				}
				.coinLogo {
				    width: 36upx;
					height: 36upx;
				    margin-right: 8px;
				    display: inline-block;
				    vertical-align: middle;
				    float: left;
				}
				.light{
					font-weight: bold;
					font-size: $font-lg;
					color: $font-color-dark;
				}
				.r{
					text-align: right;
				}
				.row-title{
					font-size: $font-base;
					font-weight: normal;
					color: $font-color-light;
				}
				.row-amount{
					font-size: $font-base;
					font-weight: normal;
					color: $font-color-dark;
				}
				.gt{
					font-weight: 10;
				}
			}
		}
		
		
	}
	
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
	.mt_list{
		/* #ifdef H5 */
		margin-top:30upx;
		/* #endif */
		/* #ifndef H5 */
		margin-top:50upx;
		/* #endif */
	}
	/* #ifdef APP-PLUS */
	.mt_top{
		margin-top: 40upx;
	}
	/* #endif */
</style>
