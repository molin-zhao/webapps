<template>
  <div class="task-group-wrapper">
    <transition-group class="group-title">
      <cell-title
        v-for="(item, index) in titles"
        :item="item"
        :key="item.name"
        :title="$t(item.name)"
        :default-style="`height: 100%; background-color: white`"
        :resizer="index < titles.length - 1 ? true : false"
        :sibling-resizing="titleResizing"
        @on-drag-start="onTitleDragStart"
        @on-drag-end="onTitleDragEnd"
        @on-drag-enter="onTitleDragEnter"
        @on-resizing="onTitleResizing(arguments)"
        @on-resizing-end="onTitleResizingEnd"
      />
    </transition-group>
    <div
      class="group-cell"
      v-for="(item, index) in projects[index].phases[phaseId].tasks"
      :key="index"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
import cellTitle from "@/components/cellTitle";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    cellTitle
  },
  computed: {
    ...mapState("user", ["projects"])
  },
  props: {
    index: {
      type: Number,
      required: true,
      default: 0
    },
    phaseId: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      titles: [
        { name: "TITLE_NAME", init_w: "25%", offset_w: 0 },
        { name: "TITLE_STATUS", init_w: "15%", offset_w: 0 },
        { name: "TITLE_MEMBER", init_w: "15%", offset_w: 0 },
        { name: "TITLE_PRIORITY", init_w: "15%", offset_w: 0 },
        { name: "TITLE_DUEDATE", init_w: "15%", offset_w: 0 },
        { name: "TITLE_INITDATE", init_w: "15%", offset_w: 0 }
      ],
      dragging: null,
      titleResizing: false
    };
  },
  methods: {
    onTitleDragStart(item) {
      this.dragging = item;
    },
    onTitleDragEnd(item) {
      this.dragging = null;
    },
    onTitleDragEnter(item) {
      if (item === this.dragging) return;
      const newTitles = [...this.titles];
      const src = newTitles.indexOf(this.dragging);
      const dst = newTitles.indexOf(item);
      newTitles.splice(dst, 0, ...newTitles.splice(src, 1));
      this.titles = newTitles;
    },
    onTitleResizing(args) {
      if (!this.titleResizing) this.titleResizing = true;
      let currentElement = args[0];
      let moveLen = args[1];
      let prevOffsetWOfCurrentElement = currentElement.offset_w;
      currentElement.offset_w = prevOffsetWOfCurrentElement + moveLen;
      let nextSiblingIndex = this.titles.indexOf(currentElement) + 1;
      if (nextSiblingIndex > this.titles.length - 1) return;
      let nextElement = this.titles[nextSiblingIndex];
      let prevOffsetWOfNextElement = nextElement.offset_w;
      nextElement.offset_w = prevOffsetWOfNextElement - moveLen;
    },
    onTitleResizingEnd() {
      if (this.titleResizing) this.titleResizing = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.task-group-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: lightcyan;
  .group-title {
    width: 95%;
    height: 40px;
    background-color: yellowgreen;
    margin-top: 40px;
    margin-bottom: 2px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
  }
  .group-cell {
    width: 95%;
    height: 40px;
    background-color: lightcoral;
    margin-bottom: 2px;
  }
}
</style>
