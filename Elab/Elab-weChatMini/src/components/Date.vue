<template>
  <div class="calendar" :style="height">
    <div class="calendar-header">
      <h2>{{my_year[index]}}</h2>
      <img src="/static/images/res/sharedEquipmentReservation-minute1/xz.png" model="aspectFit">
      <h2>{{month_name[my_month[index] - 1]}}</h2>
      <img src="/static/images/res/sharedEquipmentReservation-minute1/xy.png" model="aspectFit">
    </div>
      <div class="calendar-body">
        <div class="calendar-body-label">
          <ul>
            <li>星期一</li>
            <li>星期二</li>
            <li>星期三</li>
            <li>星期四</li>
            <li>星期五</li>
            <li>星期六</li>
            <li>星期日</li>
          </ul>
        </div>
        <div class="calendar-body-day">
          <ul>
            <li :key="space" v-for="space in this.firstDay"> </li>
            <li class="past-day" :key="pastDay" v-for="pastDay in pastDays">{{pastDay}}</li>
            <li class="current-day" @click="onClick(currentDay)" v-if="currentDay != 0">{{currentDay}}</li>
            <li class="future-day" @click="onClick(futureDay)" :key="futureDay" v-for="futureDay in futureDays">{{futureDay}}</li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  mounted() {
    this.my_date = new Date();
    this.my_day = this.my_date.getDate();
    this.my_year = this.$options.propsData.initYear;
    this.my_month = this.$options.propsData.initMonth;
    this.index = 0;
  },
  data() {
    return {
      month_olympic: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      month_normal: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      month_name: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ],
      dateSelected: null,
      my_date: null,
      my_year: [],
      my_month: [],
      my_day: null,
      index: 0,
      firstDay: 0,
      totalDay: 0,
      pastDays: [],
      currentDay: 0,
      futureDays: []
    };
  },
  props: ["bindOnClick", "data", "initMonth", "initYear", "height"],
  methods: {
    onClick: function(day) {
      return this.bindOnClick(day, this.data);
    },
    // 更新时间
    reset: function() {
      this.my_date = new Date();
      this.my_day = this.my_date.getDate();
      this.index = 0;
      this.dateSelected = null;
      this.pastDays = [];
      this.futureDays = [];
    },
    // 得到起始天数
    dayStart: function(month, year) {
      let tmpDate = new Date(year, month, 1);
      return tmpDate.getDay();
    },
    // 根据年月来判断当前月有多少天
    daysMonth: function(month, year) {
      if (
        (year % 4 === 0 && year % 100 !== 0) ||
        (year % 100 === 0 && year % 400 === 0)
      ) {
        return this.month_olympic[month];
      }
      return this.month_normal[month];
    },
    // 刷新日期
    refreshDate: function(index) {
      this.totalDay = this.daysMonth(
        this.my_month[index] - 1,
        this.my_year[index]
      );
      this.firstDay = this.dayStart(
        this.my_month[index] - 1,
        this.my_year[index]
      );
      for (let i = 1; i <= this.totalDay; i++) {
        if (
          (i < this.my_day &&
            this.my_year[index] === this.my_date.getFullYear() &&
            this.my_month[index] - 1 === this.my_date.getMonth()) ||
          this.my_year[index] < this.my_date.getFullYear() ||
          (this.my_year[index] === this.my_date.getFullYear() &&
            this.my_month[index] - 1 < this.my_date.getMonth())
        ) {
          // 今天之前的天
          this.pastDays.push(i);
        } else if (
          // 今天
          i === this.my_day &&
          this.my_year[index] === this.my_date.getFullYear() &&
          this.my_month[index] - 1 === this.my_date.getMonth()
        ) {
          this.currentDay = i;
        } else {
          // 今天之后的天
          this.futureDays.push(i);
        }
      }
    },
    prevMonth: function() {
      if (this.index > 0) {
        this.index--;
        this.refreshDate(this.index);
      }
    },
    nextMonth: function() {
      if (this.index < this.my_year.length - 1) {
        this.index++;
        this.refreshDate(this.index);
      }
    },
    getCalendar: function() {
      this.reset();
      this.index = 0;
      this.refreshDate(this.index);
    }
  }
};
</script>
<style lang="scss">
.calendar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  .calendar-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    height: 80%;
    .calendar-body-label {
      width: 100%;
      height: 20%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      color: #6cb7f1;
      font-size: 20rpx;
      ul {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        li {
          width: 15%;
          margin-left: 5rpx;
          margin-right: 5rpx;
        }
      }
    }
    .calendar-body-day {
      width: 100%;
      height: 80%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      font-size: 25rpx;
      ul {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        li {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 15%;
          margin-left: 5rpx;
          margin-right: 5rpx;
        }
      }
    }
  }

  .calendar-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 20%;
    h2 {
      width: 30%;
      height: 60%;
      color: #6cb7f1;
    }
    img {
      background-color: brown;
      width: 20rpx;
      height: 60%;
    }
  }
  .past-day {
    color: lightgrey;
  }
  .future-day {
    color: #6cb7f1;
  }
  .current-day {
    color: white;
    border-radius: 20rpx;
    background-color: #6cb7f1;
  }
}
</style>


