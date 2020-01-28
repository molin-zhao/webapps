<template>
  <div class="task-group-wrapper">
    <div class="group-setting">
      <div v-if="!collapsed" class="group-setting-show">
        <div class="setting-btn">
          <badge-icon
            :wrapper-style="triangledownfill.wrapperStyle"
            :icon-style="triangledownfill.iconStyle"
            :icon-name="triangledownfill.iconName"
            :reverse="true"
            @click.native="collapseGroup"
          />
        </div>
        <div class="setting-group-label">
          <div>
            <editable-text
              :default-value="$t('GROUP_TITLE')"
              :value="item.name"
              :font-style="`font-size: 18px; color: ${item.color}`"
            />
          </div>
        </div>
      </div>
      <div v-else class="group-setting-hide" @click="collapseGroup">
        <div class="group-color" :style="`background-color: ${item.color}`" />
        <span :style="`color: ${item.color}`">{{ item.name }}</span>
        <span style="position: absolute; right: 5px">{{
          $t("TASK_NUMBER", { number: item.task.length })
        }}</span>
      </div>
    </div>
    <div
      class="collapse show"
      :id="`collapseTask-${taskGroupId}`"
      style="width: 100%"
    >
      <div class="group-body">
        <transition-group class="group-title">
          <group-title
            v-for="(item, index) in title"
            :item="item"
            :key="item.name"
            :title="$t(item.name)"
            :default-style="computedTitleStyle"
            :resizer="index < title.length - 1 ? true : false"
            :sibling-resizing="titleResizing"
            @on-drag-start="onTitleDragStart"
            @on-drag-end="onTitleDragEnd"
            @on-drag-enter="onTitleDragEnter"
            @on-resizing="onTitleResizing(arguments)"
            @on-resizing-end="onTitleResizingEnd"
          />
        </transition-group>
        <group-row
          v-for="taskItem in item.task"
          :key="taskItem.id"
          class="group-cell"
        >
          <group-cell
            v-for="title in title"
            :key="title.name"
            :title="title"
            :task="taskItem"
            :color="item.color"
            style="border-right: 1px solid white;"
          />
        </group-row>
        <!-- add a task -->
        <addTask
          :color="item.color"
          :editable="true"
          class="group-cell"
        ></addTask>
      </div>
    </div>
  </div>
</template>

<script>
import groupRow from "@/components/groupRow";
import groupCell from "@/components/groupCell";
import groupTitle from "@/components/groupTitle";
import badgeIcon from "@/components/badgeIcon";
import editableText from "@/components/editableText";
import popover from "@/components/popover";
import tooltip from "@/components/tooltip";
import addTask from "@/components/addTask";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    groupTitle,
    groupRow,
    groupCell,
    badgeIcon,
    editableText,
    popover,
    tooltip,
    addTask
  },
  computed: {
    ...mapState("user", ["projects"]),
    computedTitleStyle() {
      const { index, title } = this;
      return `height: 100%; background-color: white; ${
        index === 0 ? "border-top-left-radius: 10px;" : null
      };${
        index === title.length - 1 ? "border-top-right-radius: 10px;" : null
      }`;
    },
    triangledownfill() {
      const { color } = this.item;
      return {
        wrapperStyle: {
          plain: `width: 16px; height: 16px; border-radius: 8px; background-color: ${color};`,
          hover: "background-color: white; border: 1px solid black;",
          active: "background-color: aliceblue;"
        },
        iconStyle: {
          plain: "width: 100%; height: 100%; color: white;",
          hover: "color: black;",
          active: "color: cornflowerblue;"
        },
        iconName: {
          plain: "triangledownfill"
        }
      };
    }
  },
  props: {
    projectId: {
      type: [Number, String],
      required: true,
      default: 0
    },
    phaseId: {
      type: [Number, String],
      required: true,
      default: 0
    },
    taskGroupId: {
      type: [Number, String],
      required: true,
      default: 0
    },
    item: {
      type: Object
    }
  },
  data() {
    return {
      title: [
        {
          name: "TITLE_NAME",
          init_w: "25%",
          offset_w: 0,
          min_w: 300,
          draggable: false
        },
        {
          name: "TITLE_STATUS",
          init_w: "12%",
          offset_w: 0,
          min_w: 100,
          draggable: true
        },
        {
          name: "TITLE_MEMBER",
          init_w: "15%",
          offset_w: 0,
          min_w: 100,
          draggable: true
        },
        {
          name: "TITLE_PRIORITY",
          init_w: "12%",
          offset_w: 0,
          min_w: 100,
          draggable: true
        },
        {
          name: "TITLE_TIMELINE",
          init_w: "21%",
          offset_w: 0,
          min_w: 150,
          draggable: true
        },
        {
          name: "TITLE_PROGRESS",
          init_w: "15%",
          offset_w: 0,
          min_w: 100,
          draggable: true
        }
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
      const newTitle = [...this.title];
      const src = newTitle.indexOf(this.dragging);
      const dst = newTitle.indexOf(item);
      if (newTitle[dst].draggable && newTitle[src].draggable) {
        newTitle.splice(dst, 0, ...newTitle.splice(src, 1));
        this.title = newTitle;
      }
    },
    onTitleResizing(args) {
      if (!this.titleResizing) this.titleResizing = true;
      let currentElement = args[0];
      let moveLen = args[1];
      let crntEleOffsetWd = args[2];
      let nxtEleOffsetWd = args[3];

      let nextSiblingIndex = this.title.indexOf(currentElement) + 1;
      if (nextSiblingIndex > this.title.length - 1) return;
      let nextElement = this.title[nextSiblingIndex];

      let crntElMinWd = currentElement.min_w;
      let nxtElMinWd = nextElement.min_w;
      let crntThreshold = crntEleOffsetWd + moveLen;
      let nxtThreshold = nxtEleOffsetWd - moveLen;
      if (crntThreshold > crntElMinWd && nxtThreshold > nxtElMinWd) {
        currentElement.offset_w = currentElement.offset_w + moveLen;
        nextElement.offset_w = nextElement.offset_w - moveLen;
      }
    },
    onTitleResizingEnd() {
      if (this.titleResizing) this.titleResizing = false;
    },
    collapseGroup() {
      if (this.collapsed) {
        $(`#collapseTask-${this.taskGroupId}`).collapse("show");
      } else {
        $(`#collapseTask-${this.taskGroupId}`).collapse("hide");
      }
      this.collapsed = !this.collapsed;
    },
    showGroup() {
      if (this.collapsed) {
        this.collapsed = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.task-group-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .group-setting {
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .group-setting-show {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
    .group-setting-hide {
      width: 96%;
      height: 60%;
      margin-left: 4%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      background-color: whitesmoke;
      cursor: pointer;
      position: relative;
    }
    .group-setting-hide:active {
      -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    }
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
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      div {
        width: 100%;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
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
