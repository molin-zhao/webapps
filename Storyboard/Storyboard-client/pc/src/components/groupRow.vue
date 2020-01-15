<template>
  <transition name="fade">
    <div v-if="visible">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  mounted() {
    this.visible = true;
  },
  beforeDestroy() {
    this.visible = false;
  }
};
</script>

<style lang="scss" scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
  height: 0;
}
.fade-leave,
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
</style>
