<template>
	<view :class="themeStyle">
		<view>
			<view class="team-cate">
				<view class="cate-li" v-for="(item,index) in category" :key="index" v-if="index<levelNum" @click="selectCate(item.id)">
					<view class="li-con" :class="{'active ns-text-color ns-border-color':selectId==item.id}">
						{{item.name}}
					</view>
				</view>
			</view>
			<mescroll-uni ref="mescroll" @getData="getData" top="90" class="member-point" :size="8">
				<view class="goods_list" slot="list">
					<view class="team-li" v-for="(item,index) in teamList" :key="index" v-if="teamList.length!=0">
						<view class="li-box" :class="{'active':index+1 ==teamList.length}">
							<image v-if="item.headimg" :src="$util.img(item.headimg)" @error="imageError(index)" mode="aspectFill"></image>
							<image v-else :src="$util.getDefaultImage().default_headimg"></image>
							<view class="menber-info">
								<view class="member-name">
									<block v-if="item.is_fenxiao">
										<view class="left">
											<view class="name">
												<text>{{item.fenxiao_name}}</text>
											</view>
											<view class="title ns-text-color ns-border-color">
												{{ fenxiaoWords.fenxiao_name }}
											</view>
										</view>
										<view>
											<text class="ns-text-color-gray ns-font-size-sm" v-if="item.audit_time">{{item.audit_time}}</text>
										</view>
									</block>
									<block v-else>
										<view class="left">
											<view class="name">
												<text>{{item.nickname}}</text>
											</view>
										</view>
										<view>
											<text class="ns-text-color-gray ns-font-size-sm" v-if="item.reg_time">{{item.reg_time}}</text>
										</view>
									</block>
								</view>
								<view class="member-date">
									<view class="">
										<text class="tit">消费：</text>
										<text>{{item.order_money}}</text>
									</view>
									<view class="member-date-order">
										<text class="tit">订单：</text>
										<text>{{item.order_num}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<ns-empty text="您当前没有推荐的会员哦" :isIndex="!1" v-if="selectId==0 && teamList.length==0 && emptyShow"></ns-empty>
					<ns-empty text="您当前没有一级团队哦" :isIndex="!1" v-if="selectId==1 && teamList.length==0 && emptyShow"></ns-empty>
					<ns-empty text="您当前没有二级团队哦" :isIndex="!1" v-if="selectId==2 && teamList.length==0 && emptyShow"></ns-empty>
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
						name: "一级",
						number: 0
					},
					{
						id: 1,
						name: "二级",
						number: 2
					},
					{
						id: 2,
						name: "三级",
						number: 0
					}
				],
				selectId: 0,
				teamList: [],
				emptyShow: false,
				levelNum: 0
			}
		},
		mixins: [fenxiaoWords],
		onShow() {
			this.$langConfig.refresh();

			uni.setNavigationBarTitle({
				title: this.fenxiaoWords.my_team
			});

			this.getFenXiaoLevel()
		},
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
					this.teamList = []
				}
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/team',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						level: this.selectId
					},
					success: res => {
						this.emptyShow = true;
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						newArr.forEach((v)=>{
							if(v.reg_time){
								v.reg_time=this.$util.timeStampTurnTime(v.reg_time).substring(0,10);
							}
							if(v.audit_time){
								v.audit_time=this.$util.timeStampTurnTime(v.audit_time).substring(0,10);
							}
						})
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.teamList = []; //如果是第一页需手动制空列表
						this.teamList = this.teamList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			imageError(e) {
				this.teamList[e].headimg = $util.getDefaultImage().default_headimg;
				this.$forceUpdate();
			},
			selectCate(e) {
				this.selectId = e;
				this.$refs.mescroll.refresh()
			},
			async getFenXiaoLevel() {
				let res = await this.$api.sendRequest({
					url: '/fenxiao/api/config/basics',
					async: false,
					success: res => {}
				});
				if (res.code == 0 && res.data) {
					this.levelNum = Number(res.data.level);
				}
			},
		}
	}
</script>

<style lang="scss">
	// [data-theme] {
		.team-cate {
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

		.team-member {
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

			.team-li {
				width: 100%;
				height: 160rpx;
				padding: 0 $ns-padding;
				box-sizing: border-box;
				background: #ffffff;
				border-bottom: 1rpx solid #F1F1F1;

				.li-box {
					display: flex;
					padding: $ns-padding 0;
					border-bottom: 1rpx solid $ns-border-color-gray;
					box-sizing: border-box;

					image {
						width: 89rpx;
						height: 89rpx;
						border-radius: 50%;
					}

					.menber-info {
						width: calc(100% - 120rpx);
						padding-left: $ns-padding;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						justify-content: center;

						.member-name {
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: $ns-font-size-base;

							.left {
								width: 70%;
								display: flex;
								align-items: center;

								.name {
									max-width: calc(100% - 150rpx);
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
									font-size: 26rpx;
								}

								.title {
									padding: 4rpx 10rpx;
									border: 1rpx solid;
									justify-content: center;
									align-items: center;
									text-align: center;
									font-size: 18rpx;
									border-radius: 4rpx;

									margin-left: 10rpx;
									line-height: 1;
								}
							}
						}

						.member-date {
							display: flex;
							align-items: center;
							margin-top: 10rpx;

							.member-date-order {
								margin-left: 110rpx;
							}

							view {
								height: 100%;
								text-align: left;
								line-height: 1;

								text {
									color: $ns-text-color-gray;
									font-size: 22rpx;
								}

								.tit {
									color: $ns-text-color-gray;
									font-size: 22rpx;
								}
							}
						}
					}
				}

				.li-box.active {
					border: none;
				}
			}
		}
	// }
</style>
<style lang="scss">
	// /deep/ .mescroll-uni-warp .mescroll-uni{
	// 	background: #ffffff !important;
	// }
</style>
 -->


 <template>
 	<view :data-theme="themeStyle">
 		<!-- 这里是分销团队页面 -->
 		<view class="team-cate">
 			<view class="cate-li" v-for="(item,index) in category" :key="index" v-if="index<levelNum" @click="selectCate(item.id)">
 				<view class="li-con" :class="{'active ns-text-color ns-border-color':selectId==item.id}">
 					{{index == 0 ? item.name : item.name + fenxiaoWords.fenxiao_name}}
 				</view>
 			</view>
 		</view>
 		<mescroll-uni ref="mescroll" @getData="getData" top="90" class="member-point" :size="8">
 			<view class="goods_list" slot="list">
 				<view class="team-li" v-for="(item,index) in teamList" :key="index" v-if="teamList.length!=0">
 					<view class="li-box" :class="{'active':index+1 ==teamList.length}">
 						<image v-if="item.headimg" :src="$util.img(item.headimg)" @error="imageError(index)" mode="aspectFill"></image>
 						<image v-else :src="$util.getDefaultImage().default_headimg"></image>
 						<view class="menber-info">
 							<view class="member-name">
 								<block v-if="item.is_fenxiao">
 									<view class="left">
 										<view class="name">
 											<text>{{item.fenxiao_name}}</text>
 										</view>
 									<!-- 	<view class="title  ns-border-color ns-bg-color">
 											{{ item.level_name }}
 										</view> -->
 									</view>
 									<view>
 										<text class="ns-text-color-gray ns-font-size-sm">{{item.audit_time}}</text>
 									</view>
 								</block>
 								<block v-else>
 									<view class="left">
 										<view class="name ns-font-size-base">
 											<text>{{item.nickname}}</text>
 										</view>
 									</view>
 									<view>
 										<text class="ns-text-color-gray ns-font-size-sm">{{item.reg_time}}</text>
 									</view>
 								</block>
 							</view>
 							<view class="member-date">
 								<view class="">
 									<text class="tit ns-font-size-sm">消费：</text>
 									<text class="ns-font-size-sm">{{item.order_money}}</text>
 								</view>
 								<view class="">
 									<text class="tit ns-font-size-sm">订单：</text>
 									<text class="ns-font-size-sm">{{item.order_num}}</text>
 								</view>
 							</view>
 						</view>
 					</view>
 				</view>
 				<view class="cart-empty">
 					<ns-empty text="您当前没有推荐的会员哦" :isIndex="!1" v-if="selectId==0 && teamList.length==0 && emptyShow"></ns-empty>
 					<ns-empty text="您当前没有一级团队哦" :isIndex="!1" v-if="selectId==1 && teamList.length==0 && emptyShow" ></ns-empty>
 					<ns-empty text="您当前没有二级团队哦" :isIndex="!1" v-if="selectId==2 && teamList.length==0 && emptyShow"></ns-empty>
 				</view>
 			</view>
 		</mescroll-uni>

 		<loading-cover ref="loadingCover"></loading-cover>
 	</view>
 </template>

 <script>
 	import fenxiaoWords from 'common/js/fenxiao-words.js';
 	export default {
 		data() {
 			return {
 				category: [
 					{
 						id: 0,
 						name: "推荐会员",
 						number: 0
 					},
 					{
 						id: 1,
 						name: "一级",
 						number: 2
 					},
 					{
 						id: 2,
 						name: "二级",
 						number: 0
 					}
 				],
 				selectId: 0,
 				teamList: [],
 				emptyShow: false,
 				levelNum:0
 			}
 		},
		mixins:[fenxiaoWords],
 		onShow() {
 			this.$langConfig.refresh();

 			uni.setNavigationBarTitle({
 				title: this.fenxiaoWords.my_team
 			});

 			this.getFenXiaoLevel()
 		},
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
 					this.teamList = []
 				}
 				this.$api.sendRequest({
 					url: '/fenxiao/api/fenxiao/team',
 					data: {
 						page_size: mescroll.size,
 						page: mescroll.num,
 						level: this.selectId
 					},
 					success: res => {
 						this.emptyShow = true;
 						let newArr = [];
 						let msg = res.message;
 						if (res.code == 0 && res.data) {
 							newArr = res.data.list;
 							newArr.forEach((v)=>{
 								v.audit_time=this.$util.timeStampTurnTime(v.audit_time).substring(0,10);
 								v.reg_time=this.$util.timeStampTurnTime(v.reg_time).substring(0,10);
 							})
 						} else {
 							this.$util.showToast({
 								title: msg
 							});
 						}
 						mescroll.endSuccess(newArr.length);
 						//设置列表数据
 						if (mescroll.num == 1) this.teamList = []; //如果是第一页需手动制空列表
 						this.teamList = this.teamList.concat(newArr); //追加新数据
 						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
 					},
 					fail: res => {
 						mescroll.endErr();
 						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
 					}
 				});
 			},
 			imageError(e) {
 				this.teamList[e].headimg = $util.getDefaultImage().default_headimg;
 				this.$forceUpdate();
 			},
 			selectCate(e) {
 				this.selectId = e;
 				this.$refs.mescroll.refresh()
 			},
 			async getFenXiaoLevel() {
 				let res = await this.$api.sendRequest({
 					url: '/fenxiao/api/config/basics',
 					async: false,
 					success: res => {}
 				});
 				if (res.code == 0 && res.data) {
 					this.levelNum = Number(res.data.level);
 				}
 			},
 		}
 	}
 </script>

 <style lang="scss">
 	.team-cate {
 		width: 100%;
 		height: 90rpx;
 		display: flex;
 		border-bottom: 1rpx solid $ns-border-color-gray;
 		box-sizing: border-box;
 		background: #ffffff;
 		position: fixed;
 		left: 0;
 		top: var(--window-top);
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
 				box-sizing: border-box;
 			}
 		}
 	}

 	.team-member {
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

 		.team-li {
 			// width: 100%;
 			height: 160rpx;
 			margin: $ns-padding;
 			padding:0 $ns-padding;
 			box-sizing: border-box;
 			background: #ffffff;
 			margin-bottom: 10px;
 			border-radius: 10rpx;

 			.li-box {
 				display: flex;
 				padding: $ns-padding 0;
 				border-bottom: 1rpx solid $ns-border-color-gray;
 				box-sizing: border-box;

 				image {
 					width: 110rpx;
 					height: 110rpx;
 					border-radius: 50%;
 				}

 				.menber-info {
 					width: calc(100% - 120rpx);
 					padding-left: $ns-padding;
 					box-sizing: border-box;
 					display: flex;
 					flex-direction: column;
 					justify-content: center;

 					.member-name {
 						display: flex;
 						justify-content: space-between;
 						align-items: center;
 						font-size: $ns-font-size-base;

 						.left {
 							width: 70%;
 							display: flex;
 							align-items: center;

 							.name {
 								max-width: calc(100% - 150rpx);
 								overflow: hidden;
 								text-overflow: ellipsis;
 								white-space: nowrap;
 							}

 							.title {
 								padding: 4rpx 16rpx;
 								justify-content: center;
 								align-items: center;
 								text-align: center;
 								font-size: 20rpx;
 								border-radius: 4rpx;
 								margin-left: 10rpx;
 								line-height: 1;
 								border:1px solid;
 								color:#fff
 							}
 						}
 					}

 					.member-date {
 						display: flex;
 						justify-content: space-between;
 						align-items: center;
 						margin-top: 26rpx;

 						view {
 							width: 50%;
 							height: 100%;
 							text-align: left;
 							line-height: 1;

 							text {
 								font-size: $ns-font-size-sm;
 								color: $ns-text-color-gray;
 							}

 							.tit {
 								color: $ns-text-color-gray;
 							}
 						}
 					}
 				}
 			}

 			.li-box.active {
 				border: none;
 			}
 		}
 	}
 </style>
