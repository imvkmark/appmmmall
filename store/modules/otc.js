import {
	payInfoList, 
	addPayInfo, 
	getPayInfo, 
	getUsePayInfo,
	updatePayInfo, 
	activePayInfo,
	deletePayInfo,
	isMerchant,
	getMerchant,
	applyMerchant,
	merchantDetail,
	advertList,
	addAdvert,
	myAdvertList,
	closeAdvert,
	pauseAdvert,
	createOrder,
	cancelOrder,
	payOrder,
	completeOrder,
	orderList,
	getOrder
} from '@/api/otc'
import {} from './../mutations_type'


const otc = {
	state: {

	},

	mutations: {

	},

	actions: {
		payInfoList({
			commit
		}) {
			return new Promise((resolve, reject) => {
				payInfoList().then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		getPayInfo({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				getPayInfo(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		getUsePayInfo({
			commit
		}) {
			return new Promise((resolve, reject) => {
				getUsePayInfo().then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		addPayInfo({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				addPayInfo(data).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		updatePayInfo({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				updatePayInfo(data).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		activePayInfo({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				activePayInfo(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		deletePayInfo({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				deletePayInfo(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		isMerchant({
			commit
		}) {
			return new Promise((resolve, reject) => {
				isMerchant().then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		getMerchant({
			commit
		}) {
			return new Promise((resolve, reject) => {
				getMerchant().then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		merchantDetail({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				merchantDetail(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		applyMerchant({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				applyMerchant(data).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		advertList({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				advertList(data).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		addAdvert({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				addAdvert(data).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		myAdvertList({
			commit
		}) {
			return new Promise((resolve, reject) => {
				myAdvertList().then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		closeAdvert({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				closeAdvert(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		pauseAdvert({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				pauseAdvert(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		createOrder({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				createOrder(data).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		orderList({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				orderList(data).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		getOrder({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				getOrder(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		cancelOrder({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				cancelOrder(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		payOrder({
			commit
		}, data) {
			return new Promise((resolve, reject) => {
				payOrder(data).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		},
		completeOrder({
			commit
		}, id) {
			return new Promise((resolve, reject) => {
				completeOrder(id).then(res => {
					resolve(res)
				}).catch(error => {
					reject(error)
				})
			})
		}
	}
}

export default otc
