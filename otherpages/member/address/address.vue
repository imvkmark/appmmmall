<template>
	<view :class="themeStyle">
		<view>
			<mescroll-uni ref="mescroll" @getData="getListData">
				<block slot="list">
					<view class="address-list">
						<view class="address-item" v-for="(item, index) in addressList" :key="index">
							<view class="address-item-top" @click="setDefault(item.id)">
								<view class="address-top-info">
									<view class="address-name">
										{{ item.name }} 
									</view>
									<view class="address-tel">
										{{ item.mobile }}
									</view>
								</view>
								<view class="address-info">
									{{ item.full_address }}{{ item.address }}
								</view>
							</view>
							<view class="address-item-bottom">
								<view class="address-default">
									<view class="iconfont" :class="item.is_default == 1 ? 'iconyuan_checked ns-text-color' : 'iconyuan_checkbox'"></view>
									<text class="default" :class="{ 'ns-text-color': item.is_default == 1 }" @click="setDefault(item.id)">{{ $lang('defaultAddress') }}</text>
								</view>
								<view class="address-btn">
									<text class="edit" @click="addAddress('edit', item.id)">{{ $lang('modify') }}</text>
									<text class="delete" v-if="item.is_default != 1" @click="deleteAddress(item.id, item.is_default)">{{ $lang('del') }}</text>
								</view>
							</view>
						</view>
						<view v-if="addressList.length == 0">
							<ns-empty text="您当前还没有任何地址哦,快去添加吧" :isIndex="isIndex" :fixed="!1"></ns-empty>
						</view>
					</view>
					<view class="button-wrap">
						<button type="primary" class="add-address" @click="addAddress('add')">{{ $lang('newAddAddress') }}</button>
						<!-- #ifdef H5 -->
						<button type="primary" class="add-address" @click="getChooseAddress()" v-if="$util.isWeiXin()">{{ $lang('getAddress') }}</button>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO -->

						<view class="wei-address ns-text-color" @click="getChooseAddress()">
							{{ $lang('getAddress') }}
						</view>
						<!-- #endif -->
					</view>
				</block>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>

</template>

<script>
	import {
		Weixin
	} from 'common/js/wx-jssdk.js';

	export default {
		data() {
			return {
				addressList: [],
				back: '', // 返回页
				redirect: 'redirectTo', // 跳转方式
				isIndex: false
			};
		},
		onLoad(option) {
			if (option.back) this.back = option.back;
			if (option.redirect) this.redirect = option.redirect;
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/api/memberaddress/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size
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
						if (mescroll.num == 1) this.addressList = []; //如果是第一页需手动制空列表
						this.addressList = this.addressList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},

			/* 地址跳转 */
			addAddress(type, id) {
				let data = {};
				if (type == 'edit') {
					data.id = id;
				}
				if (this.back) {
					data.back = this.back
				}
				this.$util.redirectTo('/otherpages/member/address_edit/address_edit', data);
			},
			/* 删除地址信息 */
			deleteAddress(id, is_default) {
				uni.showModal({
					title: '操作提示',
					content: '确定要删除该地址吗？',
					success: res => {
						if (res.confirm) {
							if (is_default == 1) {
								this.$util.showToast({
									title: '默认地址，不能删除'
								});
								return;
							}
							this.$api.sendRequest({
								url: '/api/memberaddress/delete',
								data: {
									id: id
								},
								success: res => {
									if (res.code == 0) {
										this.$util.showToast({
											title: '删除成功'
										});
									} else {
										this.$util.showToast({
											title: '删除失败'
										});
									}
									this.$refs.mescroll.refresh();
								},
								fail: res => {
									mescroll.endErr();
								}
							});
						}
					}
				});
			},
			setDefault(id) {
				this.$api.sendRequest({
					url: '/api/memberaddress/setdefault',
					data: {
						id
					},
					success: res => {
						if (res.data > 0) {
							this.$refs.mescroll.refresh();
							if (this.back != '') {
								let jump = true;
								let arr = getCurrentPages().reverse();
								for (let i = 0; i < arr.length; i++) {
									if (this.back.indexOf(arr[i].route) != -1) {
										jump = false;
										uni.navigateBack({
											delta: i
										});
										break;
									}
								}
								if (jump) {
									this.$util.redirectTo(this.back, {}, 'redirectTo');
								}

							} else {
								this.$refs.mescroll.refresh();
								this.$util.showToast({
									title: '修改默认地址成功'
								});
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			/**
			 * 一键获取地址
			 */
			getChooseAddress() {
				// #ifdef H5
				if (this.$util.isWeiXin()) {
					if (uni.getSystemInfoSync().platform == 'ios') {
						var url = uni.getStorageSync('initUrl');
					} else {
						var url = location.href;
					}
					// 获取jssdk配置
					this.$api.sendRequest({
						url: '/wechat/api/wechat/jssdkconfig',
						data: {
							url: url
						},
						success: jssdkRes => {
							if (jssdkRes.code == 0) {
								var wxJS = new Weixin();
								wxJS.init(jssdkRes.data);

								wxJS.openAddress(res => {
									if (res.errMsg == 'openAddress:ok') {
										this.saveAddress({
											name: res.userName, // 收货人姓名,
											mobile: res.telNumber, // 手机号
											province: res.provinceName, // 省
											city: res.cityName, // 市
											district: res.countryName, // 县
											address: res.detailInfo, // 详细地址
											full_address: res.provinceName + '-' + res.cityName + '-' + res.countryName
										});
									} else {
										this.$util.showToast({
											title: res.errMsg
										});
									}
								});
							} else {
								this.$util.showToast({
									title: jssdkRes.message
								});
							}
						}
					});
				}
				// #endif

				// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
				uni.chooseAddress({
					success: res => {
						if (res.errMsg == 'chooseAddress:ok') {
							this.saveAddress({
								name: res.userName, // 收货人姓名,
								mobile: res.telNumber, // 手机号
								province: res.provinceName, // 省
								city: res.cityName, // 市
								district: res.countyName, // 县
								address: res.detailInfo, // 详细地址
								full_address: res.provinceName + '-' + res.cityName + '-' + res.countyName
							});
						} else {
							this.$util.showToast({
								title: res.errMsg
							});
						}
					}
				});
				// #endif
			},
			/**
			 * 保存微信地址
			 * @param {Object} params
			 */
			saveAddress(params) {
				this.$api.sendRequest({
					url: '/api/memberaddress/addthreeparties',
					data: params,
					success: res => {
						if (res.code >= 0) {
							this.$refs.mescroll.refresh();
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		.address-list {
			width: 100%;
			height: 100%;

			.address-item {
				display: flex;
				flex-direction: column;
				background-color: #FFFFFF;
				margin-top: $ns-margin;
				padding: 27rpx 34rpx 25rpx 34rpx;

				.address-item-top {
					display: flex;
					flex-direction: column;
					border-bottom: 1rpx solid #F1F1F1;

					.address-top-info {
						display: flex;
						justify-content: space-between;

						.address-name {
							color: #000000;
							font-size: 30rpx;
						}

						.address-tel {
							color: #000000;
							font-size: 30rpx;
						}
					}

					.address-info {
						padding: $ns-padding 0;
						font-size: 22rpx;
						color: #535353;
					}
				}

				.address-item-bottom {
					display: flex;
					justify-content: space-between;
					padding-top: $ns-padding;

					.address-default {
						display: flex;
						align-items: center;
						font-size: 22rpx;
						color: $ns-text-color-gray;

						.default {
							padding-left: 10rpx;
						}
					}

					.address-btn {
						font-size: 22rpx;
						color: #A9A9A9;

						.delete {
							padding-left: 47rpx;
						}

						.edit {}
					}
				}
			}
		}

		.button-wrap {
			width: 100%;
			margin-top: 100rpx;

			.wei-address {
				text-align: center;
				font-size: 26rpx;
				margin-bottom: 68rpx;
				margin-top: 25rpx;
			}

			.add-address {
				margin-top: $ns-margin;

				&:last-child {
					margin-bottom: 68rpx;
				}
			}
		}
	// }
</style>
