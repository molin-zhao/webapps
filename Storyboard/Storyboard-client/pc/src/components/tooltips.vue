<template>
  <transition name="show">
    <div ref="tooltips" v-if="visible" class="tooltips">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      clicked: false
    };
  },
  props: {
    onClick: {
      type: Function
    },
    onFinish: {
      type: Function
    }
  },
  created() {
    document.addEventListener("click", this.checkClicked);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkClicked);
  },
  methods: {
    checkClicked(event) {
      const e = event || window.event;
      if (this.$refs.tooltips && !this.$refs.tooltips.contains(e.target)) {
        this.clicked = true;
        if (this.onClick) this.onClick();
      } else {
        this.clicked = false;
      }
    },
    show() {
      if (!this.visible) this.visible = true;
    },
    hide() {
      if (this.visible) this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.tooltips {
  position: absolute;
}
.show-enter-active,
.show-leave-active {
  transition: opacity 0.2s;
}

.show-enter,
.show-leave-active {
  opacity: 0;
}
</style>
