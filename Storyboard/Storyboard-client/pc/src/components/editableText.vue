<template>
  <div ref="input-wrapper" class="wrapper">
    <span v-if="!editing" class="value" :style="textStyle">{{
      computedValue
    }}</span>
    <slot v-else class="input"></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    default: {
      type: String,
      required: true
    },
    textStyle: {
      type: String
    }
  },
  data() {
    return {
      editing: false
    };
  },
  computed: {
    computedValue() {
      return this.value ? this.value : this.default;
    }
  },
  created() {
    document.addEventListener("click", this.checkMouseClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkMouseClick);
  },
  methods: {
    checkMouseClick(event) {
      const e = event || window.event;
      let { type, target } = e;
      if (
        this.$refs["input-wrapper"] &&
        this.$refs["input-wrapper"].contains(target)
      ) {
        // inside div
        if (!this.editing) this.editing = true;
      } else {
        if (this.editing) this.editing = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.input {
  position: absolute;
  top: 0;
  left: 0;
}

.value {
  display: block;
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  flex-wrap: wrap;
  word-break: break-all;
  text-overflow: ellipsis;
}
.wrapper:hover {
  cursor: pointer;
}
</style>
