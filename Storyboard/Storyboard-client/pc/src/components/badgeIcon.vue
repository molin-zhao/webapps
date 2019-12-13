<template>
  <div class="wrapper" :style="wrapperStyle">
    <icon
      :name="name"
      :defaultClass="defaultClass"
      :mouseoverClass="mouseoverClass"
      :style="iconStyle"
    />
    <span :class="`badge ${badgeClass}`" :style="badgeStyle">{{
      badgeNumber
    }}</span>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      default: 0
    },
    wrapperStyle: {
      type: String
    },
    defaultClass: {
      type: String
    },
    mouseoverClass: {
      type: String
    },
    iconStyle: {
      type: String
    },
    badgeClass: {
      type: String
    },
    badgeStyle: {
      type: String
    }
  },
  computed: {
    badgeNumber() {
      if (this.number > 99) return "99+";
      else if (this.number === 0) return "";
      else return `${this.number}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2px;
  position: relative;
  span {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    font-size: 0.7vw;
  }
}
</style>
