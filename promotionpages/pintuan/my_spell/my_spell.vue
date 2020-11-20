<template>
	<view :class="themeStyle">
		<view class="my_spell_category">
			<view class="category-item" v-for="(item, index) in pintuanStatusList" :key="index" @click="categoryChange(item.id)">
				<view class="item-con" :class="item.id == pintuanStatus ? 'active ns-text-color ns-bg-before' : ''">{{ item.name }}</view>
			</view>
		</view>
		<mescroll-uni @getData="getData" top="80" refs="mescroll" :size="10">
			<block slot="list">
				<view class="goods-list" v-for="(item, index) in dataList" :key="index">
					<view class="list-header">
						<view>
							<text class="ns-margin-right">{{ $lang('makeSpell') }}</text>
							<text class="ns-font-size-sm ns-text-color-gray">{{ $util.timeStampTurnTime(item.pay_time) }}</text>
						</view>
						<view v-if="item.pintuan_status == 2" class="ns-text-color">{{ $lang('spelling') }}</view>
						<view v-else-if="item.pintuan_status == 3" class="ns-text-color">{{ $lang('spellSuccess') }}</view>
						<view v-else class="ns-text-color">{{ $lang('spellFail') }}</view>
					</view>

					<view class="list-body" @click="goPinTuanDetail(item.pintuan_goods_id)">
						<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)"></image>
						<view class="shop-content">
							<view class="shop-title">{{ item.sku_name }}</view>
							<view>
								<text>
									<text class="ns-font-size-sm ns-text-color">¥</text>
									<text class="ns-text-color price-num uni-bold ns-margin-right">{{ item.order_money }}</text>
								</text>
								<text class="ns-font-size-sm">{{ item.pintuan_num }}{{ $lang('num') }}</text>
							</view>
						</view>
					</view>
					<view v-if="item.pintuan_status == 2" class="list-footer">
						<template v-if="item.timeMachine">
							<view>
								<text>{{ $lang('residue') }}</text>
								<text class="ns-text-color">{{ item.pintuan_num - item.pintuan_count }}</text>
								<text>{{ $lang('time') }}</text>
								<view class="time-wrap">
									<uni-count-down
										class="time"
										:day="item.timeMachine.d"
										:hour="item.timeMachine.h"
										:minute="item.timeMachine.i"
										:second="item.timeMachine.s"
										color="#333"
										splitorColor="#333"
										background-color="transparent"
										border-color="transparent"
									/>
								</view>
							</view>
							<navigator hover-class="none" class="ns-bg-color" :url="'/promotionpages/pintuan/share/share?id=' + item.id">{{ $lang('applyFriend') }}</navigator>
						</template>
						<template v-else>
							<text>{{ $lang('end') }}</text>
						</template>
					</view>
					<view v-else-if="item.pintuan_status == 3" class="list-footer">
						<view class="picture-box">
							<view class="img-box" v-for="(i, j) in item.member_list" v-if="j < 4" :key="j">
								<image :src="$util.img(i.member_img)" @error="memberImageError(index, j)" mode="aspectFill"></image>
							</view>
						</view>
						<navigator hover-class="none" :url="'/pages/order/detail/detail?order_id=' + item.order_id">{{ $lang('orderDetail') }}</navigator>
					</view>
				</view>
				<view v-if="dataList.length == 0" style="padding-top:0"><ns-empty :text="text"></ns-empty></view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
export default {
	components: {
		uniCountDown
	},
	data() {
		return {
			mescroll: null,
			dataList: [],
			pintuanStatusList: [
				{
					id: 2,
					name: '拼团中'
				},
				{
					id: 3,
					name: '拼团成功'
				},
				{
					id: 1,
					name: '拼团失败'
				}
			],
			pintuanStatus: 2,
			text: '您还暂无拼团订单'
		};
	},
	onLoad() {},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	computed:{
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		}
	},
	methods: {
		//请求列表数据
		getData(mescroll) {
			this.mescroll = mescroll;
			this.$api.sendRequest({
				url: '/pintuan/api/order/page',
				data: {
					page_size: mescroll.size,
					page: mescroll.num,
					pintuan_status: this.pintuanStatus
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
						if (v.group_end_time > res.timestamp) {
							v.timeMachine = this.$util.countDown(v.group_end_time - res.timestamp);
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
		//拼团商品详情
		goPinTuanDetail(id) {
			this.$util.redirectTo('/promotionpages/pintuan/detail/detail', {
				id: id
			});
		},
		//去首页
		goIndex() {
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		},
		//切换分类
		categoryChange(e) {
			this.pintuanStatus = e;
			this.mescroll.resetUpScroll();
			if (this.pintuanStatus == 1) {
				this.text = '您还暂无拼团失败订单';
			} else if (this.pintuanStatus == 2) {
				this.text = '您还暂无拼团订单';
			} else {
				this.text = '您还暂无拼团成功订单';
			}
		},
		imageError(index) {
			this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		memberImageError(index, j) {
			this.dataList[index].member_list[j].member_img = this.$util.getDefaultImage().default_headimg;
			this.$forceUpdate();
		}
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
	margin-top: 30rpx;
	background-color: #fff;

	&:last-child {
		border-bottom: none;
		margin-bottom: 30rpx;
	}
}

.list-header {
	display: flex;
	justify-content: space-between;
	height: 86rpx;
	padding: 0 30rpx;
	border-bottom: 2rpx solid $ns-border-color-gray;

	text {
		line-height: 86rpx;
	}

	view {
		line-height: 86rpx;
	}
}

.list-body {
	display: flex;
	padding: 30rpx;
	justify-content: space-between;

	image {
		width: 120rpx;
		height: 120rpx;
	}

	.shop-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 531rpx;

		.shop-title {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			line-height: 1.5;
		}
	}
}

.list-footer {
	display: flex;
	height: 80rpx;
	justify-content: space-between;
	padding: 0 30rpx;
	align-items: center;
	border-top: 2rpx solid #eee;

	.time-wrap {
		display: inline-block;
		margin-left: 10rpx;
	}

	navigator {
		padding: 0 $ns-padding;
		color: #fff;
		border-radius: 60rpx;
		font-size: $ns-font-size-sm;
		line-height: 50rpx;
	}
	.picture-box {
		width: 60%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.img-box {
		height: 52rpx;
		width: 52rpx;
		border-radius: 50%;
		margin-right: $ns-margin;
		image {
			width: 52rpx;
			height: 52rpx;
			border-radius: 50%;
		}
	}
}

.empty {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: $ns-padding;
	box-sizing: border-box;
	margin-top: 80rpx;

	.iconfont {
		font-size: 190rpx;
		color: $ns-text-color-gray;
		line-height: 1.2;
	}

	button {
		margin-top: 20rpx;
		font-size: $ns-font-size-base;
	}
}
</style>
<style scoped>
>>> .uni-countdown__number,
>>> .uni-countdown__splitor {
	margin: 0;
	padding: 0;
}
</style>
