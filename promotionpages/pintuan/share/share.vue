<template>
	<view :class="themeStyle">
		<view>
			<view class="pintuan-method">
				<view class="pintuan-use">
					<view class="use-title ns-text-color ns-font-size-lg">拼团玩法</view>
					<view class="use-step">
						<view class="step-con">
							<view class="ns-text-color">选择商品</view>
							<view class="ns-text-color">完成下单</view>
						</view>
						<text class="iconfont iconright ns-text-color"></text>
						<view class="step-con">
							<view class="ns-text-color">支付开团</view>
							<view class="ns-text-color">或参团</view>
						</view>
						<text class="iconfont iconright ns-text-color"></text>
						<view class="step-con">
							<view class="ns-text-color">邀请好友</view>
							<view class="ns-text-color">参团支付</view>
						</view>
						<text class="iconfont iconright ns-text-color"></text>
						<view class="step-con">
							<view class="ns-text-color">人满发货</view>
							<view class="ns-text-color">失败退款</view>
						</view>
					</view>
				</view>
			</view>
			<navigator hover-class="none" :url="'/promotionpages/pintuan/detail/detail?id=' + groupDetail.pintuan_goods_id" class="pintuan-list">
				<view class="list-item ns-margin-bottom">
					<view class="item-image"><image :src="$util.img(groupDetail.sku_image, { size: 'big' })" @error="imageError()" mode="widthFix"></image></view>
					<view class="item-desc">
						<view>
							<view class="desc-title">{{ groupDetail.sku_name }}</view>
							<view class="pintuan-num">
								<text class="ns-font-size-base ns-margin-right ns-text-color">{{ groupDetail.pintuan_num }}人团</text>
								<text class="ns-text-color">已团{{ groupDetail.group_num }}次</text>
							</view>
						</view>

						<view class="desc-con">
							<view class="desc-price">
								<view class="ns-text-color-gray">
									<text class="ns-text-color ns-font-size-base ns-margin-right">￥{{ groupDetail.pay_money }}</text>
									<text class="old-price">￥{{ groupDetail.discount_price }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</navigator>
			<view class="headimg-group">
				<view class="group-member" :class="{ 'group-image': item != '' }" v-for="(item, index) in groupDetail.member_list" :key="index">
					<view>
						<view class="mark ns-gradient-promotionpages-pintuan-share-share" :class="themeStyle" v-if="groupDetail.member_id == item.member_id">团长</view>
						<view class="member-face"><image :src="item.member_img ? $util.img(item.member_img) : $util.img('/upload/uniapp/spelling_who.png')"></image></view>
					</view>
				</view>
			</view>
			<template v-if="groupDetail.timeMachine">
				<view class="tips">
					还差{{ kill }}人成团，距结束还剩
					<uni-count-down
						:day="groupDetail.timeMachine.d"
						:hour="groupDetail.timeMachine.h"
						:minute="groupDetail.timeMachine.i"
						:second="groupDetail.timeMachine.s"
						backgroundColorClass="ns-bg-color"
						splitorColorClass="ns-text-color"
						borderColor="#ffffff"
						color="#ffffff"
					/>
				</view>

				<button type="primary" class="share-firend" open-type="share">邀请好友</button>
				<button
					type="default"
					class="one_btn"
					@click="$util.redirectTo('/promotionpages/pintuan/detail/detail', { id: groupDetail.pintuan_goods_id, group_id: groupDetail.group_id })"
				>
					一键参团
				</button>
			</template>
			<view class="tips" v-else><text>活动已结束</text></view>
		</view>
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
			id: 0,
			groupDetail: {
				sku_image: ''
			},
			kill: 0,
			memberId: 0
		};
	},
	onLoad(e) {
		this.id = e.id;
		this.$langConfig.refresh();
		this.getGroupDetail();
		this.getMemberId();
	},
	computed:{
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle
		}
	},
	methods: {
		getGroupDetail() {
			this.$api.sendRequest({
				url: '/pintuan/api/order/detail',
				data: {
					id: this.id
				},
				success: res => {
					if (res.code == 0) {
						res.data.member_list;
						let newArr = [];
						for (let i = 0; i < res.data.pintuan_num - res.data.member_list.length; i++) {
							let str = '';
							newArr.push(str);
						}
						this.kill = res.data.pintuan_num - res.data.pintuan_count;
						res.data.member_list = res.data.member_list.concat(newArr);
						if (res.data.group_end_time > res.timestamp) {
							res.data.timeMachine = this.$util.countDown(res.data.group_end_time - res.timestamp);
						} else {
							res.data.timeMachine = null;
						}
						this.groupDetail = res.data;
					} else {
						this.$util.showToast({ title: res.message });
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		getMemberId() {
			this.$api.sendRequest({
				url: '/api/member/id',
				success: res => {
					if (res.code >= 0) {
						this.memberId = res.data;
					}
				}
			});
		},
		imageError() {
			this.groupDetail.sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	},
	/**
	 * 自定义分享内容
	 * @param {Object} res
	 */
	onShareAppMessage(res) {
		var path = '/promotionpages/pintuan/detail/detail?id=' + this.groupDetail.pintuan_goods_id + '&group_id=' + this.groupDetail.group_id;
		if (this.memberId) path += '&source_member=' + this.memberId;
		return {
			title: '还差' + (this.groupDetail.pintuan_num - this.groupDetail.pintuan_count) + '人拼团成功，' + this.groupDetail.sku_name,
			imageUrl: this.$util.img(this.groupDetail.sku_image, { size: 'big' }),
			path: path,
			success: res => {},
			fail: res => {}
		};
	}
};
</script>

<style lang="scss">
.headimg-group {
	padding: 20rpx 20rpx 0 20rpx;
	background: #ffffff;
	line-height: 1;
	text-align: center;

	.group-member,
	.group-image {
		position: relative;
		width: 90rpx;
		height: 90rpx;
		margin: 0 20rpx 20rpx 0;
		display: inline-block;

		.member-face {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			overflow: hidden;
			line-height: 1;
			background: #f5f5f5;
		}

		.mark {
			white-space: nowrap;
			position: absolute;
			z-index: 5;
			color: #fff;
			line-height: 1;
			font-size: 24rpx;
			padding: 4rpx 10rpx;
			border-radius: 28rpx;
			left: 50%;
			transform: translate(-50%, -20%);
		}
	}

	.group-image .member-face {
		width: 82rpx;
		height: 82rpx;
		border: 4rpx solid #f00;
	}

	image {
		width: 100%;
		height: 100%;
	}
}

.tips {
	font-size: $ns-font-size-base;
	text-align: center;
	font-weight: bold;
	margin: 30rpx 0;
}

.time-wrap {
	margin-bottom: 40rpx;
	text-align: center;
}

.pin-info {
	font-size: 34rpx;
	line-height: 92rpx;
	padding: 0 $ns-padding;
	font-weight: bold;
	margin-top: 52rpx;
}

.shop-info {
	display: flex;
	justify-content: space-between;
	padding: $ns-padding;

	.shop-title {
		width: 120rpx;
	}
}

.share-firend {
	margin-bottom: 40rpx;
}

.pintuan-list {
	width: 100%;

	.list-item {
		width: 100%;
		height: 220rpx;
		background: yellow;
		border-radius: $ns-border-radius;
		padding: $ns-padding;
		box-sizing: border-box;
		border-bottom: $ns-margin;
		display: flex;
		background: #ffffff;

		.item-image {
			width: 25%;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.item-desc {
			width: 75%;
			height: 100%;
			padding-left: $ns-padding;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			flex-direction: column;

			.pintuan-num {
				text {
					display: inline-block;
					padding: 5rpx $ns-padding;
					background: #f7f7f7;
					font-size: $ns-font-size-sm;
					border-radius: 34rpx;
				}
			}

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
				align-items: center;

				.desc-price {
					text,
					view {
						line-height: 1.3;
					}
				}

				.old-price {
					text-decoration: line-through;
				}
			}
		}
	}
}

.pintuan-method {
	background: #ffffff;
	width: 100%;
	padding: $ns-padding;
	box-sizing: border-box;
	margin-bottom: 20rpx;

	.use-title {
		padding: 10rpx 0;
		box-sizing: border-box;
		text-align: center;
	}

	.use-step {
		display: flex;
		justify-content: space-between;

		.step-con {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			line-height: 0;
			border-radius: 100%;
			font-size: $ns-font-size-sm;

			width: 130rpx;
			height: 130rpx;
			background: #ccc;

			view {
				line-height: 1.2;
				font-size: 24rpx;
			}
		}

		text {
			line-height: 130rpx;
		}
	}
}

button.one_btn {
	background: #ffffff;
}
</style>
