<template>
	<view class="container" :class="themeStyle">
		<view class="image-wrap"><image :src="$util.img('upload/uniapp/pay_success.png')" mode="" class="result-image"></image></view>
		<view class="msg">{{ $lang('exchangeSuccess') }}</view>
		<view class="operation">
			<view class="btn ns-border-color ns-text-color" @click="$util.redirectTo('/promotionpages/point/order_list/order_list', {}, 'redirectTo')">{{ $lang('see') }}</view>
			<view class="btn go-home ns-bg-color" @click="$util.redirectTo('/pages/index/index/index', {}, 'redirectTo')">{{ $lang('goHome') }}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		};
	},
	onLoad() {
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
	},
	computed:{
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		}
	}
};
</script>

<style lang="scss">
.container {
	width: 100vw;
	height: 100vh;
	background: #fff;

	.image-wrap {
		display: flex;
		justify-content: center;
		padding: 200rpx 0 40rpx 0;

		.result-image {
			width: 140rpx;
			height: 140rpx;
		}
	}

	.msg {
		text-align: center;
		font-size: 40rpx;
		font-weight: 600;
		line-height: 1;
		margin-bottom: 50rpx;
	}

	.pay-amount {
		color: #999;
		text-align: center;
		line-height: 1;
		margin-bottom: 30rpx;
	}

	.operation {
		text-align: center;

		.btn {
			display: inline-block;
			line-height: 1;
			padding: 24rpx 70rpx;
			border: 2rpx solid #ffffff;
			margin-left: 30rpx;
			border-radius: 80rpx;
			font-size: 24rpx;
		}

		.alone {
			margin-left: 0;
			width: 60%;
		}

		.go-home {
			color: #fff;
		}
	}
}
</style>
