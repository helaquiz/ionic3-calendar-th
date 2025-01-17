var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";
// <div>{{displayMonthText}} {{displayYear}}</div>
var Calendar = /** @class */ (function () {
    function Calendar() {
        this.onDaySelect = new EventEmitter();
        this.lang = 'TH';
        this.isDisableLessToday = false;
        this.dateArray = []; // 本月展示的所有天的数组
        this.weekArray = []; // 保存日历每行的数组
        this.lastSelect = 0; // 记录上次点击的位置
        // weekHead: string[] = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        this.weekHead = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.weekHeadTH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
        this.fmonthArrayEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.smonthArrayEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.smonthArrayTH = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        this.fmonthArrayTH = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        this.currentYear = moment().year();
        this.currentMonth = moment().month();
        this.currentDate = moment().date();
        this.currentDay = moment().day();
    }
    Calendar.prototype.ngOnInit = function () {
        this.today();
    };
    // 跳转至今天
    Calendar.prototype.today = function () {
        this.displayYear = this.currentYear;
        this.displayMonth = this.currentMonth;
        this.createMonth(this.currentYear, this.currentMonth);
        // 将今天标记为选择状态
        var todayIndex = _.findIndex(this.dateArray, {
            year: this.currentYear,
            month: this.currentMonth,
            date: this.currentDate,
            isThisMonth: true,
        });
        this.lastSelect = todayIndex;
        this.dateArray[todayIndex].isSelect = true;
        this.dateArray[todayIndex].shortMonth = this.getShortMonth();
        this.onDaySelect.emit(this.dateArray[todayIndex]);
    };
    Calendar.prototype.createMonth = function (year, month) {
        this.dateArray = []; // 清除上个月的数据
        this.weekArray = []; // 清除数据
        var firstDay; //当前选择月份的 1 号星期几,决定了上个月取出几天出来。星期日不用显示上个月，星期一显示上个月一天，星期二显示上个月两天
        var preMonthDays; // 上个月的天数
        var monthDays; // 当月的天数
        var weekDays = [];
        firstDay = moment({ year: year, month: month, date: 1 }).day();
        // 上个月天数
        // Number of days in the previous month
        if (month === 0) {
            preMonthDays = moment({ year: year - 1, month: 11 }).daysInMonth();
        }
        else {
            preMonthDays = moment({ year: year, month: month - 1 }).daysInMonth();
        }
        // 本月天数
        // The number of days in the month
        monthDays = moment({ year: year, month: month }).daysInMonth();
        // 将上个月的最后几天添加入数组
        // Add the last few days of the last month to the array
        if (firstDay !== 7) {
            // 星期日不用显示上个月
            // Don't show last month on Sunday
            var lastMonthStart = preMonthDays - firstDay + 1;
            // 从上个月几号开始
            // Starting from the last month
            for (var i = 0; i < firstDay; i++) {
                if (month === 0) {
                    this.dateArray.push({
                        year: year,
                        month: 11,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                    });
                }
                else {
                    this.dateArray.push({
                        year: year,
                        month: month - 1,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                    });
                }
            }
        }
        var dpMonthCondition = Number(this.displayMonth + 1) < 10 ? "0" + (this.displayMonth + 1) : this.displayMonth + 1;
        var crMonthCondition = Number(this.currentMonth + 1) < 10 ? "0" + (this.currentMonth + 1) : this.currentMonth + 1;
        var isLessMonth = new Date(this.displayYear + "-" + dpMonthCondition) < new Date(this.currentYear + "-" + crMonthCondition);
        var isGreaterMonth = new Date(this.displayYear + "-" + dpMonthCondition) > new Date(this.currentYear + "-" + crMonthCondition);
        // 将本月天数添加到数组中
        // Add the number of days of the month to the array
        for (var i = 0; i < monthDays; i++) {
            var dateObj = {
                year: year,
                month: month,
                date: i + 1,
                isThisMonth: true,
                isToday: false,
                isSelect: false,
                isLessToday: (isLessMonth ? true : isGreaterMonth ? false : (i + 1 < this.currentDate) ? true : false) && this.isDisableLessToday
            };
            this.dateArray.push(dateObj);
        }
        if (this.currentYear === year && this.currentMonth === month) {
            var todayIndex = _.findIndex(this.dateArray, {
                year: this.currentYear,
                month: this.currentMonth,
                date: this.currentDate,
                isThisMonth: true
            });
            this.dateArray[todayIndex].isToday = true;
        }
        // 将下个月天数添加到数组中，有些月份显示 6 周，有些月份显示 5 周
        if (this.dateArray.length % 7 !== 0) {
            var nextMonthAdd = 7 - this.dateArray.length % 7;
            for (var i = 0; i < nextMonthAdd; i++) {
                if (month === 11) {
                    this.dateArray.push({
                        year: year,
                        month: 0,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                    });
                }
                else {
                    this.dateArray.push({
                        year: year,
                        month: month + 1,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                    });
                }
            }
        }
        // 至此所有日期数据都被添加入 dateArray 数组中
        // At this point all date data is added to the dateArray array
        // 将日期数据按照每 7 天插入新的数组中
        // Insert date data into a new array every 7 days
        for (var i = 0; i < this.dateArray.length / 7; i++) {
            for (var j = 0; j < 7; j++) {
                weekDays.push(this.dateArray[i * 7 + j]);
            }
            this.weekArray.push(weekDays);
            weekDays = [];
        }
        // this.dateArray[this.lastSelect].isSelect = true;
        this.displayMonthText = this.pickMonth();
        this.displayYearText = this.pickYear();
        if (this.lastMonthSelect == month && this.lastYearSelect == year) {
            this.dateArray[this.lastSelect].isSelect = true;
        }
    };
    Calendar.prototype.back = function () {
        // 处理跨年的问题
        if (this.displayMonth === 0) {
            this.displayYear--;
            this.displayMonth = 11;
        }
        else {
            this.displayMonth--;
        }
        this.createMonth(this.displayYear, this.displayMonth);
    };
    Calendar.prototype.forward = function () {
        // 处理跨年的问题
        if (this.displayMonth === 11) {
            this.displayYear++;
            this.displayMonth = 0;
        }
        else {
            this.displayMonth++;
        }
        this.createMonth(this.displayYear, this.displayMonth);
    };
    // 选择某日期，点击事件
    // Select a date, click on the event
    Calendar.prototype.daySelect = function (day, i, j) {
        // 首先将上次点击的状态清除
        // First clear the status of the last click
        this.dateArray[this.lastSelect].isSelect = false;
        // 保存本次点击的项
        // Save this clicked item
        this.lastSelect = i * 7 + j;
        this.lastMonthSelect = day.month;
        this.lastYearSelect = day.year;
        this.dateArray[i * 7 + j].isSelect = true;
        this.dateArray[i * 7 + j].shortMonth = this.getShortMonth();
        this.onDaySelect.emit(day);
    };
    Calendar.prototype.pickYear = function () {
        return this.checkTHLang() ? this.displayYear + 543 : this.displayYear;
    };
    Calendar.prototype.pickMonth = function () {
        this.pickWeekHead();
        return this.checkTHLang() ? this.fmonthArrayTH[this.displayMonth] : this.fmonthArrayEn[this.displayMonth];
    };
    Calendar.prototype.checkTHLang = function () {
        return this.lang.toLowerCase() == 'th';
    };
    Calendar.prototype.pickWeekHead = function () {
        if (this.checkTHLang()) {
            this.weekHead = this.weekHeadTH;
        }
    };
    Calendar.prototype.getShortMonth = function () {
        return this.checkTHLang() ? this.smonthArrayTH[this.displayMonth] : this.smonthArrayEn[this.displayMonth];
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], Calendar.prototype, "onDaySelect", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], Calendar.prototype, "lang", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], Calendar.prototype, "isDisableLessToday", void 0);
    Calendar = __decorate([
        Component({
            selector: 'ion-calendar',
            template: "\n    <ion-grid>\n        <ion-row justify-content-center>\n            <ion-col col-auto (click)=\"back()\">\n                <ion-icon ios=\"ios-arrow-back\" md=\"md-arrow-back\"></ion-icon>\n            </ion-col>\n            <ion-col col-auto>\n                <div>{{displayMonthText}} {{displayYearText}}</div>\n            </ion-col>\n            <ion-col col-auto (click)=\"forward()\">\n                <ion-icon ios=\"ios-arrow-forward\" md=\"md-arrow-forward\"></ion-icon>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n            <ion-col class=\"center calendar-header-col\" *ngFor=\"let head of weekHead\">{{head}}</ion-col>\n        </ion-row>\n\n        <ion-row class=\"calendar-row\" *ngFor=\"let week of weekArray;let i = index\">\n            <ion-col class=\"center calendar-col\" (click)=\"daySelect(day,i,j)\" \n            *ngFor=\"let day of week;let j = index\" \n            [ngClass]=\"[day.isThisMonth?'this-month':'not-this-month',day.isToday?'today':'',day.isSelect?'select':'',day.isLessToday?'disabled-date':'']\">\n                {{day.date}}\n            </ion-col>\n        </ion-row>\n\n    </ion-grid>\n"
        }),
        __metadata("design:paramtypes", [])
    ], Calendar);
    return Calendar;
}());
export { Calendar };
//# sourceMappingURL=calendar.js.map