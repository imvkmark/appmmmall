<template>
	<view class="container">
		<nav-bar type="transparent" fontColor="#FFF">廣告列表</nav-bar>
		<view class="mybg-box">
			<image src="../../../static/bg.png" class="my-bg" mode="widthFix"></image>

			<!-- 列表 -->
			<view class="form-box padding mt_top">
				<advert-list-item :adv="adv" :ali="ali" :wx="wx" :bank="bank" :empty="empty"></advert-list-item>
			</view>
		</view>
		<!-- 	<view class="line"></view> -->
	</view>

</template>

<script>
	import {
		mapState
	} from 'vuex';
	import advertListItem from "../components/advert-list-item.vue";
	import util from '@/common/function';
	export default {
		components: {
			advertListItem
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				adv: [],
				ali: "0",
				wx: "0",
				bank: "0",
				page: 1,
				limit: 7,
				isBottom: false,
				util:util
			};
		},
		onLoad(){
			this.is_author();
			this.advList();
			this.paymentList();
		},
		
		onReachBottom() {
			/* 到底部加载 */
			this.advList();
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
						// console.log('false...')
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
			change(){
				uni.showActionSheet({
					title:'支付方式',
				    itemList: ['银行卡', '微信', '支付宝'],
				    success: function (res) {
				        console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			
			
			advList(){
				var self = this;
				
				if(this.isBottom){
					uni.showToast({
						title:'已加載完畢',
						icon:'none'
					})
					return;
				}
				this.$http.post('/index/user/advList', {
					page: self.page,
					limit: self.limit
				}).then(function(response) {

					self.adv = self.adv.concat(response);
					self.page += 1;
					if(response.length < self.limit){
						self.isBottom = true;
					}
					self.empty = response.length < 1?true:false;
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
			paymentList(){
				var self = this;
				this.$http.post('/index/user/payment').then(function (response) {
					let p = response;
					for(let i = 0; i< p.length;i++){
						if(p[i].type == 1){
							self.ali = "1";
						}
						if(p[i].type == 2){
							self.wx = "1";
						}
						if(p[i].type == 3){
							self.bank = "1";
						}
					}
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
			navTo(url){
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
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
		margin-top: 20upx;
	}
	/* #endif */
</style>
