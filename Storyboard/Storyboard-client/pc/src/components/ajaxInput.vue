<template>
  <input :type="type" v-model="inputValue" />
</template>

<script>
export default {
  data() {
    return {
      inputValue: "",
      timer: null
    };
  },
  props: {
    type: {
      type: String,
      default: "text"
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
