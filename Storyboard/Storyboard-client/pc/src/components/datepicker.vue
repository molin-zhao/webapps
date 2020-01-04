<template>
  <div class="datepicker-wrapper">
    <div class="datepicker-header">
      <a @click="prevMonth"
        ><icon name="left" style="width: 2vw; height: 2vw; color: #A5C4EC"
      /></a>
      <div class="display-only" style="font-family: kai">
        <transition name="fade">
          <span v-if="showMonth">{{
            $t(`${month_name[displayMonthIndex]}`)
          }}</span>
        </transition>
        <span>&nbsp;</span>
        <transition name="fade">
          <span v-if="showYear">{{ displayYear }}</span>
        </transition>
      </div>
      <a @click="nextMonth"
        ><icon name="right" style="width: 2vw; height: 2vw; color: #A5C4EC"
      /></a>
    </div>
    <div class="datepicker-body">
      <div
        class="datepicker-body-label display-only"
        :style="computedDatepickerBodyWidth"
      >
        <span :style="`width: ${cellWidth}`">{{ $t("MON") }}</span>
        <span :style="`width: ${cellWidth}`">{{ $t("TUE") }}</span>
        <span :style="`width: ${cellWidth}`">{{ $t("WED") }}</span>
        <span :style="`width: ${cellWidth}`">{{ $t("THU") }}</span>
        <span :style="`width: ${cellWidth}`">{{ $t("FRI") }}</span>
        <span :style="`width: ${cellWidth}`">{{ $t("SAT") }}</span>
        <span :style="`width: ${cellWidth}`">{{ $t("SUN") }}</span>
      </div>
      <transition name="fade">
        <div
          class="datepicker-body-days display-only"
          :style="computedDatepickerBodyWidthAndHeight"
          v-if="showMonth"
        >
          <span
            v-for="(item, index) in paddingDaysHead"
            :key="`padding-h-${index}`"
            :style="computedDatepickerCellWidthAndHeight"
          ></span>
          <span
            v-for="(item, index) in displayNumOfDaysOfMonth"
            :key="`real-${index}`"
            :class="isCurrentDay(item)"
            :style="computedDatepickerCellWidthAndHeight"
          >
            {{ item }}
          </span>
          <span
            v-for="(item, index) in paddingDaysTail"
            :key="`padding-t-${index}`"
            :style="computedDatepickerCellWidthAndHeight"
          ></span>
        </div>
      </transition>
    </div>
    <div class="datepicker-footer"></div>
  </div>
</template>

<script>
export default {
  props: {
    cellHeight: {
      type: String,
      default: "30px"
    },
    cellWidth: {
      type: String,
      default: "40px"
    },
    animationInterval: {
      type: Number,
      default: 0.5
    }
  },
  data() {
    return {
      month_olympic: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      month_normal: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      month_name: [
        "JAN",
        "FEB",
        "MAR",
        "ARP",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
      ],
      current: {
        date: null,
        month: null,
        year: null
      },
      selected: {
        date: null,
        month: null,
        year: null
      },
      displayNumOfDaysOfMonth: 0,
      displayMonthIndex: 0, // cannot set index to -1!
      displayYear: 1970,
      showMonth: true,
      showYear: true,
      paddingDaysHead: 0,
      paddingDaysTail: 0
    };
  },
  computed: {
    computedDatepickerBodyWidthAndHeight() {
      let cellHeightNumber = parseInt(this.cellHeight);
      let cellWidthNumber = parseInt(this.cellWidth);
      let cellHeightUnit = this.cellHeight.split(cellHeightNumber).pop();
      let cellWidthUnit = this.cellWidth.split(cellWidthNumber).pop();
      let bodyHeight = `height: ${6 * cellHeightNumber}${cellHeightUnit};`;
      let bodyWidth = `width: ${7 * cellWidthNumber}${cellWidthUnit};`;
      return `${bodyHeight}; ${bodyWidth}`;
    },
    computedDatepickerBodyWidth() {
      let cellWidthNumber = parseInt(this.cellWidth);
      let cellWidthUnit = this.cellWidth.split(cellWidthNumber).pop();
      let bodyWidth = `width: ${7 * cellWidthNumber}${cellWidthUnit};`;
      return bodyWidth;
    },
    computedDatepickerCellWidthAndHeight() {
      return `height: ${this.cellHeight}; line-height: ${this.cellHeight}; width: ${this.cellWidth}`;
    },
    isCurrentDay() {
      return function(date) {
        if (
          this.displayYear === this.current.year &&
          this.displayMonthIndex === this.current.month &&
          date === this.current.date
        ) {
          return "current-day";
        }
        return null;
      };
    }
  },
  mounted() {
    let currentStandardTime = new Date();
    let date = currentStandardTime.getDate(); // olympic or normal
    let month = currentStandardTime.getMonth(); // starts from 0
    let year = currentStandardTime.getFullYear();
    this.current.date = date;
    this.current.month = month;
    this.current.year = year;
    this.setDate(year, month);
  },
  methods: {
    setDate(year, month) {
      this.displayNumOfDaysOfMonth = this.getNumOfDaysInMonth(year, month);
      this.displayMonthIndex = month;
      this.displayYear = year;
      this.paddingDaysHead = this.getPaddingDaysHead(year, month);
      this.paddingDaysTail = this.getPaddingDaysTail(year, month);
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        if (!this.showMonth) this.showMonth = true;
        if (!this.showYear) this.showYear = true;
      }, 500);
    },
    prevMonth() {
      let month = this.displayMonthIndex;
      let year = this.displayYear;
      this.showMonth = false;
      if (month === 0) {
        this.showYear = false;
        return this.setDate(year - 1, 11);
      }
      return this.setDate(year, month - 1);
    },
    nextMonth() {
      let month = this.displayMonthIndex;
      let year = this.displayYear;
      this.showMonth = false;
      if (month === 11) {
        this.showYear = false;
        return this.setDate(year + 1, 0);
      }
      return this.setDate(year, month + 1);
    },
    getNumOfDaysInMonth(year, month) {
      let firstRule = year % 4 === 0 && year % 100 !== 0;
      let secondeRule = year % 100 === 0 && year % 400 === 0;
      if (firstRule || secondeRule) return this.month_olympic[month];
      return this.month_normal[month];
    },
    getPaddingDaysHead(year, month) {
      let firstDayStandardTime = new Date(year, month, 1); // month is index starts from zero
      let firstDay = firstDayStandardTime.getDay();
      return firstDay === 0 ? 6 : firstDay - 1; // sunday is indexed zero
    },
    getPaddingDaysTail(year, month) {
      let lastDayStandardTime = new Date(year, month + 1, 0);
      let lastDay = lastDayStandardTime.getDay();
      return lastDay === 0 ? 0 : 7 - lastDay;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.datepicker-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  .datepicker-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 100%;
    a {
      width: 25%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    a:active {
      -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    }
    div {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .datepicker-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .datepicker-body-label {
      height: 50px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      span {
        height: 90%;
        font-family: kai;
      }
    }
    .datepicker-body-days {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      align-content: flex-start;
      span {
        cursor: pointer;
        font-family: kai;
      }
    }
  }
}
.datepicker-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50px;
  background-color: blue;
}
.current-day {
  background-color: lightgrey;
}

// animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
