<template>
	<view class="container">
		<view class="exchange-box">
			<view class="coin little-line">
				<view class="base item" @click="changeCoin()">
					<!-- <image :src="exItem.baseCoinIcon" class="coinLogo"></image> -->
					<!-- <text class="name">{{exItem.base}}</text>
					<image src="../../static/otc/tri.png" class="tri"></image> -->
					<picker @change="bindPickerChange" :value="index_qian" :range="array_qian">
						<text class="uni-input">{{array_qian[index_qian]}}</text>
						<image src="../../static/otc/tri.png" class="tri"></image>
					</picker>
				</view>
				<view class="quote item" @click="changeCoin()">
					<!-- <image :src="exItem.quoteCoinIcon" class="coinLogo"></image>
					<text class="name">{{exItem.quote}}</text>
					<image src="../../static/otc/tri.png" class="tri"></image> -->
					<picker @change="bindPickerChange_mm" :value="index_hou" :range="array_hou">
						<text class="uni-input">{{array_hou[index_hou]}}</text>
						<image src="../../static/otc/tri.png" class="tri"></image>
					</picker>
				</view>
				<view @click="transform" class="transform"><image src="../../static/otc/exc.png" class="exc"></image></view>
			</view>
			<view class="amount little-line">
				<input type="number" v-model="form.amount" placeholder="转出数量" class="out"/>
				<input type="number" v-model="inAmount" placeholder="收到数量" class="in"/>
			</view>
			<view class="params">
				<view class="rate">余额: {{exItem.money || 0}}</view><!-- {{exItem.base}} -->
				<view class="fee">手续费:{{exItem.bl * 100}}%</view>
			</view>
			<!-- <view class="rate-amount">汇率: 1{{exItem.base}} = {{1 * exItem.scale}}{{exItem.quote}}</view> -->
		</view>
		<button type="primary" @click="submit" class="btn">闪电兑换</button>
		
		
		<view class="record" style="padding-top:20upx;">
			<!-- <view class="tip">兑换记录</view> -->
			<view class="title">
				<view class="col">兑出资产/兑入资产</view>
				<view class="col r">手续费/时间</view>
			</view>
			<scroll-view style="background-color: #FFFFFF;" class="uni-list" :enableBackToTop="enableBackToTop" :scroll-y="scrollY" @scrolltolower="loadMore">
				<empty text="暂无数据" mode="data" :show="empty" img-width="140"></empty>
				<view class="uni-row little-line" v-for="(item, i) in records" :key="item.id">
					<view class="col">
						<!-- {{item.baseAmount}} {{item.base}} / {{item.quoteAmount}} {{item.quote}} -->
						{{item.baseAmount}} {{item.base}} / {{item.quoteAmount}} {{item.quote}}
					 </view>
					<!-- <view class="col r">{{item.fee}} {{item.quote}} / {{item.ctime | moment('HH:mm MM/DD')}}</view> -->
					<view class="col r">{{item.account_data}} / {{item.create_time | moment('HH:mm MM/DD')}}</view>
				</view>
				<uni-load-more v-if="!empty" :status="loadingStatus"></uni-load-more>
			</scroll-view>
		</view>
		<!-- <uni-popup ref="popup" type="bottom">
			<view class="coin-box">
				<view class="coin-search">
					<uni-search-bar placeholder="搜索 token" @input="search"></uni-search-bar>
				</view>
				<view class="item-wrapper">
					<empty text="暂无数据" mode="data" :show="coinEmpty" img-width="140"></empty>
					<view class="coin-item little-line" @click="select(item)" v-for="(item, i) in coinList" :key="item.id">
						<view class="col">
							<image :src="item.baseCoinIcon"/>
							<text>{{item.base}}</text>
						</view>
						<view class="col">
							<image :src="item.quoteCoinIcon"/>
							<text>{{item.quote}}</text>
						</view>
					</view>
				</view>
			</view>
		</uni-popup> -->
		
		<uni-valid-popup ref="validPopup" @ok="ok"></uni-valid-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import {uniIcons, uniPopup, uniSearchBar} from '@dcloudio/uni-ui'
	import uniList from '@/components/uni-list.vue';
	import uniCell from '@/components/uni-cell.vue';
	import uniRefresh from '@/components/uni-refresh.vue';
	import empty from '../../components/empty.vue'
	import uniValidPopup from '@/components/uni-valid-popup.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {authMixin, commonMixin} from '@/common/mixin/mixin.js'
	export default {
		components: {uniIcons, uniPopup, uniSearchBar, empty, uniList, uniCell, uniRefresh, uniLoadMore, uniValidPopup},
		mixins: [authMixin, commonMixin],
		data() {
			return {
				index_qian:0,
				index_hou:0,
				array_qian:['mycn','mall'],
				array_hou:['mm'],
				bottom: 0,
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				coinEmpty: false,
				scrollY: true,
				enableBackToTop: true,
				indicatorStyle: 'height:90upx; line-height:90upx;',
				coinCacheList: [],
				coinList: [],
				exItem: {
					baseCoinIcon:'baseCoinIcon',
					base:'base',
					quoteCoinIcon:'quoteCoinIcon',
					quote:100,
					ctime:'10:00',
					fee:1,
					base:10,
					scale:10,
				},
				account: {},
				inAmount: undefined,
				form:{
					id: undefined,
					amount: undefined,
					from: undefined,
					to: undefined,
					capitalPasswd: undefined
				},
				query: {
					page: 1,
					limit: 10
				},
				totalCount: 0,
				// records: [{
				// 	id:1,
				// 	baseCoinIcon:'baseCoinIcon',
				// 	base:'base',
				// 	quoteCoinIcon:'quoteCoinIcon',
				// 	quote:100,
				// 	ctime:'10:00',
				// 	fee:1,
				// 	base:10,
				// 	scale:10,
				// },{
				// 	id:2,
				// 	baseCoinIcon:'baseCoinIcon',
				// 	base:'base',
				// 	quoteCoinIcon:'quoteCoinIcon',
				// 	quote:100,
				// 	ctime:'10:00',
				// 	fee:1,
				// 	base:10,
				// 	scale:10,
				// }],
				records:'',
				loadingStatus: 'more',
				isLastPage: false
			};
		},
		watch: {
		    'form.amount'(newValue, oldValue) {
				if(newValue){
					this.inAmount = parseFloat(newValue * this.exItem.sxf * this.exItem.bl)
				} else {
					this.inAmount = undefined
				}
		    }
		},
		onShow() {
			// this.loadData();
		},
		onLoad(){
			var type = this.array_qian[0]
			this.sendRequest_list(type)
			this.sendRequest_moey(type)
		},
		methods: {
			...mapActions('exchange', ['exchangeList', 'addExchange', 'exchangeRecordList']),
			...mapActions('account', ['getAccount']),
			// 获取币数量信息
			bindPickerChange_mm: function(e) {
				this.index_hou = Number(e.target.value)
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.form.amount = undefined
				this.inAmount = undefined
				this.index_qian = Number(e.target.value)
				
				this.records=''
				var type = this.array_qian[this.index_qian]
				this.sendRequest_moey(type)
				this.sendRequest_list(type)
			},
			async sendRequest_list(type){
				let res = await this.$api.sendRequest({
					url: '/api/Exchange/getBalanceDetail?account_type'+type,
					async: false
				});
				console.log(res,1313)
				this.records = res.data.list
			},
			async sendRequest_moey(type) {
				var that = this
				let res = await this.$api.sendRequest({
					url: '/api/exchange/getBalance',
					async: false
				});
				console.log(res,1212)
				if(type == 'mycn'){
					that.exItem = res.data.mycn
				}else if(type == 'mall'){
					that.exItem = res.data.mall
				}
				
				// that.memberInfo_news.mm = res.data.balance.money
				// that.memberInfo_news.mycn = res.data.mycn.money
				// that.memberInfo_news.mall = res.data.mall.money
			},
			submit(){
				if(!this.loginInfo.isCapitalPasswd){
					uni.showModal({
					    title: '提示',
					    content: '请设置资金密码',
						confirmText: '设置',
						cancelText: '取消',
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({
					            	url: '/pages/user/updatePayPwd'
					            })
					        }
					    }
					});
					return
				}
				if(!this.form.amount){
					this.$api.msg('请输入兑换数量')
					return;
				}
				this.$refs.validPopup.open('capitalPasswd')
				
			},
			ok(data){
				if(!data.code){
					this.$api.msg('请输入资金密码')
					return;
				}
				this.form.id = this.exItem.id
				this.form.from = this.exItem.base
				this.form.to = this.exItem.quote
				this.form.capitalPasswd = data.code
				this.addExchange(this.form).then(res =>{
					this.records = [];
					this.query.page = 1
					this.getExchangeRecordList()
					this.$refs.popup.close()
					this.$refs.validPopup.close()
					this.resetAmount()
					this.$api.msg('兑换成功')
				}).catch(error => {
					this.$refs.validPopup.enable()
				})
			},
			changeCoin(){
				this.$refs.popup.open()
			},
			getExchangeRecordList(){
				this.exchangeRecordList(this.query).then(res =>{
					this.empty = res.total <= 0
					this.isLastPage = (this.query.page == res.pages)
					if(this.isLastPage){
						this.loadingStatus = 'noMore'
					} else {
						this.loadingStatus = 'more'
					}
					if(this.empty){
						this.records = [];
					} else {
						this.records = this.records.concat(res.rows)
					}
				})
			},
			transform(){
				let list = this.coinList
				let item = null
				for(let i = 0; i < list.length; i++){
					if(list[i].base == this.exItem.quote && list[i].quote == this.exItem.base){
						item = list[i]
						break
					}
				}
				if(item == null){
					this.$api.msg('该交易对不能互转')
					return
				}
				this.exItem = item
				this.loadAccount(this.exItem.base)
				this.resetAmount()
			},
			select(symbol){
				this.exItem = symbol
				this.loadAccount(this.exItem.base)
				this.getExchangeRecordList()
				this.resetAmount()
				this.$refs.popup.close()
			},
			loadMore(){
				if(!this.isLastPage){
					this.loadingStatus = 'loading'
					this.query.page += 1
					this.getExchangeRecordList()
				}
			},
			//请求数据
			async loadData(){
				this.exchangeList().then(res =>{
					this.coinList = res.data
					this.coinCacheList = res.data
					this.exItem = this.coinList[0]
					this.loadAccount(this.exItem.base)
				})
				this.getExchangeRecordList()
			},
			async loadAccount(coin){
				this.getAccount(coin).then(res =>{
					this.account = res.data
				})
			},
			resetAmount(){
				this.form.amount = undefined
				this.inAmount = undefined
			},
			search(data){
				if(data.value){
					let newList = []
					let list = this.coinCacheList
					let v = data.value.toLowerCase()
					for(let i = 0; i < list.length; i++){
						let base = list[i].base.toLowerCase()
						let quote = list[i].quote.toLowerCase()
						if(base.indexOf(v) >= 0 || quote.indexOf(v) >= 0){
							newList.push(list[i])
						}
					}
					if(newList == undefined || newList.length <= 0){
						this.coinEmpty = true
					} else {
						this.coinEmpty = false
					}
					this.coinList = newList
				} else {
					this.coinEmpty = false
					this.coinList = this.coinCacheList
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	
	page{
		background-color: #FFFFFF;
		overflow: hidden;
	}
	view{
		line-height: 1 !important;
	}
	.container{
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: 1;
	}
	.coin-box{
		background: #ffffff;
		.item-wrapper{
			height: 500upx;
			overflow: auto;
		}
		.coin-item{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			height: 90upx;
			line-height: 90upx;
			padding: 0 20upx;
			.col{
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			image{
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				border: 1upx solid $font-color-disabled;
				margin-right: 10upx;
			}
		}
	}
	.record{
		background: #ffffff;
		flex: 1;
		.tip{
			font-weight: bold;
			font-size:  $font-md;
			padding-left: 20upx;
		}
		.r{
			text-align: right;
		}
		.title{
			display: flex;
			flex-direction: row;
			padding: 20upx 20upx;
			/* z-index: 9999999; */
			.col{
				flex: 1;
				font-size: $font-base;
				color: $font-color-light;
			}
		}
		.uni-list{
			flex: 1;
			display: flex;
			position: absolute;
			top: 570upx;
			bottom: 0upx;
			flex-direction: column;
			.uni-row{
				display: flex;
				flex-direction: row;
				margin: 0upx 20upx;
				height: 80upx;
				line-height: 80upx;
				.col{
					flex: 1;
					font-size: $font-base;
				}
			}
		}
	}
	.btn{
		margin: 20upx 20upx;
	}
	.exchange-box{
		background: #ffffff;
		border-radius: 10upx;
		.params{
			display: flex;
			padding: 20upx 30upx 10upx 30upx;
			font-size: $font-base;
			view{
				flex: 1;
			}
			.fee{
				text-align: right;
			}
		}
		.rate-amount{
			padding: 0upx 30upx 30upx 30upx;
			font-size: $font-base;
		}
		.amount{
			display: flex;
			height: 120upx;
			line-height: 120upx;
			padding-top: 40upx;
			padding-left: 30upx;
			padding-right: 30upx;
			.out{
				width: 50%;
				font-size: $font-base;
			}
			.in{
				width: 50%;
				text-align: right;
				font-size: $font-base;
			}
		}
		.coin{
			position: relative;
			display: flex;
			height: 120upx;
			line-height: 120upx;
			.transform{
				width: 68upx;
				height: 68upx;
				position: absolute;
				left: 50%;
				top: 110upx;
				transform: translate(-50%, -50%);
				background: #ffffff;
				z-index: 99;
			}
			.exc{
				width: 68upx;
				height: 68upx;
			}
			.item{
				flex: 1;
				text-align: center;
				.name{
					font-weight: 500;
				}
			}
			.coinLogo {
			    width: 42upx;
				height: 42upx;
			    margin-right: 8px;
			    display: inline-block;
			    vertical-align: middle;
			}
			text{
				padding-top: 12upx;
			    vertical-align: middle;
			}
			.tri{
				width: 32upx;
				height: 32upx;
			    display: inline-block;
			    vertical-align: middle;
				margin-left: 8upx;
			}
		}
	}
	
	
</style>
