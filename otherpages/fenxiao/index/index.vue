<template>
	<view class="fenxiao_index" :data-theme="themeStyle">
		<block v-if="info.fenxiao_name">
			<!-- 头部 -->
			<view class="fenxiao_index_header ns-bg-color">
				<view class="member">
					<view class="member-pic"><image :src="info.headimg ? $util.img(info.headimg) : $util.getDefaultImage().default_headimg" @error="info.headimg = $util.getDefaultImage().default_headimg" mode="aspectFill"></image></view>
					<view class="member-info">
						<view class="">
							<!-- <view class="" @click="toLevel()"> -->
							<text>{{ info.fenxiao_name }}</text>
							<text class="level_name">{{ info.level_name }}</text>
						</view>
						<view v-if="info.parent_name">推荐人：{{ info.parent_name }}</view>
					</view>
					<!-- <view class="member-tixian" @click="goTixian()">{{ fenxiaoWords.withdraw }}</view> -->
					<navigator  hover-class="none" class="manu-list-box" url="/otherpages/fenxiao/promote_code/promote_code">
						<image class="code" :src="$util.img('upload/uniapp/fenxiao/index/code1.png')" mode="aspectFill"></image>
					</navigator>
				</view>
			</view>
			<!-- 提现 -->
			<view class="fenxiao_index_money">
				<view class="index-money-item">
					<text class="item_money">{{ info.account }}</text>
					<text class="item_tit">可{{fenxiaoWords.withdraw}}</text>
					
				</view>
				<view class="xian">
					
				</view>
				<view class="index-money-item">
					<text class="item_money">{{ info.account_withdraw }}</text>
					<text class="item_tit">已{{fenxiaoWords.withdraw}}</text>
					
				</view>
				<view class="xian">
					
				</view>
				<view class="index-money-item">
					<text class="item_money">{{ info.account_withdraw_apply }}</text>
					<!-- <text class="item_tit">{{fenxiaoWords.withdraw}}中</text> -->
					<text class="item_tit">待{{fenxiaoWords.withdraw}}</text>
					<!-- <text class="item_tit">（审核中）</text> -->
					
				</view>
			</view>
		    <!-- 佣金 -->
			<view class="fenxiao_index_allmoney">
				<view class="title-wrap">
					<image class="title-img" :src="$util.img('upload/uniapp/fenxiao/index/money.png')" mode="aspectFill"></image>
					<view class="title">
						我的团队
					</view>
				</view>
				<view class="all_money_wrap">
					<!-- <view class="all-money ns-text-color">
						<text class="ns-font-size-lg">{{ info.total_commission }}%</text>
					</view> -->
					<view class="all-money-item">
						<text class="all-money-num">{{ teamNum }}</text>
						<text class="all-money-tit">我的团队</text>
						
					</view>
					<view class="xian">
						
					</view>
					<view class="all-money-item">
						<text class="all-money-num">{{ info.one_child_num }}</text>
						<text class="all-money-tit">推荐会员</text>
						
					</view>
				</view>
			</view>
			<!-- 功能列表 -->
			<view class="fenxiao_manu_list">
				<view class="title-wrap">
					<image class="title-img" :src="$util.img('upload/uniapp/fenxiao/index/gongneng.png')" mode="aspectFill"></image>
					<view class="title">
						常用功能
					</view>
				</view>
				<view class="content_manu">
					<!-- <view class="manu-list">
						<navigator hover-class="none" class="manu-list-box" url="/otherpages/fenxiao/withdraw_apply/withdraw_apply">
							<image :src="$util.img('upload/uniapp/fenxiao/index/withdraw.png')" mode="aspectFill"></image>
							<text>{{fenxiaoWords.withdraw}}</text>
						</navigator>
					</view> -->
					<view class="manu-list">
						<navigator hover-class="none" class="manu-list-box" url="/otherpages/fenxiao/withdraw_list/withdraw_list">
							<image :src="$util.img('upload/uniapp/fenxiao/index/tixian.png')" mode="aspectFill"></image>
							<!-- <text>{{fenxiaoWords.withdraw}}明细</text> -->
							<text>MM币明细</text>
						</navigator>
					</view>
					<view class="manu-list">
						<navigator hover-class="none" class="manu-list-box" url="/otherpages/fenxiao/order/order">
							<image :src="$util.img('upload/uniapp/fenxiao/index/order.png')" mode="aspectFill"></image>
							<text>{{fenxiaoWords.concept+'订单'}}</text>
						</navigator>
					</view>
					<view class="manu-list">
						<navigator hover-class="none" class="manu-list-box" url="/otherpages/fenxiao/team/team">
							<image :src="$util.img('upload/uniapp/fenxiao/index/team.png')" mode="aspectFill"></image>
							<text>{{fenxiaoWords.my_team}}</text>
						</navigator>
					</view>
					<view class="manu-list">
						<navigator  hover-class="none" class="manu-list-box" url="/otherpages/fenxiao/promote_code/promote_code">
							<image :src="$util.img('upload/uniapp/fenxiao/index/code.png')" mode="aspectFill"></image>
							<text>推广码</text>
						</navigator>
					</view>
					<!-- <view class="manu-list">
						<navigator  hover-class="none" class="manu-list-box" url="/otherpages/diy/diy/diy?name=DIY_FENXIAO_MARKET">
							<image :src="$util.img('upload/uniapp/fenxiao/index/market.png')" mode="aspectFill"></image>
							<text>{{fenxiaoWords.concept+'市场'}}</text>
						</navigator>
					</view> -->
					<!-- <view class="manu-list">
						<navigator  hover-class="none" class="manu-list-box" url="/otherpages/fenxiao/follow/follow">
							<image :src="$util.img('upload/uniapp/fenxiao/index/collection.png')" mode="aspectFill"></image>
							<text>{{fenxiaoWords.concept + '商品'}}</text>
						</navigator>
					</view> -->
					<view class="manu-list">
						<navigator  hover-class="none" class="manu-list-box" url="/otherpages/fenxiao/bill/bill">
							<image :src="$util.img('upload/uniapp/fenxiao/index/bill.png')" mode="aspectFill"></image>
							<text>账单</text>
						</navigator>
					</view>
				</view>
			</view>
		</block>
		<view class="empty"  v-if="!info.fenxiao_name&&showEmpty">
			<image :src="$util.img('upload/uniapp/fenxiao/index/no-fenxiao.png')" mode="widthFix"></image>
			<text>您还不是{{fenxiaoWords.fenxiao_name}}，请先提交申请</text>
			<navigator  hover-class="none" class="ns-bg-color" url="/otherpages/fenxiao/apply/apply">立即加入</navigator>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import fenxiaoWords from 'common/js/fenxiao-words.js';
import globalConfig from '@/common/js/golbalConfig.js'
export default {
	data() {
		return {
			info: {
				fenxiao_name: '',
			},
			showEmpty:false,
			teamNum: 0
		};
	},
	mixins: [fenxiaoWords,globalConfig],
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		uni.setNavigationBarTitle({
			title: this.fenxiaoWords.concept + '中心'
		});

		if (uni.getStorageSync('token')) {
			this.getFenxiaoDetail();
		} else {
			this.$util.redirectTo(
				'/pages/login/login/login',
				{
					back: '/otherpages/fenxiao/index/index'
				},
				'redirectTo'
			);
		}
	},
	methods: {
		// 获取分销商信息
		getFenxiaoDetail() {
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/detail',
				success: res => {
					if (res.data) {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						this.info = res.data;
						this.getTeamNum();
						this.showEmpty=true;
					} else {
						this.$util.redirectTo('/otherpages/fenxiao/apply/apply',{},'redirectTo');
					}
				},
				fail: res => {
					this.showEmpty=true;
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//去提现
		goTixian() {
			this.$util.redirectTo('/otherpages/fenxiao/withdraw_apply/withdraw_apply');
		},
		toLevel() {
			this.$util.redirectTo('/otherpages/fenxiao/level/level',{'back':'/otherpages/fenxiao/index/index','redirect':'redirectTo'},);
		},
		getTeamNum(){
			this.$api.sendRequest({
				url: '/fenxiao/api/fenxiao/teamnum',
				success: res => {
					if (res.code >= 0) {
						this.teamNum = res.data;
					} 
				}
			});
		}
	},
	onBackPress(options) {
		if (options.from === 'navigateBack') {
			return false;
		}
		this.$util.redirectTo('/pages/member/index/index',{}, 'reLaunch')
		return true;
	}
};
</script>

<style lang="scss">

.fenxiao_index{
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.fenxiao_index_header {
	width: 100%;
	// background: linear-gradient(180deg, $base-color, #fd814b);
	position: relative;
	height: 260rpx;
	.member {
		width: 100%;
		height: 220rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 50rpx 40rpx;
		box-sizing: border-box;

		.member-pic {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			border: 4rpx solid #ffffff;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.member-info {
			width: 500rpx;
			height: 120rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			view {
				color: #ffffff;
			}
			.level_name {
				display: inline-block;
				border: 2rpx solid #ffffff;
				color: #ffffff;
				height: 34rpx;
				font-size: 20rpx;
				padding: 0 10rpx;
				margin-left: 10rpx;
				line-height: 38rpx;
				border-radius: 4rpx;
			}
		}

		.member-tixian {
			width: 120rpx;
			height: 50rpx;
			border: 2rpx solid #ffffff;
			border-radius: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			color: #ffffff;
		}
		.code{
			width: 50rpx;
			height: 50rpx;
			margin-right: $ns-margin;
		}
	}
}

.fenxiao_index_money{
	background-color: #FFFFFF;
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 90%;
	position: absolute;
	top: 210rpx;
	
	.xian{
		height: 80rpx;
		border: 1rpx solid #f7f7f7;
	}
	
	.index-money-item{
		padding: 40rpx 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		
		.item_money{
			color: #333333;
			font-size: 40rpx;
			line-height: 1;
		}
		.item_tit{
			padding-top: 10rpx;
			font-size: $ns-font-size-sm;
			color: $ns-text-color-gray;
		}
	}
}

.fenxiao_index_allmoney{
	display: flex;
	flex-direction: column;
	width: 90%;
	border-radius: 20rpx;
	background-color: #FFFFFF;
	position: absolute;
	top: 410rpx;
	
	.title-wrap{
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #f7f7f7;
		padding: 20rpx 40rpx;
		.title-img{
			width: 30rpx;
			height: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 10rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.title{
			color: #333333;
			font-size: $ns-font-size-base;
			line-height: 1;
		}
	}
	.all_money_wrap{
		display: flex;
		justify-content: center;
		align-items: center;
					padding: 25rpx 15rpx;
		.all-money{
			flex: 4;
			font-size: 35rpx;
		}
		.all-money{
			font-weight: 600;
			padding-left: 56rpx;
		}
		.xian{
			height: 80rpx;
			border: 1rpx solid #f7f7f7;
		}
		.all-money-item{
			flex: 3;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			
			.all-money-tit{
				color: $ns-text-color-gray;
				font-size: $ns-font-size-sm;
			}
			.all-money-num{
				
				color: #333333;
				font-size: 35rpx;
			}
		}
	}
}
.fenxiao_manu_list{
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 90%;
	border-radius: 20rpx;
	background-color: #FFFFFF;
	position: absolute;
	top: 675rpx;
	.title-wrap{
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #f7f7f7;
		padding: 20rpx 40rpx;
		.title-img{
			width: 30rpx;
			height: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 10rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.title{
			color: #333333;
			font-size: $ns-font-size-base;
			padding-left: 10rpx;
			padding-left: 5rpx;
			line-height: 1;
		}
	}
	.content_manu {
		width: 100%;
		background: #ffffff;
		border-radius: 15rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 10rpx;
		.manu-list {
			width: 33.33%;
			height: 150rpx;
			display: inline-block;
			padding: 0 $ns-padding;
			box-sizing: border-box;
			.manu-list-box {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image {
					width: 50rpx;
					height: 50rpx;
					margin-bottom: 15rpx;
				}
				text {
					font-size: $ns-font-size-sm;
				}
			}
		}
	}
}
.fenxiao_content {
	.content_manu {
		width: 100%;
		background: #ffffff;
		border-radius: 15rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		.manu-list {
			width: 24.5%;
			height: 150rpx;
			display: inline-block;
			box-sizing: border-box;
			.manu-list-box {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image {
					width: 60rpx;
					height: 60rpx;
					margin-bottom: 15rpx;
				}
				text {
					font-size: $ns-font-size-sm;
				}
			}
		}
	}
}
.empty {
	width: 100%;
	height: 400rpx;
	margin-top: 200rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	image {
		width: 300rpx;
		margin-bottom: 50rpx;
	}
	text {
		font-size: $ns-font-size-sm;
		font-weight: 600;
	}
	navigator {
		width: 300rpx;
		height: 70rpx;
		background: $base-color;
		border-radius: 70rpx;
		text-align: center;
		line-height: 70rpx;
		color: #ffffff;
		margin-top: 30rpx;
	}
}
.member-level {
	width: 100%;
	height: 66rpx;
	padding: 0 $ns-padding;
	box-sizing: border-box;
	margin-top: 12rpx;
	.member-level-box {
		width: 100%;
		height: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		background: linear-gradient(to right, #1d1d1d, rgba(#1d1d1d, 0.4));
		padding: 0 $ns-padding;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #ffd700;
		.iconv {
			font-size: 36rpx;
		}
		text {
			line-height: 1;
			display: flex;
			align-items: center;
			text {
				display: inline-block;
			}
		}
	}
}
</style>
