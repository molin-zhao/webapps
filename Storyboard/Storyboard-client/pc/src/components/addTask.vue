<template>
  <div class="add-task-wrapper">
    <div
      class="group-color"
      :style="`background-color: ${color}; opacity: ${focused ? 1 : 0.5}`"
    />
    <div class="add-text">
      <editableText
        @on-focus="onFocus"
        @lost-focus="lostFocus"
        defaultValue="ADD_TASK"
      />
    </div>
    <div v-if="focused" class="add-button">
      <a v-if="taskCreating" class="btn btn-sm btn-primary" disabled>
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      </a>
      <a
        v-else
        @click.stop="addTask"
        type="button"
        class="btn btn-sm btn-primary"
      >
        {{ $t("ADD") }}
      </a>
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
      default: false
    },
    color: {
      type: String,
      default: "none"
    }
  },
  data() {
    return {
      focused: false,
      taskCreating: false
    };
  },
  methods: {
    onFocus() {
      if (!this.focused) this.focused = true;
    },
    lostFocus() {
      if (this.focused) this.focused = false;
    },
    addTask() {}
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.add-task-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  .add-text {
    width: 94%;
    height: 100%;
  }
  .add-button {
    width: calc(6% - 1px);
    height: 100%;
    margin-right: 1px;
    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
    a:active {
      outline: none;
    }
  }
}
</style>
