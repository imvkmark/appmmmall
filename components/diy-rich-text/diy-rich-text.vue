<template>
	<view class="rich-text-box">
		<rich-text :nodes="html"></rich-text>
	</view>
</template>

<script>
	// 富文本
	import htmlParser from '@/common/js/html-parser';
	export default {
		name: 'diy-rich-text',
		props: {
			value: {
				type: Object
			}
		},
		data() {
			return {
				html: ''
			};
		},
		created() {
			this.html = htmlParser(this.value.html);
		},
		mounted() {},
		methods: {}
	};
</script>

<style lang="scss">
	.rich-text-box {
		width: 100%;
		padding: $ns-padding;
		box-sizing: border-box;
		height: auto;
		line-height: 1.2;
	}
</style>
