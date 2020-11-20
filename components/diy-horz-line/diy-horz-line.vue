<template>
	<view>
		<view :style="{ borderTop: '1px ' + value.borderStyle + ' ' + value.color }"></view>
	</view>
</template>

<script>
	// 辅助线
	export default {
		name: 'diy-horz-line',
		props: {
			value: {
				type: Object
			}
		},
		data() {
			return {};
		},
		created() {},
		methods: {}
	};
</script>

<style></style>
