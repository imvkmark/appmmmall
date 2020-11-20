<template>
	<view>
		<view class="transfer-info">
			<view class="order-list">
				
				<view class="order-item little-line" v-for="(item, index) in adv" :key="index">
					<view class="row user-info">
						<view class="name"><view class="profile">幣</view>SV</view>
					</view>
					<view class="row">
						<view class="nomarl">數量 {{item.num}} SV</view>
						<view class="nomarl">單價</view>
					</view>
					<view class="row">
						<view class="nomarl">限量{{item.num_min}}-{{item.num_max}}</view>
						<view class="price">￥{{item.price}}</view>
					</view>
					<view class="row opt">
						<view class="pay">
							
							<image v-if="ali ==1" src="../../../static/pay-alipay.png"></image>
							<image v-if="wx ==1" src="../../../static/pay-wechat.png"></image>
							<image v-if="bank ==1" src="../../../static/pay-paypal.png"></image>
						</view>
						<view>
							<button v-if="item.status == 2" class="btn buy" @click="changeStatus(item.id,1,index)">開啟</button>
							<button  v-else class="btn sell" @click="changeStatus(item.id,2,index)">暫停</button>
						</view>
					</view>
				</view>
				
				<view class="bg-white padding flex align-center margin-tb radius pt50" v-if="empty">
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
	
</template> 

<script>
	import {uniPopup} from '@dcloudio/uni-ui'
	export default {
		components: {uniPopup},
		data() {
			return {
				page:1,
				limit:10
			};
		},
		props: {
			adv: {
				type: Array,
				default: ()=>[]
			},
			ali: {
				type: String,
				default: "0"
			},
			wx: {
				type: String,
				default: "0"
			},
			bank: {
				type: String,
				default: "0"
			},
			empty: {
				type: Boolean,
				default: false
			}
			
		},
		mounted: function() {
			
		},
		onLoad(option) {
			// this.getlist()
		},
		 
		methods: {
			// getlist(){
			// 	var that = this
			// 	var data = {
			// 		page:this.page,
			// 		limit:this.limit
			// 	}
			// 	this.$http.get('/Index/user/advList',data).then(res=>{
			// 		console.log(res,666)
			// 	}).catch(error=>{
			// 		console.log(error,233)
			// 	})
			// },
			changeStatus(id,status,index){
				var self = this;
				this.$http.post('/index/user/advChangeStatus',{id:id,status:status}).then(function (response) {
					self.adv[index].status = status;
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
				
			}
			
		},
	}
</script>

<style lang="scss" scoped>
	.transfer-info{
		background-color: #FFFFFF;
		margin-top: 20upx;
		.w-title{
			font-size: $font-md;
			font-weight: bold;
			padding: 20upx 30upx 20upx 30upx;
		}
		.order-list {
			padding-bottom: 50upx;
			.order-item {
				width: 100%;
				padding: 20upx 30upx;
				display: block;
				border-bottom: 1upx solid #EEEEEE;
				.user-info{
					margin: 40upx 0 20upx 0;
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
					.buy{
						background: $uni-color-blue;
					}
					.sell{
						background: #475F78;
					}
					.btn{
						border: 0;
						color: #fff;
						font-size: $font-sm;
						height: 60upx;
						line-height: 60upx;
						padding: 0 50upx;
					}
				}
			}
		}
	}
	.pt50{margin-top: 50upx;}
</style>
