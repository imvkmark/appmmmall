<template>
	<view class="empty" :class="{ fixed: fixed }">
		<view class="empty_img"><image :src="$util.img('upload/uniapp/common-empty.png')" mode="aspectFit"></image></view>
		<view class="ns-text-color-gray ns-margin-top ns-margin-bottom">{{ text }}</view>
		<button type="primary" size="mini" class="button " @click="goIndex()" v-if="isIndex && emptyBtn.text != '去登陆'">{{ emptyBtn.text }}</button>
		<button type="primary" size="mini" class="button " open-type="getUserInfo" @getuserinfo="bindgetuserinfo" @click="goIndex()" v-if="isIndex && emptyBtn.text == '去登陆'">
			{{ emptyBtn.text }}
		</button>
	</view>
</template>

<script>
export default {
	name: 'ns-empty',
	data() {
		return {
			currentRoute: ''
		};
	},
	props: {
		text: {
			type: String,
			default: '暂时没找到相关数据哦！'
		},
		isIndex: {
			type: Boolean,
			default: true
		},
		emptyBtn: {
			type: Object,
			default: () => {
				return { text: '去逛逛' };
			}
		},
		fixed: {
			type: Boolean,
			default: true
		}
	},
	created() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = '/' + currentPage.route;
	},
	methods: {
		goIndex() {
			if (this.emptyBtn.url) {
				this.$util.redirectTo(this.emptyBtn.url, {}, 'redirectTo');
			} else {
				this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			}
		},
		bindgetuserinfo() {
			if (this.$util.isWeiXin()) {
				let redirect_url = '';
				if (this.url) redirect_url = Config.h5Domain + '/pages/login/login/login?back=' + encodeURIComponent(this.url);
				else redirect_url = Config.h5Domain + '/pages/login/login/login';

				this.$api.sendRequest({
					url: '/wechat/api/wechat/authcode',
					data: {
						redirect_url
					},
					success: res => {
						if (res.code >= 0) {
							location.href = res.data;
						}
					}
				});
			} else {
				if (this.url)
					this.$util.redirectTo('/pages/login/login/login', {
						back: this.url
					});
				else this.$util.redirectTo('/pages/login/login/login');
			}
			this.$util.redirectTo('/pages/login/login/login', {
				back: this.currentRoute
			});
		}
	}
};
</script>

<style lang="scss">
.empty {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: $ns-padding;
	box-sizing: border-box;
	.empty_img {
		width: 206rpx;
		height: 206rpx;

		image {
			width: 100%;
			height: 100%;
			padding-bottom: $ns-margin;
		}
	}
	.iconfont {
		font-size: 190rpx;
		color: $ns-text-color-gray;
		line-height: 1.2;
	}
	button {
		min-width: 300rpx;
		line-height: 2.9;
		margin-top: 100rpx;
	}
}
.fixed {
	position: fixed;
	left: 0;
	top: 20vh;
}
</style>
