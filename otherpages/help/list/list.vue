<template>
	<view class="help" :class="themeStyle">
		<block v-if="dataList.length">
			<view class="help-item" v-for="(item, index) in dataList" :key="index">
				<view class="item-title">{{ item.class_name }}</view>
				<view class="item-content" v-for="(s_item, s_index) in item.child_list" :key="s_index" @click="helpDetail(s_item.id)">{{ s_item.title }}</view>
			</view>
		</block>
		<block v-else>
			<view class="cart-empty"><ns-empty :text="$lang('emptyText')" :isIndex="!1"></ns-empty></view>
		</block>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dataList: [],
			oldindex: -1
		};
	},
	onLoad() {
		this.getData();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	computed: {
		//vueX页面主题
		themeStyle() {
			return 'theme-' + this.$store.state.themeStyle;
		}
	},
	methods: {
		getData() {
			this.$api.sendRequest({
				url: '/api/helpclass/lists',
				data: {
					app_module: 'admin'
				},
				success: res => {
					if (res.code == 0 && res.data) {
						this.dataList = res.data;
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		tabtap(item, index) {
			if (index == this.oldindex) {
				this.oldindex = -1;
			} else {
				this.oldindex = index;
			}
		},

		helpDetail(e) {
			this.$util.redirectTo('/otherpages/help/detail/detail', {
				id: e
			});
		}
	},
	onShareAppMessage(res) {
		var title = '帮助中心使你更加方便';
		var path = '/otherpages/help/list/list';
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
.cart-empty {
	position: relative;
	top: -50%;
	padding-top: 154px;
}
.help {
	height: 100%;
	box-sizing: border-box;
	padding-top: 20rpx;
	.help-item {
		width: 702rpx;
		margin: 0 auto;
		padding: 32rpx 35rpx;
		box-sizing: border-box;
		background-color: #fff;
		margin-bottom: 18rpx;
		border-radius: 10rpx;
		.item-title {
			padding-bottom: 15rpx;
			font-size: $ns-font-size-base;
			color: #000;
			border-bottom: 1px solid #f1f1f1;
		}
		.item-content {
			padding: 24rpx 0;
			border-bottom: 1px solid #f1f1f1;
			font-size: $ns-font-size-sm;
			color: #838383;
			&:last-child {
				border-bottom: none;
				padding-bottom: 0;
			}
		}
	}
}

.tab {
	background: #ffffff;

	.item-wrap {
		border-bottom: 2rpx solid $ns-border-color-gray;

		.f-item {
			padding: 0 30rpx;

			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 88rpx;
			font-size: $ns-font-size-lg;
			color: $ns-text-color-black;

			.iconfont {
				font-size: $ns-font-size-lg;
				color: $ns-text-color-gray;
			}
		}

		.title {
			font-size: $ns-font-size-base;
		}

		.s-tab {
			padding-left: 60rpx;
			background: #f5f5f5;

			.s-item {
				line-height: 88rpx;
				border-bottom: 2rpx solid $ns-border-color-gray;
			}
		}
	}
}
</style>
