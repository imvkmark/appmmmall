<template>
	<view v-if="bottomNavList">
		<view class="tab-bar" :style="{ backgroundColor: bottomNav.backgroundColor }">
			<view class="tabbar-border"></view>
			<view class="item" v-for="(item, index) in bottomNavList" :key="index" :class="{ bulge: isBulge && index == 2 }" @click="redirectTo(item.link)">
				<view class="bd">
					<view class="icon" v-if="bottomNav.type == 1 || bottomNav.type == 2">
						<image :src="verify(item.link) ? $util.img(item.selectedIconPath) : $util.img(item.iconPath)" />
						<view class="cartNumberBtn ns-bg-color" v-if="item.link.wap_url == '/pages/goods/cart/cart' && cartNumber > 0">{{ cartNumber }}</view>
					</view>
					<view class="label" v-if="bottomNav.type == 1 || bottomNav.type == 3" :style="{ color: verify(item.link) ? bottomNav.textHoverColor : bottomNav.textColor }">
						{{ item.text }}
					</view>
				</view>
			</view>
		</view>
		<view class="placeholder" :class="{ bulge: bottomNavList.length == 5 && special.indexOf(currentRoute) == -1 && bottomNav.bulge }"></view>
	</view>
</template>

<script>
export default {
	name: 'diy-bottom-nav',
	props: {
		value: {
			type: Object
		},
		type: {
			type: String,
			default: ''
		},
		siteId: {
			type: [Number, String]
		}
	},
	watch: {
		siteId() {
			this.getBottomNav();
		}
	},
	data() {
		return {
			bottomNav: {},
			update: 0,
			currentRoute: '',
			//特殊页面处理悬浮
			special: ['pages/goods/cart/cart'],
			specialPage: '/otherpages/shop/street/street',
		};
	},
	mounted() {
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		this.currentRoute = currentPage.route;
		this.getBottomNav();
		this.$store.dispatch('getCartNumber');
	},
	computed: {
		cartNumber() {
			return this.$store.state.cartNumber;
		},
		bottomNavList() {
			let obj = this.bottomNav.list;
			let newArray = [];
			if (obj) {
				for (let i = 0; i < obj.length; i++) {
					if (this.specialPage.indexOf(obj[i].link.wap_url) == -1) {
						newArray.push(obj[i]);
					}
				}
				if (this.$store.state.Development) {
					return obj;
				} else {
					return newArray;
				}
			} else {
				return obj;
			}
		},
		isBulge() {
			if (this.bottomNavList) {
				this.$emit('isBulge', this.bottomNavList.length == 5 && this.special.indexOf(this.currentRoute) == -1 && this.bottomNav.bulge)
				return this.bottomNavList.length == 5 && this.special.indexOf(this.currentRoute) == -1 && this.bottomNav.bulge;
			} else {
				return false;
			}
		}
	},
	methods: {
		redirectTo(link) {
			if (link == null || link == '' || !link.wap_url) return false;
			if (link.wap_url.indexOf(this.currentRoute) != -1) return false;

			let jump = true;
			let arr = getCurrentPages().reverse();
			for (let i = 0; i < arr.length; i++) {
				if (link.wap_url.indexOf(arr[i].route) != -1) {
					jump = false;
					uni.navigateBack({
						delta: i
					});
					break;
				}
			}
			if (jump) {
				if (this.siteId && link.wap_url.indexOf('site_id') == -1) link.wap_url += '?site_id=' + this.siteId;
				this.$util.redirectTo(link.wap_url);
			}
		},
		verify(link) {
			if (link == null || link == '' || !link.wap_url) return false;
			if (link.wap_url.indexOf(this.currentRoute) != -1) {
				return true;
			}
			return false;
		},
		getBottomNav() {
			this.bottomNav = uni.getStorageSync('bottom_nav_' + this.siteId);
			this.update = uni.getStorageSync('bottom_nav_update_' + this.siteId) ? uni.getStorageSync('bottom_nav_update_' + this.siteId) : 0;
			if (this.bottomNav) this.bottomNav = JSON.parse(this.bottomNav);
			var url = '/api/diyview/bottomNav';
			if (this.type == 'shop') url = '/api/diyview/shopBottomNav';

			this.$api.sendRequest({
				url: url,
				data: {
					site_id: this.siteId
				},
				success: res => {
					let data = res.data;
					if (data && data.value) {
						if (this.update != data.modify_time || !this.update) {
							this.update = data.modify_time;
							if (data.value.length) {
								var value = JSON.parse(data.value);
								this.bottomNav = value;
								uni.setStorageSync('bottom_nav_' + this.siteId, JSON.stringify(this.bottomNav));
								uni.setStorageSync('bottom_nav_update_' + this.siteId, this.update);
							}
						}
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.placeholder {
	height: 56px;

	&.bluge {
		height: 90px;
	}
}

.safe-area {
	padding-bottom: 68rpx;
}

.tab-bar {
	background: #ffffff;
	background-color: rgb(255, 255, 255);
	box-sizing: border-box;
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	z-index: 998;
	display: flex;
	border-top: 1px solid #f5f5f5;
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);

	.tabbar-border {
		background-color: rgba(255, 255, 255, 0.329412);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 1px;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.item {
		display: flex;
		align-items: center;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex: 1;
		flex-direction: column;
		padding-bottom: 5px;
		box-sizing: border-box;

		.bd {
			position: relative;
			height: 50px;
			flex-direction: column;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.icon {
				position: relative;
				display: inline-block;
				margin-top: 5px;
				width: 40rpx;
				height: 40rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.label {
				position: relative;
				text-align: center;
				font-size: 12px;
				line-height: 1;
				margin-top: 12rpx;
			}
		}

		&.bulge {
			.bd {
				position: relative;
				height: 50px;
				flex-direction: column;
				text-align: center;

				.icon {
					margin-top: -30px;
					margin-bottom: 2px;
					border-radius: 50%;
					width: 50px;
					height: 51px;
					padding: 5px;
					border-top: 1px solid #f5f5f5;
					background-color: #fff;
					box-sizing: border-box;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.label {
					position: relative;
					text-align: center;
					font-size: 12px;
					line-height: 1.6;
					height: 20px;
					line-height: 20px;
				}
			}
		}

		.cartNumberBtn {
			position: absolute;
			top: -8rpx;
			right: -18rpx;
			width: 24rpx;
			height: 24rpx;
			font-size: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			padding: 6rpx;
			border-radius: 50%;
			z-index: 99;
		}
	}
}
</style>
