<template>
  <div class="name-cell-wrapper">
    <div class="group-color" :style="`background-color: ${color}`" />
    <div class="name-cell">
      <editable-text
        :row="1"
        :value="value"
        :editable="editable"
        :default-value="defaultValue"
        @input-change="inputChange"
      />
    </div>
  </div>
</template>

<script>
import editableText from "@/components/editableText";
export default {
  components: {
    editableText
  },
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ""
    },
    defaultValue: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "gainsboro"
    }
  },
  methods: {
    inputChange(val) {
      this.$emit("name-change", val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/theme/container.css";
.name-cell-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: whitesmoke;
  .name-cell {
    height: 100%;
    width: calc(100% - 4px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
