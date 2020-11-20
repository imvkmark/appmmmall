<template>
	<view :class="themeStyle">
		<view class="address-edit-content">
			<view class="edit-wrap">
				<view class="edit-item">
					<text class="tit">{{ $lang('consignee') }}</text>
					<input class="uni-input" type="text" :placeholder="$lang('consigneePlaceholder')" maxlength="30" name="name" value=""
					 v-model="formData.name" />
				</view>
				<view class="edit-item">
					<text class="tit">{{ $lang('mobile') }}</text>
					<input class="uni-input" type="number" :placeholder="$lang('mobilePlaceholder')" maxlength="11" value="" v-model="formData.mobile" />
				</view>
				<view class="edit-item">
					<text class="tit">{{ $lang('telephone') }}</text>
					<input class="uni-input" type="text" :placeholder="$lang('telephonePlaceholder')" maxlength="20" value="" v-model="formData.telephone" />
				</view>
				<view class="edit-item">
					<text class="tit">{{ $lang('receivingCity') }}</text>
					<pick-regions :default-regions="defaultRegions" @getRegions="handleGetRegions">
						<text class="select-address" :class="{ empty: !formData.full_address }">{{ formData.full_address ? formData.full_address : '请选择省市区县' }}</text>
					</pick-regions>
				</view>
				<view class="edit-item">
					<text class="tit">{{ $lang('address') }}</text>
					<input class="uni-input" type="text" :placeholder="$lang('addressPlaceholder')" maxlength="50" v-model="formData.address" />
					<!-- #ifdef MP-WEIXIN -->
					<text @click="selectAddress" class="iconfont icondizhi"></text>
					<!-- #endif -->
				</view>
			</view>
			<button type="primary" class="add" @click="saveAddress">{{ $lang('save') }}</button>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>

</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue';
	import validate from 'common/js/validate.js';
	export default {
		components: {
			pickRegions
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		data() {
			return {
				formData: {
					id: 0,
					name: '',
					mobile: '',
					telephone: '',
					province_id: '',
					city_id: '',
					district_id: '',
					community_id: '',
					address: '',
					full_address: '',
					latitude: 0,
					longitude: 0,
					is_default: 1
				},
				address: '',
				addressValue: '',
				back: '', // 返回页
				redirect: 'redirectTo', // 跳转方式
				flag: false, //防重复标识
				defaultRegions: []
			};
		},
		onLoad(option) {
			if (option.id) {
				this.formData.id = option.id;
				this.getAddressDetail();
			}
			if (option.back) this.back = option.back;
			if (option.redirect) this.redirect = option.redirect;
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		onReady() {
			this.$refs.loadingCover.hide();
		},
		onHide() {
			this.flag = false;
		},
		methods: {
			// 获取地址信息
			getAddressDetail() {
				this.$api.sendRequest({
					url: '/api/memberaddress/info',
					data: {
						id: this.formData.id
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							this.formData.name = data.name;
							this.formData.mobile = data.mobile;
							this.formData.telephone = data.telephone;
							this.formData.address = data.address;
							this.formData.full_address = data.full_address;
							this.formData.latitude = data.latitude;
							this.formData.longitude = data.longitude;
							this.formData.is_default = data.is_default;
							this.defaultRegions = [data.province_id, data.city_id, data.district_id];
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			// 获取选择的地区
			handleGetRegions(regions) {
				this.formData.full_address = '';
				this.formData.full_address += regions[0] != undefined ? regions[0].label : '';
				this.formData.full_address += regions[1] != undefined ? '-' + regions[1].label : '';
				this.formData.full_address += regions[2] != undefined ? '-' + regions[2].label : '';
				this.addressValue = '';
				this.addressValue += regions[0] != undefined ? regions[0].value : '';
				this.addressValue += regions[1] != undefined ? '-' + regions[1].value : '';
				this.addressValue += regions[2] != undefined ? '-' + regions[2].value : '';
			},
			selectAddress() {
				uni.chooseLocation({
					success: res => {
						this.formData.latitude = res.latitude;
						this.formData.longitude = res.longitude;
						this.formData.address = res.name;
					}
				});
			},
			vertify() {
				this.formData.name = this.formData.name.trim();
				this.formData.mobile = this.formData.mobile.trim();
				this.formData.address = this.formData.address.trim();
				var rule = [{
						name: 'name',
						checkType: 'required',
						errorMsg: '请输入姓名'
					},
					{
						name: 'mobile',
						checkType: 'required',
						errorMsg: '请输入手机号'
					},
					{
						name: 'mobile',
						checkType: 'phoneno',
						errorMsg: '请输入正确的手机号'
					},
					{
						name: 'full_address',
						checkType: 'required',
						errorMsg: '请选择省市区县'
					},
					{
						name: 'address',
						checkType: 'required',
						errorMsg: '详细地址不能为空'
					}
				];
				var checkRes = validate.check(this.formData, rule);
				if (checkRes) {
					return true;
				} else {
					this.$util.showToast({
						title: validate.error
					});
					this.flag = false;
					return false;
				}
			},
			saveAddress() {
				if (this.flag) return;
				this.flag = true;
				if (this.vertify()) {
					let addressValueArr = this.addressValue.split('-'),
						data = {},
						url = '';

					data = {
						name: this.formData.name,
						mobile: this.formData.mobile,
						telephone: this.formData.telephone,
						province_id: addressValueArr[0],
						city_id: addressValueArr[1],
						district_id: addressValueArr[2],
						// community_id: addressValueArr[3],
						community_id: 0,
						address: this.formData.address,
						full_address: this.formData.full_address,
						latitude: this.formData.latitude,
						longitude: this.formData.longitude,
						is_default: this.formData.is_default
					};

					url = 'add';
					if (this.formData.id) {
						url = 'edit';
						data.id = this.formData.id;
					}
					this.$api.sendRequest({
						url: '/api/memberaddress/' + url,
						data: data,
						success: res => {
							this.flag = false;
							if (res.code == 0) {
								if (this.back != '' && url != 'edit') {
									// this.$util.redirectTo(this.back, {}, this.redirect);
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
									this.$util.showToast({
										title: res.message
									});
									uni.navigateBack({
										delta: 1
									});
								}
							} else {

							}
						},
						fail: res => {
							this.flag = false;
						}
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	// [data-theme] {
		.edit-wrap {
			margin: 20rpx;
			background: #fff;
			border-radius: $ns-border-radius;
			overflow: hidden;
		}

		.edit-item {
			display: flex;
			align-items: center;
			margin: 0 30rpx;
			height: 100rpx;
			background-color: #fff;

			.tit {
				width: 120rpx;
				font-size: $uni-font-size-lg - 2rpx;
			}

			.select-address {
				display: inline-block;
				font-size: $ns-font-size-base;
				margin-left: 10rpx;

				&.empty {
					color: #808080;
				}
			}

			input {
				flex: 1;
				font-size: $uni-font-size-lg - 2rpx;
				margin-left: 20rpx;
				padding: 0;
				margin-right: 20rpx;
			}
		}

		.edit-wrap>.edit-item+.edit-item {
			border-top: 2rpx solid #ebedf0;
		}

		.add {
			margin-top: 60rpx !important;
		}
	// }
</style>
