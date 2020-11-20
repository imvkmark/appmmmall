<template>
	<view class="level-index">
		<diy-goods-level-one :type="value.template" v-if="level==1" :value="value" @netFinish="netFinish" :siteId="siteId" :autoHeight="autoHeight"
		 :bottom="bottom" ref="goodsLevelOne"></diy-goods-level-one>
		<diy-goods-level-two :type="value.template" v-if="level==2" :value="value" @netFinish="netFinish" :siteId="siteId" :autoHeight="autoHeight"
		 :bottom="bottom" ref="goodsLevelTwo"></diy-goods-level-two>
		<diy-goods-level-three :type="value.template" v-if="level==3" :value="value" @netFinish="netFinish" :siteId="siteId" :autoHeight="autoHeight"
		 :bottom="bottom" ref="goodsLevelThree"></diy-goods-level-three>
	</view>
</template>

<script>
	import diyGoodsLevelOne from "@/components/diy-goods-level-category/diy-goods-level-one.vue"
	import diyGoodsLevelTwo from "@/components/diy-goods-level-category/diy-goods-level-two.vue"
	import diyGoodsLevelThree from "@/components/diy-goods-level-category/diy-goods-level-three.vue"
	export default {
		name: "diy-goods-level-category",
		components: {
			diyGoodsLevelOne,
			diyGoodsLevelTwo,
			diyGoodsLevelThree
		},
		computed: {
			level() {
				return this.value.level
			}
		},
		props: {
			value: {
				type: Object,
				default: () => {
					return {};
				}
			},
			autoHeight: {
				type: Boolean,
				default: false
			},
			bottom: {
				type: [String, Number],
				default: 0
			},
			siteId: {
				type: [Number, String],
				default: 0
			}
		},
		methods: {
			netFinish() {
				this.$emit("netFinish", true)
			},
			getCartData(){
				if(this.level == 1 && this.value.template == 3){
					this.$refs.goodsLevelOne.getCartData();
					this.$refs.goodsLevelOne.getToken();
				}else if(this.level == 2 && this.value.template == 3){
					this.$refs.goodsLevelTwo.getCartData();
					this.$refs.goodsLevelTwo.getToken();
				}else if(this.level == 3 && this.value.template == 3){
					this.$refs.goodsLevelThree.getCartData();
					this.$refs.goodsLevelThree.getToken();
				}
			}
		}
	}
</script>
