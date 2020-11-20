export default {
	data() {
		return {
			mescroll: null,
			timeList: [], //时间列表
			seckillId: null, //选中的时间块
			seckillIndex: null, //选中时间块的index
			dataList: [], //选中时间块的商品列表
			index: null, //当前正在抢购的index,
			siteId: 0
		};
	},
	watch: {
		seckillId(newName, oldName) {
			if (newName && oldName && newName != oldName) {
				this.mescroll.resetUpScroll(false);
			}
		}
	},
	computed: {
		show() {
			
			return this.timeList.length > 0
		},
	},
	methods: {
		getTimeList() {
			this.$api.sendRequest({
				url: '/seckill/api/seckill/lists',
				success: res => {
					let data = res.data;
					if(!data) return;
					let time = new Date(res.timestamp * 1000);
					let newTimes = time.getHours() * 60 * 60 + time.getMinutes() * 60 + time.getSeconds();
					data.list.forEach((v, k) => {
						if (v.seckill_start_time <= newTimes && newTimes < v.seckill_end_time) {
							v.isNow = true;
							this.seckillId = v.seckill_id;
							this.index = k;
							this.seckillIndex = k;
						} else {
							v.isNow = false;
						}
					});
					this.timeList = data.list;
					if(this.timeList.length == 0){
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
					if (!this.seckillId) {
						for (let i = 0; i < data.list.length; i++) {
							if (newTimes < data.list[i].seckill_start_time && i == 0) {
								this.seckillId = data.list[i].seckill_id;
								this.index = i;
								this.seckillIndex = i;
							} else if (newTimes < data.list[i].seckill_start_time && newTimes > data.list[i - 1].seckill_end_time && i !=
								0) {
								this.seckillId = data.list[i].seckill_id;
								this.index = i;
								this.seckillIndex = i;
							} else if (i == data.list.length - 1 && newTimes > data.list[i].seckill_end_time) {
								this.seckillId = data.list[i].seckill_id;
								this.index = i;
								this.seckillIndex = i;
							}
						}
					}
				}
			});
		},
		getData(mescroll) {
			this.mescroll = mescroll;
			if(mescroll.size==1){
				this.dataList=[];
			}
			this.$api.sendRequest({
				url: '/seckill/api/seckillgoods/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					seckill_id: this.seckillId,
					site_id: this.siteId
				},
				success: res => {
					let newArr = []
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({
							title: msg
						})
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail() {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		ontabtap(e, f) {
			this.seckillId = e;
			this.seckillIndex = f;
		},
		//跳转到详情页
		toGoodsDetail(id, isRedirectTo) {
			if (!isRedirectTo) return;
			this.$util.redirectTo('/promotionpages/seckill/detail/detail', {
				id: id
			});
		},
		imageError(index) {
			this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	},
	onShareAppMessage(res) {
		var title = '一大波的秒杀福利就要开始了，真的不来看看嘛';
		var path = '/promotionpages/seckill/list/list';
		return {
			title: title,
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
