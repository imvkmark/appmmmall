<template>
	<view class="container" :class="themeStyle">
		<view class="site-wrap">
			<view class="site-header">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ verifyInfo.site_name }}</text>
				<view class="iconfont iconright"></view>
			</view>
			<view class="site-body">
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in verifyInfo.item_array" :key="goodsIndex">
					<view class="goods-img">
						<image :src="$util.img(goodsItem.img)" @error="imageError(goodsIndex)" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">{{ goodsItem.name }}</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price ns-text-color">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									<text>{{ goodsItem.price | abs }}</text>
								</text>
							</view>
							<view>
								<text>
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="order-summary">
			<view class="order-cell" v-for="(remarkItem, remarkIndex) in verifyInfo.remark_array" :key="remarkIndex">
				<text class="tit">{{ remarkItem.title }}：</text>
				<view class="box">
					<text class="ns-text-color-gary">{{ remarkItem.value }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">核销类型：</text>
				<view class="box">
					<text class="ns-text-color-gary">{{ verifyInfo.verify_type_name }}</text>
				</view>
			</view>
			<block v-if="verifyInfo.is_verify">
				<view class="order-cell">
					<text class="tit">核销状态：</text>
					<view class="box"><text class="ns-text-color-gary">已核销</text></view>
				</view>
				<view class="order-cell" v-if="verifyInfo.verify_time">
					<text class="tit">核销人员：</text>
					<view class="box">
						<text class="ns-text-color-gary">{{ verifyInfo.verifier_name }}</text>
					</view>
				</view>
				<view class="order-cell" v-if="verifyInfo.verify_time">
					<text class="tit">核销时间：</text>
					<view class="box">
						<text class="ns-text-color-gary">{{ $util.timeStampTurnTime(verifyInfo.verify_time) }}</text>
					</view>
				</view>
			</block>
		</view>
		<view class="verify-btn" @click="verify" v-if="verifyInfo.is_verify == 0"><button type="primary">确认使用</button></view>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: '',
				verifyInfo: {
					verify_content: {
						item_array: [],
						remark_array: []
					}
				},
				isSub: false
			};
		},
		onLoad(option) {
			if (option.code) this.code = option.code;
			// 小程序扫码进入
			if (option.scene) {
				var sceneParams = decodeURIComponent(option.scene);
				sceneParams = sceneParams.split('&');
				if (sceneParams.length) {
					sceneParams.forEach(item => {
						if (item.indexOf('code') != -1) this.code = item.split('-')[1];
					});
				}
			}
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (uni.getStorageSync('token')){
				 this.checkIsVerifier();
			}else{
				this.$util.redirectTo('/pages/login/login/login', {'back':'/otherpages/verification/detail/detail?code='+this.code}, 'redirectTo');
				return ;
			}
			this.getVerifyInfo();
		},
		methods: {
			checkIsVerifier() {
				this.$api.sendRequest({
					url: '/api/verify/checkisverifier',
					success: res => {
						if (!res.data) {
							this.$util.showToast({
								title: '非核销员无此权限'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
							}, 1000);
						}
					}
				});
			},
			getVerifyInfo() {
				this.$api.sendRequest({
					url: '/api/verify/verifyInfo',
					data: {
						verify_code: this.code
					},
					success: res => {
						if (res.code >= 0) {
							this.verifyInfo = res.data;
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						} else {
							this.$util.showToast({
								title: res.message
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
							}, 1000);
						}
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			verify() {
				if (this.isSub) return;
				this.isSub = true;
				this.$api.sendRequest({
					url: '/api/verify/verify',
					data: {
						verify_code: this.code
					},
					success: res => {
						this.$util.showToast({
							title: res.message
						});
						if (res.code >= 0) {
							setTimeout(() => {
								this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
							}, 1000);
						} else {
							this.isSub = false;
						}
					}
				});
			},
			imageError(index) {
				this.verifyInfo.item_array[index].img = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		},
		filters: {
			abs(value) {
				return Math.abs(parseFloat(value)).toFixed(2);
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/detail.scss';
</style>
