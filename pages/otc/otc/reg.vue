<template>
	<view>
		<nav-bar type="transparent" fontColor="#FFF" @backClick="backClick" :backState="3000"></nav-bar>
		<view class="mybg-box">
			<image src="../../static/bg.png" class="my-bg" mode="widthFix"></image>
			<view class="form-box padding">
				<view class="from-top text-center">
					<!-- <image src="../../static/user/mine_def_touxiang.png" class="cu-avatar xl round"></image> -->
					<view class="text-white text-xxl margin-tb">實名認證</view>
				</view>
				<view class="from-card bg-white padding-top">
					<view class="cu-form-group from-input">
						<input type="text" v-model="name" :disabled="disable" placeholder="請輸入真實姓名" maxlength="4"></input>
					</view>
					<view class="cu-form-group from-input">
						<input type="idcard" v-model="id_num" :disabled="disable" placeholder="請輸入正確身份證號碼" maxlength="18"></input>
					</view>
					<view class="cu-form-group" style="margin-left:20upx;">
						<view class="title">請上傳身份證圖片:</view>
					</view>
					<view class="upload_img flex-center">
						<view class="flex">
							<view class="tc" style="margin-right: 80upx">
								<image :src="photo_front" @click="!disable?upload_photo_front():''" style="width:200upx;height:129upx;overflow: hidden;;"></image>
								<view>身份證正面</view>
							</view>
							<view class="tc">
								<image :src="photo_side" @click="!disable?upload_photo_side():''" style="width:200upx;height:129upx;overflow: hidden;"></image>
								<view>身份證反面</view>
							</view>
						</view>
					</view>
					<view class="padding-lr flex flex-direction">
						<button class="cu-btn bg-red margin-tb-sm lg shadow-blur" :disabled="disable" @tap="bindReg">提交認證</button>
					</view>
				</view>
				<view class="text-grey text-center padding-top" v-if="status != ''">
					當前狀態：{{status==1?'账号待审核中':status==2?'账号已认证通过':status==3?'审核已被拒绝':'未認證'}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CryptoJS from '../../common/request/crypto-js.js';
	import util from '@/common/function';
	export default {
		data() {
			return {
				photo_front:'../../static/idz.png',		//上传图片身份证正面
				photo_side:'../../static/idb.png',		//上传图片身份证反面
				photo_front_internet:'',
				photo_side_internet:'',
				tempFilePaths:'',
				name:'',
				id_num:'',
				if_upload_front:!1,
				if_upload_side:!1,
				status:'',
				disable:!1,
				util:util
			}
		},
		onLoad() {
			this.baseUrl = this.$http.baseUrl
			this.is_author()
		},
		methods: {
			backClick(){
				console.log('back..')
				uni.switchTab({
					url:'../user/user'
				})
			},
			is_author(){
				var that = this
				that.$http.get('/Index/user/verifyStatus').then(res=>{
					console.log(res,'author')
					that.status = res.status
					if(res.length>0 || res.status){
						if(res.status == 1 || res.status == 2){
							that.name = res.c_name
							that.id_num = res.c_num
							that.photo_front = that.baseUrl + res.c_facade
							that.photo_side = that.baseUrl + res.c_back
							that.disable = !0
						}else if(res.status == 3){
							that.name = res.c_name
							that.id_num = res.c_num
							that.photo_front = that.baseUrl + res.c_facade
							that.photo_side = that.baseUrl + res.c_back
						}
					}
					
				}).catch(error=>{
					console.log(error,'error')
				})
			},
			upload_photo_front(){//上传身份证正面
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
									// 'file': tempFilePaths[i],
									'type': 'image',
								},
								success: (uploadFileRes) => {
									console.log(JSON.parse(uploadFileRes.data));
									var url = JSON.parse(uploadFileRes.data)
									that.photo_front_internet = url.data
									// that.photo_front = 'baseUrl'+ url.data
									that.photo_front = that.baseUrl+ url.data
									that.if_upload_front = !0
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
			upload_photo_side(){//上传身份证反面
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
									that.photo_side_internet = url.data
									that.photo_side = that.baseUrl+ url.data
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
			//点击注册
			bindReg() {
				if(this.name.length < 2 || this.name.length >= 5){
					uni.showToast({
						title:'真實姓名錯誤'
					})
					return
				}else if(this.id_num.length != 18){
					uni.showToast({
						title:'身份證格式錯誤'
					})
					return
				}else if(this.photo_front.indexOf(this.baseUrl) == -1){
					uni.showToast({
						title:'請上传身份證正面照'
					})
					return
				}else if(this.photo_side.indexOf(this.baseUrl) == -1){
					uni.showToast({
						title:'請上传身份證反面照'
					})
					return
				}
				// else if(this.status == 2){
				// 	uni.showToast({
				// 		title:'账号已验证通过'
				// 	})
				// 	return
				// }
				else{
					var data = {
						c_name:this.name,
						c_num:this.id_num,
						c_facade:this.photo_front_internet,
						c_back:this.photo_side_internet
					}
					this.$http.post('/Index/user/toVerify',data).then(function (response) {
						uni.showToast({
							title: data.msg,
							duration:1500
						});
						// console.log(data,233)
						setTimeout(function(){
							uni.switchTab({
								url:'../user/user'
							})
						},1500)
						//这里只会在接口是成功状态返回
					}).catch(function (error) {
						// 这里只会在接口是失败状态返回，不需要去处理错误提示
						console.log(error);
						uni.showToast({
							title:error.msg
						})
					});
				}
			}
		}
	}
</script>

<style>
	.flex{
		display: flex;
	}
	.tc{text-align: center;}
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
	.form-box{
		position: absolute;
		width: 100%;
		left: 0;
		top: 50rpx;
	}
	.from-card{
		border-radius: 30rpx;
	}
	.from-input{
		background-color: #F4F4F4;
		margin: 30rpx;
		border-radius: 20rpx;
	}
</style>
