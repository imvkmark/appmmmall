<template>
	<view class="content">
		<uni-swipe-action>
			<uni-swipe-action-item v-for="(item, index) in list" :options="options" :key="item.id" @change="swipeChange" @onClick="swipeClick($event,item.id)">
				<view class="item" :class="item.isTop ? 'bg_view' : ''" hover-class="message-hover-class" @tap="linkTo(item.id)">
					<image mode="aspectFill" :src="item.images" />
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<view class="right u-border-bottom title-wrap">
						<view class="right_top">
							<view class="right_top_name u-line-1">{{ item.name }}</view>
							<view class="right_top_time ">{{ item.updateTime }}</view>
						</view>
						<view class="right_btm ">
							<view class="u-line-1">-</view>
							<view class=""></view>
						</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>

<script>
// import uniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue";
// import uniSwipeActionItem from "@/components/uni-swipe-action-item/uni-swipe-action-item.vue";
export default {
	// components:{
	// 	uniSwipeAction,
	// 	uniSwipeActionItem
	// },
	data() {
		return {
			list: [
				{
					id: 1,
					userId: 3,
					name: '迪丽热巴',
					images: '/static/image/girl.jpg',
					updateTime: '下午 5:10',
					show: false,
					isTop: true
				},
				{
					id: 2,
					userId: 4,
					name: '小贱贱',
					images: '/static/image/boy.jpg',
					updateTime: '下午 5:10',
					show: false
				},
				{
					id: 3,
					userId: 2,
					name: '陈冠希',
					images: '/static/image/guanxi.jpg',
					updateTime: '下午 5:10',
					show: false
				}
			],
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d',
						fontSize: '24rpx'
					}
				}
			]
		};
	},
	methods: {
		swipeChange(e) {},
		swipeClick(e,f) {
			this.list=this.list.filter((v)=>{
				return v.id!=f
			})
		},
		linkTo(e){
			this.$util.redirectTo('/otherpages/chat/room/room',{room_id:e})
		}
	}
};
</script>

<style lang="scss">
.content {
	.item {
		width: 750rpx;
		display: flex;
		align-items: center;
		// padding: 20rpx;
		image {
			width: 76rpx;
			height: 76rpx;
			margin: 20rpx;
			border-radius: 12rpx;
			flex: 0 0 76rpx;
		}
		.right {
			overflow: hidden;
			flex: 1 0;
			padding: 20rpx 20rpx 20rpx 0;
			&_top {
				display: flex;
				justify-content: space-between;
				&_name {
					font-size: 28rpx;
					color: #303133;
					flex: 0 0 450rpx;
					overflow: hidden;
				}
				&_time {
					font-size: 22rpx;
					color: #c0c4cc;
				}
			}
			&_btm {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 22rpx;
				color: #909399;
				padding-top: 10rpx;
			}
		}
	}
	.bg_view {
		background-color: #fafafa;
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
	}
}
</style>
