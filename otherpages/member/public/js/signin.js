import Calendar from '@/components/uni-calendar/util.js';
export default {
	data() {
		return {
			rule: [],
			hasSign: 0, //今天是否签到
			signDaysSeries: 0, //连续签到次数
			timestamp: "", //当前的时间戳
			time:"",  //当前日期
			MonthData: [],  //本月日期信息
			signList: [],
			back: '', //返回页
			redirect: '', //返回方式
			successTip: {},
			startDate:null,
			endDate:null,
			isActive:""  ,//判断点击
		};
	},
	methods: {
		//点击日历日期
		itemActive(num,disable) {
			if(!disable) {
				this.isActive = num
			}
		},
		navigateBack() {
			if (this.back != '') {
				this.$util.redirectTo(this.back, {}, this.redirect);
			} else {
				this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
			}
		},
		//获取rule
		getRule() {
			this.$api.sendRequest({
				url: '/api/membersignin/award',
				success: res => {
					if (res.code == 0) {
						this.rule = res.data
					}
				}
			});
		},
		getIsUser(){
			this.$api.sendRequest({
				url: '/membersignin/api/signin/config',
				success: res => {
					if (res.code == 0 && res.data) {
						if(res.data.is_use){
							this.isUse = res.data.is_use
						}else{
							this.$util.showToast({
								'title':'签到功能尚未启用'
							});
							setTimeout(()=>{
								this.$util.redirectTo('/pages/member/index/index',{},'reLaunch')
							},1500)
						}
					}
				}
			});
		},
		//获取连续签到次数
		getSignInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					this.signDaysSeries = res.data.sign_days_series;
					this.timestamp = res.timestamp;
					this.time = this.$util.timeStampTurnTime(this.timestamp).slice(0,10)
					this.getMonthInfo();
				}
			});
		},
		//获取本月日期信息
		getMonthInfo() {
			let cale = new Calendar({
				selected: [],
				startDate: null,
				endDate: null,
				range: false,
			})
			cale.setDate(this.time)
			this.MonthData = cale.weeks
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			this.updateTimeList()
		},
		//判断当前是否签到
		getIsSign() {
			this.$api.sendRequest({
				url: '/api/membersignin/issign',
				success: res => {
					if (res.code == 0) {
						this.hasSign = res.data
						this.getSignInfo()
					}
				}
			});
		},
		//得到时间列表,e当前时间戳,f,签到几次,今天是否签到
		getTimeList(e, f, g) {
			let date = new Date(e);
			let timeList = [];
			let oneTime = 24 * 60 * 60 * 1000
			if (g == 1) {
				if (f > 4) {
					for (let i = -3; i < 4; i++) {
						let newTime = new Date(e + oneTime * i);
						let month = newTime.getMonth() + 1;
						let day = newTime.getDate();
						let isSign = false;
						if (i <= 0) {
							isSign = true;
						}
						let obj = {
							day: month + '.' + day,
							isSign: isSign
						}
						timeList.push(obj)
					}
				} else {
					for (let i = -1 * f + 1; i < 8 + -1 * f; i++) {
						let newTime = new Date(e + oneTime * i);
						let day = newTime.getDate();
						let month = newTime.getMonth() + 1;
						let isSign = false;
						if (i <= 0) {
							isSign = true;
						}
						let obj = {
							day: month + '.' + day,
							isSign: isSign
						}
						timeList.push(obj)
					}
				}
			} else {
				if (f > 4) {
					for (let i = -3; i < 4; i++) {
						let newTime = new Date(e + oneTime * i);
						let month = newTime.getMonth() + 1;
						let day = newTime.getDate();
						let isSign = false;
						if (i < 0) {
							isSign = true;
						}
						if (i == 0) {
							isSign = g;
						}
						let obj = {
							day: month + '.' + day,
							isSign: isSign
						}
						timeList.push(obj)
					}
				} else {
					for (let i = -1 * f; i < 7 + -1 * f; i++) {
						let newTime = new Date(e + oneTime * i);
						let day = newTime.getDate();
						let month = newTime.getMonth() + 1;
						let isSign = false;
						if (i < 0) {
							isSign = true;
						}
						let obj = {
							day: month + '.' + day,
							isSign: isSign
						}
						timeList.push(obj)
					}
				}
			}
			this.signList = timeList;
		},
		//签到
		sign() {
			if (!this.hasSign) {
				this.$api.sendRequest({
					url: '/api/membersignin/signin',
					success: res => {
						if (res.code == 0) {
							this.successTip = res.data;
							this.$refs.uniPopup.open()
							// this.getSignInfo()
							this.hasSign=1;
							this.signDaysSeries=this.signDaysSeries+1;
							this.getMonthInfo();
						} else {
							this.$util.showToast({
								title: res.message
							})
						}
					}
				});
			}
		},
		close() {
			this.$refs.uniPopup.close()
		},
		updateTimeList(){
			let date = new Date(this.timestamp*1000);
			let nowdate=date.getDate();
			// nowdate=30;
			// this.signDaysSeries=1;
			// this.hasSign=0;
			if(this.signDaysSeries>0){
				if(this.hasSign){
					this.startDate=nowdate-this.signDaysSeries+1>0?nowdate-this.signDaysSeries+1 : 1;
					this.endDate=nowdate;
				}else{
					this.startDate=nowdate-this.signDaysSeries>0?nowdate-this.signDaysSeries:1;
					this.endDate=nowdate-1;
				}
			}
		}
	}
};
