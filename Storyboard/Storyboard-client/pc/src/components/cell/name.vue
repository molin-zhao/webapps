<template>
  <div class="name-cell-wrapper">
    <editable-text
      :row="1"
      :editable="editable"
      :default-value="defaultValue"
      @input-change="inputChange"
    />
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
.name-cell-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: lightgreen;
}
</style>
