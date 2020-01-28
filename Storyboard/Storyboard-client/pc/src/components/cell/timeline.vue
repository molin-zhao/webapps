<template>
  <div
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    @click="mouseclick(`timeline-popover`, $event)"
    class="timeline-wrapper"
  >
    <wave-btn
      :class="`timeline-btn ${isHover ? 'timeline-wrapper-hover' : null}`"
      btn-style="width: 100%; height: 100%; color: white; font-size: 13px"
      btn-color="#000000e6"
      wave-color="#000000ff"
      :title="computedTitle"
    />
    <popover ref="timeline-popover" style="top: calc(100% + 10px);">
      <tooltip
        content-style="
        width: 300px; 
        height: 450px; 
        border-radius: 5px; 
        box-shadow: -5px 2px 5px lightgrey; 
        -webkit-box-shadow: -5px 2px 5px lightgrey;
        border: 1px solid whitesmoke;
        "
        arrow-placement="top"
        arrow-position="left: 50%; transform: translateX(-50%)"
        background-color="white"
        border-color="whitesmoke"
      >
        <div class="datepicker-header"></div>
        <div class="datepicker-body">
          <datepicker
            :start="timeline.start_date"
            :end="timeline.due_date"
            :select-period="true"
            @select-date="selectDate"
            @select-timeline="selectTimeline(arguments)"
            @select-start="selectStart"
            @select-end="selectEnd"
          />
        </div>
        <div class="datepicker-footer"></div>
      </tooltip>
    </popover>
  </div>
</template>

<script>
import waveBtn from "@/components/waveBtn";
import popover from "@/components/popover";
import tooltip from "@/components/tooltip";
import datepicker from "@/components/datepicker";
import { eventBus } from "@/common/utils/eventBus";
import { mouseclick, hide } from "@/common/utils/mouse";
import { NOW_ISO, parseISODate } from "@/common/utils/date";
export default {
  components: {
    waveBtn,
    popover,
    tooltip,
    datepicker
  },
  data() {
    return {
      hover: false,
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
      ]
    };
  },
  props: {
    index: {
      type: [Number, String],
      default: 0
    },
    timeline: {
      type: Object,
      required: true,
      default: () => ({
        start_date: NOW_ISO,
        due_date: NOW_ISO
      })
    }
  },
  mounted() {
    eventBus.$on("reset-visible-component", () => {
      this.hide(`timeline-popover`);
    });
  },
  methods: {
    mouseclick,
    hide,
    mouseenter() {
      if (!this.hover) this.hover = true;
    },
    mouseleave() {
      if (this.hover) this.hover = false;
    },
    selectDate(iso) {
      console.log(iso);
    },
    selectTimeline(args) {
      console.log(`start ${args[0]}`);
      console.log(`due ${args[1]}`);
    },
    selectStart(iso) {},
    selectEnd(iso) {}
  },
  computed: {
    isHover() {
      const popover = this.$refs["timeline-popover"];
      if (this.hover || (popover && popover.visible)) {
        return true;
      }
      return false;
    },
    computedTitle() {
      const { start_date, due_date } = this.timeline;
      const { month_name } = this;
      let start = parseISODate(start_date);
      let startMonthIndex = start.getMonth();
      let startDate = start.getDate();
      let end = parseISODate(due_date);
      let endMonthIndex = end.getMonth();
      let endDate = end.getDate();
      let startTimeStr = `${this.$t(month_name[startMonthIndex])} ${startDate}`;
      let endTimeStr = `${this.$t(month_name[endMonthIndex])} ${endDate}`;
      return `${startTimeStr} - ${endTimeStr}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.timeline-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}
.timeline-wrapper-hover {
  -webkit-transform: translateY(-3px);
  -ms-transform: translateY(-3px);
  transform: translateY(-3px);
  -webkit-box-shadow: -5px 2px 5px lightgrey;
  box-shadow: -5px 2px 5px lightgrey;
  -webkit-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
  border-radius: 2px;
}
.timeline-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.datepicker-header {
  height: 15%;
  width: 100%;
  background-color: lightblue;
}
.datepicker-body {
  height: 70%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.datepicker-footer {
  height: 15%;
  width: 100%;
  background-color: lightblue;
}
</style>
