<!-- <template>
	<view class="loading-box ns-margin-right" v-show="isShow">
		<view class="loader ns-border-color-top ns-margin-right"></view>
		<text>加载中...</text>
	</view>
</template>

<script>
	export default {
		name: 'loading-cover',
		data() {
			return {
				isShow: true
			};
		},
		methods: {
			show() {
				this.isShow = true;
			},
			hide() {
				this.isShow = false;
			}
		}
	}
</script>

<style lang="scss">
	.loading-box {
		width: 100%;
		height: 120rpx;
		color: rgba(200, 200, 200, 0.5);
		vertical-align: top;
		-webkit-transition: .3s color, .3s border;
		transition: .3s color, .3s border;
		line-height: 1;
		display: flex;
		justify-content: center;
		align-items: center;

		text {
			color: $ns-text-color-gray;
		}
	}

	[class*="loader"] {
		display: inline-block;
		width: 1em;
		height: 1em;
		color: inherit;
		vertical-align: middle;
		pointer-events: none;
	}

	.loader {
		width: 30rpx;
		height: 30rpx;
		border: .2em solid transparent;
		border-radius: 50%;
		-webkit-animation: .7s loader linear infinite;
		animation: .7s loader linear infinite;
		position: relative;
	}

	.loader:before {
		content: '';
		display: block;
		width: inherit;
		height: inherit;
		position: absolute;
		top: -.2em;
		left: -.2em;
		border: .2em solid currentcolor;
		border-radius: 50%;
		opacity: .5;
	}

	@-webkit-keyframes loader {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	@keyframes loader {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
</style>
 -->
 
 
 
 <template>
 	<view class="ns-mescroll-downwarp">
 		<view class="ns-downwarp-content">
 			<view class="ns-downwarp-progress ns-mescroll-rotate" style="transform"></view>
 			<view class="ns-downwarp-tip">{{downText}}</view>
 		</view>
 	</view>
 </template>
 
 <script>
 	export default {
 		name: 'ns-loading',
 		props:{
 			downText: {
 				type: String,
 				default: '加载中'
 			}
 		},
 		data() {
 			return {
 				isShow: true
 			};
 		},
 		methods: {
 			show() {
 				this.isShow = true;
 			},
 			hide() {
 				this.isShow = false;
 			}
 		}
 	}
 </script>
 
 <style lang="scss">
 	/* 下拉刷新区域 */
 	.ns-mescroll-downwarp {
 		width: 100%;
 		height: 100%;
 		text-align: center;
 	}
 	
 	/* 下拉刷新--内容区,定位于区域底部 */
 	.ns-mescroll-downwarp .ns-downwarp-content {
 		width: 100%;
 		min-height: 60rpx;
 		padding: 20rpx 0;
 		text-align: center;
 	}
 	
 	/* 下拉刷新--提示文本 */
 	.ns-mescroll-downwarp .ns-downwarp-tip {
 		display: inline-block;
 		font-size: 28rpx;
 		color: gray;
 		vertical-align: middle;
 		margin-left: 16rpx;
 	}
 	
 	/* 下拉刷新--旋转进度条 */
 	.ns-mescroll-downwarp .ns-downwarp-progress {
 		display: inline-block;
 		width: 32rpx;
 		height: 32rpx;
 		border-radius: 50%;
 		border: 2rpx solid gray;
 		border-bottom-color: transparent;
 		vertical-align: middle;
 	}
 	
 	/* 旋转动画 */
 	.ns-mescroll-downwarp .ns-mescroll-rotate {
 		animation: ns-mescrollDownRotate 0.6s linear infinite;
 	}
 	
 	@keyframes ns-mescrollDownRotate {
 		0% {
 			transform: rotate(0deg);
 		}
 	
 		100% {
 			transform: rotate(360deg);
 		}
 	}
 </style>
 