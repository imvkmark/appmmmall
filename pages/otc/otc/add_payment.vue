<template>
	<view>
		<nav-bar type="transparent" fontColor="#FFF">添加收付款方式</nav-bar>
		<view class="mybg-box">
			<image src="../../static/bg.png" class="my-bg" mode="widthFix"></image>
			<view class="form-box padding">
				<view class="cu-bar bg-white margin-tb radius">
					<view class="action">
						<text class="cuIcon-title text-orange "></text>
						<text>{{fangshi}}</text>
					</view>
					<view class="action">
						<button class="cu-btn bg-red" @tap="actionSheetTap">請抉擇</button>
					</view>
				</view>
				<view class="from-card bg-white radius">
					<view class="cu-form-group from-input">
						<view class="title">真實姓名</view>
						<input type="text" :placeholder="pla_name" v-model="name" maxlength="6"></input>
					</view>
					<view class="cu-form-group from-input" v-if="type == 3">
						<view class="title">銀行卡號</view>
						<input type="number" :placeholder="bank_info_total" v-model="bank_info"></input>
					</view>
					<view class="cu-form-group from-input" v-if="type == 3">
						<view class="title">開戶行</view>
						<input type="text" :placeholder="bank_info_open" v-model="bank_open"></input>
					</view>
					<view class="cu-form-group from-input" v-if="type == 3">
						<view class="title">開戶支行</view>
						<input type="text" :placeholder="bank_info_bar_open" v-model="bank_bar_open" ></input>
					</view>
					<view class="cu-form-group from-input" v-if="type == 1 || type == 2">
						<view class="title">请上传收款二維碼:</view>
					</view>
					<view class="upload_img flex-center" v-if="type == 1 || type == 2">
						<image :src="photo" @click="upImage" style="width:300upx;height:300upx;overflow: hidden;"></image>
					</view>
					<view class="padding-lr flex flex-direction">
						<button class="cu-btn bg-red margin-tb-sm lg" :disabled="btnd" @tap="exchange">確認</button>
					</view>
				</view>
				<view class="text-grey text-center padding-top">
					溫馨提示：收付款账户必须与實名認證资料一致！！
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/function';
	export default {
		data() {
			return {
				btnd: !1,
				fangshi: '請選擇收付款方式',
				pla_name:'請輸入您的真實姓名',
				name:'',
				bank_info_total: '請填寫銀行卡號',//银行卡号
				bank_info_open : '請填寫開戶行',//开户行
				bank_info_bar_open : '請填寫開戶行',//开户支行
				bank_info: '',//银行卡号
				bank_open:'',//开户行
				bank_bar_open:'',//开户支行
				photo: '../../static/qrsk.png', //上传图片路径
				photo_internet:'',
				if_upload_side:!1,
				type:'',//当前选择类型（int）： 1=支付宝  2=微信  3=银行卡
				util:util,
				if_type:''
			}
		},
		onLoad() {
			this.baseUrl = this.$http.baseUrl
			this.paymentList()
			this.mineInfoRequest()
		},
		methods: {
			paymentList(){//获取已添加收款方式列表列表
				var self = this;
				this.$http.post('/index/user/payment').then(function (response) {
					response.forEach(function(item,index){
						if(item.type == 1){
							that.if_type = 1
						}else if(item.type == 2){
							that.if_type = 2
						}else if(item.type == 3){
							that.if_type = 3
						}
					})
					//这里只会在接口是成功状态返回
				}).catch(function (error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
				});
			},
			//获取个人信息
			mineInfoRequest(){
				var self = this;
				this.$http.post('/index/login/index').then(function (response) {
					self.userinfo = response;
					self.username = util.cutPhone(response.tel?response.tel:response.mail);
					uni.stopPullDownRefresh();
					//这里只会在接口是成功状态返回
				}).catch(function (error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					console.log('错误信息',error);
					uni.stopPullDownRefresh();
				});
			},
			//上传图片
			upImage() {
				var that = this
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.showLoading({
							title: '上傳中...'
						});
						let tempFilePaths = res.tempFilePaths
						for (var i = 0; i < tempFilePaths.length; i++) {
							uni.uploadFile({
								url: that.baseUrl+'/Index/Adv/upload', //仅为示例，非真实的接口地址
								filePath: tempFilePaths[i],
								fileType: 'image',
								sizeType:['compressed'],
								name: 'file',
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'multipart/form-data',
								},
								formData: {
									// 'file': tempFilePaths[i]
									'type': 'image',
								},
								success: (uploadFileRes) => {
									// console.log(JSON.parse(uploadFileRes.data));
									var url = JSON.parse(uploadFileRes.data)
									that.photo_internet = url.data
									that.photo = that.baseUrl+ url.data
									that.if_upload_side = !0
									// callback();
								},
								fail: (error) => {
									//fail
								},
								complete: () => {
									setTimeout(function() {
										uni.hideLoading();
									}, 250);
								},
							});
						}
					}
				});
			},
			//确认提交
			exchange() {
				var that = this;
				if (this.fangshi == '請選擇付款方式') {
					uni.showToast({
						title: '請選擇付款方式!',
						icon: 'none'
					});
					return;
				}else if(this.name == ''){
					uni.showToast({
						title: '真實姓名不能為空',
						icon: 'none'
					});
					return;
				}else if(this.type == 1){
					if(this.photo.indexOf(that.baseUrl) == -1){
						uni.showToast({
							title:'請上傳支付寶收款碼'
						})
						return;
					}
					var data = {
						type:this.type,
						img:this.photo_internet,
						user_name:this.name
					}
				}else if(this.type == 2){
					if(this.photo.indexOf(that.baseUrl) == -1){
						uni.showToast({
							title:'請上傳微信收款碼'
						})
						return;
					}
					var data = {
						type:this.type,
						img:this.photo_internet,
						user_name:this.name
					}
				}else if(this.type == 3){
					if(this.bank_info == ''){
						uni.showToast({
							title:'銀行卡號不能為空'
						})
						return;
					}else if(this.bank_open == ''){
						uni.showToast({
							title:'開戶行不能為空'
						})
						return;
					}else if(this.bank_bar_open == ''){
						uni.showToast({
							title:'開戶支行不能為空'
						})
						return;
					}
					var data = {
						type:this.type,
						user_name:this.name,
						bank_num:this.bank_info,
						bank_who:this.bank_open,
						bank_address:this.bank_bar_open
					}
				}
				this.$http.post('/index/user/savePayment',data).then(function (response) {
					console.log(response)
					if(that.if_type == ''){
						uni.showToast({
							title:'添加成功'
						})
					}else{
						uni.showToast({
							title:'编辑成功'
						})
					}
					setTimeout(function(){
						uni.navigateBack()
					},1500)
					uni.stopPullDownRefresh();
					//这里只会在接口是成功状态返回
				}).catch(function (error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon:'none'
					});
					
					uni.stopPullDownRefresh();
				});
				
			},
			//选择类型
			actionSheetTap() {
				var self = this;
				//获取数据
				// this.getwallet();
				//弹出选择栏
				uni.showActionSheet({
					title: '請選擇付款方式',
					itemList: ['支付寶', '微信', '銀行卡'],
					success: (e) => {
						switch (e.tapIndex) {
							case 0:
								self.fangshi = '支付寶';
								// self.selected = '支付宝';
								self.type = 1;
								break;
							case 1:
								self.fangshi = '微信';
								// self.selected = '微信';
								self.type = 2;
								break;
							case 2:
								self.fangshi = '銀行卡';
								// self.selected = '银行卡';
								self.type = 3;
								break;
							default:
								self.fangshi = '收付款方式';
						}
					}
				})
			},
			//获取用户数据
			getwallet() {
				var self = this;
				//获取数据
				this.$http.get('/index/wallet/index').then(function(response) {
					self.wallet = response;
					//self.$set(self.wallet,0,response);
					//这里只会在接口是成功状态返回
				}).catch(function(error) {
					//这里只会在接口是失败状态返回，不需要去处理错误提示
					uni.showToast({
						title: error.msg,
						duration: 2000,
						icon: 'none'
					});
					console.log('错误信息', error);
				});
			}
		}
	}
</script>

<style>
	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mybg-box {
		width: 100%;
		height: 35vh;
		position: relative;
	}

	.my-bg {
		width: 100%;
		height: 30vh;
		display: block;
	}

	.form-box {
		position: absolute;
		width: 100%;
		left: 0;
		top: 80rpx;
	}

	.upload_img {
		padding: 40upx 0;
	}
</style>
