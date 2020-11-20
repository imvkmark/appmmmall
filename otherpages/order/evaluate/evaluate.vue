<template>
	<view :class="themeStyle">
		<view>
			<view class="page">
				<block v-for="(item, index) in goodsList" :key="index">
					<view class="eval-good">
						<view class="good-box">
							<image class="good_pic" :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" />
							<view class="good_info ns-font-size-base">{{ item.sku_name }}</view>
						</view>
					</view>
					<view class="eval-star" v-if="!isEvaluate">
						<view class="star-box">
							<view class="star-title ns-bg-before">描述相符</view>
							<view class="rate-box">
								<sx-rate :value="goodsEvalList[index].scores" :index="index" @change="setStar" />
							</view>
							<view class="grade-li">
								<view class="icon iconfont" :class="
										goodsEvalList[index].explain_type == '1'
											? 'iconhaoping1 ns-text-color'
											: goodsEvalList[index].explain_type == '2'
											? 'iconzhongchaping ns-text-color'
											: goodsEvalList[index].explain_type == '3'
											? 'iconzhongchaping'
											: ''
									"></view>
								<view class="ns-font-size-base ns-text-color">
									{{
										goodsEvalList[index].explain_type == '1'
											? '好评'
											: goodsEvalList[index].explain_type == '2'
											? '中评'
											: goodsEvalList[index].explain_type == '3'
											? '差评'
											: ''
									}}
								</view>
							</view>
						</view>
					</view>
		
					<view class="eval-text">
						<view class="text-box">
							<block v-if="!isEvaluate">
								<textarea value="" placeholder="请在此处输入您的评价" v-model="goodsEvalList[index].content" maxlength="200" />
								<text class="maxSize">{{ goodsEvalList[index].content.length }}/200</text>
							</block>
							<block v-else>
								<textarea value="" placeholder="请在此处输入您的追评" v-model="goodsEvalList[index].again_content" maxlength="200" />
								<text class="maxSize">{{ goodsEvalList[index].again_content.length }}/200</text>
							</block>
		
							<view class="other-info">
								<view class="other-info-box" v-for="(i, t) in imgList[index]" :key="t">
									<image :src="$util.img(i)" mode="aspectFit" @click="preview(i, index)"></image>
									<view class="imgDel" @click="deleteImg(i, index)"><text class=" icon iconfont ns-text-color icondelete"></text></view>
								</view>
								<view class="other-info-box active" @click="addImg(index)" v-if="imgList[index].length < 6 || imgList[index].length == undefined">
									<text class="icon iconfont iconzhaoxiangji"></text>
									<text>{{ imgList[index].length ? 6 - imgList[index].length : 0 }}/6</text>
								</view>
							</view>
						</view>
					</view>
				</block>
		
				<view class="shop-evaluate" v-if="!isEvaluate">
					<view class="site-name">{{ siteName }}</view>
					<view class="score-wrap">
						<text>配送服务</text>
						<sx-rate :value="5" :index="'shop_deliverycredit'" @change="shopScore" />
					</view>
					<view class="score-wrap">
						<text>描述相符</text>
						<sx-rate :value="5" :index="'shop_desccredit'" @change="shopScore" />
					</view>
					<view class="score-wrap">
						<text>服务态度</text>
						<sx-rate :value="5" :index="'shop_servicecredit'" @change="shopScore" />
					</view>
				</view>
			</view>
			<view class="eval-bottom" :class="{ 'safe-area': isIphoneX }">
				<view class="all-election" @click="isAll()" v-if="!isEvaluate">
					<view class="iconfont ns-text-color" :class="isAnonymous ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"></view>
					<text>匿名</text>
				</view>
				<view v-else></view>
				<view class="operation-btn"><button type="primary" size="mini" @click="save()">提交</button></view>
			</view>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
	
</template>

<script>
// import uniRate from '@/components/uni-rate/uni-rate.vue';
import evaluate from '../public/js/evaluate.js';
import sxRate from '@/components/sx-rate/index.vue'
export default {
	components: {
		sxRate
	},
	mixins: [evaluate],
	data() {
		return {
			isIphoneX: false //判断手机是否是iphoneX以上
		};
	},
	computed: {
		//vueX页面主题
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		}
	},
	onLoad(options) {
		//接收订单号，订单是否是追评等信息
		options.order_id ? (this.orderId = options.order_id) : this.$util.redirectTo('/pages/order/list/list');
		this.isIphoneX=this.$util.uniappIsIPhoneX()
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/login/login/login', { back: '/otherpages/order/evaluate/evaluate?order_id=' + this.orderId }, 'redirectTo');
		}
		this.getUserInfo();
		this.getOrderInfo();
	},
	onShow() {
		//初始化重复点击
		this.flag = false;
		// 刷新多语言
		this.$langConfig.refresh();
	}
};
</script>

<style lang="scss">
.page {
	padding-bottom: 100rpx;
}
.eval-good {
	width: 100%;
	padding: 0 $ns-padding;
	box-sizing: border-box;
	background: #ffffff;

	.good-box {
		width: 100%;
		height: 100%;
		padding: $ns-padding 0;
		border-bottom: 2rpx solid #f5f5f5;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;

		.good_pic {
			width: 150rpx;
			height: 150rpx;
			margin-right: $ns-margin;
		}

		.good_info {
			width: 510rpx;
			height: 100%;
			line-height: 1.3;
			padding: 10rpx 0;
			box-sizing: border-box;
		}
	}
}

.eval-text {
	width: 100%;
	padding: 0 $ns-padding;
	box-sizing: border-box;
	padding-bottom: $ns-padding;
	margin-top: $ns-margin;

	.text-box {
		width: 100%;
		height: 100%;
		border-radius: 15rpx;
		background: #ffffff;
		padding-bottom: $ns-padding;
		box-sizing: border-box;
		position: relative;

		textarea {
			width: 100%;
			height: 190rpx;
			padding: $ns-padding;
			box-sizing: border-box;
			font-size: $ns-font-size-sm;
		}
	}

	.maxSize {
		position: absolute;
		right: 20rpx;
		top: 160rpx;
		color: #999;
		font-size: $ns-font-size-sm;
	}

	.other-info {
		width: 100%;
		padding: 0 $ns-padding;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		margin-top: $ns-margin;
	}

	.other-info-box {
		width: 145rpx;
		height: 145rpx;
		margin-right: $ns-margin;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		position: relative;
		image {
			width: 100%;
		}
		.iconfont {
			font-size: 60rpx;
			color: #898989;
			line-height: 1;
		}
		text {
			line-height: 1;
		}
		.imgDel {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: -20rpx;
			top: -20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.iconfont {
				font-size: $ns-font-size-lg;
			}
		}
	}
	.other-info-box.active {
		border: 1rpx dashed #898989;
	}
	.other-info-box.active:active {
		background: rgba($color: #cccccc, $alpha: 0.6);
	}
	.other-info-box:nth-child(4n) {
		margin-right: 0;
	}
}

.eval-star {
	width: 100%;
	background: #ffffff;
	padding: $ns-padding;
	box-sizing: border-box;

	.star-box {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;

		.star-title {
			height: 60rpx;
			position: relative;
			padding: 0 $ns-padding;
			box-sizing: border-box;
			line-height: 60rpx;
			font-size: $ns-font-size-base;
			font-weight: bold;
		}

		.star-title::before {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			top: 25%;
			width: 4rpx;
			height: 50%;
		}

		.grade-li {
			width: 30%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.iconhaoping1 {
			font-size: $ns-font-size-base;
			margin-right: 10rpx;
		}

		.iconhaoping {
			font-size: $ns-font-size-base;
			color: #999;
			margin-right: 10rpx;
		}

		.iconzhongchaping {
			font-size: $ns-font-size-base;
			margin-right: 10rpx;
		}

		.iconchaping {
			font-size: $ns-font-size-base;
			color: #999;
			margin-right: 10rpx;
		}
	}
}

.shop-evaluate {
	margin: 20rpx 0;
	background: #fff;
	padding: 20rpx;

	.site-name {
		height: 80rpx;
		line-height: 80rpx;
		color: #999;
	}

	.score-wrap {
		height: 60rpx;
		display: flex;
		align-items: center;

		& > text {
			height: 60rpx;
			line-height: 60rpx;
			display: inline-block;
			transform: translateY(-4rpx);
			font-weight: 600;
			margin-right: $ns-margin; 
		}

		& > view {
			flex: 1;
			display: flex;
			align-items: center;
			padding-left: 20rpx;
		}
	}
}

.eval-bottom {
	position: fixed;
	z-index: 5;
	width: 100vw;
	height: 100rpx;
	background: #fff;
	bottom: var(--window-bottom);
	overflow: hidden;
	display: flex;
	justify-content: space-between;
	&.safe-area {
		padding-bottom: 68rpx !important;
	}

	.all-election {
		height: 100rpx;
		position: relative;
		padding-left: 20rpx;
		display: inline-block;

		& > .iconfont {
			font-size: 45rpx;
			position: absolute;
			top: 50%;
			left: 24rpx;
			transform: translateY(-50%);
		}

		& > text {
			margin-left: 56rpx;
			line-height: 100rpx;
		}
	}

	.operation-btn {
		width: 230rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.operation-btn.disabled:after {
		content: '';
		border: none;
	}
}
</style>
