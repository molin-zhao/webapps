<template>
  <input :type="type" v-model="inputValue" />
</template>

<script>
export default {
  data() {
    return {
      inputValue: this.initValue,
      timer: null
    };
  },
  props: {
    type: {
      type: String,
      default: "text"
    },
    initValue: {
      type: String,
      default: ""
    },
    interval: {
      type: Number,
      default: 200
    }
  },
  watch: {
    inputValue(newVal, oldVal) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        return this.$emit("on-change", newVal);
      }, this.interval);
    }
  }
};
</script>

<style lang="scss" scoped></style>
