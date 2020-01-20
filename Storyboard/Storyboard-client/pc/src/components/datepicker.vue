<template>
  <div class="datepicker-wrapper">
    <div class="datepicker-header">
      <a @click.stop="prevMonth">
        <icon name="left" style="width: 2vw; height: 2vw; color: #A5C4EC" />
      </a>
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
      <a @click.stop="nextMonth"
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
          <!-- paddings -->
          <span
            v-for="(item, index) in paddingDaysHead"
            :key="`padding-h-${index}`"
            :style="computedDatepickerCellWidthAndHeight"
          ></span>
          <!-- paddings -->
          <!-- days -->
          <span
            v-for="(item, index) in displayNumOfDaysOfMonth"
            :key="`real-${index}`"
            :class="computedDateClass(item)"
            :style="computedDatepickerCellWidthAndHeight"
            @click.stop="onDayClick(item)"
          >
            {{ item }}
          </span>
          <!-- days -->
          <!-- paddings -->
          <span
            v-for="(item, index) in paddingDaysTail"
            :key="`padding-t-${index}`"
            :style="computedDatepickerCellWidthAndHeight"
          ></span>
          <!-- paddings -->
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { getTimestampFromISODate } from "@/common/utils/date";
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
    },
    init: {
      type: Object,
      default: null
    },
    start: {
      type: String,
      default: ""
    },
    end: {
      type: String,
      default: ""
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
      start_date: {
        date: null,
        month: null,
        year: null
      },
      end_date: {
        date: null,
        month: null,
        year: null
      },
      displayNumOfDaysOfMonth: 0,
      displayMonthIndex: 0, // cannot set index to -1!
      displayYear: 1970,
      showMonth: true,
      showYear: true,
      disabled: false,
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
      const { cellHeight, cellWidth } = this;
      let outlineStyle = `height: ${cellHeight}; line-height: ${cellHeight}; width: ${cellWidth}`;
      return `${outlineStyle}`;
    },
    computedDateClass() {
      return function(date) {
        const { init, current, displayYear, displayMonthIndex } = this;
        if (
          displayYear === current.year &&
          displayMonthIndex === current.month &&
          date === current.date
        )
          return "current-day";
        else if (
          init &&
          (displayYear < init.year ||
            (displayYear === init.year && displayMonthIndex < init.month) ||
            (displayYear === init.year &&
              displayMonthIndex === init.month &&
              date < init.date))
        )
          return "past-day";
        return "future-day";
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
        if (this.disabled) this.disabled = false;
      }, 500);
    },
    prevMonth() {
      if (this.disabled) return;
      this.disabled = true;
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
      if (this.disabled) return;
      this.disabled = true;
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
    },
    onDayClick(item) {
      if (this.computedDateClass(item) === "past-day") return;
      // can select day
      // 1. check if the timeline already exists, if it does, compare item with start and end date
      const { start, end } = this;
      if (start && end) {
        const { displayYear, displayMonthIndex } = this;
        let selectedDateStr = `${displayYear}-${displayMonthIndex + 1}-${item}`;
        let selectedDateTimestamp = Date.parse(selectedDateStr);
        let startDateTimestamp = getTimestampFromISODate(start);
        let endDateTimestamp = getTimestampFromISODate(end);
        let selectedDateISOStr = new Date(selectedDateTimestamp).toISOString();
        let distToStart = selectedDateTimestamp - startDateTimestamp;
        let distToEnd = endDateTimestamp - selectedDateTimestamp;
        if (distToStart <= distToEnd) {
          // recalculate start date
          return this.$emit("select-timeline", selectedDateISOStr, end);
        }
        return this.$emit("select-timeline", start, selectedDateISOStr);
      } else {
        return this.$emit("select-date", item);
      }
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
      background-color: none;
      border: none;
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
        height: 100%;
      }
    }
    .datepicker-body-days {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      align-content: flex-start;
    }
  }
}
.current-day {
  background-color: gainsboro;
  cursor: pointer;
}
.past-day {
  color: lightgrey;
}

.future-day {
  cursor: pointer;
}

.future-day:active,
.current-day:active {
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
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
