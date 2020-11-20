<template>
	<view class="diy-notice" :style="{ background: value.backgroundColor }">
		<image class="pic" :src="$util.img('upload/uniapp/ns-notice.png')" mode=""></image>
		<view class="main-wrap">
			<view class="uni-swiper-msg">
				<swiper vertical="true" autoplay="true" circular="true" @change="change">
					<swiper-item v-for="(item, index) in value.list" :key="index" @touchmove.stop>
						<text @click="redirectTo(item.link)" class="beyond-hiding" :style="{ color: value.textColor, fontSize: value.fontSize * 2 + 'rpx' }">{{ item.title }}</text>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="notice-mark" @click="redirectTo()"></view>
	</view>
</template>
<script>
	// 公告
	export default {
		name: 'diy-notice',
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
				index: 0
			};
		},
		created() {},
		methods: {
			redirectTo() {
				if (this.value && this.value.list && this.value.list[this.index].link) {
					let link = this.value.list[this.index].link;
					if (this.siteId) {
						link.site_id = this.siteId;
					}
					this.$util.diyRedirectTo(link);
				}
			},
			change(e) {
				this.index = e.detail.current;
			}
		}
	};
</script>

<style lang="scss">
	.diy-notice {
		padding: 20rpx;
		line-height: 0;
		position: relative;

		.pic {
			width: 45rpx;
			height: 45rpx;
			margin-right: $ns-margin;
		}
	}

	.diy-notice .main-wrap {
		display: inline-block;
		width: 85%;
		position: relative;
	}

	.diy-notice .flag {
		border: 1px solid;
		padding: 4rpx 10rpx;
		border-radius: 24rpx;
		margin-right: 20rpx;
		float: left;
		line-height: initial;
	}

	.uni-swiper-msg {
		padding: 0;
	}

	.uni-swiper-msg swiper {
		height: 50rpx;
	}

	.beyond-hiding {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.notice-mark {
		width: 100%;
		height: 100%;
		background: rgba($color: #000000, $alpha: 0);
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
