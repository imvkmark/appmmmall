<template>
	<view>
		<view v-if="value.arrangement == 'vertical'" class="diy-text-nav" :style="{ fontSize: value.fontSize * 2 + 'rpx', background: value.backgroundColor, color: value.textColor, textAlign: value.textAlign }"
		 @click="redirectTo(value.list[0].link)">
			<view class="single">
				{{ value.list[0].text }}
				<text class="iconfont iconright ns-font-size-sm"></text>
			</view>
		</view>
		<view v-else class="diy-text-nav" :style="{ background: value.backgroundColor }">
			<scroll-view scroll-x>
				<view v-for="(item, index) in value.list" :key="index" class="item" @click="redirectTo(item.link)" :style="{ textAlign: value.textAlign, fontSize: value.fontSize * 2 + 'rpx' }">
					{{ item.text }}
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 文本导航
	export default {
		name: 'diy-text-nav',
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
			return {};
		},
		created() {},
		methods: {
			redirectTo(link) {
				if (this.siteId) {
					link.site_id = this.siteId;
				}
				this.$util.diyRedirectTo(link);
			}
		}
	};
</script>

<style>
	.control-text-navigation i {
		float: right;
		margin: 3px 10px 0 0;
	}

	.diy-text-nav {
		padding: 20rpx;
	}

	.diy-text-nav scroll-view {
		width: 100%;
		flex-direction: row;
		white-space: nowrap;
	}

	.diy-text-nav scroll-view .item {
		display: inline-block;
		margin-left: 16rpx;
		position: relative;
		min-width: 25%;
		text-overflow: ellipsis;
		text-align: center;
	}

	.diy-text-nav .single {
		position: relative;
	}

	.diy-text-nav .iconfont {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 0;
	}
</style>
<style scoped>
	.diy-text-nav>>>.uni-scroll-view::-webkit-scrollbar {
		display: none;
	}
</style>
