<template>
	<view class="activist-container" :class="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getListData">
			<block slot="list">
				<view class="container">
					<block v-if="refundList.length">
						<view class="order-item" v-for="(item, index) in refundList" :key="index">
							<view class="order-header">
								<view class="iconfont icondianpu" @click="toShopDetail(item.site_id )"></view>
								<text class="site-name" @click="toShopDetail(item.site_id )">{{ item.site_name }}</text>
								<view class="iconfont iconright" @click="toShopDetail(item.site_id )"></view>
								<text class="status-name ns-text-color" v-if="item.refund_type == 1">退款</text>
								<text class="status-name ns-text-color" v-else>退货</text>
							</view>
							<view class="order-body">
								<view class="goods-wrap">
									<view class="goods-img" @click="refundDetail(item.order_goods_id)">
										<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)" mode="aspectFill"
										 :lazy-load="true"></image>
									</view>
									<view class="goods-info">
										<view class="goods-name" @click="refundDetail(item.order_goods_id)">{{ item.sku_name }}</view>
										<view class="goods-sub-section">
											<view>
												<text class="refund-price">
													<text>退款：</text>
													<text class="unit">{{ $lang('common.currencySymbol') }}</text>
													<text>{{ item.refund_apply_money }}</text>
												</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="order-footer">
								<view class="status">
									<view class="status-name" v-if="item.refund_status == 3">退款成功</view>
									<view class="status-name" v-else>退款中</view>
									<view class="status-text">{{ item.refund_status_name }}</view>
								</view>
								<view class="order-operation">
									<view class="order-box-btn" @click="refundDetail(item.order_goods_id)">{{ $lang('checkDetail') }}</view>
									<block v-if="item.refund_action.length">
										<view class="order-box-btn" @click="refundAction(actionItem.event, item)" v-for="(actionItem, actionIndex) in item.refund_action"
										 :key="actionIndex">
											{{ actionItem.title }}
										</view>
									</block>
								</view>
							</view>
						</view>
					</block>
					<block v-else>
						<view>
							<ns-empty :isIndex="!1" :text="$lang('emptyTips')"></ns-empty>
						</view>
					</block>
				</view>
			</block>
		</mescroll-uni>
	</view>
</template>

<script>
	import refundMethod from '../public/js/refundMethod.js';

	export default {
		mixins: [refundMethod],
		data() {
			return {
				refundList: []
			};
		},
		onLoad() {},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();

			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo('/pages/order/login/login', {
					back: '/pages/order/activist/activist'
				});
			}
		},
		computed: {
			themeStyle(){
				return 'theme-'+this.$store.state.themeStyle
			}
		},
		methods: {
			getListData(mescroll) {
				this.$api.sendRequest({
					url: '/api/orderrefund/lists',
					data: {
						page: mescroll.num,
						page_size: mescroll.size
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.refundList = []; //如果是第一页需手动制空列表
						this.refundList = this.refundList.concat(newArr);
					},
					fail: res => {
						mescroll.endErr();
					}
				});
			},
			//退款详情
			refundDetail(order_goods_id) {
				this.$util.redirectTo('/otherpages/order/refund_detail/refund_detail', {
					order_goods_id
				});
			},

			refundAction(event, data) {
				switch (event) {
					case 'orderRefundCancel': // 撤销维权
						this.cancleRefund(data.order_goods_id, res => {
							if (res.code >= 0) {
								this.$util.showToast({
									title: '撤销成功'
								});
								this.$refs.mescroll.refresh();
							}
						});
						break;
					case 'orderRefundDelivery': // 退款发货
						this.$util.redirectTo('/otherpages/order/refund_detail/refund_detail', {
							order_goods_id: data.order_goods_id,
							action: 'returngoods'
						});
						break;
					case 'orderRefundAsk':
						this.$util.redirectTo('/otherpages/order/refund/refund', {
							order_goods_id: data.order_goods_id
						});
						break;
				}
			},
			imageError(index) {
				this.refundList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			toShopDetail(e){
				this.$util.redirectTo('/otherpages/shop/index/index', { site_id: e});
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/activist.scss';
</style>
