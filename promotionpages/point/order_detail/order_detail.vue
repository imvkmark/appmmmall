<template>
	<view :class="themeStyle"></view>
</template>

<script>
export default {
	data() {
		return {};
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
	methods: {}
};
</script>

<style lang="scss"></style>
