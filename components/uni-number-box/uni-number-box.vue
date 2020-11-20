<template>
	<view class="uni-numbox" :class="{ small: size == 'small' }">
		<view :class="{ 'uni-numbox--disabled': inputValue <= min || disabled, small: size == 'small' }" class="uni-numbox__minus" @click="_calcValue('minus')">-</view>
		<input :disabled="disabled" v-model="inputValue" class="uni-numbox__value" type="number" @input="_onInput" @blur="_onInput" :class="{ small: size == 'small' }" />
		<view :class="{ 'uni-numbox--disabled': inputValue >= max || disabled, small: size == 'small' }" class="uni-numbox__plus" @click="_calcValue('plus')">+</view>
	</view>
</template>
<script>
export default {
	name: 'UniNumberBox',
	props: {
		value: {
			type: [Number, String],
			default: 1
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		step: {
			type: Number,
			default: 1
		},
		disabled: {
			type: Boolean,
			default: false
		},
		modifyFlag: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'default'
		},
		index: {
			type: Number,
			default: -1
		}
	},
	data() {
		return {
			inputValue: 0
		};
	},
	watch: {
		value(val) {
			this.inputValue = +val;
		},
		inputValue(newVal, oldVal, params) {
			if (+newVal !== +oldVal && !this.modifyFlag) {
				this.$emit('change', newVal, params)
			}
		}
	},
	created() {
		this.inputValue = +this.value;
	},
	methods: {
		_calcValue(type) {
			if (this.disabled) {
				return;
			}
			if (this.modifyFlag) return;
			const scale = this._getDecimalScale();
			let value = this.inputValue * scale;
			let step = this.step * scale;
			if (type === 'minus') {
				value -= step;
			} else if (type === 'plus') {
				value += step;
			}
			if (value < this.min || value > this.max) {
				return;
			}
			this.inputValue = value / scale;
		},
		_getDecimalScale() {
			let scale = 1;
			// 浮点型
			if (~~this.step !== this.step) {
				scale = Math.pow(10, (this.step + '').split('.')[1].length);
			}
			return scale;
		},
		_onInput(event) {
			setTimeout(() => {
				let value = event.detail.value;
				if (!(/(^[1-9]\d*$)/.test(value))) value = this.min;
				if (!value) {
					this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min;
				}
				this.inputValue = value;
			}, 0);
		}
	}
};
</script>
<style>
@charset "UTF-8";

.uni-numbox {
	display: inline-flex;
	flex-direction: row;
	justify-content: flex-start;
	height: 70rpx;
	position: relative;
}

.uni-numbox.small {
	height: 52rpx;
}

.uni-numbox:after {
	content: '';
	position: absolute;
	transform-origin: center;
	box-sizing: border-box;
	pointer-events: none;
	top: -50%;
	left: -50%;
	right: -50%;
	bottom: -50%;
	border: 1px solid #e5e5e5;
	border-radius: 12rpx;
	transform: scale(0.5);
}

.uni-numbox__minus,
.uni-numbox__plus {
	margin: 0;
	background-color: #f8f8f8;
	width: 70rpx;
	font-size: 40rpx;
	height: 100%;
	line-height: 70rpx;
	text-align: center;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: #333;
	position: relative;
}

.uni-numbox__value {
	position: relative;
	background-color: #fff;
	width: 80rpx;
	height: 100%;
	text-align: center;
	padding: 0;
}

.uni-numbox__minus.small,
.uni-numbox__plus.small {
	width: 50rpx;
	line-height: 50rpx;
}
.uni-numbox__value.small {
	width: 60rpx;
	font-size: 28rpx;
}

.uni-numbox__value:after {
	content: '';
	position: absolute;
	transform-origin: center;
	box-sizing: border-box;
	pointer-events: none;
	top: -50%;
	left: -50%;
	right: -50%;
	bottom: -50%;
	border-style: solid;
	border-color: #e5e5e5;
	border-left-width: 1px;
	border-right-width: 1px;
	border-top-width: 0;
	border-bottom-width: 0;
	transform: scale(0.5);
}

.uni-numbox--disabled {
	color: silver;
}
</style>
