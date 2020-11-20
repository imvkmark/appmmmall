<template>
	<view :class="themeStyle">
		<view class="balances" v-if="dataList.length">
			<view v-for="(item, index) in dataList" :key="index" class="ns-border-color-gray balances-item">
				<view class="balance-img">
					<image v-if="item.account_data>0" :src="$util.img('upload/uniapp/member/balance_detail/income.png')" mode="widthFix"></image>
					<image v-else :src="$util.img('upload/uniapp/member/balance_detail/pay.png')" mode="widthFix"></image>
				</view>
				<view class="balance-head-wrap">
					<view class="ns-margin-bottom balance-head">
						<text class="ns-font-size-base balance-head-title">{{ item.type_name }}</text>
						<text class="ns-text-color ns-font-size-sm num">{{ item.account_data ? item.account_data : 0 }}</text>
					</view>
					<text class="balance-text ns-text-color-gray ns-font-size-sm balance-desc">{{ item.remark }}</text>
					<text class="ns-text-color-gray balance-time ns-font-size-sm">{{ $util.timeStampTurnTime(item.create_time) }}</text>
				</view>
			</view>
		</view>
		<!-- <mescroll-uni ref="mescroll" @getData="getData">
			<block slot="list"> -->
				<!-- 明细列表 -->
				<!-- <view class="balances" v-if="dataList.length">
					<view v-for="(item, index) in dataList" :key="index" class="ns-border-color-gray balances-item">
						<view class="balance-img">
							<image v-if="item.account_data>0" :src="$util.img('upload/uniapp/member/balance_detail/income.png')" mode="widthFix"></image>
							<image v-else :src="$util.img('upload/uniapp/member/balance_detail/pay.png')" mode="widthFix"></image>
						</view>
						<view class="balance-head-wrap">
							<view class="ns-margin-bottom balance-head">
								<text class="ns-font-size-base balance-head-title">{{ item.type_name }}</text>
								<text class="ns-text-color ns-font-size-sm num">{{ item.account_data ? item.account_data : 0 }}</text>
							</view>
							<text class="balance-text ns-text-color-gray ns-font-size-sm balance-desc">{{ item.remark }}</text>
							<text class="ns-text-color-gray balance-time ns-font-size-sm">{{ $util.timeStampTurnTime(item.create_time) }}</text>
						</view>
					</view>
				</view> -->
				<!-- 无明细列表 -->
				<!-- <view v-else>
					<ns-empty></ns-empty>
				</view> -->
			<!-- </block>
		</mescroll-uni> -->
		<!-- <loading-cover ref="loadingCover"></loading-cover> -->
	</view>
</template>

<script>
	import config from '../../../utils/config.js'
	export default {
		data() {
			return {
				dataList: '',
				statusList: [{
						name: '全部',
						id: '0'
					},
					{
						name: '收入',
						id: '1'
					},
					{
						name: '支出',
						id: '2'
					}
				],
				scrollInto: '',
				orderStatus: '0',
				token:'',
				pages_size:10
			};
		},
		onPullDownRefresh() {
			console.log('onpull')
			this.get_list(this.type)
		},
		onReachBottom() {
			this.pages_size += this.pages_size
			this.get_list(this.type)
		},
		onLoad(option) {
			// if (option.status) this.orderStatus = option.status;
			this.basurl = config.url
			if(uni.getStorageInfo('token')){
				this.token = uni.getStorageInfo('token')
			}
			console.log(option.type)
			this.type = option.type
			this.get_list(option.type)
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/otherpages/member/balance/balance');
			}
		},
		computed: {
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			async get_list(type){
				var that = this
				let res = await this.$api.sendRequest({
					url: '/api/Exchange/getBalanceDetail?account_type='+type+'&page=1&pages_size='+that.pages_size,
					async: false
				});
				console.log(res.data.list,111)
				that.dataList = res.data.list
				uni.stopPullDownRefresh()
				
				// that.$forceUpdate()
			},
			ontabtap(e) {
				let index = e.currentTarget.dataset.current;
				this.orderStatus = this.statusList[index].id;
				this.$refs.mescroll.refresh();
			},
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/api/memberaccount/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						account_type: 'balance'
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
			},
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		.balances {
			background: #fff;

			.balances-item {
				display: flex;
				padding: 30rpx 30rpx;
				border-bottom: 1px solid $ns-border-color-gray;
				font-size: $ns-font-size-lg + 2rpx;

				.balance-img {
					padding-right: 20rpx;
					felx: 2;
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					margin-left: 20rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.balance-head-wrap {
					flex: 5;

					.balance-head {
						display: flex;
						justify-content: space-between;
						line-height: 1;

						.balance-head-title {
							color: #000000;
							font-size: $ns-font-size-lg;
							font-weight: 600;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							width: 460rpx;
						}

						.num {
							font-size: $ns-font-size-lg;
						}
					}

					.balance-time {
						// align-self: flex-end;
					}

					.balance-text {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						line-height: 1.5;
					}
				}
			}

		}

		.empty {
			width: 100%;
			height: 500rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			.iconfont {
				font-size: 50rpx;
				margin-bottom: $ns-margin;
			}
		}
	// }
</style>
