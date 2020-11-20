import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Http from '../common/js/http.js'

const store = new Vuex.Store({
    state: {
		cartNumber:0,						//购物车数量
		wholeSaleNumber:0,					//进货单数量
		themeStyle:'',
		Development: 0,
		addonIsExit: {
			bundling: 0,
			coupon: 0,
			discount: 0,
			fenxiao: 0,
			gift: 0,
			groupbuy: 0,
			manjian: 0,
			memberconsume: 0,
			memberrecharge: 0,
			memberregister: 0,
			membersignin: 0,
			memberwithdraw: 0,
			pintuan: 0,
			pointexchange: 0,
			seckill: 0,
			store: 0,
			topic: 0
		},									
	},
    mutations: {
		setCartNumber(state, cartNumber) {
			state.cartNumber = cartNumber
		},
		setWholeSaleNumber(state, wholeSaleNumber) {
			state.wholeSaleNumber = wholeSaleNumber
		},
		setThemeStyle(state, ThemeStyle) {
			state.themeStyle = ThemeStyle
		},
		setAddonIsexit(state,addonIsExit){
			state.addonIsExit=Object.assign(state.addonIsExit, addonIsExit);
		}
	},
    actions: {
		//查询购物车数量
		getCartNumber() {
			if (uni.getStorageSync("token")) {
				return new Promise((resolve, reject)=>{
					Http.sendRequest({
						url: '/api/cart/count',
						success: res => {
							if (res.code == 0) {
								this.commit('setCartNumber', res.data)
								resolve(res.data)
							}
						}
					});
				})
			}
		},
		//查询进货单数量
		getWholeSaleNumber(){
			Http.sendRequest({
				url: '/wholesale/api/cart/count',
				success: res => {
					if (res.code == 0) {
						this.commit('setWholeSaleNumber',res.data)
					}
				}
			});
		},
		getThemeStyle() {
			if(uni.getStorageSync('setThemeStyle')){
				this.commit('setThemeStyle', uni.getStorageSync('setThemeStyle'))
			}
			Http.sendRequest({
				url: '/api/diyview/style',
				success: res => {
					if (res.code == 0) {
						this.commit('setThemeStyle', res.data.style_theme)
						uni.setStorageSync('setThemeStyle',res.data.style_theme)
					}
				}
			});
		},
		// 获取插件是否安装
		getAddonIsexit() {
			if(uni.getStorageSync('memberAddonIsExit')){
				this.commit('setAddonIsexit', uni.getStorageSync('memberAddonIsExit'))
			}
			Http.sendRequest({
				url: '/api/addon/addonisexit',
				success: res => {
					if (res.code == 0) {
						uni.setStorageSync('memberAddonIsExit',res.data);
						this.commit('setAddonIsexit', res.data)
					}
				}
			})
		},
    }
})
export default store