<template>
	<view class="container">
		<nav-bar type="transparent" fontColor="#FFF">添加廣告</nav-bar>
		<view class="mybg-box">
			<image src="../../../static/bg.png" class="my-bg" mode="widthFix"></image>
			
			
			<view class="form-box padding mt_top">
				<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
					<text class="cell-tit">單價</text>
					<input class="cell-input" v-model="price" placeholder="請輸入單價"/>
				</view>
				<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
					<text class="cell-tit">數量</text>
					<input class="cell-input" v-model="num" placeholder="請輸入數量"/>
				</view>
				<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
					<text class="cell-tit">限額</text>
					<view class="cell-cust">
						<input class="cell-input limit-l" v-model="num_min" placeholder="最小購買量"/>
						<text class="gap">-</text>
						<input class="cell-input limit-r" v-model="num_max" placeholder="最大購買量"/>
					</view>
				</view>
				<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
					<text class="cell-tit">限時出售</text>
					<input class="cell-input limit-r" v-model="expiration_time" placeholder="單位:小時"/>
				</view>
				<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50">
					<textarea placeholder="請輸入備註信息" v-model="brief" style="width: 100%; font-size: 28upx;"></textarea>
				</view>
				<button class="submit" :disabled="btnd" @tap="exchange">確認</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {  
	    mapMutations  
	} from 'vuex';
	import util from '@/common/function';
	export default {
		data() {
			return {
				price:'',
				num:'',
				num_min:'',
				num_max:'',
				expiration_time:'',
				brief:'',
				btnd:false,
				util:util
			};
		},
		onLoad() {
			this.is_author()
		},
		methods:{
			is_author() {//判断用户是否已认证，未认证则跳转认证
				var that = this
				that.$http.get('/Index/user/verifyStatus').then(res => {
					console.log(res.status, 'author')
					that.status = res.status
					if(res.status == undefined){
						console.log('false...')
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
			...mapMutations(['logout']),

			navTo(url){
				this.$api.msg(`跳转到${url}`);
			},
			//确认提交
			exchange(){
				var self = this;
				var data = {
					price:this.price,
					num:this.num,
					num_min:this.num_min,
					num_max:this.num_max,
					expiration_time:this.expiration_time,
					brief:this.brief,
				}
				//提交数据
				this.btnd = true;
				this.$http.post('/index/user/saveAdv',data).then(function (response) {
					uni.showToast({
					    title: '提交成功!',
					    duration: 2000,
						icon:'success'
					});
					setTimeout(function () {
						//清空输入框
						self.price="";
						self.num="";
						self.num_min="";
						self.num_max="";
						self.expiration_time="";
						self.brief="";
						//按钮可点击
						self.btnd =false;
					}, 2000);
					//这里只会在接口是成功状态返回
				}).catch(function (error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					console.log('错误信息',error);
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					self.btnd =false;
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss' scoped>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		flex-direction: row;
		align-items:baseline;
		padding: 30upx $page-row-spacing;
		/* line-height:80upx; */
		position:relative;
		background: #fff;
		justify-content: space-between;
		border-bottom: 1upx solid #f5f5f5;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size: $font-base;
			color: $font-color-blue;
			margin-left:10upx;
		}
		.cell-tit{
			font-size: $font-base + 2upx;
			color: $font-color-dark;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
		.cell-cust{
			width: 60%;
			height: 60upx;
			line-height: 60upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.limit-r{
				text-align: right;
				width: 150upx;
			}
			.limit-l{
				text-align: left;
				width: 150upx;
			}
		}
		.cell-side{
			font-size: $font-base;
		}
		radio{
			transform:scale(0.7);
			margin-left: 20upx;
		}
		.cell-input{
			font-size: $font-base;
			text-align: right;
		}
		
		.cell-btn{
			display: block;
			margin-right: 0;
			padding: 2upx 40upx;
			font-size: $font-base;
			border: 1upx solid $font-color-blue;
			color: $font-color-blue;
		}
	}
	.list-cell:last-child{
		border-bottom: 0;
	}
	.submit{
		margin: 60upx 20upx;
		/* background: $uni-color-blue; */
		color: #fff;
		font-size: $font-md;
		background-color: #e54d42;;
	}
	.safe-tip{
		font-size: $font-sm;
		color: $font-color-blue;
		background: $uni-color-tip;
		padding: 20upx 30upx;
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
			margin-top: 50upx;
		}
		/* #endif */
</style>
