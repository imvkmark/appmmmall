<template>
	<view class="container">
		<view class="total-box">
			<view class="title">总资产折合(USDT)</view>
			<view class="asset">
				<text class="amount">{{data.totalUsdAmount | fixed(2)}}</text>
				<text class="cny">≈￥{{data.totalCnyAmount | fixed(2)}}</text>
			</view>
			<view class="operat">
				<view class="btn" @click="navTo('/pages/wallet/deposit')">充币</view>
				<!-- <view class="btn" @click="navTo('/pages/wallet/withdraw')">提币</view> -->
				<view class="btn" @click="navTo('/pages/exchange/index')">兑换</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="coin-section m-t">
			<view v-for="(item, i) in data.list" :key="item.symbol" class="block little-line" @click="navTo('/pages/wallet/detail', true)">
				<view class="s-row">
					<view class="col">
						<image :src="item.icon" class="coinLogo"></image>
						<text class="coin">{{item.symbol}}</text>
					</view>
					<view class="col r light">
						<uni-icons type="forward" size="20" class="gt"></uni-icons>
					</view>
				</view>
				<view class="s-row">
					<view class="col subtitle row-title">可用</view>
					<view class="col subtitle row-title">冻结</view>
					<view class="col r subtitle row-title">折合(CNY)</view>
				</view>
				<view class="s-row">
					<view class="col subtitle row-amount">{{item.normalBalance | fixed(item.showPrecision)}}</view>
					<view class="col subtitle row-amount">{{item.frozenBalance | fixed(item.showPrecision)}}</view>
					<view class="col r subtitle row-amount">{{item.priceCny | fixed(2)}}</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import {uniIcons} from '@dcloudio/uni-ui'
	import {authMixin, commonMixin} from '@/common/mixin/mixin.js'
	export default {
		components: {uniIcons},
		mixins: [authMixin, commonMixin],
		data() {
			return {
				data: {
					list: [{
						icon:'../../static/otc/empty.jpg',
						symbol:'symbol',
						normalBalance:1,
						frozenBalance:10,
						priceCny:10,
					}],
					totalUsdAmount: 0,
					totalCnyAmount: 0
				}
			};
		},
		onShow(){
			if(this.loginInfo.hasLogin){
				this.loadData();
			}
		},
		onPullDownRefresh() {
			this.loadData();
		},
		methods: {
			...mapActions('account', ['accountList']),
			//请求数据
			async loadData(){
				this.accountList().then(res =>{
					this.data = res.data
					uni.stopPullDownRefresh();
				}).catch(error =>{
					
				})
			},
			navTo(e){
				uni.navigateTo({
					url:e
				})
			}
			
		}
	}
</script>

<style lang='scss' scoped>
	.container{
		padding: 0upx 0upx;
	}
	.total-box{
		background: #0AA3EE;
		font-size: $font-base;
		padding: 50upx 60upx 40upx 60upx;
		color: $font-color-light;
		.title{
			padding-bottom: 10upx;
			color: #FFFFFF;
		}
		.amount{
			font-size: $font-xxl;
			font-weight: 100upx;
			color: #ffffff;
		}
		.cny{
			padding-left: 20upx;
			color: #FFFFFF;
		}
		.operat{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: middle;
			padding-top: 20upx;
			.btn{
				text-align: center;
				flex: 0 0 45%;
				height: 60upx;
				line-height: 60upx;
				color: #ffffff;
				background-color: rgba(255,255,255,0.2);
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
	
	
</style>
