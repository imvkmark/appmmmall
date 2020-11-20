<template>
	<view  :data-theme="themeStyle">
		<view class="my_spell_category">
			<view class="category-item" v-for="(item, index) in statusList" :key="index" @click="categoryChange(item.id)">
				<view class="item-con" :class="item.id == status ? 'active ns-text-color ns-bg-before' : ''">{{ item.name }}</view>
			</view>
		</view>
		<mescroll-uni @getData="getData" top="80" refs="mescroll" :size="10">
			<block slot="list">
			<view class="goods-list ns-margin-left ns-margin-right" v-for="(item, index) in dataList" :key="index">
				<view class="goods-item">
					<view class="goods-item-content" @click="goBargainDetail(item.launch_id)">
						<view class="image-wrap"> 
							<view class="shade" v-if="item.status != 0">
								<block v-if="item.status == 1">
									<view class="iconfont iconyuan_checked"></view>
									<view class="txt ns-font-size-sm">砍价成功</view>
								</block>
								<block v-else>
									<view class="iconfont iconguanbi"></view>
									<view class="txt ns-font-size-sm">砍价失败</view>
								</block>
							</view>
							<image :src="$util.img(item.sku_image)" mode="aspectFit" @error="imageError(index)"></image>
						</view>
						<view class="content">
							<view class="title">{{ item.sku_name }}</view>
							<text class="residue-price ns-text-color">已砍至{{ item.curr_price }}元</text>
							<view class="price-box">
								<text class="original-price">{{ $lang('common.currencySymbol') }}{{ item.price }}</text>
								<view class="time" v-if="item.timeMachine && item.status == 0">
									<uni-count-down
										:day="item.timeMachine.d"
										:hour="item.timeMachine.h"
										:minute="item.timeMachine.i"
										:second="item.timeMachine.s"
										color="#fff" 
										splitorColor="#000 !important" 
										backgroundColorClass="ns-bg-color"
										border-color="transparent"
									/>
									<text class="end-txt">后结束</text>
								</view>
							</view>
						</view>
					</view>
					<view class="goods-item-operation">
						<view class="invitation-bargain">
							<image :src="recordItem.headimg == '' ? $util.img($util.getDefaultImage().default_headimg) : $util.img(recordItem.headimg)" v-for="(recordItem, recordIndex) in item.bargain_record" :key="recordIndex" @error="memberImageError(index, recordIndex)"></image>
							<text class="ns-text-color" v-if="item.status == 0" @click="goBargainDetail(item.launch_id)">+</text>
							<text class="ns-text-color" v-else>···</text>
						</view>
						<button class="btn" v-if="item.status == 0" @click="goBargainDetail(item.launch_id)">继续砍价</button>
						<block v-if="item.status == 1">
							<button class="btn" v-if="item.order_id == 0" @click="goBargainDetail(item.launch_id)">购买商品</button>
							<button class="btn" v-else @click="goBargainDetail(item.launch_id)">查看详情</button>
						</block>
						<button class="btn fail" v-if="item.status == 2" @click="$util.redirectTo('/promotionpages/bargain/list/list')">重新砍价</button>
					</view>
				</view>
			</view>
			
			<view v-if="dataList.length == 0" style="padding-top:0">
				<ns-empty text="当前没有订单哦..."></ns-empty>
			</view>
			
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	components: {
		uniCountDown,
	},
	data() {
		return {
			mescroll: null,
			dataList: [],
			statusList: [
				{
					id: 'all',
					name: '全部'
				},
				{
					id: 0,
					name: '正在砍价'
				},
				{
					id: 1,
					name: '砍价成功'
				},
				{
					id: 2,
					name: '砍价失败'
				}
			],
			status: 'all'
		};
	},
	mixins:[globalConfig],
	onLoad() {},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	methods: {
		//请求列表数据
		getData(mescroll) {
			this.mescroll = mescroll;
			this.$api.sendRequest({
				url: '/bargain/api/bargain/launchPage',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					status: this.status
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
					newArr.forEach(v => {
						if (v.end_time > res.timestamp) {
							v.timeMachine = this.$util.countDown(v.end_time - res.timestamp);
						} else {
							v.timeMachine = null;
						}
					});
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
		//砍价详情
		goBargainDetail(id) {
			this.$util.redirectTo('/promotionpages/bargain/launch/launch', {
				id: id
			});
		},
		//切换分类
		categoryChange(e) {
			this.status = e;
			this.mescroll.resetUpScroll();
		},
		imageError(index) {
			this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		memberImageError(index, j) {
			this.dataList[index].bargain_record[j].headimg = this.$util.getDefaultImage().default_headimg;
			this.$forceUpdate();
		}
	},
	onBackPress(options){
		if (options.from === 'navigateBack') {
			return false;
		}
		this.$util.redirectTo('/pages/member/index/index',{})
		return true;
	}
};
</script>

<style lang="scss">
.my_spell_category {
	width: 100%;
	height: 70rpx;
	display: flex;
	background: #ffffff;

	// justify-content: space-between;
	.category-item {
		flex: 1;
		height: 100%;
		text-align: center;

		.item-con {
			display: inline-block;
			height: 64rpx;
			font-size: $ns-font-size-sm;
			position: relative;
			line-height: 64rpx;
		}

		.item-con.active:after {
			content: '';
			display: block;
			width: 100%;
			height: 6rpx;
			border-radius: 6rpx;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
}

.goods-list {
	margin-top: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;

	&:last-child {
		border-bottom: none;
		margin-bottom: 30rpx;
	}
}

.goods-list .goods-item-content{
	display: flex;
	background-color: #fff;
	border-radius: 10rpx;
	height: 250rpx;
	padding: 24rpx;
	box-sizing: border-box;
	
	.image-wrap{
		width: 200rpx;
		height: 200rpx;
		margin-right: 22rpx;
		position: relative;
		border-radius: 10rpx;
		overflow: hidden;
		
		.shade{
			position: absolute;
			z-index: 5;
			left: 0;
			top: 0;
			background: rgba(30,30,30,.5);
			width: 100%;
			height: 100%;
			
			view{
				text-align: center;
				color: #fff;
			}
			
			.iconfont{
				font-size: 50rpx;
				line-height: 1;
				margin-top: 50rpx;
			}
			
			.txt{
				margin-top: 10rpx;
			}
		}
		
		image{
			width: 200rpx;
			height: 200rpx;
		}
	}
	
	.content{
		position: relative;
		line-height: 1;
		flex: 1;
		.title{
			font-size: $ns-font-size-sm;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			line-height: 18px;
		}
		.residue-price{
			display: inline-block;
			margin-top: 6rpx;
			background: rgba($base-color,0.08) !important;
			font-size: $ns-font-size-sm;
			padding: 2rpx 4rpx;
		}
		.price-box{			
			position: absolute;
			bottom: 0;
			line-height: 1.6;
			font-size: $ns-font-size-sm;
			width: 100%;
			.original-price{
				color: #777;
				text-decoration: line-through;
			}
			.time{
				font-size: 22rpx;
				
				.end-txt{
					margin-left: 8rpx;
				}
			}
		}	
	}
}
.goods-list .goods-item-operation{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 12px 20rpx;
	box-sizing: border-box;
	.invitation-bargain{
		display: flex;
		flex-flow: wrap;
		width: 510rpx;
		
		image,text{
			margin-right: 16rpx;
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			border: 2rpx solid #f1f1f1;
		}
		text{			
			display: flex;
			align-items: center;
			justify-content: center;
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
		
		&.fail{
			background-color: #aaa;
		}
	}
}

</style>
<style scoped>
>>> .uni-countdown__number,
>>> .uni-countdown__splitor {
	margin: 0;
	padding: 0;
}
.time>>>.uni-countdown__number {
	min-width: 28rpx;
	height: 28rpx;
	text-align: center;
	line-height: 28rpx;
	background: #000;
	/* // #690b08 */
	border-radius: 4px;
	display: inline-block;
	padding: 4rpx;
	margin: 0;
	border: none;
}
.time>>>.uni-countdown__splitor{
	margin: 0 4rpx;
}
</style>
