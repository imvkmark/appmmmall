<template>
	<view>
		<view class="content_real"></view>
		<view style="padding: 370upx 50upx 0 50upx;box-sizing: border-box;">
			<view>
				<view class="flex list_input mt20">
					<view class="blue_color" style="width:200upx;">真实姓名：</view>
					<view class="flex1">
						<input type="text" v-model="name" />
					</view>
				</view>
				<view class="flex list_input mt20">
					<view class="blue_color" style="width:200upx;">身份证号码：</view>
					<view class="flex1">
						<input type="idcard" v-model="idcard_number" />
					</view>
				</view>
				<view class="flex-jsb list_input mt20">
					<view class="blue_color" style="width:200upx;">认证状态</view>
					<view class="blue_color">
						未认证/已认证
					</view>
				</view>
			</view>
			<view class="mt30" style="border-radius:5upx;box-shadow:2px 2px 5px #ccc;padding:30upx 0;">
				<view class="flex-center">
					<view style="">
						<image :src="idcard_front?(url_img+'/'+idcard_front):'../../static/otc/id_front.png'" style="width:400upx;" mode="widthFix" @click="idcard('front')"></image>
						<view class="tc c-gray">添加身份证正面</view>
					</view>
				</view>
				<view class="flex-center mt10">
					<view style="">
						<image :src="idcard_side?(url_img+'/'+idcard_side):'../../static/otc/id_front.png'" style="width:400upx;" mode="widthFix" @click="idcard('side')"></image>
						<view class="tc c-gray">添加身份证反面</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mt30">
			<button type="primary" style="margin-bottom: 50upx;">立即上传</button>
		</view>
	</view>
</template>

<script>
import config from '../../utils/config.js'
export default{
	data() {
		return {
			name: '',
			idcard_number:'',
			idcard_front:'',
			idcard_side:'',
			url_img:''//域名
		}
	},
	onLoad() {
		// console.log(config)
		this.url_img = config.url
	},
	methods: {
		idcard(type){
			// var that = this
			// uni.chooseImage({
			//     count: 1, //默认9
			//     sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			//     sourceType: ['album','camera'], //从相册选择、使用相机
			//     success: function (res) {
			// 		console.log(res)
			//         if(type == 'front'){
			// 			console.log(JSON.stringify(res.tempFilePaths));
			// 			that.idcard_front = res.tempFilePaths[0]
			// 		}else if(type == 'side'){
			// 			console.log(JSON.stringify(res.tempFilePaths));
			// 			that.idcard_side = res.tempFilePaths[0]
			// 		}
			//     }
			// });
				var that = this
				this.$util.upload(
					1, {
						path: 'headimg'
					},
					res => {
						console.log('上传成功',res)
						if(type=='front'){
							that.idcard_front = res[0];
						}else if(type=='side'){
							that.idcard_side = res[0];
						}
						that.$forceUpdate()
					}
				)
		}
	},
}
</script>

<style>
@import url("./public.css");
.content_real{
	/* background: url('../../static/otc/bg_real.jpg'); */
	/* background-size: 100% 100%; */
	/* margin:400upx 50upx 0 50upx;
	background-color: #FFFFFF; */
	width:100%;
	height:100%;
	/* position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0; */
	background: url('../../static/otc/bg_real.jpg');
	background-size: 100% 100%;
	/* z-index: -1; */
}
page{
	width:100%;
	height:100%;
	background: url('../../static/otc/bg_real.jpg') no-repeat;
	background-size: 100% 100%;
	/* background-color: #FFFFFF; */
}
.list_input{
	background-color:#FFFFFF;padding: 20upx 30upx;border-radius:5upx;box-shadow:2px 2px 5px #ccc;
}
.blue_color{
	color: #43A1F4;
}
</style>
