<template>
  <div ref="container" class="status-wrapper">
    <wave-btn
      class="status-btn"
      btn-style="width: 100%; height: 100%;"
      @click.native.stop="mouseclick('priority')"
    />
    <popover ref="priority" style="top: calc(100% + 10px);">
      <tooltip
        content-style="width: 200px; height: 200px"
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
import mouse from "@/common/utils/mouse";
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
    }
  },
  computed: {
    computedBtnStyle() {
      switch (this.status) {
        case "planned":
        case "working":
        case "stuck":
        case "done":
        case "defer":
          break;
      }
    }
  },
  created() {
    document.addEventListener("click", this.checkMouseClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkMouseClick);
  },
  methods: {
    ...mouse,
    checkMouseClick(event) {
      const e = event || window.event;
      const { type, target } = e;
      const containerEl = this.$refs["container"];
      if (containerEl && !containerEl.contains(target)) {
        this.hide("priority");
      } else {
        this.show("priority");
      }
    }
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
.status-btn:hover {
  background-color: #426fc5b3;
}
</style>
