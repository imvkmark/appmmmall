<template>
	 <view :style="{background: bgColor}">
	 	<swiper :indicator-dots="advList.length > 1" indicator-active-color="#ffffff" :autoplay="true" :interval="3000"
	 	 :duration="1000" v-if="advList.length" class="ns-adv" @change="swiperChange">
	 		<swiper-item v-for="(item, index) in advList" :key="index" @click="jumppage(item.adv_url)">
	 			<view class="image-box" :style="{background: item.background}">
	 				<image :src="$util.img(item.adv_image)" mode="widthFix"></image>
	 			</view>
	 		</swiper-item>
	 	</swiper>
	 </view>
	
</template>

<script>
	export default {
		name: 'ns-advert',
		props: {
			keyword: {
				type: String
			}
		},
		data() {
			return {
				advList: [],
				nowIndex:0,
				advInfo:{}
			};
		},
		created() {
			this.getAdvList();
		},
		computed:{
			bgColor(){
				if(!this.advInfo) return "#ffffff";
				return this.advInfo.ap_background_color;
			}
		},
		methods: {
			//获取广告位
			getAdvList() {
				if (this.keyword) {
					this.$api.sendRequest({
						url: '/api/adv/detail',
						data: {
							keyword: this.keyword
						},
						success: res => {
							if (res.code == 0 && res.data) {
								res.data.adv_list.forEach(v => {
									if(v.adv_url){
										v.adv_url = JSON.parse(v.adv_url);
									}
								});
								this.advList = res.data.adv_list;
								this.advInfo=res.data.adv_position;
							}
						},
						fail() {}
					});
				}
			},
			jumppage(e) {
				this.$util.diyRedirectTo(e);
			},
			swiperChange(e){
				this.nowIndex=e.detail.current;
			}
		}
	};
</script>

<style>
	.ns-adv .image-box {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.ns-adv image {
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		margin: auto;
	}
</style>
