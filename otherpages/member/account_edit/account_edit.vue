<template>
	<view :class="themeStyle">
		<view class="account-list-content">
			<view class="edit-item">
				<text class="tit">{{ $lang('name') }}</text>
				<input class="desc uni-input" type="text" maxlength="30" placeholder="请输入真实姓名" name="name" v-model="formData.realname" />
			</view>
			<view class="edit-item">
				<text class="tit">{{ $lang('mobilePhone') }}</text>
				<input class="desc uni-input" type="number" maxlength="11" placeholder="请输入手机号" v-model="formData.mobile" />
			</view>
			<view class="edit-item">
				<text class="tit">{{ $lang('accountType') }}</text>
				<picker @change="bindPickerChange" :value="accountType" :range="payList">
					<text class="desc uni-input">{{ payList[accountType] }}</text>
				</picker>
			</view>
			<view class="edit-item" v-if="formData.withdraw_type == 'bank'">
				<text class="tit">{{ $lang('bankName') }}</text>
				<input class="desc uni-input" type="text" maxlength="50" placeholder="请输入银行名称" v-model="formData.branch_bank_name" />
			</view>
			<view class="edit-item" v-if="formData.withdraw_type != 'wechatpay'">
				<text class="tit">{{ $lang('withdrawalAccount') }}</text>
				<input class="desc uni-input" type="text" maxlength="30" placeholder="请输入提现账号" v-model="formData.bank_account" />
			</view>
			<button class="add" type="primary" @click="saveAccount">{{ $lang('save') }}</button>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
	import validate from 'common/js/validate.js';
	export default {
		data() {
			return {
				formData: {
					realname: '',
					mobile: '',
					withdraw_type: '',
					bank_account: '',
					branch_bank_name: ''
				},
				payList: [],
				index: 0,
				flag: false,
				transferType: []
			};
		},
		computed: {
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			},
			accountType(){
				let arr=Object.keys(this.transferType);
				let index=0;
				if(!arr.length){
					return index
				}else{
					for(let i=0;i<arr.length;i++){
						if(arr[i]==this.formData.withdraw_type){
							index=i;
						}
					}
					return index
				}
			}
		},
		onLoad(option) {
			if (option.id) {
				this.formData.id = option.id;
			}
			this.getTransferType();
			if (this.formData.id) this.getAccountDetail(this.formData.id);
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		methods: {
			getAccountDetail(id) {
				this.$api.sendRequest({
					url: '/api/memberbankaccount/info',
					data: {
						id: this.formData.id
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.formData.realname = res.data.realname;
							this.formData.mobile = res.data.mobile;
							this.formData.bank_account = res.data.bank_account;
							this.formData.branch_bank_name = res.data.branch_bank_name;
							this.formData.withdraw_type = res.data.withdraw_type;
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			/**
			 * 获取转账方式
			 */
			getTransferType() {
				this.$api.sendRequest({
					url: '/api/memberwithdraw/transferType',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.transferType = res.data;
							for (let v in this.transferType) {
								if (!this.formData.withdraw_type) {
									this.formData.withdraw_type = v;
								}
								this.payList.push(this.transferType[v]);
							}
							if (!this.formData.id && this.$refs.loadingCover) this.$refs.loadingCover.hide();
						}
					}
				});
			},
			bindPickerChange(e) {
				let arr=Object.keys(this.transferType);
				this.formData.withdraw_type = arr[e.detail.value];
			},
			vertify() {
				this.formData.realname = this.formData.realname.trim();
				this.formData.branch_bank_name = this.formData.branch_bank_name.trim();
				this.formData.bank_account = this.formData.bank_account.trim();
				this.formData.mobile = this.formData.mobile.trim();
				var rule = [{
						name: 'realname',
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
					}
				];
				if (this.formData.withdraw_type == 'bank') {
					rule.push({
						name: 'branch_bank_name',
						checkType: 'required',
						errorMsg: '请输入银行名称'
					});
				}
				if (this.formData.withdraw_type != 'wechatpay') {
					rule.push({
						name: 'bank_account',
						checkType: 'required',
						errorMsg: '请输入提现账号'
					});
				}

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
			saveAccount() {
				if (this.flag) return;
				this.flag = true;
				if (this.vertify()) {
					let url = !this.formData.id ? 'add' : 'edit';
					let data = {};
					this.$api.sendRequest({
						url: '/api/memberbankaccount/' + url,
						data: {
							id: this.formData.id,
							realname: this.formData.realname,
							mobile: this.formData.mobile,
							withdraw_type: this.formData.withdraw_type,
							bank_account: this.formData.bank_account,
							branch_bank_name: this.formData.branch_bank_name
						},
						success: res => {
							this.$util.showToast({
								title: res.message
							});
							if (res.code == 0) {
								uni.navigateBack({
									delta: 1
								});
							} else {
								this.flag = false;
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
		.account-list-content {
			.edit-item {
				display: flex;
				align-items: center;
				padding: 0 30rpx;
				height: 100rpx;
				background-color: #fff;

				.tit {
					width: 120rpx;
					font-size: $uni-font-size-lg - 2rpx;
				}

				.desc {
					flex: 1;
					font-size: $uni-font-size-lg - 2rpx;
					margin-left: $ns-margin;
					padding: 0;
				}

				&:first-of-type {
					margin-top: $uni-spacing-row-base;
				}
			}
		}

		.account-list-content>.edit-item+.edit-item {
			border-top: 2rpx solid $ns-border-color-gray;
		}

		.add {
			margin-top: 60rpx !important;
		}
	// }
</style>
