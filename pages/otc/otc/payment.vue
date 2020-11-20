<template>
	<view class="container">
		<!-- <nav-bar type="transparent" fontColor="#FFF" :title="title"> -->
		<nav-bar type="transparent" fontColor="#FFF" :title="title">
			<view slot="right">
				<image src="../../static/add.png" @click="navTo('add_payment')" style="width:40upx;height: 40upx;margin-right:30upx;"></image>
			</view>
		</nav-bar>
		<view class="mybg-box">
			<image src="../../static/bg.png" class="my-bg" mode="widthFix"></image>
			
			<view class="form-box padding mt_top">
				<view style="background-color: #FFFFFF;">
					<view class="flex list" v-for="(item,index) in payment" :key="index">
						<view class="flex-center" style="width:140upx;">
							<image :src="item.type==1?zfb:item.type==2?wx:item.type==3?yl:''" style="width:60upx;" mode="widthFix"></image>
						</view>
						<view class="flex1 flex-y">
							<view class="flex-y-jsb">
								<view style="font-size:30upx;margin-bottom:10upx;">收款人:{{item.user_name}}</view><!-- :class="item.type == 3?'ml40':''" -->
								
								<view class="c-gray" v-if="item.type == 3">卡號:{{item.bank_num}}</view>
								<view class="c-gray" v-if="item.type == 1">收付款方式:支付寶</view>
								<view class="c-gray" v-if="item.type == 2">收付款方式:微信</view>
								<view class="c-gray" v-if="item.type == 3">收付款方式:銀行卡</view>	
								
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '收付款方式',
				payment:[],
				zfb:'../../static/pay/zfb.png',
				wx:'../../static/pay/wx.png',
				yl:'../../static/pay/yl.png',
				way:[{
					src:'../../static/user-bg.jpg',
					author:'財神官方',
					money_way:'支付寶',
					user:'admin'
				},{
					src:'../../static/user-bg.jpg',
					author:'財神官方',
					money_way:'微信',
					user:'admin'
				}]
			}
		},
		onLoad(){
		
		},
		onShow() {
			this.paymentList();
		},
		methods: {
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			paymentList(){
				var self = this;
				this.$http.post('/index/user/payment').then(function (response) {
					console.log(response)
					self.payment = response;
					uni.stopPullDownRefresh();
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
			},
		},
	}
</script>

<style>
	.flex {
		display: flex;
	}

	.flex1 {
		flex: 1;
	}

	.flex-y {
		display: flex;
		align-items: center;
	}

	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.flex-y-jsb {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.list{
		background-color: #FFFFFF;
		/* margin-top: 20upx; */
		padding:30upx 0;
		border-bottom: 1upx solid #EEEEEE;
	}
	.list:first-child{
		margin-top: 0;
	}
	.list:last-child{
		border-bottom: 0;
	}
	
	.c-gray{
		color: #B2B2B2;
	}
	.ml40{
		margin-left:40upx;
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
	
	.form-box {
		position: absolute;
		width: 100%;
		left: 0;
		top: 100rpx;
	}
	
	.car-box {
		border-radius: 30rpx;
	}
	
	.car-img {
		width: 50rpx;
		height: 150rpx;
		display: block;
	}
	
	.car-info-tile {
		line-height: 51rpx;
	}
	/* #ifdef APP-PLUS */
	.mt_top{
		margin-top: 40upx;
	}
	/* #endif */
</style>
