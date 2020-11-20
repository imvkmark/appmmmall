import config from './config.js'
export default {
	data() {
		return {
			timeout: config.timeout, // 1分钟
			timeoutObj: null,
			servicer_id:0,
			
			isconnect:false
		}
	},
	onLoad() {
		let that=this;
		// .判断是否已连接
		that.checkOpenSocket();
		uni.onSocketClose(function (res) {
		  console.log('WebSocket 已关闭！');
		  that.isconnect=false;
		});
	},
	methods: {
		// 判断是否已连接
		checkOpenSocket() {
			console.log('判断是否已连接')
			let self = this;
			uni.sendSocketMessage({
				data: 'ping',
				success: (res) => {
					console.log('连接成功')
					return;
				},
				fail: (err) => { // 未连接打开websocket连接
					console.log('连接失败')
					self.openConnection();
				}
			});
		},
		openConnection() { // 打开连接
			console.log('打开连接')
			uni.closeSocket(); // 确保已经关闭后再重新打开
			uni.connectSocket({
				url: config.webSocket,
				method: 'POST',
				success(res) {
					console.log('连接成功 connectSocket=', res);
				},
				fail(err) {
					console.log('连接失败 connectSocket=', err);
				}
			});
			uni.onSocketOpen((res) => {
				console.log('连接成功', res);
				this.isconnect=true;
			});
			this.onSocketMessage(); // 打开成功监听服务器返回的消息
		},
		//	打开成功监听服务器返回的消息
		onSocketMessage() { // 消息
			let that=this;
			this.timeout = config.timeout;
			this.timeoutObj = null;
			uni.onSocketMessage((res) => {
				let msg=JSON.parse(res.data);
				console.log(msg) 
				if(msg.type=='close'){
					return;
				}
				this.reset();
				this.getSocketMsg(res.data); // 监听到有新服务器消息
			});
		},
		// 监听到有新服务器消息
		getSocketMsg(reData) { // 监听到服务器消息
			let that=this;
			let giveMsg = JSON.parse(reData);
			console.log(giveMsg)
			let data={
				isItMe: false,
			};
			data.contentType=giveMsg.type;
			if(giveMsg.type=='init'){
				
				that.$api.sendRequest({
					url:'/servicer/api/chat/bind',
					data:{
						client_id:giveMsg.data.client_id,
						site_id:that.siteId
					},
					success(res){
						if(res.code==0){
							that.servicer_id=res.data.servicer_id;
							that.getChatList();
						}else{
							that.$util.showToast({'title':res.message})
						}
					}
				})
				
			}else if(giveMsg.type=='string'){
				data.content=giveMsg.data.servicer_say;
			}else if(giveMsg.type=='order'){
				data.order_id=giveMsg.data.order_id;
			}else if(giveMsg.type=='goodssku'){
				data.sku_id=giveMsg.data.goods_sku_id;
			}
			if(giveMsg.type=='init') return;
			
			that.messageList.push(data);
			that.selectPosition='a'+(that.messageList.length-1);
			
		},
		// 检测心跳reset
		reset() {
			console.log("检测心跳")
			clearInterval(this.timeoutObj);
			this.start(); // 启动心跳
		},
		// 启动心跳 start 
		start() {
			console.log("启动心跳")
			let self = this;
			this.timeoutObj = setInterval(function() {
				uni.sendSocketMessage({
					data: 'ping',
					success: (res) => {
						console.log('连接中....');
					},
					fail: (err) => {
						console.log('连接失败重新连接....');
						self.openConnection();
					}
				});
			}, this.timeout);
		}
	},
}
