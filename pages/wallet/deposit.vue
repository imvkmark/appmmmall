<template>
	<view class="container">
		<!-- 列表 -->
		<view class="coin-section m-t">
			<picker @change="bindPickerChange" :value="index" :range="array">
				<view class="s-row">
					<view class="col">
						<image :src="coin.icon" class="coinLogo"></image>
						<!-- <text class="coin">{{coin.symbol}}</text> -->
						<text class="coin">
							<!-- <picker @change="bindPickerChange" :value="index" :range="array"> -->
								<view class="uni-input">{{array[index]}}</view>
							<!-- </picker> -->
						</text>
					</view>
					<view class="col r light"><!-- @click="navTo('/pages/public/coinList')" -->
						<text class="subtitle">选择币种</text>
						<uni-icons type="forward" size="20" class="arrow"></uni-icons>
					</view>
				</view>
			</picker>
			
			<view class="s-row qrcode">
				<!-- <tki-qrcode ref="qrcode" :size="400" :onval="true" cid="qrcode" :val="qrcode.val" /> -->
				<image :src="qrcode.val" style="width:400upx;height:400upx;"></image>
				<view class="save" @click="save">保存二维码到相册</view>
				<text class="title">充币地址</text>
				<text class="address">{{deposit.address}}</text>
				<view class="copy" @click="paste">复制</view>
			</view>
			<!-- <view class="desc" v-html="tips[1] ? tips[1].content : ''"></view> -->
			<view class="desc" v-html="tips.content ? tips.content : ''"></view>
		</view>
	</view>
</template>
<script>
	import { mapState, mapActions } from 'vuex'
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import {uniIcons} from '@dcloudio/uni-ui'
	import {commonMixin, authMixin} from '@/common/mixin/mixin.js'
	export default {
		components: {tkiQrcode, uniIcons},
		mixins: [commonMixin, authMixin],
		data() {
			return {
				coin: {
					symbol:'symbol',
					icon:'../../static/otc/exc.png'
				},
				account: {},
				coins: [],
				tips: {
					content:'<h1 style="padding:10px">标题1</h1>'
				},
				deposit: {
					address:'地址'
				},
				qrcode: {
					val: '../../static/otc/empty.jpg'
				},
				array: ['USDT', 'ETC', 'O2O', 'CV'],
				index: 0,
			};
		},
		onUnload(){
			uni.$off('selectCoin', this.selectCoin)
		},
		onLoad(){
			// uni.$on('selectCoin', this.selectCoin)
			// this.coinList().then(res =>{
			// 	this.coins = res.data
			// 	this.coin = res.data[0]
			// 	this.loadData()
			// })
		},
		methods: {
			...mapActions('common', ['coinList', 'coinTips']),
			...mapActions('user', ['depositAddress']),
			async loadData(){
				this.depositAddress(this.coin.symbol).then(res =>{
					this.deposit = res.data
					this.qrcode.val = res.data.address
					this.$refs.qrcode._makeCode()
				})
				this.coinTips(this.coin.symbol).then(res =>{
					this.tips = res.data
				})
			},
			selectCoin(data){
				for(let i = 0; i < this.coins.length; i++){
					let item = this.coins[i]
					if(item.symbol === data.coin.item.name){
						this.coin = item;
						break;
					}
				}
				this.loadData()
			},
			save(){
				// this.$refs.qrcode._saveCode()
				// #ifdef MP || APP-PLUS
				uni.saveImageToPhotosAlbum({
					// filePath: config.url+'/'+this.poster,
					filePath: this.coin.icon,
					success: function () {
						uni.showToast({
							title: '下载成功'
						});
					},fail() {
						uni.showToast({
							title: '下载失败',
							icon:'none'
						});
					}
				});
				// #endif
			},
			paste() {
				let $this = this
				uni.setClipboardData({
				    data: this.deposit.address,
				    success: function () {
				        // $this.$api.msg('复制成功')
						uni.showToast({
							title:'复制成功'
						})
				    }
				});
			},
			bindPickerChange: function(e) {
				this.index = e.target.value
			}
		}
	}
</script>

<style lang='scss' scoped>
	page{
		background-color:#FFFFFF;
	}
	.container{
		padding: 20upx 20upx;
	}
	.coin-section{
		background: #fff;
		.s-row{
			background-color: $uni-color-subbg;
			display:flex;
			align-items:center;
			padding: 20upx 30upx 20upx 30upx;
			.col{
				font-size: $font-lg;
				color: $font-color-dark;
				flex:1;
				.coin{
					font-weight: 400;
					vertical-align: middle;
				}
				.subtitle{
					font-size: $font-sm;
					font-weight: 400;
				}
			}
			.coinLogo {
			    width: 46upx;
				height: 46upx;
			    margin-right: 8px;
			    display: inline-block;
			    vertical-align: middle;
			    float: left;
			}
			.light{
				font-weight: 100;
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.r{
				text-align: right;
			}
			.arrow{
				vertical-align: middle;
			}
		}
		.qrcode{
			margin-top: 30upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			padding: 50upx 0upx;
			.img{
				width: 380upx;
				height: 380upx;
			}
			.save{
				width: 350upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				font-size: $font-base;
				color: #256AC2;
				background-color: #E9F0F8;
				border: 1px solid #BDD5E8;
				margin: 20upx 0;
			}
			.title{
				color: $font-color-light;
				font-size: $font-sm;
				margin: 20upx 0;
			}
			.address{
				display: block;
				width: 580upx;
				word-wrap: break-word;
				font-size: $font-base;
				text-align: center;
			}
			.copy{
				margin: 30upx 0 0 0;
				background-color: #E7EBEE;
				padding: 10upx 30upx;
				font-size: $font-base;
				color: $font-color-light;
			}
		}
		.desc{
			margin-top: 30upx;
			margin-bottom: 20upx;
			font-size: $font-base;
			color: $font-color-light;
			display: flex;
			flex-direction: column;
		}
	}
	
	
</style>
