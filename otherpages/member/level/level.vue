<template>
	<view class="member-level" :class="themeStyle">
		<view class="level-top">
			<image :src="$util.img('upload/uniapp/level/level_bg.png')" mode=""></image>
		</view>
		<view class="banner-container">
			<view class="memberInfo">
				<image :src="$util.img(userInfo.headimg)" v-if="userInfo.headimg" @error="userInfo.headimg = $util.getDefaultImage().default_headimg"
				 mode="aspectFill"></image>
				<image :src="$util.getDefaultImage().default_headimg" v-else mode="aspectFill"></image>
				<view class="member-desc">
					<view>{{ userInfo.nickname }}</view>
					<view class="ns-font-size-sm">当前等级：{{ userInfo.member_level_name }}</view>
				</view>
			</view>
			<swiper :style="{ width: '100vw', height: '390rpx' }" class="ns-margin-bottom" :indicator-dots="swiperConfig.indicatorDots"
			 :indicator-color="swiperConfig.indicatorColor" :indicator-active-color="swiperConfig.indicatorActiveColor"
			 :autoplay="false" :interval="swiperConfig.interval" :duration="swiperConfig.duration" :circular="swiperConfig.circular"
			 :previous-margin="swiperConfig.previousMargin" :next-margin="swiperConfig.nextMargin" @change="swiperChange"
			 @animationfinish="animationfinish" :current="curIndex">
				<swiper-item :class="levelList.length==1?'image-container-box':''" v-for="(item, i) in levelList" :key="i">
					<view class="image-container" :class="[
							curIndex === 0
								? i === listLen - 1
									? 'item-left'
									: i === 1
									? 'item-right'
									: 'item-center'
								: curIndex === listLen - 1
								? i === 0
									? 'item-right'
									: i === listLen - 2
									? 'item-left'
									: 'item-center'
								: i === curIndex - 1
								? 'item-left'
								: i === curIndex + 1
								? 'item-right'
								: 'item-center'
						]">
						<view class="slide-image" style="background-size: 100% 100%;background-repeat:no-repeat" :style="{
								transform: curIndex === i ? 'scale(' + scaleX + ',' + scaleY + ')' : 'scale(1,1)',
								transitionDuration: '.3s',
								transitionTimingFunction: 'ease'
							}">
							<image :src="$util.img('upload/uniapp/level/level_' + (Number(i % 5) + 1) + '.png')" mode=""></image>
							<view class="info">
								<view class="title-box">
									<view class="title">{{ item.level_name }}</view>
									<view class="ns-font-size-sm ns-margin-top" v-if="differ > 0 && levelId != item.level_id">距离该等级还差{{ differ }}合约池</view>
								</view>
								<view class="now_growth">当前合约池：{{ growth }}</view>
								<!-- <view>当前成长值：{{ item.growth }}</view> -->
								<view class="progress-info">
									<view class="">{{ levelList[i].growth }}</view>
									<view class="progress-box"><progress :percent="i | rate(levelList,growth)" :activeColor="baseColor" active
										 stroke-width="6" /></view>
									<view class="">{{ i != levelList.length - 1 ? levelList[i + 1].growth : levelList[levelList.length - 1].growth }}</view>
								</view>
							</view>
							<view class="isnow" v-if="levelId == item.level_id">当前等级</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="level_benefite ns-margin-bottom">
				<view class="level_title"><text>投资权益</text></view>
				<view class="benefite_content"><text>{{ remark6 }}</text></view>
			</view>
			<view class="level_benefite ns-margin-bottom">
				<view class="level_title"><text>消费权益</text></view>
				<view class="benefite_content"><text>{{ remark7 }}</text></view>
			</view>
			<view class="level_benefite ns-margin-bottom">
				<view class="level_title"><text>质押分红权益</text></view>
				<view class="benefite_content"><text>{{ remark8 }}</text></view>
			</view>
			<!-- <view class="level_benefite" v-if="rule">
				<view class="level_title"><text>成长值规则</text></view>
				<view class="benefite_content" v-for="(item, index) in rule" :key="index">{{ index + 1 + '.' + item }}</view>
			</view> -->
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curIndex: 0,
				descIndex: 0,
				isDescAnimating: false,
				scaleX: (634 / 540).toFixed(4),
				scaleY: (378 / 330).toFixed(4),
				swiperConfig: {
					//type==1时的默认参数
					indicatorDots: false,
					indicatorColor: 'rgba(255, 255, 255, .4)',
					indicatorActiveColor: 'rgba(255, 255, 255, 1)',
					interval: 3000,
					duration: 300,
					circular: false,
					previousMargin: '58rpx',
					nextMargin: '58rpx'
				},
				levelList: [],
				levelId: 0,
				growth: 0,

				nowIndex: 0, //我当前所在等级的index
				userInfo: {},
				rule: [] //成长值规则
			};
		},
		computed: {
			listLen() {
				return this.levelList.length;
			},
			remark() {
				if (this.levelList[this.curIndex]) {
					return this.levelList[this.curIndex].remark;
				}
			},
			remark2() {
				if (this.levelList[this.curIndex]) {
					return this.levelList[this.curIndex].remark2;
				}
			},
			remark3() {
				if (this.levelList[this.curIndex]) {
					return this.levelList[this.curIndex].remark3;
				}
			},
			remark4() {
				if (this.levelList[this.curIndex]) {
					return this.levelList[this.curIndex].remark4;
				}
			},
			remark5() {
				if (this.levelList[this.curIndex]) {
					return this.levelList[this.curIndex].remark5;
				}
			},
			remark6() {
				if (this.levelList[this.curIndex]) {
					return this.levelList[this.curIndex].remark6;
				}
			},
			remark7() {
				if (this.levelList[this.curIndex]) {
					return this.levelList[this.curIndex].remark7;
				}
			},
			remark8() {
				if (this.levelList[this.curIndex]) {
					return this.levelList[this.curIndex].remark8;
				}
			},
			differ() {
				return parseInt(this.levelList[this.curIndex].growth) - parseInt(this.growth);
			},
			baseColor() {
				return this.$store.state.baseColor
			},
			//vueX页面主题
			themeStyle() {
				return 'theme-' + this.$store.state.themeStyle
			}
		},
		onLoad() {
			this.getLevelList();
			this.getLevelRule();
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
		},
		filters: {
			rate(index, list, growth) {
				let nowGrowth = Number(growth);
				let minGrouth = Number(list[index].growth);
				if (index == list.length - 1) {
					return nowGrowth > minGrouth ? 100 : 0;
				} else {
					let maxGrouth = Number(list[index + 1].growth)
					let num2 = nowGrowth - minGrouth;
					let num1 = maxGrouth - minGrouth;
					let num = Math.floor(num2 / num1 * 100);
					return num > 100 ? 100 : num;
				}
			}
		},
		methods: {
			swiperChange(e) {
				let that = this;
				this.curIndex = e.detail.current;
				this.isDescAnimating = true;
				let timer = setTimeout(function() {
					that.descIndex = e.detail.current;
					clearTimeout(timer);
				}, 150);
			},
			animationfinish(e) {
				this.isDescAnimating = false;
			},
			getBannerDetail(index) {
				uni.showLoading({
					title: '将前往详情页面',
					duration: 2000,
					mask: true
				});
			},
			getLevelList() {
				this.$api.sendRequest({
					url: '/api/memberlevel/lists',
					success: res => {
						if (res.data && res.code == 0) {
							this.levelList = res.data;
							this.getMemberInfo();
						} else {
							this.$util.showToast({
								title: res.message
							});
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						}
					}
				});
			},
			getLevelRule() {
				this.$api.sendRequest({
					url: '/api/member/accountrule',
					success: res => {
						if (res.code == 0 && res.data && res.data.growth) {
							this.rule = res.data.growth;
						}
					}
				});
			},
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.data && res.code == 0) {
							this.levelId = res.data.member_level;
							this.growth = res.data.growth;
							this.userInfo = res.data;
							this.levelList.forEach((v, i) => {
								if (v.level_id == res.data.member_level) {
									this.curIndex = i;
									this.descIndex = i;
									this.nowIndex = i;
									return;
								}
							});
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
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/level.scss';
</style>
