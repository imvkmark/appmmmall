<template>
	<view :style="{backgroundColor: value.backgroundColor}">
		<!-- 1行2个 -->
		<!-- row1-of2 -->

		<!-- 1行3个 -->
		<!-- row1-of3 -->

		<!-- 1行4个 -->
		<!-- row1-of4 -->

		<!-- 2左2右 -->
		<!-- row2-lt-of2-rt -->

		<!-- 1左2右 -->
		<!-- row1-lt-of2-rt -->

		<!-- 1上2下 -->
		<!-- row1-tp-of2-bm -->

		<!-- 1左3右 -->
		<!-- row1-lt-of1-tp-of2-bm -->

		<!-- 自定义 -->
		<!-- custom-rubik-cube -->

		<view v-if="value.selectedTemplate == 'custom-rubik-cube'">
			<view style="position: relative;">
				<rich-text :nodes="customHtml"></rich-text>
			</view>
		</view>
		<view v-else class="rubik-cube">
			<view :class="['item', value.selectedTemplate]" v-for="(item, index) in value.list" :key="index" @click="redirectTo(item.link)">
				<image :src="$util.img(item.imageUrl)" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	// 魔方、橱窗
	import htmlParser from '@/common/js/html-parser';
	export default {
		name: 'diy-rubik-cube',
		props: {
			value: {
				type: Object,
				default: () => {
					return {
						layout: '2',
						padding: 0,
						clearance: 1
					};
				}
			},
			siteId: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				customHtml: ''
			};
		},
		created() {
			if (this.value.selectedTemplate == 'custom-rubik-cube') {
				this.value.diyHtml = this.value.diyHtml.replace(/&quot;/g, '"');
				this.customHtml = htmlParser(this.value.diyHtml);
			}
		},
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

<style lang="scss">
	.rubik-cube {
		overflow: hidden;
		padding: 20rpx;
		margin: 0;
	}

	.rubik-cube .item {
		float: left;
		text-align: center;
		line-height: 0;
	}

	.rubik-cube .item image {
		max-width: 100%;
		max-height: 100%;
	}

	.rubik-cube .item.row1-of2 {
		width: 50%;
	}

	.rubik-cube .item.row1-of3 {
		width: 33.33%;
	}

	.rubik-cube .item.row1-of4 {
		width: 25%;
	}

	.rubik-cube .item.row2-lt-of2-rt {
		width: 50%;
		display: inline-block;
	}

	.rubik-cube .item.row1-lt-of2-rt {
		width: 50%;
	}

	.rubik-cube .item.row1-lt-of2-rt:nth-child(1) {
		width: 48%;
	}

	.rubik-cube .item.row1-lt-of2-rt:nth-child(2) {
		float: right;
		margin-bottom: 10rpx;
	}

	.rubik-cube .item.row1-lt-of2-rt:nth-child(3) {
		float: right;
	}

	.rubik-cube .item.row1-tp-of2-bm {}

	.rubik-cube .item.row1-tp-of2-bm:nth-child(1) {
		width: 100%;
	}

	.rubik-cube .item.row1-tp-of2-bm:nth-child(2),
	.rubik-cube .item.row1-tp-of2-bm:nth-child(3) {
		width: 50%;
	}

	.rubik-cube .item.row1-lt-of1-tp-of2-bm:nth-child(1) {
		width: 50%;
	}

	.rubik-cube .item.row1-lt-of1-tp-of2-bm:nth-child(2) {
		width: 50%;
	}

	.rubik-cube .item.row1-lt-of1-tp-of2-bm:nth-child(3),
	.rubik-cube .item.row1-lt-of1-tp-of2-bm:nth-child(4) {
		width: 25%;
	}
</style>
