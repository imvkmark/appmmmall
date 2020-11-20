<template>
	<view :class="themeStyle">
		<mescroll-uni @getData="getData" refs="mescroll" :size="10" v-if="addonIsExit.groupbuy">
			<block slot="list">
				<ns-adv keyword="NS_BARGAIN"></ns-adv>
				<block v-for="(dataItem,index) in dataList" :key="index">
					<ns-goods-item-col :value="dataItem" @toDetail="toDetail" type="bargain">
						<view class="bargain-operation">
							<view class="price-box">
								<text class="original-price">{{dataItem.price}}</text>
								<text>
									底价：<text class="floor-price ns-text-color ns-font-size-base">{{ $lang('common.currencySymbol') }}{{dataItem.floor_price}}</text>
								</text>
							</view>
							<button class="btn ns-bg-color" @click="toDetail(dataItem)">去砍价</button>
						</view>
					</ns-goods-item-col>	
				</block>
				<view v-if="!dataList.length" class="cart-empty"><ns-empty></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniTag from '@/components/uni-tag/uni-tag.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import nsGoodsItemCol from '@/components/ns-goods-item/ns-goods-item-col.vue'
import nsAdv from '@/components/ns-adv/ns-adv.vue';
export default {
	components: {
		uniTag,
		nsGoodsItemCol,
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
		// 刷新多语言
		if(!this.addonIsExit.groupbuy){
			this.$util.showToast({
				title:'砍价插件未安装',
				mask:true,
				duration:2000
			})
			setTimeout(()=>{
				this.$util.redirectTo('/pages/index/index/index',{},'redirectTo')
			},2000)
			return;
		}
		
		this.$langConfig.refresh();
	},
	mixins:[globalConfig],
	methods: {
		getData(mescroll) {
			let data={
				page_size: mescroll.size,
				page: mescroll.num
			}
			if(this.siteId){
				data.site_id=this.siteId  
			}
			this.$api.sendRequest({
				url: '/bargain/api/bargain/page',
				data: data,
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
				fail() {
					//联网失败的回调
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toDetail(e) {
			this.$util.redirectTo('/promotionpages/bargain/detail/detail', {
				id: e.id
			});
		},
		imageError(index) {
			this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	},
	onShareAppMessage(res) {
		var title = '砍价，优惠更多哦';
		var path = '/promotionpages/bargain/list/list';
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
	@import '../public/css/list.scss';
	.bargain-operation{
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		width: 100%;
		.residue-price{
			display: inline-block;
			margin-top: 6rpx;
			background: rgba($base-color,0.08) !important;
			font-size: $ns-font-size-sm;
			padding: 2rpx 4rpx;
		}
		.price-box{
			line-height: 1.6;
			font-size: $ns-font-size-sm;
			display: flex;
			flex-direction: column;
			.original-price{
				color: #777;
				text-decoration: line-through;
			}
			.time{
				font-size: 22rpx;
				text{
					padding: 2rpx 4rpx;
					margin: 0 4rpx;
					color: #fff;
					border-radius: 4rpx;
					line-height: 1;
				}
			}
		}
		.btn{
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0;
			padding: 0;
			width: 136rpx;
			height: 48rpx;
			line-height: 1;
			color: #fff;
			font-size: $ns-font-size-sm;
			background-color: #FF7200;
			border-radius: 40rpx;
		}
	}
</style>
