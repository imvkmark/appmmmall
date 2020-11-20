<template>
	<view :class="themeStyle">
		<view class="ns-gradient-otherpages-fenxiao-level-level level-page" :class="themeStyle">
			<view class="head-nav" :class="{ active: isIphoneX }"></view>
			<view class="head-return" @click="navigateBack()">
				<text class="iconfont iconback_light"></text>
				推广员等级
			</view>
			<view class="level-top"> 
				<view class="head-img-wrap">
					<view class="">
						<view class="head-img">
							<image :src="fenxiaoInfo.headimg ? $util.img(fenxiaoInfo.headimg) : $util.getDefaultImage().default_headimg"
							 @error="fenxiaoInfo.headimg = $util.getDefaultImage().default_headimg" mode="aspectFill"></image>
						</view>
						<view class="head-bg ns-text-color" :style="{backgroundImage:'url(' + $util.img('upload/uniapp/fenxiao/level/bg2.png') + ')'}">
							{{ fenxiaoInfo.level_name }}
						</view>
					</view>
					<view class="level-info">
						{{ fenxiaoInfo.nickname }}
					</view>
				</view>
				<scroll-view scroll-x="true" class="level-list">
					<view class="level-list-box">
						<view v-for="(item,index) in levelList" class="level-list-item" :key="index">
							<view class="item-box">
								<view class="iconfont font-father" :class="index<levelIndex?'iconyuan_checkbox isSignin':index==levelIndex?'iconyuan_checked isSignin':'iconyuan_checkbox'">
									<view class="font-son">
										{{item.level_name}}
									</view>
								</view>
								<view class="xian" v-if="index != levelList.length-1" :class="index<levelIndex?'active':''"></view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="level-top-content">
					<view class="content-title-wrap">
						<view class="content-title ns-text-color">
							当前等级提速比率
						</view>
					</view>
					<view class="level-img-item">
						<view class="level-img" v-if="Number(config.level)>0">
							<view class="level-img-wrap">
								<image :src="$util.img('upload/uniapp/fenxiao/level/money.png')"></image>
							</view>
							<view class="level-img2-wrap" :style="{backgroundImage:'url(' + $util.img('upload/uniapp/fenxiao/level/bg1.png') + ')'}">
								<view class="content-name">
									直推奖励
								</view>
							</view>

							<view class="level-fs">
								{{levelInfo.one_rate}}%
							</view>
						</view>
						<view class="level-img" v-if="Number(config.level)>1">
							<view class="level-img-wrap">
								<image :src="$util.img('upload/uniapp/fenxiao/level/money.png')"></image>
							</view>
							<view class="level-img2-wrap" :style="{backgroundImage:'url(' + $util.img('upload/uniapp/fenxiao/level/bg1.png') + ')'}">
								<view class="content-name">
									间推奖励
								</view>
							</view>

							<view class="level-fs">
								{{levelInfo.two_rate}}%
							</view>
						</view>
						<view class="level-img" v-if="Number(config.level)>2">
							<view class="level-img-wrap">
								<image :src="$util.img('upload/uniapp/fenxiao/level/money.png')"></image>
							</view>
							<view class="level-img2-wrap" :style="{backgroundImage:'url(' + $util.img('upload/uniapp/fenxiao/level/bg1.png') + ')'}">
								<view class="content-name">
									三代奖励
								</view>
							</view>
							<view class="level-fs">
								{{levelInfo.three_rate}}%
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="level-bottom" v-if="fenxiaoInfo&&fenxiaoInfo.condition&&fenxiaoInfo.condition.last_level">
				<view class="level-bottom-name">
					距离下一等级：<text class="ns-text-color">{{ fenxiaoInfo.condition.last_level.level_name }}</text>
				</view>
				<view class="level-bottom-title">
					<text class="line-left ns-bg-color"></text>{{fenxiaoInfo.condition.last_level.upgrade_type==1?'满足以下任意条件':'满足以下全部条件'}}<text class="line-right ns-bg-color"></text>
				</view>
				<view class="detail">
					<view class="detail-wrap">
						<view class="detail-title">
							<text>操作行为</text>
							<text>操作进度</text>
						</view>
						<view class="detail-item" v-if="fenxiaoInfo.condition.last_level.one_fenxiao_order_num>0">
							<view class="detail-item-name">
								一级分销订单总数
							</view>
							<view class="detail-item-content">
								<text class="ns-text-color">{{ fenxiaoInfo.condition.fenxiao.one_fenxiao_order_num}}</text> / {{ fenxiaoInfo.condition.last_level.one_fenxiao_order_num}}
							</view>
						</view>
						
						<view class="detail-item" v-if="fenxiaoInfo.condition.last_level.one_fenxiao_order_money>0">
							<view class="detail-item-name">
								一级分销订单总额
							</view>
							<view class="detail-item-content">
								<text class="ns-text-color">{{ fenxiaoInfo.condition.fenxiao.one_fenxiao_order_money ? fenxiaoInfo.condition.fenxiao.one_fenxiao_order_money : 0}}</text> / {{ fenxiaoInfo.condition.last_level.one_fenxiao_order_money}}
							</view>
						</view>
						<view class="detail-item"  v-if="fenxiaoInfo.condition.last_level.order_num>0">
							<view class="detail-item-name">
								自购订单总数
							</view>
							<view class="detail-item-content">
								<text class="ns-text-color">{{ fenxiaoInfo.condition.fenxiao.order_num ? fenxiaoInfo.condition.fenxiao.order_num : 0}}</text> / {{ fenxiaoInfo.condition.last_level.order_num}}
							</view>
						</view>
						<view class="detail-item"  v-if="fenxiaoInfo.condition.last_level.order_money>0">
							<view class="detail-item-name">
								自购订单总额
							</view>
							<view class="detail-item-content">
								<text class="ns-text-color">{{ fenxiaoInfo.condition.fenxiao.order_money ? fenxiaoInfo.condition.fenxiao.order_money : 0}}</text> / {{ fenxiaoInfo.condition.last_level.order_money}}
							</view>
						</view>
						<view class="detail-item" v-if="fenxiaoInfo.condition.last_level.one_child_num>0">
							<view class="detail-item-name">
								一级下线人数
							</view>
							<view class="detail-item-content" >
								<text class="ns-text-color">{{ fenxiaoInfo.condition.fenxiao.one_child_num ? fenxiaoInfo.condition.fenxiao.one_child_num : 0}}</text> / {{ fenxiaoInfo.condition.last_level.one_child_num}}
							</view>
						</view>
						<view class="detail-item"  v-if="fenxiaoInfo.condition.last_level.one_child_fenxiao_num>0">
							<view class="detail-item-name">
								一级下线分销商
							</view>
							<view class="detail-item-content">
								<text class="ns-text-color">{{ fenxiaoInfo.condition.fenxiao.one_child_fenxiao_num ? fenxiaoInfo.condition.fenxiao.one_child_fenxiao_num : 0}}</text> / {{ fenxiaoInfo.condition.last_level.one_child_fenxiao_num}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="max-level" v-else>
				恭喜您当前已经是最高等级了哦！
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import fenxiaoWords from 'common/js/fenxiao-words.js';

	export default {
		data() {
			return {
				fenxiaoInfo: {},
				levelInfo: {},
				config: {},
				levelList: [],
				isIphoneX: false,
				back: '', //返回页
				redirect: '' //返回方式
			}
		},
		mixins: [fenxiaoWords],
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			},
			levelIndex() {
				let index = -1;
				let levelId = this.fenxiaoInfo.level_id
				let array = this.levelList;
				for (let i = 0; i < array.length; i++) {
					if (array[i].level_id == levelId) {
						index = i;
						break;
					}
				}
				return index;
			}
		},
		onLoad(option) {
			this.getFenxiaoLevel(),
				this.isIphoneX = this.$util.uniappIsIPhoneX();
			if (option.back) this.back = option.back;
			if (option.redirect) this.redirect = option.redirect;
		},
		onShow() {
			this.$langConfig.refresh();
			uni.setNavigationBarTitle({
				title: this.fenxiaoWords.fenxiao_name + '等级'
			});

			if (uni.getStorageSync('token')) {
				this.getFenxiaoInfo();
				this.getBasicsConfig();
			} else {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/otherpages/fenxiao/level/level'
				});
			}
		},
		methods: {
			navigateBack() {
				if (this.back != '') {
					this.$util.redirectTo(this.back, {}, this.redirect);
				} else {
					this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
				}
			},
			/**
			 * 获取分销等级信息
			 */
			getFenxiaoLevel() {
				this.$api.sendRequest({
					url: '/fenxiao/api/Level/lists',
					success: res => {
						if (res.code == 0 && res.data) {
							this.levelList = res.data
						}
					}
				})
			},


			/**
			 * 获取分销商信息
			 */
			getFenxiaoInfo() {
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/detail',
					success: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						if (res.code >= 0 && res.data) {
							this.fenxiaoInfo = res.data;
							if(this.fenxiaoInfo.condition&&this.fenxiaoInfo.condition.last_level){
								this.fenxiaoInfo.condition.last_level.one_fenxiao_order_money=this.fenxiaoInfo.condition.last_level.one_fenxiao_order_money?Number(this.fenxiaoInfo.condition.last_level.one_fenxiao_order_money):0;
								this.fenxiaoInfo.condition.last_level.order_money=this.fenxiaoInfo.condition.last_level.order_money?Number(this.fenxiaoInfo.condition.last_level.order_money):0
							}
							this.getLevelInfo();
						} else {
							this.$util.redirectTo('/otherpages/fenxiao/apply/apply');
						}
						this.$refs.loadingCover.hide();
					},
					fail: () => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				})
			},
			getLevelInfo() {
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/level',
					data: {
						level: this.fenxiaoInfo.level_id
					},
					success: res => {
						if (res.code >= 0) {
							this.levelInfo = res.data;
						}
					}
				})
			},
			/**
			 * 获取分销基本配置
			 */
			getBasicsConfig() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/basics',
					success: res => {
						if (res.code >= 0) {
							this.config = res.data;
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
		.level-page{
			min-height: 100vh;
		}
		@mixin wrap {
			position: relative;
		}

		.head-nav {
			width: 100%;
			height: var(--status-bar-height);
		}

		.head-nav.active {
			padding-top: 40rpx;
		}

		.head-return {
			padding-left: 30rpx;
			height: 90rpx;
			line-height: 90rpx;
			color: #333;
			font-weight: 600;
			font-size: $ns-font-size-lg;
			color: #ffffff;

			text {
				display: inline-block;
				margin-right: 10rpx;
			}
		}

		.level-top {
			height: 800rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: relative;

			.head-img-wrap {
				flex: 2;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.head-img {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					border: 6rpx solid #FFFFFF;
					box-sizing: border-box;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.head-bg {
					height: 40rpx;
					margin-top: -28rpx;
					background-size: 100% 100%;
					position: relative;
					font-size: $ns-font-size-sm;
					text-align: center;
					line-height: 50rpx;
					min-width: 120rpx;
					padding: 0 $ns-padding;
					box-sizing: border-box;
				}

				.level-info {
					color: #FFFFFF;
					font-size: $ns-font-size-lg;
				}
			}

			.level-list {
				padding: 0 100rpx;
				box-sizing: border-box;
				height: 120rpx;
				flex-direction: row;
				white-space: nowrap;


				.level-list-box {
					width: 100%;
					text-align: center;
					padding: 0 20rpx;
					box-sizing: border-box;
					
					.level-list-item{
						display: inline-block;
						.item-box{
							display: flex;
							align-items: center;
						}
					}
					.iconfont {
						font-size: 40rpx;
						color: rgba($color: #ffffff, $alpha: 0.6);
						line-height: 1;
					}

					.isSignin {
						color: #FFFFFF;
					}

					.xian {
						width: 100rpx;
						border: 1rpx solid rgba($color: #ffffff, $alpha: 0.6);
					}

					.xian.active {
						border: 1rpx solid #ffffff;
					}

					.font-father {
						position: relative;
					}

					.font-son {
						width: 100rpx;
						height: 50rpx;
						position: absolute;
						bottom: -60rpx;
						left: -30rpx;
						text-align: center;
						line-height: 50rpx;
						color: #ffffff;
					}

					.level-item-name {
						color: #FFFFFF;
						padding: 20rpx 50rpx;
					}

				}
			}

			.level-top-content {
				background-color: #FFFFFF;
				flex: 2;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 95%;
				margin-bottom: 30rpx;
				border-radius: 10rpx;

				.content-title-wrap {
					flex: 1;

					.content-title {
						padding-top: 10rpx;
						font-size: 32rpx;
						font-weight: bold;
					}
				}

				.level-img-item {
					flex: 3;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;

					.level-img {
						width: 30%;
						position: relative;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						.level-img-wrap {
							width: 88rpx;
							height: 88rpx;
							border-radius: 50%;
							border: 1rpx solid #E5E5E5;
							background-color: #FFFFFF;
							display: flex;
							justify-content: center;
							align-items: center;

							image {
								width: 60rpx;
								height: 60rpx;
							}
						}

						.level-img2-wrap {
							width: 170rpx;
							height: 50rpx;
							background-size: 100% 100%;
							background-repeat: no-repeat;
							text-align: center;
							line-height: 30rpx;
							margin-top: -15rpx;
						}

						.content-name {
							position: relative;
							width: 100%;
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #FFFFFF;
							font-size: 20rpx;
						}

						.level-fs {
							font-size: $ns-font-size-base;
						}
					}
				}
			}
		}

		.detail-wrap .detail-item:nth-child(2n+1) {
			background-color: #f7f8fa;
		}

		.level-bottom {
			display: flex;
			flex-direction: column;
			padding: 15rpx;
			background-color: #FFFFFF;
			height: 50%;

			.level-bottom-name {
				color: $ns-text-color-gray;
				font-size: $ns-font-size-base;

				text {
					padding-left: 5rpx;
				}
			}

			.level-bottom-title {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 10rpx 0;

				text {
					width: 100rpx;
					border: 1rpx solid lighten($base-color, 10%);
				}
			}

			.detail {
				display: flex;
				flex-direction: column;

				.detail-wrap {
					display: flex;
					flex-direction: column;

					.detail-title {
						height: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						text {
							flex: 1;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}

					.detail-item {
						height: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						.detail-item-name {
							flex: 1;
							color: $ns-text-color-gray;
							display: flex;
							justify-content: center;
							align-items: center;

						}

						.detail-item-content {
							flex: 1;
							color: $ns-text-color-gray;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
				}
			}
		}
		.max-level{
			width: 100%;
			height: 200rpx;
			text-align: center;
			line-height: 200rpx;
			color: #ffffff;
		}
</style>
