<template>
  <div class="task-group-wrapper">
    <div class="group-setting">
      <div class="setting-btn">
        <badge-icon
          :wrapper-style="triangledownfill.wrapperStyle"
          :icon-style="triangledownfill.iconStyle"
          :icon-name="triangledownfill.iconName"
          :reverse="true"
          @click.native="collapseGroup"
        />
      </div>
      <div class="setting-group-label"></div>
    </div>
    <div class="collapse show" id="collapseExample" style="width: 100%">
      <div class="group-body">
        <transition-group class="group-title">
          <group-title
            v-for="(item, index) in titles"
            :item="item"
            :key="item.name"
            :title="$t(item.name)"
            :default-style="
              `
          height: 100%; 
          background-color: white; 
          ${index === 0 ? 'border-top-left-radius: 10px;' : null};
          ${
            index === titles.length - 1
              ? 'border-top-right-radius: 10px;'
              : null
          }
          `
            "
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
          <!-- nested v-for rendering different type of cells -->
          <group-row
            v-for="title in titles"
            :key="title.name"
            :title="title"
            :task="item"
            style="border-right: 1px solid white;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import groupRow from "@/components/groupRow";
import groupTitle from "@/components/groupTitle";
import badgeIcon from "@/components/badgeIcon";
import { triangledownfill } from "@/common/theme/icon";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    groupTitle,
    groupRow,
    badgeIcon
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
      triangledownfill,
      titles: [
        { name: "TITLE_NAME", init_w: "25%", offset_w: 0 },
        { name: "TITLE_STATUS", init_w: "15%", offset_w: 0 },
        { name: "TITLE_MEMBER", init_w: "15%", offset_w: 0 },
        { name: "TITLE_PRIORITY", init_w: "15%", offset_w: 0 },
        { name: "TITLE_DUEDATE", init_w: "15%", offset_w: 0 },
        { name: "TITLE_INITDATE", init_w: "15%", offset_w: 0 }
      ],
      dragging: null,
      titleResizing: false,
      collapsed: false
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
    },
    collapseGroup() {
      this.collapsed = !this.collapsed;
      if (this.collapsed) {
        $("#collapseExample").collapse("show");
      } else {
        $("#collapseExample").collapse("hide");
      }
    },
    showGroup() {
      if (this.collapsed) {
        this.collapsed = false;
      }
    },
    mounted() {
      $(document).ready(function() {
        $("#groupCollapseBody").collapse({
          toggle: true
        });
      });
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
  .group-setting {
    width: 100%;
    height: 10%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .setting-btn {
      width: 4%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .setting-group-label {
      width: 16%;
      height: 100%;
      background-color: red;
    }
  }
  .group-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
  }
  .group-title {
    width: 96%;
    height: 40px;
    margin-bottom: 2px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
  }
  .group-cell {
    width: 96%;
    height: 40px;
    margin-bottom: 1px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
  }
}
</style>
