<template>
	<view class="message" v-if="orderInfo">
		<view class="goods-item">
			<image :src="$util.img(orderInfo.order_goods?orderInfo.order_goods[0].sku_image:'')" mode="aspectFill"></image>
			<view class="goods-info">
				<view class="goods-name">{{orderInfo.order_goods?orderInfo.order_goods[0].sku_name:''}}</view>
				<view class="ns-font-size-sm">订单状态:{{orderInfo.delivery_status_name}}</view>
				<view class="ns-font-size-sm">配送方式:{{orderInfo.delivery_type_name}}</view>
				<view class="goods-bottom">
					<view class="goods-price ns-text-color">
						<text class="goods-price-sign">￥</text>
						<text class="ns-font-size-sm">{{orderInfo.order_goods?orderInfo.order_goods[0].price:''}}</text>
					</view>
					<view class="goods-option ns-font-size-sm ns-bg-color" v-if="isCanSend" @click="sendMsg('goods')">发送</view>
					<view class="goods-option ns-font-size-sm disabled" v-else @click="sendMsg('goods')">已发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ns-chat-goods',
		props: {
			orderId: {
				type: [Number,String]
			},
			isCanSend:Boolean
		},
		data() {
			return {
				orderInfo:{}
			};
		},
		mounted() {
			this.getGoodsInfo();
		},
		methods: {
			getGoodsInfo(){
				this.$api.sendRequest({
					url: '/api/order/detail',
					data: {
						order_id: this.orderId,
					},
					success:(res)=>{
						if(res.code>=0){
							this.orderInfo=res.data;
						}
					}
				});	
			},
			sendMsg(){
				this.$emit('sendMsg','order')
			}
		}
	};
</script>

<style lang="scss">
	.message {
		padding: 13rpx 20rpx;
		box-sizing: border-box;
		width: 100vw;
		position: relative;
		.goods-item{
			width:100%;
			height: 220rpx;
			background: #ffffff;
			position: relative;
			display: flex;
			align-items: center;
			border-radius: 20rpx;
			margin: 0 auto;
			padding: $ns-padding;
			box-sizing: border-box;
			image{
				width: 180rpx;
				height: 180rpx;
			}
			.goods-info{
				width: 100%;
				height: 180rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-left: 20rpx;
				box-sizing: border-box;
				.goods-name{
					width: 100%;
					line-height: 1.4;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: $ns-font-size-base;
					margin-bottom: 10rpx;
				}
				.goods-bottom{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					text{
						line-height: 1;
					}
					.goods-price{
						display: flex;
						align-items: flex-end;
						padding-bottom: 10rpx;
						.goods-price-sign{
							font-size: 20rpx;
						}
					}
					.goods-option{
						width: 150rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						border-radius: 50rpx;
						color: #ffffff;
					}
				}
			}
			.disabled{
				background: #e5e5e5;
			}
		}
	}
</style>
