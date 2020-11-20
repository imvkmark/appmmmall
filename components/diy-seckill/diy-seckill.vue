<template>
	<view class="diy-seckill" v-if="dataList.length" :style="{backgroundColor: value.backgroundColor}">
		<view class="diy-seckill-top">
			<view class="seckill-title">
				<text class="seckill-title-name">秒杀专区</text>
				<text class="seckill-title-time">{{ timeList[index].name }} {{ timeList[index].seckill_start_time_show + '~' + timeList[index].seckill_end_time_show }}</text>
			</view>
			<view class="seckill-more ns-text-color" @click="toMore()">更多秒杀</view>
		</view>
		<scroll-view class="diy-seckill-box" scroll-x="true">
			<view class="seckill-box-item" v-for="(item, i) in dataList" :key="i" @click="toDetail(item.id)">
				<view class="seckill-item">
					<view class="seckill-item-image">
						<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(i)"></image>
					</view>
					<text class="seckill-item-new-price ns-text-color">￥{{ item.seckill_price }}</text>
					<text class="seckill-item-old-price">￥{{ item.price }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'diy-seckill',
		props: {
			value: {
				type: Object
			},
			siteId: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				seckillId: 0,
				index: null,
				timeList: [],
				dataList: [],
				isNow: false
			};
		},
		created() {
			this.getTimeList();
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
								this.seckillId = v.seckill_id;
								this.index = k;
								this.isNow = true;
							}
						});
						if (!this.seckillId) {
							for (let i = 0; i < data.list.length; i++) {
								if (newTimes < data.list[i].seckill_start_time && i == 0) {
									this.seckillId = data.list[i].seckill_id;
									this.index = i;
								} else if (newTimes < data.list[i].seckill_start_time && newTimes > data.list[i - 1].seckill_end_time && i !=
									0) {
									this.seckillId = data.list[i].seckill_id;
									this.index = i;
								} else if (i == data.list.length - 1 && newTimes > data.list[i].seckill_end_time) {
									this.seckillId = data.list[i].seckill_id;
									this.index = i;
								}
							}
						}
						this.timeList = data.list;
						this.getDataList(this.seckillId);
					}
				});
			},
			getDataList(seckillId) {
				this.$api.sendRequest({
					url: '/seckill/api/seckillgoods/page',
					data: {
						seckill_id: seckillId,
						site_id: this.siteId
					},
					success: res => {
						var data = res.data;
						if (data.list) {
							this.dataList = data.list;
						}
					}
				});
			},
			toMore() {
				this.$util.redirectTo('/promotionpages/seckill/list/list', {
					site_id: this.siteId
				});
			},
			toDetail(id) {
				if (this.isNow) {
					this.$util.redirectTo('/promotionpages/seckill/detail/detail', {
						id: id
					});
				} else {
					this.$util.showToast({
						title: '活动还未开始，敬请期待'
					});
				}
			},
			imageError(index) {
				this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	.diy-seckill {
		width: 100%;
		padding: $ns-padding;
		box-sizing: border-box;
	}

	.diy-seckill-top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.seckill-title {
			display: flex;
			align-items: center;

			.seckill-title-name {
				font-size: $ns-font-size-base;
				font-weight: bold;
				margin-right: $ns-margin;
			}

			.seckill-title-time {
				display: inline-block;
				max-width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: $ns-font-size-sm;
			}
		}

		.seckill-more {
			font-size: $ns-font-size-sm;
		}

		.seckill-more::after {
			font-family: 'iconfont';
			content: '\eb93';
			font-size: $ns-font-size-base;
			line-height: 1;
			position: relative;
			top: 2rpx;
			margin-left: 4rpx;
		}
	}

	.diy-seckill-box {
		width: 100%;
		/*white-space 不能丢  */
		white-space: nowrap;
		box-sizing: border-box;
		margin-top: 10rpx;
	}

	.seckill-box-item {
		width: 150rpx;
		height: 100%;
		display: inline-block;
		background: #ffffff;
		margin-right: $ns-margin;

		.seckill-item {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		.seckill-item-image {
			width: 100%;
			height: 140rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 130rpx;
				height: 130rpx;
				padding: 0;
				margin: 0;
			}
		}

		.seckill-item-new-price {
			font-size: $ns-font-size-base;
			text-align: center;
		}

		.seckill-item-old-price {
			font-size: $ns-font-size-sm;
			text-align: center;
			color: $ns-text-color-gray;
			text-decoration: line-through;
			line-height: 1;
		}
	}
</style>
