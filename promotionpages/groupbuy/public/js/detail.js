import htmlParser from '@/common/js/html-parser';
import {Weixin} from '@/common/js/wx-jssdk.js';

export default {
	data() {
		return {
			id: 0,
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

			//评价数量
			token: "",

			poster: "-1", //海报
			posterMsg: "", //海报错误信息
			posterHeight: 0,

			//评价
			goodsEvaluate: {
				member_headimg: '',
				member_name: '',
				content: '',
				images: [],
				create_time: 0,
				sku_name: ''
			},

			pintuanList: [],
			currentPintuan: {
				timeMachine: {}
			},
			openPopup: false,
			memberId: 0,
			contactData: {
				title: '',
				path: '',
				img: ''
			},


			detailTab: 0,
			service: null
		}
	},
	onLoad(data) {
		this.id = data.id || 0;
		this.skuId = data.sku_id || 0;
		if (data.source_member) uni.setStorageSync('source_member', data.source_member);
		// 小程序扫码进入
		if (data.scene) {
			var sceneParams = decodeURIComponent(data.scene);
			sceneParams = sceneParams.split('&');
			if (sceneParams.length) {
				sceneParams.forEach(item => {
					if (item.indexOf('id') != -1) this.id = item.split('-')[1];
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

		//登录后查询
		this.token = uni.getStorageSync('token');

		//修改商品信息
		this.modifyGoodsInfo();
		
		//同步获取商品详情
		await this.getGoodsSkuDetail();
		
		if (this.token != '') {
			this.getCartCount();
			this.getWhetherCollection();
			this.getMemberId();
		}
		
		//商品评论
		this.getGoodsEvaluate();

	},
	onHide() {},
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
					back: '/promotionpages/groupbuy/detail/detail?id=' + that.id
				});
			}
		},
		// 获取团购商品详情
		async getGoodsSkuDetail() {
			let res = await this.$api.sendRequest({
				url: '/groupbuy/api/goods/detail',
				async: false,
				data: {
					id: this.id,
					sku_id: this.skuId,
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				this.goodsSkuDetail = data.goods_sku_detail;
				this.shopInfo = data.shop_info;

				if (this.skuId == 0) this.skuId = this.goodsSkuDetail.sku_id;

				//团购倒计时
				if ((this.goodsSkuDetail.end_time - res.timestamp) > 0) {
					this.goodsSkuDetail.timeMachine = this.$util.countDown(this.goodsSkuDetail.end_time - res.timestamp);
				} else {
					this.$util.showToast({
						title: "活动已结束",
					});
					setTimeout(() => {
						this.$util.redirectTo('/pages/goods/detail/detail', {
							sku_id: this.goodsSkuDetail.sku_id
						}, 'redirectTo');
					}, 1000);
				}

				//媒体
				if (this.goodsSkuDetail.video_url) this.switchMedia = "video";

				this.goodsSkuDetail.sku_images = this.goodsSkuDetail.sku_images.split(",");

				this.goodsSkuDetail.unit = this.goodsSkuDetail.unit || "件";

				this.goodsSkuDetail.show_price = this.goodsSkuDetail.groupbuy_price;

				this.goodsSkuDetail.save_price = (this.goodsSkuDetail.price - this.goodsSkuDetail.show_price) > 0 ? (this.goodsSkuDetail
					.price - this.goodsSkuDetail.show_price).toFixed(2) : 0;

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

				this.contactData = {
					title: this.goodsSkuDetail.sku_name,
					path: '/promotionpages/groupbuy/detail/detail?id=' + this.id,
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
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		},
		goCart() {
			this.$util.redirectTo('/pages/goods/cart/cart', {}, 'reLaunch');
		},
		// 团购
		groupbuy() {
			if (!this.token) {
				this.$refs.login.open('/promotionpages/groupbuy/detail/detail?id=' + this.id + '&sku_id=' + this.skuId);
				return;
			}
			this.$refs.goodsSku.show("groupbuy", () => {
				this.getCartCount();
			});
		},
		swiperChange(e) {
			this.swiperCurrent = e.detail.current + 1;
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
				this.$refs.login.open('/promotionpages/groupbuy/detail/detail?id=' + this.id + '&sku_id=' + this.skuId);
			}
		},
		//获取购物车数量
		getCartCount() {
			this.$api.sendRequest({
				url: "/api/cart/count",
				data: {},
				success: res => {
					this.cartCount = res.data;
				}
			});
		},

		//返回顶部
		goTopClick() {
			uni.pageScrollTo({
				duration: 200,
				scrollTop: 0
			});
		},
		//更新商品信息
		modifyGoodsInfo() {
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
							this.posterHeight = parseInt(1240 / ratio);
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
				sku_id: this.skuId,
				id: this.id
			};
			if (this.memberId) qrcode_param.source_member = this.memberId;
			this.$api.sendRequest({
				url: "/groupbuy/api/goods/poster",
				data: {
					page: '/promotionpages/groupbuy/detail/detail',
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
		swiperImageError(index) {
			this.goodsSkuDetail.sku_images[index] = this.$util.getDefaultImage().default_goods_img;
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
		/**
		 * 设置微信公众号分享
		 */
		setWechatShare(){
			// 微信公众号分享
			// #ifdef H5
			if (this.$util.isWeiXin()) {
				this.$api.sendRequest({
					url: '/wechat/api/wechat/share',
					data : {
						url: window.location.href
					},
					success: res => {
						if (res.code == 0) {
							var wxJS = new Weixin();
							wxJS.init(res.data.jssdk_config);
							
							let shareConfig = res.data.share_config,
								url = this.$config.h5Domain + '/promotionpages/groupbuy/detail/detail?id=' + this.id;
								if (this.memberId) url += '&source_member=' + this.memberId;
						
							wxJS.setShareData({
								title: this.goodsSkuDetail.sku_name,
								desc: '团购价' + '：' + this.$lang('common.currencySymbol') + this.goodsSkuDetail.show_price + '\r\n' + shareConfig.goods_param_2 + '\r\n' + '收藏热度：★★★★★',
								link: url,
								imgUrl: this.$util.img(this.goodsSkuDetail.sku_image, { size: 'big' })
							})
						}
					}
				})
			}
			// #endif
		}
	}
}
