<template>
	<view :class="themeStyle">
		<view>
			<mescroll-uni @getData="getData" class="member-point">
				<view slot="list">
					<view class="account-box">
						<view class="tit">我的积分</view>
						<view>
							<text class="iconfont iconmn_jifen_fill"></text>
							<text class="point">{{ memberAccount.point ? Math.ceil(memberAccount.point) : 0 }}</text>
						</view>
					</view>

					<block v-if="dataList.length">
						<view class="detailed-wrap">
							<view class="head">
								<view>积分收支明细</view>
							</view>

							<view class="cont">
								<view class="detailed-item" v-for="(item, index) in dataList" :key="index">
									<view class="info">
										<view class="event">{{ item.type_name }}</view>
										<view>
											<text class="time">{{ $util.timeStampTurnTime(item.create_time) }}</text>
										</view>
									</view>
									<view class="num ns-text-color" v-if="item.account_data > 0">+{{ parseInt(item.account_data) }}</view>
									<view class="num ns-text-color" v-else>{{ parseInt(item.account_data) }}</view>
								</view>
							</view>
						</view>
					</block>
					<block v-else>
						<ns-empty></ns-empty>
					</block>
				</view>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				memberAccount: {
					point: 0
				},
				dataList: []
			};
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		onShow() {
			this.$langConfig.refresh();
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo(
					'/pages/login/login/login', {
						back: '/otherpages/member/point/point'
					},
					'redirectTo'
				);
			}
			this.getAccountInfo();
		},
		methods: {
			//获取个人积分信息
			getAccountInfo() {
				this.$api.sendRequest({
					url: '/api/memberaccount/info',
					data: {
						account_type: 'point'
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.memberAccount = res.data;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			//获得列表数据
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/api/memberaccount/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						account_type: 'point'
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		.account-box {
			width: 100vw;
			padding: 30rpx;
			background: lighten($base-color, 10%) !important;
			box-sizing: border-box;
			padding-bottom: 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.tit {
				color: #fff;
				line-height: 1;
			}

			.iconmn_jifen_fill {
				font-size: 60rpx;
				color: #fff;
			}

			.point {
				color: #fff;
				font-size: 60rpx;
				margin-left: 10rpx;
			}
		}

		.detailed-wrap {
			.head {
				display: flex;
				height: 90rpx;

				&>view {
					flex: 1;
					text-align: left;
					padding: 0 $ns-padding;
					line-height: 90rpx;
				}
			}

			.cont {
				background: #fff;

				.detailed-item {
					padding: $ns-padding 10rpx;
					margin: 0 $ns-margin;
					border-bottom: 1px solid #eee;
					position: relative;

					&:last-of-type {
						border-bottom: none;
					}

					.info {
						padding-right: 180rpx;

						.event {
							font-size: 28rpx;
							line-height: 1.3;
						}

						.time {
							font-size: 26rpx;
							color: $ns-text-color-gray;
						}
					}

					.num {
						width: 160rpx;
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						text-align: right;
						font-size: 40rpx;
					}
				}
			}
		}
	// }
</style>
 -->


 <template>
 	<view :data-theme="themeStyle">
 		<mescroll-uni @getData="getData" class="member-point">
 			<view slot="list">
 				<view class="account-box ns-bg-color" :style="'background-image:url(' + $util.img('upload/uniapp/point/head_bg.png') + ');background-repeat: no-repeat;background-position: bottom right; background-size: 150rpx;'">
 					<view class="account-text">
 						<text class="iconfont iconmn_jifen_fill"></text>
 						<text class="point">{{ memberAccount.point ? parseInt(memberAccount.point) : 0 }}</text>
 					</view>
 					<view class="accout-btn">
 						<view @click="toList">积分商城</view>
 						<view @click="toOrderList">兑换记录</view>
 					</view>
 				</view>

 				<block v-if="dataList.length">
 					<view class="detailed-wrap">
 						<view class="cont">
 							<view class="detailed-item" v-for="(item, index) in dataList" :key="index">
 								<view class="info">
 									<view class="event">{{ item.type_name }}</view>
 									<view class="time-box">
 										<text class="time">{{ $util.timeStampTurnTime(item.create_time) }}</text>
 									</view>
 								</view>
 								<view class="num ns-text-color" v-if="item.account_data > 0">+{{ parseInt(item.account_data) }}</view>
 								<view class="num" v-else>{{ parseInt(item.account_data) }}</view>
 							</view>
 						</view>
 					</view>
 				</block>
 				<block v-else>
 					<view class="cart-empty"><ns-empty></ns-empty></view>
 				</block>
 			</view>
 		</mescroll-uni>
 		<loading-cover ref="loadingCover"></loading-cover>
 	</view>
 </template>

 <script>
 import globalConfig from '@/common/js/golbalConfig.js'
 export default {
 	data() {
 		return {
 			memberAccount: {
 				point: 0
 			},
 			dataList: []
 		};
 	},
 	mixins:[globalConfig],
 	onShow() {
 		this.$langConfig.refresh();
 		if (!uni.getStorageSync('token')) {
 			this.$util.redirectTo(
 				'/pages/login/login/login',
 				{
 					back: '/otherpages/member/point/point'
 				},
 				'redirectTo'
 			);
 		}
 		this.getAccountInfo();
 	},
 	methods: {
 		toList(){
 			this.$util.redirectTo('/promotionpages/point/list/list');
 		},
 		toOrderList(){
 			this.$util.redirectTo('/promotionpages/point/order_list/order_list');
 		},
 		//获取个人积分信息
 		getAccountInfo() {
 			this.$api.sendRequest({
 				url: '/api/memberaccount/info',
 				data: {
 					account_type: 'point'
 				},
 				success: res => {
 					if (res.code == 0 && res.data) {
 						this.memberAccount = res.data;
 					} else {
 						this.$util.showToast({ title: res.message });
 					}
 				}
 			});
 		},
 		//获得列表数据
 		getData(mescroll) {
 			this.$api.sendRequest({
 				url: '/api/memberaccount/page',
 				data: {
 					page_size: mescroll.size,
 					page: mescroll.num,
 					account_type: 'point'
 				},
 				success: res => {
 					let newArr = [];
 					let msg = res.message;
 					if (res.code == 0 && res.data) {
 						newArr = res.data.list;
 					} else {
 						this.$util.showToast({ title: msg });
 					}
 					mescroll.endSuccess(newArr.length);
 					//设置列表数据
 					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
 					this.dataList = this.dataList.concat(newArr); //追加新数据
 					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
 				},
 				fail: res => {
 					mescroll.endErr();
 					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
 				}
 			});
 		}
 	}
 };
 </script>

 <style lang="scss">
 /deep/ .fixed{position: relative;top:0}
 .cart-empty{position:relative;top: 50%;margin-top: 104px !important;}
 .account-box {
 	width: 702rpx;
 	height: 211rpx;
 	margin: 0 auto;
 	border-radius: 20rpx;
 	padding: 20rpx;
 	box-sizing: border-box;

 	.accout-btn {
 		display: flex;
 		margin-top: 30rpx;
 		view {
 			width: 170rpx;
 			height: 44rpx;
 			border-radius: 22rpx;
 			border: 1px solid rgba(255,255,255,.4);
 			color: #fff;
 			display: flex;
 			align-items: center;
 			justify-content: center;
 			margin-right: 44rpx;
 		}
 	}

 	.account-text {
 		color: #fff;
 		font-size: 44rpx;
 		display: flex;
 		align-items: center;
 		margin-left: 10rpx;
 		text {
 			margin-right: 12rpx;
 		}
 	}
 }

 .detailed-wrap {
 	background: #fff;
 	border-radius: 10rpx;
 	margin: 20rpx;
 	.head {
 		display: flex;
 		height: 90rpx;

 		& > view {
 			flex: 1;
 			text-align: left;
 			padding: 0 $ns-padding;
 			line-height: 90rpx;
 		}
 	}

 	.cont {
 		background: #fff;
 		width: 702rpx;
 		margin: 0 auto;

 		.detailed-item {
 			padding: 32rpx $ns-padding;
 			margin: 0 $ns-margin;
 			border-bottom: 1px solid #eee;
 			position: relative;
 			box-sizing: border-box;

 			&:last-of-type {
 				border-bottom: none;
 			}

 			.info {
 				padding-right: 180rpx;

 				.event {
 					font-weight: bold;
 					font-size: $ns-font-size-lg;
 					line-height: 1.3;
 					color: #333;
 				}
 				.time-box{
 					line-height: 1;
 					margin-top: 24rpx;
 				}

 				.time {
 					font-size: $ns-font-size-base;
 					color: $ns-text-color-gray;
 				}
 			}

 			.num {
 				width: 160rpx;
 				position: absolute;
 				right: 17rpx;
 				top: 50%;
 				transform: translateY(-50%);
 				text-align: right;
 				font-size: 40rpx;
 			}
 		}
 	}
 }
 </style>
