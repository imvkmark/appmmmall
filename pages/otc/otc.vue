<template>
	<view>
		<view class="header">
			<view class="side">
				<view class="navbar">
					<view class="nav-item" :class="{current: sideIndex === 0}" @click="sideTabClick('BUY', 0)">我要买</view>
					<view class="nav-item" :class="{current: sideIndex === 1}" @click="sideTabClick('SELL', 1)">我要卖</view>
				</view>
				<view class="menu">
					<image src="../../static/otc/icon-filter.png" @click="filter"></image>
					<image src="../../static/otc/icon-order.png" @click="redirectToLink('/pages/otc/order/list', true)"></image>
				</view>
			</view>
			<view class="coinNavbar">
				<view 
					v-for="(item, index) in fiatCoins" :key="index" 
					class="nav-item" 
					:class="{current: coinIndex === index}"
					@click="coinTabClick(index)"
				>
					{{item}}
				</view>
			</view>
		</view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" :auto="false" top="180" @down="downCallback" @up="upCallback">
			<!-- 分页的数据列表 -->
			<view v-for="(item, i) in list" :key="item.id">
				<otc-list-item :data.sync="item"></otc-list-item>
			</view>
		</mescroll-body>
		
		<!-- 弹出层start -->
		<uni-popup ref="popup" type="bottom">
			<view class="wrapper">
				<view class="filter">
				    <view class="filter-title">金额</view>
					<view><input type="number" v-model="form_popup.price" class="filter-price" placeholder="系统会为您筛选包含目标金额的商品"/></view>
					<view class="filter-title" style="margin-top:40upx;">支付方式</view>
					<view class="filter-pay">
						<text class="filter-pay-item" :class="{'filter-active': form_popup.payment == undefined}" @click="changePay(undefined)">全部</text>
						<text class="filter-pay-item" :class="{'filter-active': form_popup.payment == 'UnionPay'}" @click="changePay('UnionPay')">银行卡</text>
						<text class="filter-pay-item" :class="{'filter-active': form_popup.payment == 'Alipay'}" @click="changePay('Alipay')">支付宝</text>
						<text class="filter-pay-item" :class="{'filter-active': form_popup.payment == 'Wechat'}" @click="changePay('Wechat')">微信</text>
					</view>
					<!-- <text class="filter-title">法币</text>
					<view class="filter-pay">
						<text class="filter-pay-item filter-active">人民币(CNY)</text>
						<text class="filter-pay-item">美元(USD)</text>
						<text class="filter-pay-item">港元(HKD)</text>
					</view> -->
				</view>
				<button @click="clickitem" class="btn-wrapper"><text style="color: #fff;font-size: 32upx;text-align: center;">筛选</text></button>
			</view>
		</uni-popup>
		<!-- 弹出层end -->
	</view>
</template>

<script>
	import otcListItem from './components/otc-list-item.vue'
	import MescrollBody from "@/components/mescroll/mescroll-body.vue";
	import MescrollMixin from "@/components/mescroll/mescroll-mixins.js";
	import { mapState, mapActions } from 'vuex'
	import {commonMixin} from '@/common/mixin/mixin.js'
	import uniPopup from '@/components/uni-popup.vue'
	export default {
		mixins: [MescrollMixin, commonMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			MescrollBody,
			otcListItem,
			uniPopup
		},
		data() {
			return {
				// 弹出层start
				form_popup: {
					price: undefined,
					payment: undefined
				},
				// 弹出层end
				
				
				sideIndex: 0,
				coinIndex: 0,
				fiatCoins: ['MM币'],
				form:{
					side: 'BUY',
					coin: undefined,
					paycoin: undefined,
					payment: undefined
				},
				page:{
					page: 1,
					limit: 10,
					side: 'BUY',
					coin: undefined,
					paycoin: undefined,
					payment: undefined
				},
				data_request:{
					page:1,
					page_size:'',
					account_type:'',
					from_type:'',
					start_date:'',
					end_date:''
				},
				list: [{
					nickname:'名字',
					volume:1000,
					dealVolume:100,
					minTrade:100,
					maxTrade:10000,
					price:10,
					payment:'qqq',
					side:'BUY'
				},{
					nickname:'名字',
					volume:1000,
					dealVolume:100,
					minTrade:100,
					maxTrade:10000,
					price:10,
					payment:'qqq',
					side:'BUY'
				}], // 数据列表
				downOption:{
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto: false, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					empty:{
						tip: '~ 空空如也 ~'
					}
				},
				
				list_new:''
			}
		},
		onLoad() {
			// /index/user/advAll
			this.getData()
			// this.fiatList().then(res =>{
			// 	this.fiatCoins = res.data
			// 	this.page.coin = this.fiatCoins[0]
			// 	this.mescroll.resetUpScroll()
			// }).catch(error =>{
			// })
		},
		onShow(){
			// uni.$on("refresh", (res) => {
			// 	this.mescroll.resetUpScroll()
			// })
			// uni.$on("filter", (res) => {
			// 	this.page.price = res.price
			// 	this.page.payment = res.payment
			// 	this.mescroll.resetUpScroll()
			// })
			// this.$fire.$emit('refreshCoin')
		},
		onUnload() {
			uni.$off("refresh", (res) => {})
			uni.$off("filter", (res) => {})
		},
		methods: {
			...mapActions('common', ['fiatList']),
			...mapActions('otc', ['advertList']),
			mescrollInit(){
				console.log('mescrollInit')
			},
			async getData(){
				let res = await this.$api.sendRequest({
					url: '/api/user/advAll',
					async: false
				});
				console.log(res,666)
				this.list = res.data.list
			},
			/*下拉刷新的回调 */
			downCallback() {
				console.log(222222222)
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				// this.mescroll.resetUpScroll()
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				console.log('upCallback')
				console.log(page.num)
				if(page.num <= 1){
					 this.list = [];
				}
				let $this = this
				this.page.page = page.num
				console.log(this.page.page)
				this.advertList(this.page).then(res =>{
					console.log(this.page, res.rows);
					$this.mescroll.endSuccess(res.rows.length)
					if(res.total == 0){
						$this.list = [];
					} else {
						$this.list = $this.list.concat(res.rows)
					}
				}).catch(error =>{
					this.mescroll.endErr()
				})
			},
			//顶部tab点击
			sideTabClick(side, index){
				this.sideIndex = index
				this.page.side = side
				// this.mescroll.resetUpScroll()
			},
			//顶部tab点击
			coinTabClick(index){
				this.coinIndex = index;
				this.page.coin = this.fiatCoins[index]
				// this.mescroll.resetUpScroll()
			},
			filter(){
				// uni.getSubNVueById('otcFilterDrawer').show('slide-in-right', 200);
				this.open()
			},
			redirectToLink(url) {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open(url);
				} else {
					this.$util.redirectTo(url);
				}
			},
			// 获取会员基础信息
			async getMemberInfo() {
				let res = await this.$api.sendRequest({
					url: '/api/member/info',
					async: false
				});
				if (res.code >= 0 && res.data) {
					this.token = uni.getStorageSync('token');
					this.memberInfo = res.data;
					uni.setStorageSync('userInfo', this.memberInfo);
				} else {
					this.token = '';
					this.initInfo();
					uni.removeStorageSync('token');
				}
				uni.stopPullDownRefresh();
			},
			open(){
				this.$refs.popup.open()
			},
			
			// 弹窗层strat
			// hideDrawer() {
			//     uni.getCurrentSubNVue().hide('auto')
			// },
			clickitem() {
				console.log(this.form_popup)
				// uni.$emit('filter', this.form_popup);
				// this.hideDrawer()
			},
			changePay(v){
				this.form_popup.payment = v
			}
			// 弹窗层end
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #FFFFFF;
	}
	image{width: 100%;vertical-align: bottom;will-change: transform}
	.header{
		z-index: 9900;
		position: fixed;
		top: --window-top;
		left: 0;
		height: 180upx;
		background: #ffffff;
		width: 100%;
	}
	.navbar{
		display: flex;
		height: 40px;
		background: #fff;
		position: relative;
		margin: 0 30upx 20upx 30upx;
		padding-bottom: 30upx;
		.nav-item{
			height: 100%;
			font-size: 30upx;
			color: $font-color-light;
			margin-right: 15px;
			display:flex;
			align-items:flex-end;
			&.current{
				color: $font-color-dark;
				font-size: 40upx;
				font-weight: bold;
			}
		}
	}
	.side{
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		.menu{
			image {
				width: 20px;
				height: 20px;
				margin: 0upx 30upx 0upx 10upx;
			}
		}
	}
	.coinNavbar{
		display: flex;
		height: 30px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		overflow-x: scroll;
		padding-left: 30upx;
		padding-right: 30upx;
		.nav-item{
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			margin-right: 15px;
			position: relative;
			&.current{
				color: $uni-color-blue;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 100%;
					height: 0;
					border-bottom: 2px solid $uni-color-blue;
				}
			}
		}
	}
	// 弹窗样式start
	.wrapper {
		// flex-direction: column;
		// flex: 1;
		background-color: #FFFFFF;
		height:600upx;
	}
	.filter{
		padding: 60upx 20upx 10upx 20upx;
	}
	.filter-title{
		font-size: $font-lg;
		// padding-top: 40upx;
		padding-bottom: 10upx;
	}
	.filter-price{
		border-width:1rpx;  
		border-color:$border-color-dark;  
		border-style:solid;
		height: 40px;
		line-height: 40px;
		font-size: $font-sm;
		padding-left: 20upx;
	}
	.filter-pay{
		// flex: 1;
		// flex-direction: row;
		// justify-content: space-between;
		// flex-wrap: wrap;
	}
	.filter-pay-item{
		width: 200upx;
		height: 70upx;
		line-height: 70upx;
		font-size: $font-sm;
		text-align: center;
		margin-top: 10upx;
		margin-bottom: 10upx;
		background-color: $border-color-base;
		padding: 20upx 40upx;
		margin-right:35upx;
	}
	.filter-active{
		border-width: 2rpx;
		border-color: $font-color-blue;  
		border-style: solid;
		color: $font-color-blue;
	}
	.btn-wrapper{
		position: absolute;
		width: 100%;
		bottom: 0px;
		left: 0px;
		right: 0px;
		height: 90upx;
		line-height: 90upx;
		background-color: $uni-color-blue;
		color: #ffffff;
		text-align: center;
		border-radius: 0;
		border-width: 0;
		margin: 0 !important;
	}
	// 弹窗样式end
</style>
