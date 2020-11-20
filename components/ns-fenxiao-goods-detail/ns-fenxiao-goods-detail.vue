<template>
	<view class="wrap-box" v-if="showFenxiao!=0 && levelInfo.words_account ">
		<view class="wrap">
			<view class="title ns-text-color">{{levelInfo.words_account}}详情</view>
			<view class="commission-ratio">
				<view class="item">
					<view>一级{{levelInfo.words_account}}</view>
					<view class="ns-text-color">￥{{levelInfo.commission_money}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ns-fenxiao-good-detail',
		props: {
			skuId: {
				type: [Number,String],
				default: 0
			}
		},
		data() {
			return {
				isIphoneX: false,
				//是否开启预览，0：不开启，1：开启
				preview: 0,
				showFenxiao: 0, //判断是否开启分销
				fenXiaoLevel: 0,
				levelId:0,
				levelInfo:{},
				token:""
			};
		},
		async created() {
			if(!uni.getStorageSync("token")) return;
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			await this.getAddonisexit()	
			if(this.showFenxiao!=0){
				this.getFenxiaoGoodsDetail()
			}
		},
		methods: {
			//判断是否有分销插件
			async getAddonisexit() {
				let res = await this.$api.sendRequest({
					url: '/api/addon/addonisexit',
					async: false,
					success: res => {}
				});
				if (res.code == 0 && res.data) {
					this.showFenxiao = res.data.fenxiao;
				}
			},
			//请求佣金详情
			getFenxiaoGoodsDetail() {
				this.$api.sendRequest({
					url: '/fenxiao/api/goods/detail',
					data:{
						sku_id:this.skuId,
					},
					success: res => {
						if(res.code==0&&res.data){
							this.levelInfo=res.data
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.wrap {
		background-color: #fff;
		padding: $ns-padding;
		box-sizing: border-box;
		margin: 20rpx 0;

		.title {
			font-weight: 600;
			font-size:  $ns-font-size-base;
		}

		.commission-ratio {
			margin-top: 10rpx;
			padding: 0 24rpx;
			border: 1px solid #f5f5f5;
			border-radius: $ns-border-radius;

			.item {
				display: flex;
				border-bottom: 1px solid #eee;
				height: 80rpx;
				align-items: center;

				&:last-child {
					border-bottom: none;
				}

				view {
					flex: 1;

					&:first-child {}

					&:last-child {
						text-align: right;
					}
				}
			}
		}
	}
</style>
