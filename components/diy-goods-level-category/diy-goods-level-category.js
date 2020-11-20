export default {
	data() {
		return {
			categoryAdvImage: '',
			cartList: [], //购物车
			cateList: [], //所有分类
			twoCateList: [], //展示的二级分类
			threeCateList: [], //三级分类列表
			join_cart: 'join_cart',

			oneCategoryId: 0,
			oneCategoryIndex: 0,
			TwoCategoryId: 0,
			TwoCategoryIndex: 0,
			threeCategoryId: 0,
			threeCategoryIndex: 0,

			goodsList: [], //商品列表


			isAll: false, //判断是否已经达到最大值
			isToken: false,
			size: 10,
			num: 1,
			isNetwork: 1, //是否可以继续请求
			isLoading: false,

			newheight: 0,

			goodsSkuDetail: {},
			currentRoute: '',

			token: '',

			isSafari:false,
			cartFlag: false, //添加商品数量时，防止重复点击
		}
	},
	props: {
		value: {
			type: Object
		},
		autoHeight: {
			type: Boolean
		},
		bottom:{
			type:[String,Number]
		},
		siteId: {
			type: [Number, String],
			default: 0
		}
	},
	computed: {
		type() {
			return this.value.template
		},
		height() {
			return this.newheight + 'px'
		},
		addonIsExit() {
			return this.$store.state.addonIsExit
		},
		themeStyle(){
			return 'theme-'+this.$store.state.themeStyle
		},
	},
	async created() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = '/' + currentPage.route;
		await this.getCategoryList()

		this.token = uni.getStorageSync('token');
	},
	methods: {
		getToken(){
			this.token = uni.getStorageSync('token');
			if(!this.token && !this.isToken){
				this.getCategoryList()
			}
		},
		//获取购物车的信息
		getCartData(val = '') {
			var that = this;
			if (!uni.getStorageSync('token')) {
				// this.getCategoryList();
				this.$emit("netFinish", true);
				return;
			}
			this.$api.sendRequest({
				url: '/api/cart/lists',
				success: res => {
					if (res.code >= 0) {
						that.cartList = res.data
						if (this.value.level != 3) {
							that.modifyGoodsCartNum()
						} else {
							that.modifyGoodsCartThree()
						}
						this.cartFlag = false;
					}
					this.$emit("netFinish", true)
				},
				fail: res => {}
			});
		},

		// 一二级数据处理
		modifyGoodsCartNum(type, param) {

			let that = this,
				goods_data = that.goodsList,
				cart_data = that.cartList
			type = type || 1;
			for (let goods_index in goods_data) {
				let goods_item = goods_data[goods_index],
					sku_id = goods_item.sku_id,
					num = 0,
					cart_id = '';

				if (type == 1) {
					// 整体更新, 购物车数据刷新/商品数据刷新
					for (let cart_index in cart_data) {
						let cart_item = cart_data[cart_index];
						if (sku_id == cart_item.sku_id) {
							num += cart_item.num;
							cart_id = cart_item.cart_id;
						}

					}
					goods_item.num = num;
					goods_item.cart_id = cart_id;
				} else if (type == 2) {
					// 单个数据更新
					num = parseInt(goods_item.num || 0);
					if (typeof(param) !== 'undefined' && !app.isEmptyObject(param)) {
						if (param.sku_id == sku_id) {
							if (param.type == 'add') {
								goods_item.num += parseInt(param.num || 0);
							} else if (param.type == 'minus') {
								goods_item.num -= parseInt(param.num || 0);
								if (goods_item.num < 0) {
									goods_item.num = 0;
								}
							}
							break;
						}
					}
					// goods_item.cart_id =  goods_item.
				}

				if (typeof(goods_item.num) === 'undefined' || goods_item.num === null) {
					goods_item.num = 0;
				}

			}
			this.goodsList = goods_data;
			this.$forceUpdate()
		},


		// 三级数据处理
		modifyGoodsCartThree() {
			let goods_data = this.cateList;
			let cart_data = this.cartList;
			for (let goods_index in goods_data) {
				let goods_item = goods_data[goods_index],
					sku_id = goods_item.sku_id,
					num = 0,
					cart_id = '';

				if (goods_data[goods_index].child_list&&goods_data[goods_index].child_list.length) {
					for (let goods_two in goods_data[goods_index].child_list) {
						let goods_item_two = goods_data[goods_index].child_list[goods_two],
							sku_id_two = goods_item_two.sku_id,
							num_two = 0,
							cart_id_two = '';
						for (let cart_index in cart_data) {
							let cart_item_two = cart_data[cart_index];
							if (sku_id_two == goods_item_two.sku_id) {
								num_two = goods_item_two.num;
								cart_id_two = cart_item_two.cart_id;
							}
						}

						goods_item_two.num = num_two;
						goods_item_two.cart_id = cart_id_two;
						//
						if (goods_item_two.child_list.length) {
							for (let goods_three in goods_item_two.child_list) {
								let goods_item_three = goods_item_two.child_list[goods_three],

									sku_id_three = goods_item_three.sku_id,
									num_three = 0,
									cart_id_three = '';

								for (let cart_index in cart_data) {
									let cart_item_three = cart_data[cart_index];
									if (sku_id_three == cart_item_three.sku_id) {
										num_three = goods_item_three.num;
										cart_id_three = cart_item_three.cart_id;
									}
								}
								goods_item_three.num = num_three;
								goods_item_three.cart_id = cart_id_three;
								if (goods_item_three.goods_list.length > 0) {
									for (let goods_four in goods_item_three.goods_list) {
										let goods_item_four = goods_item_three.goods_list[goods_four],
											sku_id_four = goods_item_four.sku_id,
											num_four = 0,
											cart_id_four = '';

										for (let cart_index in cart_data) {

											let cart_item_four = cart_data[cart_index];

											if (sku_id_four == cart_item_four.sku_id) {
												num_four = cart_item_four.num;
												cart_id_four = cart_item_four.cart_id;
											}
										}
										goods_item_four.num = num_four;
										goods_item_four.cart_id = cart_id_four;

									}
								}
							}
						}
					}
				}
			}
			this.cateList = goods_data;
			this.$forceUpdate();
		},

		// 变更购物车数量
		cartNumChange(type, num, cart_id, sku_id,site_id) {
			if (!this.token) {
				let back="/pages/goods/category/category"
				if(this.siteId){
					back="/otherpages/shop/category/category"
				}
				this.$refs.login.open(back);
				// this.$util.redirectTo('/pages/login/login/login', {
				// 	back: back
				// });
				return;
			}
			if(this.cartFlag) return false;
			this.cartFlag = true;

			let cartData = {num: '',cart_id: cart_id,sku_id: sku_id,site_id:site_id},
				shopData = {num: '',cart_id: cart_id,sku_id: sku_id},
				cartUrl = "",
				operationtype ; //类型 add--新增商品  edit--修改商品数量  delete--删除商品

			if(cart_id == '') {
				operationtype = "add";

				cartData.num = 1;
				shopData.num = 1;
				cartUrl = '/api/cart/add';
			}else if (type == 'add') {
				operationtype = "edit";
				cartData.num = num + 1;
				shopData.num = num + 1;
				cartUrl = '/api/cart/edit';
			}else if (type == 'minus') {
				cartData.num = num - 1 ? num - 1 : 0;
				shopData.num = num - 1 ? num - 1 : 0;

				cartUrl =  cartData.num > 0 ? '/api/cart/edit' :'/api/cart/delete';
				operationtype =  cartData.num > 0 ? 'edit' :'delete';
			}

			this.shopDataChange(shopData);

			this.$api.sendRequest({
				url: cartUrl,
				data: cartData,
				success: res => {
					if (res.code >= 0 && res.data > 0) {
						this.getCartData()
						if(operationtype == "edit"){
							return false;
						}

						shopData.cart_id = operationtype == "add" ? res.data : '';
						this.shopDataChange(shopData);
						this.$store.dispatch('getCartNumber');

					} else {
						shopData.num = num;
						this.shopDataChange(shopData);
						this.cartFlag = false;
						// this.$util.showToast({
						// 	title: res.message
						// });
					}


				}
			});

		},
		shopDataChange(data){

			if(this.value.level != 3){
				for(var i = 0; i < this.goodsList.length; i++){

					var item = this.goodsList[i];
					if(data.sku_id == item.sku_id){

						item.num = data.num;
						item.cart_id = data.cart_id;

						this.$forceUpdate();

					}
				}

			}else{
				for(var i = 0; i < this.threeCateList.length; i++){
					var item = this.threeCateList[i];
					for(var j = 0; j < item.goods_list.length; j++){
						if(item.goods_list[j].sku_id == data.sku_id){

							item.goods_list[j].num = data.num;
							item.goods_list[j].cart_id = data.cart_id;

							this.$forceUpdate();

						}
					}
				}
			}
		},

		//请求分类列表
		getCategoryList() {
			let url = "/api/goodscategory/tree"
			let data={
				level: this.value.level,
				template: this.value.template,
			};
			if(this.siteId){
				data.site_id=this.siteId;
				url = "/api/shopgoodscategory/tree"
			}
			this.$api.sendRequest({
				url: url,
				data: data,
				success: res => {
					if (res.code == 0) {
						this.cateList = res.data;
						if (!this.cateList.length) return;

						this.categoryAdvImage = this.cateList[0].image_adv;

						if (res.data) {
							this.oneCategoryId = res.data[0].category_id_1;
						}else{
							this.$emit("netFinish", true)
						}
						if (this.value.level != 1 && res.data && res.data[0].child_list && res.data[0].child_list.length>0) {
						
							this.twoCateList = res.data[0].child_list;
							this.TwoCategoryId = res.data[0].child_list[0].category_id_2;

							if (this.value.level == 3 && res.data[0].child_list[0].child_list.length>0) {
								this.threeCateList = res.data[0].child_list[0].child_list
								this.threeCategoryId = res.data[0].child_list[0].child_list.category_id_3;
							}
						}
						if (this.value.level == 2 && this.type == 3) {
							this.getGoodsList()
						} else if (this.value.level == 1 && this.type == 3) {
							this.getGoodsList()
						} else if (this.value.level == 3 && this.type == 3) {
							this.getCartData()
						} else {
							this.$emit("netFinish", true)
						}

						setTimeout(() => {
							const query = uni.createSelectorQuery().in(this);
							query.select('.category-cate-top').boundingClientRect(data => {
								this.newheight = data.height;
							}).exec();
						}, 100)

					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				},
			});
		},

		//请求商品列表
		getGoodsList() {
			let levelId = 0;
			let level = 0;
			if (this.value.level == 1) {
				levelId = this.oneCategoryId;
				level = 1
			} else if (this.value.level == 2 && this.TwoCategoryId) {
				levelId = this.TwoCategoryId;
				level = 2
			} else if (this.value.level == 2 && !this.TwoCategoryId) {
				levelId = this.oneCategoryId;
				level = 1
			}

			if (!this.isNetwork) return;
			if (this.isAll) return;
			this.isNetwork = 0;
			this.isLoading = true;
			var data = {
				page: this.num,
				page_size: this.size,
			};
			if (this.siteId) {
				data.shop_category_id=levelId;
			}else{
				data.category_id = levelId;
				data.category_level=level;
			}

			this.$api.sendRequest({
				url: '/api/goodssku/page',
				data: data,
				success: res => {
					if (res.code == 0 && res.data) {
						let newArr = [];
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						}
						//设置列表数据
						if (this.num == 1) this.goodsList = []; //如果是第一页需手动制空列表
						this.goodsList = this.goodsList.concat(newArr); //追加新数据
						if (this.goodsList.length == res.data.count) {
							this.isAll = true;
						}

						this.getCartData()
					}
					this.$emit("netFinish", true)
					this.num = this.num + 1;
					this.isNetwork = 1;
					this.isLoading = false;


				}
			});
		},

		// 获取商品详情
		async getGoodsSkuDetail(skuId) {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open(this.currentRoute);
				return;
			}

			let res = await this.$api.sendRequest({
				url: '/api/goodssku/detail',
				async: false,
				data: {
					sku_id: skuId,
				}
			});
			let data = res.data;
			if (data.goods_sku_detail != null) {
				// var tempInfo = data.goods_sku_detail
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


				this.contactData = {
					title: this.goodsSkuDetail.sku_name,
					path: '/pages/goods/detail/detail?sku_id=' + this.skuId,
					img: this.$util.img(this.goodsSkuDetail.sku_image, {
						size: 'big'
					})
				}
				this.$refs.goodSkuNew.show("join_cart", this.goodsSkuDetail, () => {
					this.getCartCount();
				});
			} else {
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			}
		},

		/**
		 * 刷新商品sku详情数据
		 * @param {Object} goodsSkuDetail
		 */
		refreshGoodsSkuDetail(goodsSkuDetail) {
			Object.assign(this.goodsSkuDetail, goodsSkuDetail);
		},

		//获取购物车数量
		getCartCount() {
			if (this.preview) return; // 开启预览，禁止任何操作和跳转
			this.$store.dispatch('getCartNumber').then((e) => {
				this.cartCount = e;
			})
		},

		//跳转商品详情
		toDetail(skuId) {
			this.$util.redirectTo('/pages/goods/detail/detail', {
				sku_id: skuId
			})
		},

		//跳转至商品列表
		toListDetail(id,level) {
			let data = {
				category_id: id,
				category_level:level
			};
			let url = '/pages/goods/list/list';
			if(this.siteId){
				url = '/otherpages/shop/list/list';
				data.site_id=this.siteId;
			}
			this.$util.redirectTo(url, data)
		},

		// 点击一级分类
		// 	参数1，一级分类id,
		// 	参数2，一级分类index,
		// 	参数3. 是否跳转至详情页 true  or  false
		selectOneCategory(onecateId, index, jump) {

			//切换一级分类
			this.oneCategoryId = onecateId;
			this.oneCategoryIndex = index;

			//切换广告图片
			this.categoryAdvImage = this.cateList[this.oneCategoryIndex].image_adv;


			if (this.value.level > 1) {

				//修改二级分类列表
				this.twoCateList = this.cateList[this.oneCategoryIndex].child_list ? this.cateList[this.oneCategoryIndex].child_list :
					[];
				if (this.twoCateList.length) {
					this.TwoCategoryId = this.twoCateList[0].category_id_2;
					this.TwoCategoryIndex = 0;
				}else{
					this.TwoCategoryId=null;
					this.TwoCategoryIndex = null;
				}
				//如果有三级，修改三级列表
				if (this.value.level == 3) {
					if (this.twoCateList.length) {
						this.threeCateList = this.twoCateList[this.TwoCategoryIndex].child_list
					} else {
						this.threeCateList = []
					}
				}
			}

			if (this.value.level == 2 && this.type == 3) {
				this.num = 1;
				this.isAll = false;
				this.isNetwork = true;
				this.goodsList = [];
				this.getGoodsList()
			}
			if (this.value.level == 1 && this.type == 3) {
				this.num = 1;
				this.isAll = false;
				this.isNetwork = true;
				this.goodsList = [];
				this.getGoodsList()
			}

			setTimeout(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.category-cate-top').boundingClientRect(data => {
					this.newheight = data.height;
				}).exec();
			}, 100)
		},

		// 点击二级分类
		// 	参数1，二级分类id,
		// 	参数2，二级分类index,
		// 	参数3. 是否跳转至详情页 true  or  false
		selectTwoCategory(twoCateId, index, jump) {
			this.TwoCategoryId = twoCateId;
			this.TwoCategoryIndex = index;
			if (this.value.level == 2 && jump == false) {
				this.num = 1;
				this.isAll = false;
				this.isNetwork = true;
				this.goodsList = [];
				this.getGoodsList();
			}


			if (this.value.level == 3) {
				if (this.twoCateList.length) {
					this.threeCateList = this.twoCateList[index].child_list
				}
			}

			if (this.value.level == 2 && this.type == 3) {
				this.num = 1;
				this.isAll = false;
				this.isNetwork = true;
				this.goodsList = [];
				this.getGoodsList()
			}
			if (this.value.level == 1 && this.type == 3) {
				this.num = 1;
				this.isAll = false;
				this.isNetwork = true;
				this.goodsList = [];
				this.getGoodsList()
			}
		},

		selectThreeCategory() {
			this.toListDetail()
		},

		goodsImageError(index, num) {
			this.goodsList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},

		cateImageError(index, level) {
			if (level == 1) {
				this.cateList[index].image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate()
			} else if (level == 2) {
				this.twoCateList[index].image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate()
			}
		},

		threeGoodsImageError(index, num) {
			this.threeCateList[index].goods_list[num].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},

		threeCateImageError(index, num) {
			this.twoCateList[index].child_list[num].image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		
		
		price(item) {
			let price=Number(item.price);
			let member_price=Number(item.member_price?item.member_price:100000000000000000000);
			let discount_price=100000000000000000000;
			if(item.promotion_type==1){
				discount_price=Number(item.discount_price?item.discount_price:100000000000000000000)
			}else{
				discount_price=100000000000000000000
			}
			if(price<=member_price&&price<=discount_price){
				return price.toFixed(2)
			}else if(member_price<=discount_price&&member_price<=price){
				return member_price.toFixed(2)
			}else{
				return discount_price.toFixed(2)
			}
		},
		priceLogo(item){
			let price=Number(item.price);
			let member_price=Number(item.member_price?item.member_price:100000000000000000000);
			let discount_price=100000000000000000000;
			if(item.promotion_type==1){
				discount_price=Number(item.discount_price?item.discount_price:100000000000000000000)
			}else{
				discount_price=100000000000000000000
			}
			if(price<=member_price&&price<=discount_price){
				return 'price'
			}else if(member_price<=discount_price&&member_price<=price){
				return 'member_price'
			}else{
				return 'discount_price'
			}
		}
	}
}
