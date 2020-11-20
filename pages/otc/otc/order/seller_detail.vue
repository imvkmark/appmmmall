<template>
	<view class="container">
		<view class="head-wrapper" >
			<view class="status" >
				<view class="s">
					<text class="iconfont s0"></text>
					<text class="v" v-if="order.status == 1">待對方支付</text>
					<text class="v" v-if="order.status == 2">對方已支付</text>
					<text class="v" v-if="order.status == 3">訂單完成</text>
					<text class="v" v-if="order.status == 4">訂單已取消</text>
				</view>
			</view>
			<view class="concat" @click="go()">
				<text class="iconfont icon-telephone"></text>
				<view style="text-align: center;color:#FFFFFF;">Call Me</view>
			</view>
		</view>
		
		<!-- 列表 -->
		<view class="transfer-info">
			<view class="list">
				<view class="item little-line">
					<view class="left">總金額</view>
					<view class="right">{{order.money}}</view>
				</view>
				<view class="item little-line">
					<view class="left">單價</view>
					<view class="right">{{order.price}}</view>
				</view>
				<view class="item little-line">
					<view class="left">購買數量</view>
					<view class="right">{{order.num}}</view>
				</view>
				<view v-if="order.status == 2 || order.status == 3">
					<view class="item little-line" >
						<view class="left">收款方式</view>
						<view class="right" v-if="order.payment.type == 1">支付寶</view>
						<view class="right" v-if="order.payment.type == 2">微信</view>
						<view class="right" v-if="order.payment.type == 3">銀行卡</view>
					</view>
					<view class="item little-line">
						<view class="left">支付時間</view>
						<view class="right">{{order.pay_time_str}}</view>
					</view>
					<view v-if="order.payment.type == 3">
						<view class="item little-line">
							<view class="left">銀行卡號</view>
							<view class="right">{{order.payment.bank_num}}</view>
						</view>
						<view class="item little-line">
							<view class="left">開戶銀行</view>
							<view class="right">{{order.payment.bank_who}}</view>
						</view>
						<view class="item">
							<view class="left">開戶支行</view>
							<view class="right">{{order.payment.bank_address}}</view>
						</view>
					</view>
					<view v-if="order.payment.type == 2 || order.payment.type == 1">
						
						<view class="item little-line">
							<view class="left">收款二維碼</view>
							<view class="right flex-center">
								<image :src="order.payment.img" style="width:300upx;height:300upx;"></image>
							</view>
						</view>
					</view>
				</view>
				
				
			</view>
		</view>
		<view class="line"></view>
		<view class="transfer-info">
			<view class="list">
				<view class="item little-line">
					<view class="left">買家暱稱</view>
					<view class="right">{{order.user_nickname}}</view>
				</view>
				<view class="item little-line">
					<view class="left">買家實名</view>
					<view class="right">{{order.user_name}}</view>
				</view>
				<view class="item little-line">
					<view class="left">訂單號</view>
					<view class="right">{{order.order_id}}</view>
				</view>
				<view class="item">
					<view class="left">下單時間</view>
					<view class="right">{{order.ctime_str}}</view>
				</view>
				<view class="item" v-if="order.status ==3">
					<view class="left">收款時間</view>
					<view class="right">{{order.confirm_time_str}}</view>
				</view>
			</view>
		</view>

		<view class="footer" v-if="order.status == 2">
			<view class="btns flex-y">
				<!-- <button class="cancel" >剩余：{{d}}天{{h}}时{{m}}分{{s}}秒</button> -->
				<view class="cancel">{{str}}</view>
				<!-- 超时自动放币 -->
				<button class="pay" @click="confirm()">確認收款</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import util from '@/common/function';
	import {
		uniIcons,
		uniList,
		uniListItem
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniIcons,
			uniList,
			uniListItem
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				money:'',
				num:'',
				fangshi: '請選擇付款方式',
				type:'',//当前选择类型（int）： 1=支付宝  2=微信  3=银行卡
				order:[],
				pay_list:[],
				img1:'',
				img2:'',
				bank_num:'',
				bank_who:'',
				bank_address:'',
				strtime: 0,
				d: 0,
				h: 0,
				m: 0,
				s: 0,
				util: util,
				str:''
			};
		},
		onLoad(options){
			
			if(typeof options.order_id == "undefined"){
				uni.showToast({
					title:'缺少参数',
					icon:'none'
				})
				return;
			}
			this.order_id = options.order_id;
			// this.loadData(options.order_id);
			this.loadData(options.order_id);
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			//获取个人信息
			mineInfoRequest() {
				var self = this;
				this.$http.post('/index/login/index').then(function(response) {
					self.userinfo = response;
					self.username = util.cutPhone(response.tel ? response.tel : response.mail);
					uni.stopPullDownRefresh();
					//这里只会在接口是成功状态返回
				}).catch(function(error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon: 'none'
					});
					console.log('错误信息', error);
					uni.stopPullDownRefresh();
				});
			},
			change() {
				uni.showActionSheet({
					title:'支付方式',
				    itemList: ['銀行卡', '微信', '支付寶'],
				    success: function (res) {
				        console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			addZero(i) {
			     return i < 10 ? "0" + i: i + "";
			},
			dateProceed() {
				let that = this;
				setInterval(function() {
					
					that.strtime--;
					if(that.strtime <= 0){
						that.str = '由於您未及時確認，系統將於1分鐘後自動完成訂單';
						// return false;
					}
					var lefttime = that.strtime;
					var d = parseInt(lefttime / (24 * 60 * 60))
					var h = parseInt(lefttime / (60 * 60) % 24);
					var m = parseInt(lefttime / 60 % 60);
					var s = parseInt(lefttime % 60);
					that.d = that.addZero(d);
					that.h = that.addZero(h);
					that.m = that.addZero(m);
					that.s = that.addZero(s);
					that.str = '剩餘：'+h+'時'+m+'分'+s+'秒';
				}, 1000);
				
			},
			confirm(){
				var that = this
				var data = {
					order_id:this.order_id
				}
				this.$http.post('/index/user/confirmOrder',data).then(function (response) {
					uni.showToast({
						title: '確認成功',
						duration: 1500,
						icon:'none'
					});
					uni.stopPullDownRefresh();
					setTimeout(function () {
						uni.navigateTo({
							url: '/pages/otc/otc'
						});
										
					}, 1500);
					
				}).catch(error=>{
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					uni.stopPullDownRefresh();
				})
			},
			
			//请求数据
			loadData(id){
				var that = this
				var data = {
					order_id:that.order_id
				}
				this.$http.post('/index/user/orderInfo',data).then(function (response) {
					
					that.order = response;
					let payment = that.payment = response.payment;
					if(response.status == 1){
						let myArray=[];
						for(let i=0;i<payment.length;i++){
							if(payment[i].type == 1){
								myArray.push('支付寶');
								that.img1= payment[i].img;
							}
							if(payment[i].type == 2){
								myArray.push('微信');
								that.img2= payment[i].img;
							}
							if(payment[i].type == 3){
								myArray.push('銀行卡');
								that.bank_address= payment[i].bank_address;
								that.bank_num= payment[i].bank_num;
								that.bank_who= payment[i].bank_who;
							}
						}
						that.pay_list = myArray;
					}
					if(response.status == 2){
						 that.strtime =  response.confirm_time;
						 that.dateProceed();
					}
					uni.stopPullDownRefresh();
				}).catch(error=>{
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					uni.stopPullDownRefresh();
				})
			},
			
			go(){
			 	uni.makePhoneCall({
			 	// 手机号
			    phoneNumber: this.order.user_tel, 
				// 成功回调
				success: (res) => {
					console.log(this.order.seller_tel)	
				},
				// 失败回调
				fail: (res) => {
					console.log('调用失败!')
				}
			  });
			},
			
			
			navTo(url){
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	@font-face {
	  font-family: 'iconfont';
	  src: url('../../../static/font/otc-detail.ttf') format('truetype');
	}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 70upx;
	  color: #ffffff;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	.s0:before {
	  content: "\e6db";
	}
	.s1:before {
	  content: "\e69b";
	}
	.s2:before {
	  content: "\e6e6";
	}
	.s3:before {
	  content: "\e698";
	}
	.s4:before {
	  content: "\e69e";
	}
	
	.icon-telephone:before {
	  content: "\e6a2";
	}
	.icon-message:before {
	  content: "\e6df";
	}

	.container {
		padding: 0upx 0upx 120upx 0upx;
	}

	.head-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background: #0952C3;
		/* background: #e54d42; */
		font-size: $font-base;
		padding: 160upx 30upx 40upx 30upx;
		color: $font-color-light;
		.status{
			font-size: $font-sm;
			.s{
				display: flex;
				flex-direction: row;
				align-items: center;
				.v{
					font-size: $font-xl;
					color: #ffffff;
				}
			}
			.t{
				color: #ffffff;
			}
		}
		.concat{
			font-size: $font-sm;
		}
		
	}
	.secrity-tip{
		padding: 20upx 30upx;
		font-size: $font-sm;
	}
	.amount-wrapper{
		padding: 30upx 30upx 30upx 30upx;
		.total{
			display: block;
			color: $font-color-blue;
			padding: 20upx 0 20upx 0;
			font-weight: bold;
		}
		.info{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.price{
				font-size: $font-base;
				view{
					padding-top: 10upx;
					padding-bottom: 10upx;
				}
				.label{
					color: $font-color-light;
					padding-right: 30upx;
				}
			}
			.coin{
				font-size: $font-base;
				text-align: center;
				image{
					width: 56upx;
					height: 56upx;
				}
			}
		}
	}
	.transfer-info{
		padding: 0upx 30upx;
		background-color: #FFFFFF;

		.change {
			color: $font-color-blue;
		}
	}
	.list{
		.item{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 30upx 0 30upx 0;
			border-bottom: 1upx solid #EEEEEE;

			.left {
				font-size: $font-base;
			}
			.right{
				font-size: $font-base;
			}
		}
	}
	.footer{
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		width: 100%;
		border-top: 1upx solid #CCCCCC;

		.safe-tip {
			font-size: $font-sm;
			color: $font-color-blue;
			background: $uni-color-tip;
			padding: 20upx 30upx;
		}
		.btns{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			height: 100upx;
			line-height: 100upx;

			/* padding: 20upx 30upx; */
			.cancel {
				height: 100upx;
				line-height: 100upx;
				padding-left: 30upx;
				width: 60%;
				font-size: $font-base;
			}

			.pay {
				width: 40%;
				height: 100upx;
				line-height: 100upx;
				border: 0px;
				border-radius: 0;
				background-color: $uni-color-blue;
				color: #ffffff;
				font-size: $font-base;
			}
		}
	}

	.flex {
		display: flex;
	}

	.flex-y {
		/* display: flex;
		  align-items: center */
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
