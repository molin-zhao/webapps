<template>
  <transition name="fade">
    <div @click="del" v-if="show" class="item">{{ item }}</div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  },
  methods: {
    del() {
      this.$emit("del", this.item);
    }
  },
  props: {
    item: {
      type: [String, Number],
      required: true
    }
  },
  mounted() {
    this.show = true;
  },
  beforeDestroy() {
    this.show = false;
  }
};
</script>
<style lang="scss" scoped>
.item {
  width: 80%;
  height: 30px;
  margin-bottom: 5px;
  background-color: lightcoral;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  height: 0;
  margin-bottom: 0;
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
