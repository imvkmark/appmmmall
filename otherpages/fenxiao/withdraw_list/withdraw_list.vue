<template>
	<view :class="themeStyle">
		<view>
			<view class="withdraw-cate">
				<view class="cate-li" v-for="(item,index) in category" :key="index" @click="slectCate(item.id)">
					<view class="li-con" :class="{'active ns-text-color ns-border-color':status==item.id}">
						{{item.name}}
					</view>
				</view>
			</view>
			<mescroll-uni ref="mescroll" @getData="getData" top="90" class="member-point" :size="10">
				<view class="goods_list" slot="list">
					<view class="withdraw-li" v-for="(item,index) in withdrawList" :key="index">
						<view class="li-box">
							<view class="tixian-desc">
								<view class="desc-info">
									<view class="desc-info-name">
										申请{{fenxiaoWords.withdraw}}
									</view>
									<view class="desc-info-time">
										{{$util.timeStampTurnTime(item.create_time)}}
									</view>
								</view>
								<view class="desc-money ns-text-color">
									￥{{item.money}}
								</view>
							</view>
							<view class="money-desc">
								<text>实际到金额：{{item.real_money}}</text>
								<text>手续费：{{item.withdraw_rate_money}}</text>
								<text class="ns-text-color" v-if="item.status==1">待审核</text>
								<text class="ns-text-color" v-if="item.status==2">已审核</text>
								<text class="ns-text-color" v-if="item.status==-1">已拒绝</text>
							</view>
						</view>
					</view>

					<ns-empty :text="'您没有'+fenxiaoWords.withdraw+'记录哦'" :isIndex="!1" v-if="status==0 && withdrawList.length==0 && emptyShow"></ns-empty>
					<ns-empty :text="'您没有待审核'+ fenxiaoWords.withdraw +'记录哦'" :isIndex="!1" v-if="status==1 && withdrawList.length==0 && emptyShow"></ns-empty>
					<ns-empty :text="'您没有已审核'+ fenxiaoWords.withdraw +'记录哦'" :isIndex="!1" v-if="status==2 && withdrawList.length==0 && emptyShow"></ns-empty>
					<ns-empty :text="'您没有已拒绝'+ fenxiaoWords.withdraw +'记录哦'" :isIndex="!1" v-if="status==-1 && withdrawList.length==0 && emptyShow"></ns-empty>
				</view>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>

</template>

<script>
	import fenxiaoWords from 'common/js/fenxiao-words.js';
	export default {
		data() {
			return {
				category: [{
						id: 0,
						name: "全部",
						number: 2
					},
					{
						id: 1,
						name: "待审核",
						number: 0
					},
					{
						id: 2,
						name: "已审核",
						number: 0
					},
					{
						id: -1,
						name: "已拒绝",
						number: 0
					}
				],
				status: 0,
				withdrawList: [],
				emptyShow: false
			}
		},
		onShow() {
			this.$langConfig.refresh();
			uni.setNavigationBarTitle({
				title: this.fenxiaoWords.withdraw + '明细'
			});

			if (uni.getStorageSync('token')) {

			} else {
				this.$util.redirectTo(
					'/pages/login/login/login', {
						back: '/otherpages/fenxiao/withdraw_list/withdraw_list'
					},
					'redirectTo'
				);
			}
		},
		mixins: [fenxiaoWords],
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		methods: {
			//获得列表数据
			getData(mescroll) {
				this.emptyShow = false;
				if (mescroll.num == 1) {
					this.withdrawList = []
				}
				this.$api.sendRequest({
					url: '/fenxiao/api/withdraw/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						status: this.status
					},
					success: res => {
						this.emptyShow = true;
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data && res.data.list) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.withdrawList = []; //如果是第一页需手动制空列表
						this.withdrawList = this.withdrawList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			slectCate(e) {
				this.status = e;
				this.$refs.mescroll.refresh()
			}
		}
	}
</script>

<style lang="scss">
	// [data-theme] {
		.withdraw-cate {
			width: 100%;
			height: 90rpx;
			display: flex;
			border-bottom: 1rpx solid $ns-border-color-gray;
			box-sizing: border-box;
			background: #ffffff;

			.cate-li {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;

				.li-con {
					display: inline-block;
					line-height: 90rpx;
					height: 100%;
				}

				.li-con.active {
					border-bottom: 6rpx solid;
					box-sizing: border-box;
				}
			}
		}

		.withdraw-member {
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			color: $ns-text-color-gray;
			padding: 0 $ns-padding;
			box-sizing: border-box;
		}

		.goods_list {
			width: 100%;
			height: 100%;

			.withdraw-li {
				width: 100%;
				padding: 0 $ns-padding;
				box-sizing: border-box;
				margin-top: $ns-margin;

				.li-box {
					width: 100%;
					height: 100%;
					padding: $ns-padding 35rpx;
					background: #ffffff;
					box-sizing: border-box;
					border-radius: $ns-border-radius;

					.tixian-desc {
						width: 100%;
						height: 120rpx;
						display: flex;
						justify-content: space-between;
						border-bottom: 1rpx solid #e5e5e5;

						.desc-info {
							display: flex;
							justify-content: center;
							flex-direction: column;

							.desc-info-name {
								font-size: $ns-font-size-base;
								font-weight: 600;
							}

							.desc-info-time {
								font-size: $ns-font-size-sm;
								color: $ns-text-color-gray;
							}
						}

						.desc-money {
							max-width: 50%;
							height: 100%;
							display: flex;
							align-items: center;
							justify-content: flex-end;
							font-size: 30rpx;
							font-weight: 600;
						}
					}

					.money-desc {
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 20rpx;
						line-height: 1;
						font-size: $ns-font-size-sm;
					}
				}
			}
		}
	// }
</style>
