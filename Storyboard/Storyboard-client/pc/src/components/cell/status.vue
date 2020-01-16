<template>
  <div class="status-wrapper" @click="mouseclick(`status-popover`, $event)">
    <wave-btn
      class="status-btn"
      btn-style="width: 100%; height: 100%; color: white;"
      :btn-color="`${computedColor}e6`"
      :wave-color="`${computedColor}ff`"
      :title="$t(computedTitle)"
    />
    <popover :ref="`status-popover`" style="top: calc(100% + 10px);">
      <tooltip
        content-style="
        width: 150px; 
        height: 200px; 
        border-radius: 5px; 
        box-shadow: -5px 2px 5px lightgrey; 
        -webkit-box-shadow: -5px 2px 5px lightgrey;
        border: 1px solid whitesmoke;
        "
        arrow-placement="top"
        arrow-position="left: 50%; transform: translateX(-50%)"
        background-color="white"
        border-color="whitesmoke"
      />
    </popover>
  </div>
</template>

<script>
import waveBtn from "@/components/waveBtn";
import popover from "@/components/popover";
import tooltip from "@/components/tooltip";
import { mouseclick, hide } from "@/common/utils/mouse";
import { eventBus } from "@/common/utils/eventBus";
export default {
  components: {
    waveBtn,
    popover,
    tooltip
  },
  props: {
    status: {
      type: String,
      default: ""
    },
    editable: {
      type: Boolean,
      default: true
    },
    index: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    computedColor() {
      switch (this.status) {
        case "working":
          return "#6495ed";
          break;
        case "planned":
          return "#d3d3d3";
          break;
        case "stuck":
          return "#ffa500";
          break;
        case "done":
          return "#7cfc00";
          break;
        case "defer":
          return "#ff0000";
          break;
        default:
          return "#000000";
          break;
      }
    },
    computedTitle() {
      switch (this.status) {
        case "working":
          return "STATUS_WORKING";
          break;
        case "planned":
          return "STATUS_PLANNED";
          break;
        case "stuck":
          return "STATUS_STUCK";
          break;
        case "done":
          return "STATUS_DONE";
          break;
        case "defer":
          return "STATUS_DEFER";
          break;
        default:
          return "";
          break;
      }
    }
  },
  methods: {
    mouseclick,
    hide
  },
  mounted() {
    eventBus.$on("reset-visible-component", () => {
      this.hide(`status-popover`);
    });
  }
};
</script>

<style lang="scss" scoped>
.status-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.status-btn {
  width: 100%;
  height: 100%;
}
</style>
