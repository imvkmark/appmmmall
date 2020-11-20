<template>
	<view class="container">
		<view class="head-wrapper" v-if="order.status == 1">
			<view class="status">
				<view class="s">
					<text class="iconfont s0"></text>
					<text class="v">請付款</text>
				</view>
				<view style="color: #FFFFFF;">請係<text class="t">{{ order.cancel_time_str }}</text>內付款卑賣家</view>
			</view>
			<view class="concat" @click="go()">
				<text class="iconfont icon-telephone" ></text>
				<view style="color: #FFFFFF;">Call Me</view>
			</view>
		</view>
		<view class="head-wrapper" v-if="order.status == 2">
			<view class="status">
				<view class="s">
					<text class="iconfont s0"></text>
					<text class="v">已支付</text>
				</view>
				<view style="color: #FFFFFF;">等待賣家放幣，可自行聯繫賣家</view>
			</view>
			<view class="concat" @click="go()">
				<text class="iconfont icon-telephone"></text>
				<view style="color: #FFFFFF;">Call Me</view>
			</view>
		</view>
		<view class="head-wrapper" v-if="order.status == 3">
			<view class="status">
				<view class="s">
					<text class="iconfont s0"></text>
					<text class="v">已完成</text>
				</view>

			</view>
			<view class="concat" @click="go()">
				<text class="iconfont icon-telephone"></text>
				<view style="color: #FFFFFF;">Call Me</view>
			</view>
		</view>
		<view class="head-wrapper" v-if="order.status == 4">
			<view class="status">
				<view class="s">
					<text class="iconfont s0"></text>
					<text class="v">已取消</text>
				</view>

			</view>
			<view class="concat" @click="go()">
				<text class="iconfont icon-telephone" style="color: #FFFFFF;"></text>
				<view style="color: #FFFFFF;">Call Me</view>
			</view>
		</view>
		<view class="amount-wrapper" v-if="order.status == 1">
			<text class="total">￥{{ order.money }}</text><!-- {{cartList.money}} -->
			<view class="info">
				<view class="price">
					<view><text class="label">單價</text><text class="num">￥{{ order.price }}</text></view><!-- {{cartList.price}} -->
					<view><text class="label">數量</text><text class="num">{{ order.num }} SV</text></view>
				</view>
				<!-- <view class="coin">
					<image src="https://s1.bqiapp.com/coin/20181030_72_webp/bitcoin_200_200.webp?v=67" class="coinLogo"></image>
					<view>SV</view>
				</view> -->
			</view>
		</view>
		<view class="line"></view>
		<view class="secrity-tip little-line" style="color: red;" v-if="order.status == 1">請使用實名認證嘎身份信息向以下賬戶自行轉賬</view>
		<!-- 列表 -->
		<view class="transfer-info">
			<view class="list">
				<view class="item little-line" v-if="order.status == 1">
					<view class="left">{{fangshi}}</view>
					<view class="right"><text class="change" @tap="actionSheetTap">切換支付方式</text></view>
				</view>
				<view v-if="order.status == 4">
					<view class="item little-line">
						<view class="left">總金額</view>
						<view class="right">{{order.money}}</view>
					</view>
					<view class="item little-line">
						<view class="left">單價</view>
						<view class="right">{{order.price}}</view>
					</view>
					<view class="item little-line">
						<view class="left">購買數量</view>
						<view class="right">{{order.num}}</view>
					</view>
				</view>
				<view v-if="order.status == 2 || order.status == 3 ">
					<view class="item little-line">
						<view class="left">總金額</view>
						<view class="right">{{order.money}}</view>
					</view>
					<view class="item little-line">
						<view class="left">單價</view>
						<view class="right">{{order.price}}</view>
					</view>
					<view class="item little-line">
						<view class="left">購買數量</view>
						<view class="right">{{order.num}}</view>
					</view>

					<view class="item little-line">
						<view class="left">收款方式</view>
						<view class="right" v-if="order.payment.type == 1">支付寶</view>
						<view class="right" v-if="order.payment.type == 2">微信</view>
						<view class="right" v-if="order.payment.type == 3">銀行卡</view>
					</view>
					<view class="item little-line">
						<view class="left">支付時間</view>
						<view class="right">{{order.pay_time_str}}</view>
					</view>
					<view v-if="order.payment.type == 3">
						<view class="item little-line">
							<view class="left">銀行卡號</view>
							<view class="right">{{order.payment.bank_num}}</view>
						</view>
						<view class="item little-line">
							<view class="left">開戶銀行</view>
							<view class="right">{{order.payment.bank_who}}</view>
						</view>
						<view class="item">
							<view class="left">開戶支行</view>
							<view class="right">{{order.payment.bank_address}}</view>
						</view>
					</view>
					<view v-if="order.payment.type == 2 || order.payment.type == 1">

						<view class="item little-line">
							<view class="left">二維碼</view>
							<view class="right flex-center">
								<image :src="order.payment.img" style="width:300upx;height:300upx;" @click="look_img(order.payment.img)"></image>
							</view>
						</view>
					</view>
				</view>

				<view v-if="type == 3">
					<view class="item little-line">
						<view class="left">收款人</view>
						<view class="right">{{order.seller_name}}</view>
					</view>
					<view class="item little-line">
						<view class="left">銀行卡號</view>
						<view class="right">{{bank_num}}</view>
					</view>
					<view class="item little-line">
						<view class="left">開戶銀行</view>
						<view class="right">{{bank_who}}</view>
					</view>
					<view class="item">
						<view class="left">開戶支行</view>
						<view class="right">{{bank_address}}</view>
					</view>
				</view>
				<view v-if="type == 2">
					<view class="item little-line">
						<view class="left">收款人</view>
						<view class="right">{{order.seller_name}}</view>
					</view>
					<view class="item little-line">
						<view class="left">二維碼</view>
						<view class="right flex-center">
							<image :src="img2" style="width:300upx;height:300upx;" @click="look_img(img2)"></image>
						</view>
					</view>
				</view>
				<view v-if="type == 1">
					<view class="item little-line">
						<view class="left">收款人</view>
						<view class="right">{{order.seller_name}}</view>
					</view>
					<view class="item little-line">
						<view class="left flex-center">二維碼</view>
						<view class="right">
							<image :src="img1" style="width:300upx;height:300upx;" @click="look_img(img1)"></image>
						</view>
					</view>

				</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="transfer-info">
			<view class="list">
				<view class="item little-line">
					<view class="left">賣家暱稱</view>
					<view class="right">{{order.seller_nickname}}</view>
				</view>
				<view class="item little-line">
					<view class="left">賣家實名</view>
					<view class="right">{{order.seller_name}}</view>
				</view>
				<view class="item little-line">
					<view class="left">訂單號</view>
					<view class="right">{{order.order_id}}</view>
				</view>
				<!-- <view class="item little-line">
					<view class="left">付款参考号</view>
					<view class="right">{{order.seller_name}}</view>
				</view> -->
				<view class="item">
					<view class="left">下單時間</view>
					<view class="right">{{order.ctime_str}}</view>
				</view>
				<view class="item" v-if="order.status ==3">
					<view class="left">確認時間</view>
					<view class="right">{{order.confirm_time_str}}</view>
				</view>
			</view>
		</view>
		<view class="footer" v-if="order.status == 1">
			<view class="safe-tip">
				係轉賬過程中，請勿備註任何關於SV/USDT/交易所等信息，防止匯款被攔截，銀行卡卑凍結等問題
			</view>
			<view class="btns">
				<button class="cancel" @click="cancel()">取消訂單</button>
				<button class="pay" @click="toPay()">我已付款成功</button>
			</view>
		</view>
		<view class="footer" v-if="order.status == 2">
			<view class="btns">
				<!-- <button class="cancel" >剩余：{{d}}天{{h}}时{{m}}分{{s}}秒</button> -->
				<view class="cancel">{{str}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		uniIcons,
		uniList,
		uniListItem
	} from '@dcloudio/uni-ui'
	import util from '@/common/function';
	export default {
		components: {
			uniIcons,
			uniList,
			uniListItem
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				money: '',
				num: '',
				fangshi: '請選擇付款方式',
				type: '', //当前选择类型（int）： 1=支付宝  2=微信  3=银行卡
				order: [],
				pay_list: [],
				img1: '',
				img2: '',
				bank_num: '',
				bank_who: '',
				bank_address: '',
				strtime: 0,
				d: 0,
				h: 0,
				m: 0,
				s: 0,
				util:util,
				str:''
			};
		},
		onLoad(options) {

			if (typeof options.order_id == "undefined") {
				uni.showToast({
					title: '缺少参数',
					icon: 'none'
				})
				return;
			}
			this.order_id = options.order_id;
			// this.loadData(options.order_id);
			this.loadData(options.order_id);
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			look_img(url){
				console.log(url)
				var urls = []
				urls.push(url)
				uni.previewImage({//预留图片
					urls: urls,//urls必须是数组形式
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
							// console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							uni.downloadFile({
									url: url,
									success: (res) =>{
										if (res.statusCode === 200){
											uni.saveImageToPhotosAlbum({
												filePath: res.tempFilePath,
												success: function() {
													uni.showToast({
														title: "保存成功",
														icon: "none"
													});
												},
												fail: function() {
													uni.showToast({
														title: "保存失败，请稍后重试",
														icon: "none"
													});
												}
											});
										}
									}
								})	
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			//获取个人信息
			mineInfoRequest() {
				var self = this;
				this.$http.post('/index/login/index').then(function(response) {
					self.userinfo = response;
					self.username = util.cutPhone(response.tel ? response.tel : response.mail);
					uni.stopPullDownRefresh();
					//这里只会在接口是成功状态返回
				}).catch(function(error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon: 'none'
					});
					console.log('错误信息', error);
					uni.stopPullDownRefresh();
				});
			},
			change() {
				uni.showActionSheet({
					title: '支付方式',
					itemList: ['銀行卡', '微信', '支付寶'],
					success: function(res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			addZero(i) {
				return i < 10 ? "0" + i : i + "";
			},
			dateProceed() {
				let that = this;
				setInterval(function() {
					
					that.strtime--;
					if(that.strtime <= 0){
						that.str = '賣家未及時確認，系統將於係1分鐘後自動完成訂單';
						// return false;
					}
					var lefttime = that.strtime;
					var d = parseInt(lefttime / (24 * 60 * 60))
					var h = parseInt(lefttime / (60 * 60) % 24);
					var m = parseInt(lefttime / 60 % 60);
					var s = parseInt(lefttime % 60);
					that.d = that.addZero(d);
					that.h = that.addZero(h);
					that.m = that.addZero(m);
					that.s = that.addZero(s);
					that.str = '剩餘：'+h+'時'+m+'分'+s+'秒';
				}, 1000);
				consolo.log(that.d,that.h,that.m,that.s)
			},
			cancel() {
				var that = this
				var data = {
					order_id: this.order_id
				}
				this.$http.post('/index/user/cancelOrder', data).then(function(response) {
					uni.showToast({
						title: '取消成功',
						duration: 1500,
						icon: 'none'
					});
					uni.stopPullDownRefresh();
					setTimeout(function() {
						uni.navigateTo({
							url: '/pages/otc/otc'
						});

					}, 1500);

				}).catch(error => {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon: 'none'
					});
					uni.stopPullDownRefresh();
				})
			},
			toPay() {
				if (this.type == '') {
					uni.showToast({
						title: '請選擇付款方式',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				var that = this
				var data = {
					order_id: that.order_id,
					pay_type_id: that.type
				}
				this.$http.post('/index/user/payOrder', data).then(function(response) {
					that.type = '';
					uni.showToast({
						title: '支付成功',
						duration: 1000,
						icon: 'none'
					});
					uni.stopPullDownRefresh();
					that.loadData(that.order_id);

				}).catch(error => {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon: 'none'
					});
					uni.stopPullDownRefresh();
				})
			},
			//请求数据
			loadData(id) {
				var that = this
				var data = {
					order_id: that.order_id
				}
				this.$http.post('/index/user/orderInfo', data).then(function(response) {

					that.order = response;
					let payment = that.payment = response.payment;
					if (response.status == 1) {
						let myArray = [];
						for (let i = 0; i < payment.length; i++) {
							if (payment[i].type == 1) {
								myArray.push('支付寶');
								that.img1 = payment[i].img;
							}
							if (payment[i].type == 2) {
								myArray.push('微信');
								that.img2 = payment[i].img;
							}
							if (payment[i].type == 3) {
								myArray.push('銀行卡');
								that.bank_address = payment[i].bank_address;
								that.bank_num = payment[i].bank_num;
								that.bank_who = payment[i].bank_who;
							}
						}
						that.pay_list = myArray;
					}
					if (response.status == 2) {
						that.strtime = response.confirm_times;
						that.dateProceed();
					}
					uni.stopPullDownRefresh();
				}).catch(error => {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon: 'none'
					});
					uni.stopPullDownRefresh();
				})
			},
			//选择类型
			actionSheetTap() {
				var self = this;
				//获取数据
				// this.getwallet();
				//弹出选择栏
				uni.showActionSheet({
					title: '請選擇付款方式',
					itemList: self.pay_list,
					success: (e) => {
						// console.log(e);return false;
						self.fangshi = self.pay_list[e.tapIndex];
						if (self.fangshi == '支付寶') {
							self.type = 1;
						}
						if (self.fangshi == '微信') {
							self.type = 2;
						}
						if (self.fangshi == '銀行卡') {
							self.type = 3;
						}
					}
				})
			},
			go() {
				uni.makePhoneCall({
					// 手机号
					phoneNumber: this.order.seller_tel,
					// 成功回调
					success: (res) => {
						console.log(this.order.seller_tel)
					},
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
				});
			},


			navTo(url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	@font-face {
		font-family: 'iconfont';
		src: url('../../../static/font/otc-detail.ttf') format('truetype');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 70upx;
		color: #ffffff;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.s0:before {
		content: "\e6db";
	}

	.s1:before {
		content: "\e69b";
	}

	.s2:before {
		content: "\e6e6";
	}

	.s3:before {
		content: "\e698";
	}

	.s4:before {
		content: "\e69e";
	}

	.icon-telephone:before {
		content: "\e6a2";
	}

	.icon-message:before {
		content: "\e6df";
	}

	.container {
		padding: 0upx 0upx 240upx 0upx;
	}

	.head-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background: #0952C3;
		font-size: $font-base;
		padding: 160upx 30upx 40upx 30upx;
		color: $font-color-light;

		.status {
			font-size: $font-sm;

			.s {
				display: flex;
				flex-direction: row;
				align-items: center;

				.v {
					font-size: $font-xl;
					color: #ffffff;
				}
			}

			.t {
				color: #ff0000;
			}
		}

		.concat {
			font-size: $font-sm;
		}

	}

	.secrity-tip {
		padding: 20upx 30upx;
		font-size: $font-sm;
	}

	.amount-wrapper {
		padding: 30upx 30upx 30upx 30upx;

		.total {
			display: block;
			color: $font-color-blue;
			padding: 20upx 0 20upx 0;
			font-weight: bold;
		}

		.info {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.price {
				font-size: $font-base;

				view {
					padding-top: 10upx;
					padding-bottom: 10upx;
				}

				.label {
					color: $font-color-light;
					padding-right: 30upx;
				}
			}

			.coin {
				font-size: $font-base;
				text-align: center;

				image {
					width: 56upx;
					height: 56upx;
				}
			}
		}
	}

	.transfer-info {
		padding: 0upx 30upx;
		background-color: #FFFFFF;

		.change {
			color: $font-color-blue;
		}
	}

	.list {
		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 30upx 0 30upx 0;
			border-bottom: 1upx solid #EEEEEE;

			.left {
				font-size: $font-base;
			}

			.right {
				font-size: $font-base;
			}
		}
	}

	.footer {
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		width: 100%;
		border-top: 1upx solid #CCCCCC;

		.safe-tip {
			font-size: $font-sm;
			color: $font-color-blue;
			background: $uni-color-tip;
			padding: 20upx 30upx;
		}

		.btns {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			height: 100upx;
			line-height: 100upx;

			/* padding: 20upx 30upx; */
			.cancel {
				width: 50%;
				height: 100upx;
				line-height: 100upx;
				padding-left: 30upx;
				font-size: $font-base;
			}

			.pay {
				width: 50%;
				height: 100upx;
				line-height: 100upx;
				border: 0px;
				border-radius: 0;
				background-color: $uni-color-blue;
				color: #ffffff;
				font-size: $font-base;
			}
		}
	}
</style>
