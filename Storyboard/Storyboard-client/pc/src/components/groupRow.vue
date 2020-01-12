<template>
  <div class="row-item-wrapper" :style="computedStyle">
    <div class="row-item" v-if="isType('TITLE_NAME')">
      <name
        :editable="true"
        :value="task.name"
        :default-value="task.id"
        @name-change="taskNameChange"
      />
    </div>
    <div class="row-item" v-else-if="isType('TITLE_STATUS')">
      <status :editable="true" :status="task.status" />
    </div>
    <div class="row-item" v-else-if="isType('TITLE_MEMBER')">
      <member :member="task.members" />
    </div>
    <div class="row-item" v-else-if="isType('TITLE_PRIORITY')">
      <priority />
    </div>
    <div class="row-item" v-else-if="isType('TITLE_TIMELINE')">
      <timeline />
    </div>
    <div class="row-item" v-else-if="isType('TITLE_PROGRESS')">
      <task-progress />
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import name from "@/components/cell/name";
import member from "@/components/cell/member";
import status from "@/components/cell/status";
import taskProgress from "@/components/cell/taskProgress";
import timeline from "@/components/cell/timeline";
import priority from "@/components/cell/priority";
export default {
  components: {
    name,
    member,
    status,
    taskProgress,
    timeline,
    priority
  },
  props: {
    title: {
      type: Object,
      required: true
    },
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    isType() {
      return function(name) {
        return this.title.name === name;
      };
    },
    computedStyle() {
      return `width: calc(${this.title.init_w} + ${this.title.offset_w}px); ${this.style};`;
    }
  },
  methods: {
    taskNameChange(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.row-item-wrapper {
  height: 100%;
  .row-item {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
