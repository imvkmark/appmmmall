<template>
	<view :class="themeStyle">
		<mescroll-uni @getData="getData" refs="mescroll" :size="10" v-if="addonIsExit.pintuan">
			<block slot="list">
				<ns-adv keyword="NS_PINTUAN"></ns-adv>
				<view class="pintuan-page">
					<view class="pintuan-list" v-if="dataList.length">
						<view class="list-item ns-margin-bottom" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.id)">
							<view class="item-image"><image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="widthFix"></image></view>
							<view class="item-desc">
								<view class="desc-title">{{ item.goods_name }}</view>
								<view class="desc-con">
									<view class="desc-price">
										<view class="ns-text-color-gray old-price">
											<text>￥{{ item.price }}</text>
										</view>
										<view>
											<text class="ns-text-color ns-font-size-base">拼团价：{{ item.pintuan_price }}</text>
										</view>
									</view>
									<view class="desc-pin ns-gradient-promotionpages-pintuan-list-list" :class="themeStyle">
										<view class="ns-text-color price">{{ item.pintuan_num }}人团</view>
										<view class="ns-gradient-promotionpages-pintuan-list-list" :class="themeStyle">立即开团</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!dataList.length"><ns-empty :siteId="siteId"  :fixed="false"></ns-empty></view>
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
			siteId: 0
		};
	},
	onLoad(options) {
		if (options.site_id) {
			this.siteId = options.site_id;
		}
	},
	onShow() {
		if(!this.addonIsExit.pintuan){
			this.$util.showToast({
				title:'拼团插件未安装',
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
				url: '/pintuan/api/goods/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					site_id: this.siteId
				},
				success: res => {
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({ title: msg });
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
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/pintuan/detail/detail', {
				id: e
			});
		},
		imageError(index) {
			this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
.pintuan-top {
	width: 100%;

	image {
		width: 100%;
	}
}

.pintuan-page {
	width: 100%;
	padding: $ns-padding;
	box-sizing: border-box;
	margin-bottom: $ns-margin;
	.pintuan-list {
		width: 100%;

		.list-item {
			width: 100%;
			height: 268rpx;
			background: yellow;
			border-radius: $ns-border-radius;
			padding: $ns-padding;
			box-sizing: border-box;
			border-bottom: $ns-margin;
			display: flex;
			background: #ffffff;

			.item-image {
				width: 34%;
				height: 100%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.item-desc {
				width: 66%;
				height: 100%;
				padding-left: $ns-padding;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				flex-direction: column;

				.desc-title {
					font-size: $ns-font-size-base;
					font-weight: bold;

					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					line-height: 1.5;
				}

				.desc-con {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;

					.desc-price {
						text,
						view {
							line-height: 1.3;
						}
					}

					.old-price {
						text-decoration: line-through;
					}

					.desc-pin {
						width: 150rpx;
						height: 100rpx;
						padding: 4rpx;
						box-sizing: border-box;
						border-radius: $ns-border-radius;
						view {
							width: 100%;
							height: 50%;
							text-align: center;
							line-height: 48rpx;
						}
						.price{
							background: #ffffff;
						}
						view:nth-child(2) {
							color: #ffffff;
						}
					}
				}
			}
		}
	}
}

.pintuan_game {
	width: 100%;
}
</style>
