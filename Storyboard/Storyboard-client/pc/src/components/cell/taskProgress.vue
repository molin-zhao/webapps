<template>
  <div class="progress-wrapper display-only" :style="computedColor">
    {{ computedProgress }}
  </div>
</template>

<script>
import {
  getTimestampFromISODate,
  getTimestampFromDate,
  displayTimeFromTimestamp,
  NOW_ISO
} from "@/common/utils/date";
export default {
  data() {
    return {
      backgroundColor: "whitesmoke",
      color: "black",
      status: ""
    };
  },
  props: {
    timeline: {
      type: Object,
      required: true,
      default: () => ({
        start_date: NOW_ISO,
        due_date: NOW_ISO
      })
    },
    taskStatus: {
      type: String,
      default: ""
    }
  },
  computed: {
    computedProgress() {
      const { start_date, due_date } = this.timeline;
      const { taskStatus } = this;
      if (taskStatus === "done") return this.$t("PROGRESS_DONE");
      let startTimestamp = getTimestampFromISODate(start_date);
      let dueTimestamp = getTimestampFromISODate(due_date);
      let nowTimestamp = getTimestampFromDate(new Date());

      /**
       * compute abs(now - start) and abs(end - now)
       * show the result of the smaller one
       */

      let timestampToStart = nowTimestamp - startTimestamp;
      let timestampToDue = nowTimestamp - dueTimestamp;

      if (timestampToStart < 0) {
        // before task start
        this.status = "before";
        const { number, unit } = displayTimeFromTimestamp(-timestampToStart);
        return this.$t("PROGRESS_BEFORE", {
          progress: this.$t(unit, { number })
        });
      } else if (timestampToStart >= 0 && timestampToDue <= 0) {
        // task is undergoing
        if (timestampToStart <= 0.8 * (dueTimestamp - startTimestamp)) {
          // undergoing
          this.status = "undergoing";
          const { number, unit } = displayTimeFromTimestamp(timestampToStart);
          return this.$t("PROGRESS_UNDERGOING", {
            progress: this.$t(unit, { number })
          });
        } else {
          this.status = "due";
          const { number, unit } = displayTimeFromTimestamp(-timestampToDue);
          return this.$t("PROGRESS_DUE", {
            progress: this.$t(unit, { number })
          });
        }
      } else {
        // task is defered
        this.status = "defer";
        const { number, unit } = displayTimeFromTimestamp(timestampToDue);
        return this.$t("PROGRESS_DEFER", {
          progress: this.$t(unit, { number })
        });
      }
    },
    computedColor() {
      const { status, taskStatus } = this;
      if (taskStatus === "done")
        return "background-color: lightgreen; color: white";
      if (status === "before") {
        return "background-color: whitesmoke; color: black";
      } else if (status === "undergoing") {
        return "background-color: gainsboro; color: white";
      } else if (status === "due") {
        return "background-color: orange; color: white";
      } else if (status === "defer") {
        return "background-color: tomato; color: white";
      } else {
        return "background-color: whitesmoke; color: black";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/theme/container.css";
.progress-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
