export default {
	data() {
		return {
			orderCreateData: {
				is_balance: 0,
				pay_password: '',
				platform_coupon_id:0,
				buyer_message:{}
			},
			orderPaymentData: {
				member_account: {
					balance: 0,
					is_pay_password: 0
				},
				platform_coupon_list:[]
			},
			isSub: false,
			sitePromotion: [],
			siteDelivery: {
				site_id: 0,
				data: []
			},
			siteCoupon: {
				site_id: 0,
				data: []
			},
			isFocus:false,
			tempData: null,
			
			
			selectCouponId:0,
			selectCouponMoney:'0.00',
			
			selectPlatCouponId:0,
			selectPlatCouponMoney:'0.00',
		};
	},
	methods: {
		/**
		 * 显示弹出层
		 * @param {Object} ref
		 */
		openPopup(ref) {
			if(ref=='PlatcouponPopup'){
				this.selectPlatCouponId=this.orderPaymentData.platform_coupon_id;
				this.selectPlatCouponMoney=this.orderPaymentData.platform_coupon_money; 
			}
			this.$refs[ref].open();
		},
		/**
		 * 关闭弹出层
		 * @param {Object} ref
		 */
		closePopup(ref) {
			if (this.tempData) {
				Object.assign(this.orderCreateData, this.tempData);
				Object.assign(this.orderPaymentData, this.tempData);
				this.tempData = null;
				this.$forceUpdate();
			}
			this.$refs[ref].close();
		},
		/**
		 * 选择收货地址
		 */
		selectAddress() {
			this.$util.redirectTo('/otherpages/member/address/address', {
				'back': '/pages/order/payment/payment'
			});
		},
		/**
		 * 获取订单初始化数据
		 */
		getOrderPaymentData() {
			this.orderCreateData = uni.getStorageSync('orderCreateData');
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
			this.$api.sendRequest({
				url: '/api/ordercreate/payment',
				data: this.orderCreateData,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData = res.data;
						this.handlePaymentData();
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
			this.orderCreateData.delivery = {};
			this.orderCreateData.coupon = {};
			this.orderCreateData.buyer_message = {};

			this.orderCreateData.is_balance = 0;
			this.orderCreateData.pay_password = '';

			var data = this.orderPaymentData;
			
			let h = new Date().getHours().toString();
			let m = new Date().getMinutes().toString();
			if (h.length == 1) {
				h = '0' + h;
			}
			if (m.length == 1) {
				m = '0' + m;
			}
			let nowTime = h + ':' + m;

			Object.keys(data.shop_goods_list).forEach((key, index) => {
				let siteItem = data.shop_goods_list[key];
				// 店铺配送方式
				this.orderCreateData.delivery[key] = {};
				if(siteItem.local_config){
					if (siteItem.local_config.info && siteItem.local_config.info.time_is_open == 1) {
						this.orderCreateData.delivery[key].showTimeBar=true;
						this.orderCreateData.delivery[key].buyer_ask_delivery_time=nowTime;
					}else{
						this.orderCreateData.delivery[key].showTimeBar=false;
					}
				}
				
				
				if (siteItem.express_type[0] != undefined) {
					this.orderCreateData.delivery[key].delivery_type = siteItem.express_type[0].name;
					this.orderCreateData.delivery[key].delivery_type_name = siteItem.express_type[0].title;
					this.orderCreateData.delivery[key].store_id = 0;
					this.orderCreateData.delivery[key].store_id = 0;

					// 如果是门店配送
					if (siteItem.express_type[0].name == 'store') {
						if (siteItem.express_type[0].store_list[0] != undefined) {
							this.orderCreateData.delivery[key].store_id = siteItem.express_type[0].store_list[0].store_id;
						}
					}	
				}

				// 店铺优惠券
				this.orderCreateData.coupon[key] = {};
				if (siteItem.coupon_list[0] != undefined) {
					this.orderCreateData.coupon[key].coupon_id = siteItem.coupon_list[0].coupon_id;
					this.selectCouponId=siteItem.coupon_list[0].coupon_id;
					this.orderCreateData.coupon[key].coupon_money = siteItem.coupon_list[0].money;
					this.selectCouponMoney=siteItem.coupon_list[0].coupon_id;
				}

				this.orderCreateData.buyer_message[key] = '';
			})

			if (this.orderPaymentData.is_virtual) this.orderCreateData.member_address = {
				mobile: ''
			};
			
			
			if(this.orderPaymentData.platform_coupon_list.length>0){
				this.orderPaymentData.platform_coupon_id=this.orderPaymentData.platform_coupon_list[0].platformcoupon_id;
				this.orderCreateData.platform_coupon_id=this.orderPaymentData.platform_coupon_list[0].platformcoupon_id;
				this.orderPaymentData.platform_coupon_money=this.orderPaymentData.platform_coupon_list[0].money;
				this.orderCreateData.platform_coupon_money=this.orderPaymentData.platform_coupon_list[0].money;
				
				this.selectPlatCouponId=this.orderPaymentData.platform_coupon_list[0].platformcoupon_id;
				this.selectPlatCouponMoney=this.orderPaymentData.platform_coupon_list[0].money;
			}
		

			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.orderCalculate();
		},
		/**
		 * 订单计算
		 */
		orderCalculate() {
			var data = this.$util.deepClone(this.orderCreateData);
			data.delivery = JSON.stringify(data.delivery);
			data.coupon = JSON.stringify(data.coupon);
			data.member_address = JSON.stringify(data.member_address);
			this.$api.sendRequest({
				url: '/api/ordercreate/calculate',
				data,
				success: res => {
					if (res.code >= 0) {
						this.orderPaymentData.delivery_money = res.data.delivery_money;
						this.orderPaymentData.coupon_money = res.data.coupon_money;
						this.orderPaymentData.invoice_money = res.data.invoice_money;
						this.orderPaymentData.promotion_money = res.data.promotion_money;
						this.orderPaymentData.order_money = res.data.order_money;
						this.orderPaymentData.balance_money = res.data.balance_money;
						this.orderPaymentData.pay_money = res.data.pay_money;
						this.orderPaymentData.goods_money = res.data.goods_money;

						Object.keys(res.data.shop_goods_list).forEach((key, index) => {
							let siteItem = res.data.shop_goods_list[key];
							
							this.orderPaymentData.shop_goods_list[key].pay_money = siteItem.pay_money;
							this.orderPaymentData.shop_goods_list[key].coupon_money = siteItem.coupon_money;
						})
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				},
			})
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
				data.buyer_message = JSON.stringify(data.buyer_message);

				this.$api.sendRequest({
					url: '/api/ordercreate/create',
					data,
					success: res => {
						uni.hideLoading();
						if (res.code >= 0) {
							uni.removeStorage({
								key: 'orderCreateData',
								success: () => {
									if (this.orderPaymentData.pay_money == 0) {
										this.$util.redirectTo('/pages/pay/result/result', {
											code: res.data
										}, 'redirectTo');
									} else {
										this.$util.redirectTo('/pages/pay/index/index', {
											code: res.data
										}, 'redirectTo');
									}
								}
							});
						} else {
							this.isSub = false;
							uni.hideLoading();
							if(this.$refs.payPassword){
								this.$refs.payPassword.close();
							}
							if (res.data.error_code == 10 || res.data.error_code == 12) {
								uni.showModal({
									title: '订单未创建',
									content: res.message,
									confirmText: '去设置',
									success: res => {
										if (res.confirm) {
											this.selectAddress();
										}
									}
								})
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						}
						this.getCartNumber();
					},
					fail: res => {
						uni.hideLoading();
						this.isSub = false;
					}
				})
			}
		},
		/**
		 * 订单验证
		 */
		verify() {
			if (this.orderPaymentData.is_virtual == 1) {
				if (!this.orderCreateData.member_address.mobile.length) {
					this.$util.showToast({
						title: '请输入您的手机号码'
					});
					return false;
				}
				var reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
				if (!reg.test(this.orderCreateData.member_address.mobile)) {
					this.$util.showToast({
						title: '请输入正确的手机号码'
					});
					return false;
				}
			}

			if (this.orderPaymentData.is_virtual == 0) {
				if (!this.orderPaymentData.member_address) {
					this.$util.showToast({
						title: '请先选择您的收货地址'
					});
					return false;
				}

				let deliveryVerify = true;

				for (let key in this.orderCreateData.delivery) {
					if (JSON.stringify(this.orderCreateData.delivery[key]) == "{}") {
						deliveryVerify = false;
						this.$util.showToast({
							title: '店铺"' + this.orderPaymentData.shop_goods_list[key].site_name + '"未设置配送方式'
						});
						break;
					}
					if (this.orderCreateData.delivery[key].delivery_type == 'store' && this.orderCreateData.delivery[key].store_id ==
						0) {
						deliveryVerify = false;
						this.$util.showToast({
							title: '店铺"' + this.orderPaymentData.shop_goods_list[key].site_name + '"没有可提货的门店,请选择其他配送方式'
						});
						break;
					}
				}
				if (!deliveryVerify) return false;
			}

			if (this.orderCreateData.is_balance == 1 && this.orderCreateData.pay_password == '') {
				setTimeout(() => {
					this.$refs.input.clear();
				}, 0)
				// this.$refs.payPassword.open();
				this.openPasswordPopup();
				return false;
			}
			return true;
		},
		/**
		 * 显示店铺优惠信息
		 * @param {Object} data
		 */
		openSitePromotion(data) {
			this.sitePromotion = data;
			this.$refs.sitePromotionPopup.open();
		},
		/**
		 * 显示店铺配送信息
		 * @param {Object} index
		 */
		openSiteDelivery(siteId, deliveryData) {
			this.tempData = {
				delivery: this.$util.deepClone(this.orderPaymentData.delivery)
			};

			this.siteDelivery.site_id = siteId;
			this.siteDelivery.data = deliveryData;
			this.$refs.deliveryPopup.open();
		},
		/**
		 * 选择配送方式
		 */
		selectDeliveryType(data) {
			this.orderCreateData.delivery[this.siteDelivery.site_id].delivery_type = data.name;
			this.orderCreateData.delivery[this.siteDelivery.site_id].delivery_type_name = data.title;
			// 如果是门店配送
			if (data.name == 'store') {
				if (data.store_list[0] != undefined) {
					this.orderCreateData.delivery[this.siteDelivery.site_id].store_id = data.store_list[0].store_id;
				}
			}
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.$forceUpdate();
		},
		/**
		 * 选择自提点 
		 */
		selectPickupPoint(store_id) {
			this.orderCreateData.delivery[this.siteDelivery.site_id].store_id = store_id;
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.$forceUpdate();
		},
		/**
		 * 显示店铺优惠券信息
		 * @param {Object} siteId
		 * @param {Object} couponData
		 */
		openSiteCoupon(siteId, couponData,siteIndex) {
			this.tempData = {
				coupon: this.$util.deepClone(this.orderPaymentData.coupon)
			};
			
			this.siteCoupon.site_id = siteId;
			this.selectCouponId=this.orderCreateData.coupon[siteId].coupon_id;
			this.selectCouponMoney=this.orderCreateData.coupon[siteId].coupon_money;
			
			this.siteCoupon.data = couponData;
			this.$refs.couponPopup.open();
		},
		/**
		 * 选择优惠券
		 * @param {Object} item
		 */
		selectCoupon(item) {
			if (this.selectCouponId != item.coupon_id) {
				this.selectCouponId = item.coupon_id;
				// this.orderCreateData.coupon[this.siteCoupon.site_id].coupon_money = this.orderPaymentData.shop_goods_list[item.site_id].coupon_money;
			} else {
				this.selectCouponId = 0;
				// this.orderCreateData.coupon[this.siteCoupon.site_id].coupon_id = 0;
				// this.orderCreateData.coupon[this.siteCoupon.site_id].coupon_money = '0.00';
			}
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.$forceUpdate();
		},
		/**
		 * 选择平台优惠券
		 * @param {Object} item
		 */
		selectPlatCoupon(item){
			
			if(this.selectPlatCouponId != item.platformcoupon_id){
				this.selectPlatCouponId=item.platformcoupon_id;
				this.selectPlatCouponMoney=item.money;
				// this.orderPaymentData.platform_coupon_id=item.platformcoupon_id;
				// this.orderCreateData.platform_coupon_id=item.platformcoupon_id;
				// this.orderPaymentData.platform_coupon_money=item.money;
				// this.orderCreateData.platform_coupon_money=item.money;
			}else{
				this.selectPlatCouponId=0;
				this.selectPlatCouponMoney='0.00';
			}
			Object.assign(this.orderPaymentData, this.orderCreateData);
			this.$forceUpdate();
		},
		popupConfirm(ref,site_id) {
			this.$refs[ref].close();
			if(ref=='couponPopup'){
				this.orderCreateData.coupon[site_id].coupon_id = this.selectCouponId;
				this.orderCreateData.coupon[site_id].coupon_money = this.selectCouponMoney;
			}
			if(ref=='PlatcouponPopup'){
				this.orderPaymentData.platform_coupon_id=this.selectPlatCouponId;
				this.orderCreateData.platform_coupon_id=this.selectPlatCouponId;
				this.orderPaymentData.platform_coupon_money=this.selectPlatCouponMoney;
				this.orderCreateData.platform_coupon_money=this.selectPlatCouponMoney;
			}
			this.orderCalculate();
		},
		/**
		 * 使用余额
		 */
		useBalance() {
			if (this.orderCreateData.is_balance) this.orderCreateData.is_balance = 0;
			else this.orderCreateData.is_balance = 1;
			this.orderCalculate();
			this.$forceUpdate();
		},
		/**
		 * 设置支付密码
		 */
		setPayPassword() {
			this.$util.redirectTo('/otherpages/member/pay_password/pay_password', {
				back: '/pages/order/payment/payment'
			});
		},
		/**
		 * 暂不设置支付密码
		 */
		noSet() {
			this.orderCreateData.is_balance = 0;
			this.$refs.payPassword.close();
			this.orderCalculate();
			this.$forceUpdate();
		},
		/**
		 * 支付密码输入
		 */
		input(pay_password) {
			if (pay_password.length == 6) {
				uni.showLoading({
					title: '支付中...',
					mask: true
				})
				this.$api.sendRequest({
					url: '/api/member/checkpaypassword',
					data: {
						pay_password
					},
					success: res => {
						if (res.code >= 0) {
							this.orderCreateData.pay_password = pay_password;
							this.orderCreate();
						} else {
							uni.hideLoading();
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: res => {
						uni.hideLoading();
					}
				})
			}
		},
		imageError(siteIndex, goodsIndex) {
			this.orderPaymentData.shop_goods_list[siteIndex].goods_list[goodsIndex].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		// 购物车数量
		getCartNumber() {
			if (uni.getStorageSync("token")) {
				this.$store.dispatch('getCartNumber')
			}
		},
		openPasswordPopup(){
			this.$refs.payPassword.open();
			setTimeout(()=>{
				this.isFocus = true;
			},500)
		},
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/login/login/login');
		} else {
			this.orderPaymentData= {
				member_account: {
					balance: 0,
					is_pay_password: 0
				}
			}
			this.orderCreateData= {
				is_balance: 0,
				pay_password: '',
				platform_coupon_id:0,
				buyer_message:{}
			}
			this.getOrderPaymentData();
		}
	},
	onHide() {
		if (this.$refs.loadingCover) this.$refs.loadingCover.show();
	},
	filters: {
		/**
		 * 金额格式化输出
		 * @param {Object} money
		 */
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		},
		/**
		 * 店铺优惠摘取
		 */
		promotion(data) {
			let promotion = '';
			if (data) {
				Object.keys(data).forEach((key) => {
					promotion += data[key].content + '　';
				})
			}
			return promotion;
		}
	}
}
