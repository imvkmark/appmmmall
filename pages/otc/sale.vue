<template>
	<view>
		<nav-bar type="transparent" fontColor="#FFF">售賣幣管理</nav-bar>
		<view class="mybg-box">
			<image src="../../static/bg.png" class="my-bg" mode="widthFix"></image>
			<view class="padding card-menu mt_top">
				<view class="cu-list menu shadow-lg radius">
					<view class="cu-item arrow">
						<button class="cu-btn content" @tap="ToUrl('./merchant/advertList')">
							<!-- <text class="cuIcon-settingsfill text-blue"></text> -->
							<text class="text-black">廣告列表</text>
						</button>
					</view>
					<view class="cu-item arrow">
						<button class="cu-btn content" @tap="Toadv()">
							<!-- <text class="cuIcon-settingsfill text-pink"></text> -->
							<text class="text-black">發幣廣告</text>
						</button>
					</view>
					<view class="cu-item arrow">
						<button class="cu-btn content" @tap="ToUrl('./payment')">
							<!-- <text class="cuIcon-settingsfill text-pink"></text> -->
							<text class="text-black">添加收付款方式</text>
						</button>
					</view>
					<!-- <view class="cu-item arrow">
						<button class="cu-btn content"  @tap="ToUrl('./reg')">
							<text class="text-black">實名認證</text>
						</button>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import util from '@/common/function';
	export default {
		data() {
			return {
				// util:util
			}
		},
		onLoad(){
			
		},
		onShow() {
			// this.is_author()
		},
		methods: {
			async is_author() {//判断用户是否已认证，未认证则跳转认证
				var that = this
				// that.$http.get('/Index/user/verifyStatus').then(res => {
				// 	// console.log(res.status, 'author')
				// 	that.status = res.status
				// 	if(res.status == undefined){
				// 		uni.showToast({
				// 			title:'請先實名認證',
				// 			icon:'none'
				// 		})
				// 		setTimeout(function(){
				// 			uni.reLaunch({
				// 				url:'./reg'
				// 			})
				// 		},1500)
				// 	}
				// }).catch(error => {
				// 	console.log(error, 'error')
				// })
				let res = await this.$api.sendRequest({
					url: '/api/user/verifyStatus',
					async: false
				});
				if(res.status == undefined){
					uni.showToast({
						title:'請先實名認證',
						icon:'none'
					})
					setTimeout(function(){
						uni.reLaunch({
							url:'./realname'
						})
					},1500)
				}
			},
			//跳转到其他页面
			ToUrl(url){
				// console.log(url)
				uni.navigateTo({
					url: url
				});
			},
			async Toadv(){
				// var self = this;
				// this.$http.post('/index/user/payment').then(function (response) {
				// 	uni.stopPullDownRefresh();
				// 	let p = response;
				// 	if(p.length < 1){
				// 		uni.showToast({
				// 			title: '請先添加收付款方式',
				// 			duration: 1000,
				// 			icon:'none'
				// 		});
				// 		return ;
				// 	}
				// uni.navigateTo({
				// 	url: './merchant/addAdvert'
				// });
					
				// 	//这里只会在接口是成功状态返回
				// }).catch(function (error) {
				// 	//这里只会在接口是失败状态返回，不需要去处理错误提示
				// 	uni.showToast({
				// 		title: error.msg,
				// 		duration: 2000,
				// 		icon:'none'
				// 	});
					
				// 	uni.stopPullDownRefresh();
				// });
				let res = await this.$api.sendRequest({
					url: '/api/user/payment',
					async: false
				});
				uni.stopPullDownRefresh();
				let p = res;
				if(p.length < 1){
					uni.showToast({
						title: '請先添加收付款方式',
						duration: 1000,
						icon:'none'
					});
					return ;
				}
				uni.navigateTo({
					url: './merchant/addAdvert'
				});
			}
		}
	}
</script>

<style>
	@import url("./main.css");
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
	.card-menu{
		position: absolute;
		width: 100%;
		top: 140rpx;
	}
	.menu{
		width: 100%;
	}
	/* #ifdef APP-PLUS */
	.mt_top{
		margin-top: 10upx;
	}
	/* #endif */
</style>
