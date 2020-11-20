import htmlParser from '@/common/js/html-parser';
import {
	Weixin
} from '@/common/js/wx-jssdk.js';

export default {
	data() {
		return {
			skuId: 0,

			// 商品详情
			goodsSkuDetail: {
				goods_id: 0
			},

			// 店铺详情
			shopInfo: {
				logo: '',
				shop_baozh: 0,
				shop_qtian: 0,
				shop_zhping: 0,
				shop_erxiaoshi: 0,
				shop_tuihuo: 0,
				shop_shiyong: 0,
				shop_shiti: 0,
				shop_xiaoxie: 0
			},

			cartCount: 0, // 购物车商品数量
			whetherCollection: 0,

			// 媒体,图片,视频

			// 解决每个商品SKU图片数量不同时，无法切换到第一个，导致轮播图显示不出来
			swiperInterval: 1,
			swiperAutoplay: false,
			swiperCurrent: 1,
			switchMedia: 'img',

			couponList: [], //优惠券列表
			couponBtnSwitch: false, //获取优惠券防止重复提交

			//评价数量
			token: "",

			poster: "-1", //海报
			posterMsg: "", //海报错误信息
			posterHeight: 0,

			manjianList: {}, //满减活动列表
			//评价
			goodsEvaluate: {
				member_headimg: '',
				member_name: '',
				content: '',
				images: [],
				create_time: 0,
				sku_name: ''
			},
			//组合套餐
			bundling: [{
				bundling_goods: {
					bl_name: '',
					sku_image: ''
				}
			}],
			memberId: 0,
			contactData: {
				title: '',
				path: '',
				img: ''
			},

			detailTab: 0,
			service: null,
			//是否开启预览，0：不开启，1：开启
			preview: 0
		}
	},
	onLoad(data) {
		this.skuId = data.sku_id || 0;
		this.preview = data.preview || 0;
		if (data.source_member) uni.setStorageSync('source_member', data.source_member);
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('sku_id') != -1) this.skuId = item.split('-')[1];
					if (item.indexOf('source_member') != -1) uni.setStorageSync('source_member', item.split('-')[1]);
				});
			}
		}
		this.getService()
	},
	async onShow() {

		// 刷新多语言
		this.$langConfig.refresh();

		//同步获取商品详情
		await this.getGoodsSkuDetail();
		
		//登录后查询
		this.token = uni.getStorageSync('token');
		
		if (this.token != '' && this.preview == 0) {
			this.getCartCount();
			this.getWhetherCollection();
			this.getMemberId();
		}

		// 开启预览，禁止任何操作和跳转
		if (this.preview == 0) {
			//修改商品信息
			this.modifyGoodsInfo();

			this.getCoupon();

			if(this.addonIsExit.manjian){
				this.getManjian();
			}

			//商品评论
			this.getGoodsEvaluate();

			//组合套餐
			if(this.addonIsExit.bundling){
				this.getBundling();
			}
		}
	},
	onHide() {
		this.couponBtnSwitch = false;
	},
	methods: {
		//h5播放视频
				openVideo(){
					this.$refs.videoPopup.open();
				},
		//联系客服
		goConnect(){
			let that=this;
			if (uni.getStorageSync('token')) {
				that.$api.sendRequest({
					url:'/servicer/api/chat/hasServicers',
					data:{
						site_id:that.shopInfo.site_id
					},
					success(res){
						if(res.code>=0){
							let data={
								siteId:that.shopInfo.site_id,
								avatar:that.shopInfo.avatar,
								siteName:that.shopInfo.site_name,
								skuId:that.goodsSkuDetail.sku_id
							}
							that.$util.redirectTo('/otherpages/chat/room/room',data)
						}else{
							that.$util.showToast({'title': '客服未上线'})
						}
					}
				})
			} else {
				that.$util.redirectTo('/pages/login/login/login', {
					back: '/pages/goods/detail/detail?sku_id=' + that.goodsSkuDetail.sku_id
				});
			}
		},
		// 获取商品详情
		async getGoodsSkuDetail(skuId) {
			this.skuId = skuId || this.skuId;
			let res = await this.$api.sendRequest({
				url: '/api/goodssku/detail',
				async: false,
				data: {
					sku_id: this.skuId,
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				this.goodsSkuDetail = data.goods_sku_detail;
				this.goodsSkuDetail.preview = this.preview;
				this.shopInfo = data.shop_info;

				if (this.skuId == 0) this.skuId = this.goodsSkuDetail.sku_id;

				//媒体
				if (this.goodsSkuDetail.video_url) this.switchMedia = "video";

				this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.split(",");

				this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";

				this.goodsSkuDetail.show_price = this.goodsSkuDetail.discount_price;

				// 当前商品SKU规格
				if (this.goodsSkuDetail.sku_spec_format) this.goodsSkuDetail.sku_spec_format = JSON.parse(this.goodsSkuDetail.sku_spec_format);

				// 商品属性
				if (this.goodsSkuDetail.goods_attr_format) {
					let goods_attr_format = JSON.parse(this.goodsSkuDetail.goods_attr_format);
					this.goodsSkuDetail.goods_attr_format = JSON.parse(this.goodsSkuDetail.goods_attr_format);
					this.goodsSkuDetail.goods_attr_format = this.$util.unique(this.goodsSkuDetail.goods_attr_format, "attr_id");
					for (var i = 0; i < this.goodsSkuDetail.goods_attr_format.length; i++) {
						for (var j = 0; j < goods_attr_format.length; j++) {
							if (this.goodsSkuDetail.goods_attr_format[i].attr_id == goods_attr_format[j].attr_id && this.goodsSkuDetail.goods_attr_format[
									i].attr_value_id != goods_attr_format[j].attr_value_id) {
								this.goodsSkuDetail.goods_attr_format[i].attr_value_name += "、" + goods_attr_format[j].attr_value_name;
							}
						}
					}
				}

				// 商品SKU格式
				if (this.goodsSkuDetail.goods_spec_format) this.goodsSkuDetail.goods_spec_format = JSON.parse(this.goodsSkuDetail.goods_spec_format);

				uni.setNavigationBarTitle({
					title: this.goodsSkuDetail.sku_name
				});

				// 商品详情
				if (this.goodsSkuDetail.goods_content) this.goodsSkuDetail.goods_content = htmlParser(this.goodsSkuDetail.goods_content);

				// 限时折扣
				if (this.goodsSkuDetail.promotion_type == 1 && this.addonIsExit.discount) {
					//检测倒计时
					if ((this.goodsSkuDetail.end_time - res.timestamp) > 0) {
						this.goodsSkuDetail.discountTimeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
					} else {
						this.goodsSkuDetail.promotion_type = 0;
					}
				}

				this.contactData = {
					title: this.goodsSkuDetail.sku_name,
					path: '/pages/goods/detail/detail?sku_id=' + this.skuId,
					img: this.$util.img(this.goodsSkuDetail.sku_image, {
						size: 'big'
					})
				}

				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();

				this.setWechatShare();
			} else {
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			}
		},
		/**
		 * 刷新商品详情数据
		 * @param {Object} goodsSkuDetail
		 */
		refreshGoodsSkuDetail(goodsSkuDetail) {
			Object.assign(this.goodsSkuDetail, goodsSkuDetail);

			// 解决轮播图数量不一致时，切换到第一个
			if (this.swiperCurrent > this.goodsSkuDetail.sku_images.length) {
				this.swiperAutoplay = true;
				this.swiperCurrent = 1;
				setTimeout(() => {
					this.swiperAutoplay = false;
				}, 40);
			}
		},
		goHome() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		},
		goCart() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$util.redirectTo('/pages/goods/cart/cart', {}, 'reLaunch');
		},
		// 加入购物车
		joinCart() {
			if (!this.token && this.preview == 0) {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
				return;
			}
			this.$refs.goodsSku.show("join_cart", () => {
				this.getCartCount();
			});
		},
		// 立即购买
		buyNow() {
			if (!this.token && this.preview == 0) {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
				return;
			}
			this.$refs.goodsSku.show("buy_now", () => {
				this.getCartCount();
			});
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current + 1;
		},


		//-------------------------------------优惠券-------------------------------------

		getCoupon() {
			this.$api.sendRequest({
				url: "/coupon/api/coupon/typelists",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					let data = res.data;
					if (data) {
						data.forEach(v => {
							v.useState = 0;
						});
						this.couponList = data;
					}
				}
			});
		},

		// 打开优惠券弹出层
		openCouponPopup() {
			this.$refs.couponPopup.open();
		},
		// 关闭优惠券弹出层
		closeCouponPopup() {
			this.$refs.couponPopup.close();
		},
		// 领取优惠券
		receiveCoupon(item,index) {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			if(item.useState==1){
				return;
			}
			if (this.couponBtnSwitch) return;
			this.couponBtnSwitch = true;
			if (this.token != '') {
				var url,data = {
					site_id: item.site_id,
					coupon_type_id: item.coupon_type_id,
					get_type :2,
				};
				url = '/coupon/api/coupon/receive';
				this.$api.sendRequest({
					url,
					data,
					success: res => {
						var data = res.data;
						let msg = res.message;
						if (res.code == 0) {
							msg = '领取成功';
						}
						let list = this.couponList;
						if (res.data.is_exist == 1) {
							for (let i = 0; i < list.length; i++) {
								if (list[i].coupon_type_id == item.coupon_type_id) {
									list[i].useState = 1;
								}
							}
						} else {
							for (let i = 0; i < list.length; i++) {
								if (list[i].coupon_type_id == item.coupon_type_id) {
									list[i].useState = 2;
								}
							}
						}
						this.$util.showToast({
							title: msg,
						});
						this.couponBtnSwitch = false;
						// this.$refs.couponPopup.close();
					},
				});
			} else {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
			}
		},

		//-------------------------------------服务-------------------------------------

		openMerchantsServicePopup() {
			this.$refs.merchantsServicePopup.open();
		},
		closeMerchantsServicePopup() {
			this.$refs.merchantsServicePopup.close();
		},



		//-------------------------------------属性-------------------------------------

		openAttributePopup() {
			this.$refs.attributePopup.open();
		},
		closeAttributePopup() {
			this.$refs.attributePopup.close();
		},

		//-------------------------------------属性-------------------------------------



		//-------------------------------------评价-------------------------------------
		//商品评论列表
		getGoodsEvaluate() {
			this.$api.sendRequest({
				url: "/api/goodsevaluate/firstinfo",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					let data = res.data;
					if (data) {
						this.goodsEvaluate = data;
						if (this.goodsEvaluate.images) this.goodsEvaluate.images = this.goodsEvaluate.images.split(",");
						if (this.goodsEvaluate.is_anonymous == 1) this.goodsEvaluate.member_name = this.goodsEvaluate.member_name.replace(
							this.goodsEvaluate.member_name.substring(1, this.goodsEvaluate.member_name.length - 1), '***')
					}
				}
			});
		},

		// 预览评价图片
		previewEvaluate(index, field) {
			var paths = [];
			for (let i = 0; i < this.goodsEvaluate[field].length; i++) {
				paths.push(this.$util.img(this.goodsEvaluate[field][i]));
			}
			uni.previewImage({
				current: index,
				urls: paths,
			});
		},


		//-------------------------------------关注-------------------------------------

		//获取用户是否关注
		getWhetherCollection() {
			this.$api.sendRequest({
				url: "/api/goodscollect/iscollect",
				data: {
					goods_id: this.goodsSkuDetail.goods_id
				},
				success: res => {
					this.whetherCollection = res.data;
				}
			});
		},

		editCollection() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转

			if (this.token != "") {

				//未关注添加关注
				if (this.whetherCollection == 0) {
					this.$api.sendRequest({
						url: "/api/goodscollect/add",
						data: {
							sku_id: this.skuId,
							site_id: this.goodsSkuDetail.site_id,
							goods_id: this.goodsSkuDetail.goods_id,
							category_id: this.goodsSkuDetail.category_id,
							sku_name: this.goodsSkuDetail.sku_name,
							sku_price: this.goodsSkuDetail.discount_price,
							sku_image: this.goodsSkuDetail.sku_image
						},
						success: res => {
							var data = res.data;
							if (data > 0) {
								this.whetherCollection = 1;
							}
						}
					});
				} else {
					//已关注取消关注
					this.$api.sendRequest({
						url: "/api/goodscollect/delete",
						data: {
							goods_id: this.goodsSkuDetail.goods_id
						},
						success: res => {
							var data = res.data;
							if (data > 0) {
								this.whetherCollection = 0;
							}
						}
					});
				}
			} else {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.skuId);
			}
		},
		//获取购物车数量
		getCartCount() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$store.dispatch('getCartNumber').then((e)=>{
				this.cartCount = e;
			})
		},
		//更新商品信息
		modifyGoodsInfo() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			//更新商品点击量
			this.$api.sendRequest({
				url: "/api/goods/modifyclicks",
				data: {
					sku_id: this.skuId,
					site_id: this.goodsSkuDetail.site_id,
				},
				success: res => {}
			});

			//添加足迹
			this.$api.sendRequest({
				url: "/api/goodsbrowse/add",
				data: {
					goods_id: this.goodsSkuDetail.goods_id,
					sku_id: this.skuId,
					category_id: this.goodsSkuDetail.category_id,
					category_id_1: this.goodsSkuDetail.category_id_1,
					category_id_2: this.goodsSkuDetail.category_id_2,
					category_id_3: this.goodsSkuDetail.category_id_3,
					site_id: this.goodsSkuDetail.site_id,
				},
				success: res => {}
			});
		},

		//-------------------------------------满减-------------------------------------

		//获取满减信息
		getManjian() {
			this.$api.sendRequest({
				url: "/manjian/api/manjian/info",
				data: {
					goods_id: this.goodsSkuDetail.goods_id,
				},
				success: res => {
					let data = res.data;
					if (data) {
						this.manjianList = data;
					}
				}
			});
		},
		openManjianPopup() {
			this.$refs.manjianPopup.open();
		},
		closeManjianPopup() {
			this.$refs.manjianPopup.close();
		},


		//-------------------------------------组合套餐-------------------------------------

		//获取当前商品关联的组合套餐
		getBundling() {
			this.$api.sendRequest({
				url: "/bundling/api/bundling/lists",
				data: {
					sku_id: this.skuId
				},
				success: res => {
					if (res.data && res.data.length) {
						let bundling = res.data;
						bundling.forEach((v)=>{
							v.bundling_goods=v.bundling_goods.filter((j)=>{ return j.sku_id != this.goodsSkuDetail.sku_id;})
						})
						this.bundling=bundling;
					}
				}
			});
		},
		// 打开组合套餐弹出层
		openBundlingPopup() {
			this.$refs.bundlingPopup.open();
		},
		// 关闭组合套餐弹出层
		closeBundlingPopup() {
			this.$refs.bundlingPopup.close();
		},


		//-------------------------------------分享-------------------------------------
		// 打开分享弹出层
		openSharePopup() {
			this.$refs.sharePopup.open();
		},
		// 关闭分享弹出层
		closeSharePopup() {
			this.$refs.sharePopup.close();
		},
		//-------------------------------------海报-------------------------------------

		// 打开海报弹出层
		openPosterPopup() {
			this.getGoodsPoster();
			this.$refs.sharePopup.close();
			this.$refs.posterPopup.open();
			if (this.poster != '-1') {
				setTimeout(() => {
					let view = uni.createSelectorQuery().in(this).select(".poster-layer .image-wrap");
					view.fields({
						size: true,
					}, data => {
						let posterWhith = data.width;
						let ratio = parseFloat((740 / posterWhith).toFixed(2));
						if (this.token != '') {
							this.posterHeight = parseInt(1120 / ratio);
						} else {
							this.posterHeight = parseInt(1100 / ratio);
						}
					}).exec();
				}, 100);
			}
		},
		// 关闭海报弹出层
		closePosterPopup() {
			this.$refs.posterPopup.close();
		},
		//生成海报
		getGoodsPoster() {
			//活动海报信息
			let qrcode_param = {
				sku_id: this.skuId
			};
			if (this.memberId) qrcode_param.source_member = this.memberId;
			this.$api.sendRequest({
				url: "/api/goods/poster",
				data: {
					page: '/pages/goods/detail/detail',
					qrcode_param: JSON.stringify(qrcode_param),
					// #ifdef APP-PLUS
					app_type: 'weapp',
					app_type_name: '微信小程序',
					// #endif
				},
				success: res => {
					if (res.code == 0) {
						this.poster = res.data.path;
					} else {
						this.posterMsg = res.message;
					}
				}
			});
		},
		// 预览图片
		previewMedia(index) {
			var paths = [];
			for (let i = 0; i < this.goodsSkuDetail.sku_images.length; i++) {
				paths.push(this.$util.img(this.goodsSkuDetail.sku_images[i], {
					size: 'big'
				}));
			}
			uni.previewImage({
				current: index,
				urls: paths,
			});
		},
		imageError() {
			this.goodsSkuDetail.sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		swiperImageError(index) {
			this.goodsSkuDetail.sku_images[index] = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		bundlingImageError(index, goods_index) {
			this.bundling[index].bundling_goods[goods_index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		// #ifdef MP
		//小程序中保存海报
		saveGoodsPoster() {

			let url = this.$util.img(this.poster);
			// this.$util.showToast({
			// 	title: "saveGoodsPoster:"+ url
			// });
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.$util.showToast({
									title: "保存成功"
								});
							},
							fail: () => {
								this.$util.showToast({
									title: "保存失败，请稍后重试"
								});
							}
						});
					}
				},

				fail: (e) => {
					// this.$util.showToast({
					// 	title: "fail:" + JSON.stringify(e)
					// });
				}
			});
		},
		// #endif
		getMemberId() {
			this.$api.sendRequest({
				url: "/api/member/id",
				success: res => {
					if (res.code >= 0) {
						this.memberId = res.data;
						this.setWechatShare();
					}
				}
			});
		},
		getService() {
			this.$api.sendRequest({
				url: '/api/goods/aftersale',
				success: res => {
					if (res.code == 0 && res.data) {
						let data = res.data.content;
						if (res.data.content) this.service = htmlParser(res.data.content);
					}
				}
			});
		},
		errorShopLogo() {
			this.shopInfo.avatar = this.$util.getDefaultImage().default_shop_img;
			this.$forceUpdate();
		},
		fenxiao() {
			this.$refs.fenxiaoPopup.show()
		},
		/**
		 * 设置微信公众号分享
		 */
		setWechatShare() {
			// 微信公众号分享
			// #ifdef H5
			if (this.$util.isWeiXin()) {
				this.$api.sendRequest({
					url: '/wechat/api/wechat/share',
					data: {
						url: window.location.href
					},
					success: res => {
						if (res.code == 0) {
							var wxJS = new Weixin();
							wxJS.init(res.data.jssdk_config);

							let shareConfig = res.data.share_config,
								url = this.$config.h5Domain + '/pages/goods/detail/detail?sku_id=' + this.skuId;
							if (this.memberId) url += '&source_member=' + this.memberId;

							wxJS.setShareData({
								title: this.goodsSkuDetail.sku_name,
								desc: shareConfig.goods_param_1 + '：' + this.$lang('common.currencySymbol') + this.goodsSkuDetail.discount_price +
									'\r\n' + shareConfig.goods_param_2 + '\r\n' + '收藏热度：★★★★★',
								link: url,
								imgUrl: this.$util.img(this.goodsSkuDetail.sku_image, {
									size: 'big'
								})
							})
						}
					}
				})
			}
			// #endif
		}
	}
}
