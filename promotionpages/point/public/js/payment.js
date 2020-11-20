export default {
	data() {
		return {
			orderCreateData: {},
			orderPaymentData: {
				exchange_info: {
					type: 0
				}
			},
			type:1,
			isSub: false,
		};
	},
	methods: {
		/**
		 * 显示弹出层
		 * @param {Object} ref
		 */
		openPopup(ref) {
			this.$refs[ref].open();
		},
		/**
		 * 关闭弹出层
		 * @param {Object} ref
		 */
		closePopup(ref) {
			this.$refs[ref].close();
		},
		/**
		 * 选择收货地址
		 */
		selectAddress() {
			this.$util.redirectTo('/otherpages/member/address/address', {
				'back': '/promotionpages/point/payment/payment'
			});
		},
		/**
		 * 获取订单初始化数据
		 */
		getOrderPaymentData() {
			this.orderCreateData = uni.getStorageSync('exchangeOrderCreateData');
			if (!this.orderCreateData) {
				this.$util.showToast({
					title: '未获取到创建订单所需数据!！',
					success: () => {
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}, 1500)
					}
				});
				return;
			}
			this.orderCreateData.buyer_message = '';

			this.$api.sendRequest({
				url: '/pointexchange/api/ordercreate/payment',
				data: this.orderCreateData,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData = res.data;
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到创建订单所需数据!！',
							success: () => {
								setTimeout(() => {
									this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
								}, 1500)
							}
						});
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			})
		},
		/**
		 * 处理结算订单数据
		 */
		handlePaymentData() {

		},
		/**
		 * 订单创建
		 */
		orderCreate() {
			if (this.verify()) {
				if (this.isSub) return;
				this.isSub = true;

				var data = this.$util.deepClone(this.orderCreateData);
				data.delivery = JSON.stringify(data.delivery);
				data.coupon = JSON.stringify(data.coupon);
				data.member_address = JSON.stringify(data.member_address);

				this.$api.sendRequest({
					url: '/pointexchange/api/ordercreate/create',
					data,
					success: res => {
						if (res.code >= 0) {
							uni.removeStorage({
								key: 'exchangeOrderCreateData',
								success: () => {
									this.$util.redirectTo('/promotionpages/point/result/result', {}, 'redirectTo');
								}
							});
						} else {
							this.isSub = false;
							this.$util.showToast({
								title: res.message
							});
						}
					}
				})
			}
		},
		/**
		 * 订单验证
		 */
		verify() {
			if (this.orderPaymentData.exchange_info.type == 1) {
				if (!this.orderPaymentData.member_address) {
					this.$util.showToast({
						title: '请先选择您的收货地址'
					});
					return false;
				}
			}
			return true;
		},
		imageError() {
			let imageUrl=''
			if(this.type==1){
				imageUrl=this.$util.img('upload/uniapp/point/gift.png')
			}else if(this.type==2){
				imageUrl=this.$util.img('upload/uniapp/point/coupon.png')
			}else if(this.type==3){
				imageUrl=this.$util.img('upload/uniapp/point/hongbao.png')
			}
			// this.orderPaymentData.exchange_info.image = this.$util.getDefaultImage().default_goods_img;
			this.orderPaymentData.exchange_info.image = imageUrl;
			this.$forceUpdate();
		}
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/login/login/login');
		} else {
			this.getOrderPaymentData();
		}
	}
}
