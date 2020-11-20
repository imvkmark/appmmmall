<template>
	<view class="content">
		<scroll-view class="content-box" scroll-y="true" :scroll-into-view="selectPosition" @scrolltoupper="getChatList" id="content-box">
			<!-- 背景图- 定位方式 -->
			<!-- 	<image class="content-box-bg" src="/static/image/Ran.jpg" :style="{ height: imgHeight }"></image> -->
			<view class="content-box-loading" v-if="loading"><ns-loading></ns-loading></view>
			<ns-chat-goods :isCanSend="!0" :skuId="skuId" @sendMsg="sendGood" v-if="isSendGoods && skuId"></ns-chat-goods>
			<ns-chat-order :isCanSend="!0" :orderId="orderId" @sendMsg="sendOrder" v-if="isSendOrder && orderId"></ns-chat-order>
			<block v-for="(item, index) in messageList" :key="index">
				<view class="message" :id="'a' + index" v-if="item.contentType == 'string'">
					<view class="message-item " :class="item.isItMe ? 'right' : 'left'">
						<block v-if="item.isItMe"><image class="img" :src="myHeadImg"></image></block>
						<block v-else><image class="img" :src="avatar"></image></block>

						<!-- contentType = 1 文本 -->
						<view class="content" v-if="item.contentType == 'string'">{{ item.content }}</view>
					</view>
				</view>
				<view v-else-if="item.contentType == 'goods'" :id="'a' + index"><ns-chat-goods :isCanSend="!1" :skuId="item.sku_id"></ns-chat-goods></view>
				<view v-else-if="item.contentType == 'order'" :id="'a' + index"><ns-chat-order :isCanSend="!1" :orderId="item.order_id"></ns-chat-order></view>
			</block>
		</scroll-view>

		<!-- 底部聊天输入框 -->
		<view class="input-box" :class="{ 'input-box-mpInputMargin': mpInputMargin }">
			<view class="input-box-flex">
				<!-- <view class="iconfont iconbiaoqing-xue ns-padding-right"></view>
				<view class="iconfont iconwenjian ns-padding-right"></view> -->
				<view class="input-box-flex-grow">
					<input
						type="text"
						class="content"
						placeholder="点此提问客服"
						id="input"
						v-model="formData.content"
						:confirm-type="'send'"
						placeholder-style="color:#DDDDDD;"
						:cursor-spacing="10"
						@confirm="sendMsg('message')"
					/>
				</view>
				<view
					class="iconfont iconmn_fasong_fill ns-padding-left ns-padding-right"
					:class="formData.content.trim() ? 'ns-text-color' : ''"
					@touchend.prevent="sendMsg('message')"
				></view>
			</view>
		</view>
	</view>
</template>

<script>
import SocketTask from '@/common/js/socketTest.js';
import config from '@/common/js/config.js';
import nsLoading from '@/components/ns-loading/ns-loading.vue';
import nsChatGoods from '@/components/ns-chat/ns-chat-goods.vue';
import nsChatOrder from '@/components/ns-chat/ns-chat-order.vue';
export default {
	components: {
		nsLoading,
		nsChatGoods,
		nsChatOrder
	},
	data() {
		return {
			siteId: 0, //店铺id
			skuId: 0, //商品id
			orderId: 0, //订单id
			siteName: '', //店铺名称
			avatar: '', //店铺头像
			myHeadImg: '', //我的头像
			loading: false, //是否正在请求
			isSendGoods: 1, //是否展示要发送的商品
			isSendOrder: 1, //是否展示要发型的订单
			selectPosition: '', //控制此变量使得页面自动滚动到某个位置
			formData: {
				//提交信息
				content: '',
				limit: 15,
				index: 1
			},
			orderInfo: {},
			isNet: false,

			fromUserInfo: {
				fromUserName: '张三'
			},
			showFunBtn: false, //是否展示功能型按钮
			imgHeight: '1000px',
			page: 1,
			messageList: [],
			mpInputMargin: false, //适配微信小程序 底部输入框高度被顶起的问题
			chatType: 'voice', // 图标类型 'voice'语音 'keyboard'键盘
			voiceTitle: '按住 说话',

			canSend: true, //是否可以发送
			Recorder: uni.getRecorderManager(),
			Audio: uni.createInnerAudioContext(),
			recording: false, //标识是否正在录音
			voiceIconText: '正在录音...',
			funList: [{ icon: 'iconzhaopian', title: '照片', uploadType: ['album'] }, { icon: 'iconzhaoxiangji', title: '拍摄', uploadType: ['camera'] }]
		};
	},
	mixins: [SocketTask],
	methods: {
		//获取店铺详情
		getShopInfo() {
			this.$api.sendRequest({
				url: '/api/shop/info',
				data: {
					site_id: this.siteId
				},
				success: res => {
					if (res.code == 0) {
						this.shopInfo = res.data;
						this.avatar = this.$util.img(res.data.logo);
						this.siteName = res.data.site_name;
					}
				}
			});
		},
		//获取个人信息
		getUserInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.myHeadImg = this.$util.img(res.data.headimg);
					}
				}
			});
		},
		//拼接消息 处理滚动
		async joinData(addType, contentType) {
			if (addType == 'send') {
				let data = {
					isItMe: true,
					contentType: contentType
				};
				if (contentType == 'string') {
					data.content = this.formData.content;
				} else if (contentType == 'order') {
					data.order_id = this.orderId;
				} else if (contentType == 'goods') {
					data.sku_id = this.skuId;
				}
				this.messageList.push(data);
				(this.formData.content = ''), (this.selectPosition = 'a' + (this.messageList.length - 1));
			}
		},
		//处理滚动
		bindScroll(sel, duration = 0) {
			const query = uni.createSelectorQuery().in(this);
			query
				.select(sel)
				.boundingClientRect(data => {
					uni.pageScrollTo({
						scrollTop: data && data.top - 40,
						duration
					});
				})
				.exec();
		},
		sendGood(e) {
			this.sendMsg(e);
			this.isSendGoods = 0;
		},
		sendOrder(e) {
			this.sendMsg(e);
			this.isSendOrder = 0;
		},
		//发送消息
		sendMsg(data) {
			// if(!this.isconnect){
			// 	this.$util.showToast({'title':'连接失败，请稍后重试'});
			// 	return;
			// }
			if (this.isNet) return;
			this.isNet = true;
			let that = this;
			if (data == 'goods') {
				this.$api.sendRequest({
					url: '/servicer/api/chat/say',
					data: {
						goods_id: this.skuId,
						servicer_id: this.servicer_id,
						content_type: 1,
						site_id: this.siteId
					},
					success(res) {
						that.joinData('send', 'goods');
					},
					complete() {
						that.isNet = false;
						uni.hideKeyboard();
					}
				});
			} else if (data == 'order') {
				this.$api.sendRequest({
					url: '/servicer/api/chat/say',
					data: {
						order_id: this.orderId,
						servicer_id: this.servicer_id,
						site_id: this.siteId,
						content_type: 2
					},
					success(res) {
						that.joinData('send', 'order');
					},
					complete() {
						that.isNet = false;
						uni.hideKeyboard();
					}
				});
			} else {
				if (!this.formData.content.trim()) {
					this.$util.showToast({ title: '发送内容不能为空' });
					that.isNet = false;
					return;
				}
				this.$api.sendRequest({
					url: '/servicer/api/chat/say',
					data: {
						message: this.formData.content,
						servicer_id: this.servicer_id,
						site_id: this.siteId,
						content_type: 0
					},
					success(res) {
						that.joinData('send', 'string');
					},
					complete() {
						that.isNet = false;
						uni.hideKeyboard();
					}
				});
			}
		},
		//用户触摸屏幕的时候隐藏键盘
		touchstart() {
			uni.hideKeyboard();
		},

		//发送图片
		chooseImage(sourceType) {
			uni.chooseImage({
				sourceType,
				sizeType: ['compressed'],
				success: res => {
					this.showFunBtn = false;
					for (let i = 0; i < res.tempFilePaths.length; i++) {
						const params = {
							contentType: 3,
							content: res.tempFilePaths[i]
						};
						this.sendMsg(params);
					}
				}
			});
		},
		//查看大图
		viewImg(imgList) {
			uni.previewImage({
				urls: imgList,
				// #ifndef MP-WEIXIN
				indicator: 'number'
				// #endif
			});
		},
		getOrderInfo() {
			this.$api.sendRequest({
				url: '/api/goodssku/detail',
				data: {
					order_id: this.orderId
				},
				success(res) {}
			});
		},
		getChatList() {
			let that = this;
			if (this.page != 1) this.loading = true;
			if (this.page == 1) this.messageList = [];
			this.$api.sendRequest({
				url: '/servicer/api/chat/dialogs',
				data: {
					servicer_id: this.servicer_id,
					page: this.page
				},
				success(res) {
					let newArr = [];
					if (res.data.list) {
						that.page += 1;
						let arr = res.data.list;
						for (let i = 0; i < arr.length; i++) {
							let obj = {};
							if (arr[i].content_type == 0) {
								obj.content = arr[i].type == 0 ? arr[i].consumer_say : arr[i].servicer_say;
								obj.isItMe = arr[i].type == 0 ? true : false;
								obj.contentType = 'string';
							} else if (arr[i].content_type == 1) {
								obj.isItMe = arr[i].type == 0 ? true : false;
								obj.contentType = 'goods';
								obj.sku_id = arr[i].goods_sku_id;
							} else if (arr[i].content_type == 2) {
								obj.isItMe = arr[i].type == 0 ? true : false;
								obj.contentType = 'order';
								obj.order_id = arr[i].order_id;
							}
							newArr.push(obj);
						}
					}
					that.loading = false;
					that.messageList = newArr.concat(that.messageList ? that.messageList : []);
					// that.selectPosition='a'+(that.messageList.length - 1);
				}
			});
		}
	},
	onLoad(info) {
		let memberInfo = uni.getStorageSync('userInfo');
		this.myHeadImg = this.$util.img(memberInfo.headimg);
		if (info.siteId) {
			this.siteId = info.siteId;
			this.getShopInfo();
			this.getUserInfo();
		} else {
			this.$util.showToast({ title: '缺少必要参数' });
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
		this.skuId = info.skuId ? info.skuId : 0;
		this.orderId = info.orderId ? info.orderId : 0;
	},
	onReady() {
		//自定义返回按钮 因为原生的返回按钮不可阻止默认事件
		// #ifdef H5
		const icon = document.getElementsByClassName('uni-page-head-btn')[0];
		icon.style.display = 'none';
		// #endif

		//修改标题
		uni.setNavigationBarTitle({
			title: this.siteName
		});

		uni.getSystemInfo({
			success: res => {
				this.imgHeight = res.windowHeight + 'px';
			}
		});

		uni.onKeyboardHeightChange(res => {
			if (res.height == 0) {
				// #ifdef MP-WEIXIN
				this.mpInputMargin = false;
				// #endif
			} else {
				this.showFunBtn = false;
			}
		});
	},
	beforeDestroy() {
		clearInterval(this.timeoutObj);
		this.timeoutObj = null
		this.$api.sendRequest({
			url: '/servicer/api/chat/bye',
			data: {
				servicer_id: this.servicer_id
			},
			success(res) {
				uni.closeSocket();
			}
		});
	},
	onPullDownRefresh() {
		this.loading = true;
		uni.stopPullDownRefresh();
		this.getChatList();
	}
};
</script>

<style lang="scss" scoped>
@import '../public/css/room.scss';
.good-order-box {
	position: fixed;
	left: 0;
	top: 30rpx;
}
</style>
