<template>
  <div
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    @click="mouseclick(`timeline-popover`, $event)"
    class="timeline-wrapper"
  >
    <wave-btn
      :class="`timeline-btn ${isHover ? 'timeline-wrapper-hover' : null}`"
      btn-style="width: 100%; height: 100%; color: white;"
      btn-color="#000000e6"
      wave-color="#000000ff"
      title="timeline"
    />
    <popover ref="timeline-popover" style="top: calc(100% + 10px);">
      <tooltip
        content-style="width: 400px; height: 200px"
        arrow-placement="top"
        arrow-position="left: 50%; transform: translateX(-50%)"
      />
    </popover>
  </div>
</template>

<script>
import waveBtn from "@/components/waveBtn";
import popover from "@/components/popover";
import tooltip from "@/components/tooltip";
import { eventBus } from "@/common/utils/eventBus";
import { mouseclick, hide } from "@/common/utils/mouse";
export default {
  components: {
    waveBtn,
    popover,
    tooltip
  },
  data() {
    return {
      hover: false
    };
  },
  props: {
    index: {
      type: [Number, String],
      default: 0
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
    }
  },
  computed: {
    isHover() {
      const popover = this.$refs["timeline-popover"];
      if (this.hover || (popover && popover.visible)) {
        return true;
      }
      return false;
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
</style>
