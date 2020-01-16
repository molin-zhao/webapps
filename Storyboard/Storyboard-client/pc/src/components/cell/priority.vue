<template>
  <div class="priority-wrapper">
    <wave-btn
      class="priority-btn"
      :btn-color="`${computedColor}e6`"
      :wave-color="`${computedColor}ff`"
      :title="$t(computedTitle)"
      btn-style="width: 100%; height: 100%; color: white;"
      @click.native="mouseclick('priority', $event)"
    />
    <popover ref="priority" style="top: calc(100% + 10px);">
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
    priority: {
      type: String,
      default: ""
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    computedColor() {
      switch (this.priority) {
        case "medium":
          return "#6495ed";
          break;
        case "low":
          return "#d3d3d3";
          break;
        case "high":
          return "#ff0000";
          break;
        default:
          return "#000000";
          break;
      }
    },
    computedTitle() {
      switch (this.priority) {
        case "medium":
          return "PRIORITY_MEDIUM";
          break;
        case "low":
          return "PRIORITY_LOW";
          break;
        case "high":
          return "PRIORITY_HIGH";
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
      this.hide("priority");
    });
  }
};
</script>

<style lang="scss" scoped>
.priority-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.priority-btn {
  width: 100%;
  height: 100%;
}
</style>
