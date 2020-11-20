<template>
	<view :class="themeStyle">
		<mescroll-uni @getData="getData" refs="mescroll" :size="10" v-if="addonIsExit.topic">
			<block slot="list">
				<ns-adv keyword="NS_TOPIC"></ns-adv>
				<view class="topic-list" v-if="dataList.length">
					<view class="topic-item-row" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.topic_id)">
						<image :src="$util.img(item.topic_adv)" mode="widthFix" v-if="item.topic_adv"></image>
						<view class="item-title">{{ item.topic_name }}</view>
						<text class="item-content" v-if="item.remark">{{ item.remark }}</text>
					</view>
				</view>
				<view v-if="!dataList.length">
					<ns-empty :siteId="siteId" :fixed="!1" :isIndex="!1"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import nsAdv from '@/components/ns-adv/ns-adv.vue';
	export default {
		components: {
			nsAdv
		},
		data() {
			return {
				dataList: [],
				siteId:0
			};
		},
		onLoad(options) {
			if (options.site_id) {
				this.siteId = options.site_id;
			}
		},
		onShow() {
			if(!this.addonIsExit.topic){
				this.$util.showToast({
					title:'专题活动插件未安装',
					mask:true,
					duration:2000
				})
				setTimeout(()=>{
					this.$util.redirectTo('/pages/index/index/index',{},'redirectTo')
				},2000);
				return;
			}
			// 刷新多语言
			this.$langConfig.refresh();
		},
		computed:{
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			},
			addonIsExit(){
				return this.$store.state.addonIsExit
			}
		},
		methods: {
			getData(mescroll) {
				this.$api.sendRequest({
					url: '/topic/api/topic/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num
					},
					success: res => {
						let newArr=[]
						let msg=res.message;
						if(res.code==0 && res.data){
							newArr = res.data.list;
						}else{
							this.$util.showToast({title:msg})
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			toDetail(e) {
				this.$util.redirectTo('/promotionpages/topics/detail/detail', {
					topic_id: e
				}, );
			}
		},
		onShareAppMessage(res) {
			var title = '活动多多，优惠多多，快来看看吧';
			var path = '/promotionpages/topics/list/list';
			return {
				title: title,
				path: path,
				success: res => {},
				fail: res => {}
			};
		}
	};
</script>

<style lang="scss">
	.topic-pic {
		height: 300rpx;

		image {
			height: 300rpx;
		}
	}

	.topic-list {
		display: flex;
		flex-wrap: wrap;
		margin: $ns-margin;

		.topic-item-row {
			width: 100%;
			background: #ffffff;
			border-radius: 15rpx;
			overflow: hidden;
			padding-bottom: $ns-padding;
			margin-bottom: 30rpx;

			image {
				width: 100%;
			}

			.item-content {
				overflow: hidden;
				display: block;
				white-space: nowrap;
				text-overflow: ellipsis;
				height: 34rpx;
				line-height: 34rpx;
				padding: 0 $ns-padding;
				box-sizing: border-box;
			}

			.item-title {
				padding: 0 $ns-padding;
				box-sizing: border-box;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-weight: 700;
				width: 80%;
			}
		}
	}
	.empty{
		margin-top: 100rpx;
	}
</style>
