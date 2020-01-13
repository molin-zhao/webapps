<template>
  <div
    :ref="`title-${item.name}`"
    :draggable="siblingResizing || resizing ? false : true"
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
    class="title-wrapper"
    :style="computedStyle"
    @dragstart="onDragStart"
    @dragover.prevent="onDragOver"
    @dragenter="onDragEnter"
    @dragend="onDragEnd"
  >
    <span v-if="title">{{ title }}</span>
    <slot v-else></slot>
    <div
      :ref="`resizer-${item.name}`"
      v-if="resizer && isHover"
      class="resizer"
    />
  </div>
</template>

<script>
export default {
  props: {
    defaultStyle: {
      type: String,
      default: "height: 100%"
    },
    hoverStyle: {
      type: String,
      default: "background-color: gainsboro"
    },
    resizer: {
      type: Boolean,
      default: false
    },
    item: {
      type: [Object, String, Number],
      required: true
    },
    siblingResizing: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      mouseover: false,
      resizing: false,
      resizingStartX: null,
      prevMoveLen: 0
    };
  },
  created() {
    document.addEventListener("mousedown", this.onResizerMousedown);
    document.addEventListener("mouseup", this.onResizerMouseup);
    document.addEventListener("mousemove", this.onResizerMousemove);
  },
  beforeCreate() {
    document.removeEventListener("mousedown", this.onResizerMousedown);
    document.removeEventListener("mouseup", this.onResizerMouseup);
    document.removeEventListener("mousemove", this.onResizerMousemove);
  },
  computed: {
    computedStyle() {
      const {
        defaultStyle,
        hoverStyle,
        mouseover,
        item,
        resizing,
        siblingResizing
      } = this;
      let computedWidth = `width: calc(${item.init_w} + ${item.offset_w}px)`;
      let hasSiblingResizing = siblingResizing ^ resizing; // only difference results in 1
      let criteria = (mouseover && !hasSiblingResizing) || resizing;
      if (criteria) return `${defaultStyle}; ${hoverStyle}; ${computedWidth};`;
      else return `${defaultStyle}; ${computedWidth};`;
    },
    isHover() {
      const { siblingResizing, resizing, mouseover } = this;
      let hasSiblingResizing = siblingResizing ^ resizing; // only difference results in 1
      return (mouseover && !hasSiblingResizing) || resizing;
    }
  },
  methods: {
    onMouseover() {
      if (!this.mouseover) this.mouseover = true;
    },
    onMouseleave() {
      if (this.mouseover) this.mouseover = false;
    },
    onResizerMousedown() {
      const e = event || window.event;
      const { type, target, clientX } = e;
      const { name } = this.item;
      if (
        this.$refs[`resizer-${name}`] &&
        this.$refs[`resizer-${name}`].contains(target)
      ) {
        if (!this.resizing) {
          this.resizing = true;
          this.resizingStartX = clientX;
        }
      } else {
        if (this.resizing) {
          this.resizing = false;
          this.resizingStartX = null;
        }
      }
    },
    onResizerMousemove(e) {
      const { clientX, currentTarget, target } = e;
      const { resizing } = this;
      if (resizing) {
        let resizingEndX = clientX;
        // (endX - startX) = move length
        // if move left, move length is negative
        // if move right, move length is positive
        let moveLen = resizingEndX - this.resizingStartX;
        if (this.prevMoveLen !== moveLen) {
          this.prevMoveLen = moveLen;
          const currentEl = this.$refs[`title-${this.item.name}`];
          const nextEl = currentEl.nextSibling;
          const crntElOffsetWd = currentEl.offsetWidth;
          const nxtElOffsetWd = nextEl.offsetWidth;
          this.$emit(
            "on-resizing",
            this.item,
            moveLen,
            crntElOffsetWd,
            nxtElOffsetWd
          );
        }
        this.resizingStartX = resizingEndX;
      }
    },
    onResizerMouseup() {
      if (this.resizing) {
        this.resizing = false;
        this.$emit("on-resizing-end");
      }
    },
    onDragStart(e) {
      this.$emit("on-drag-start", this.item);
    },
    onDragEnd(e) {
      this.$emit("on-drag-end");
    },
    onDragOver(e) {
      e.dataTransfer.dropEffect = "move";
    },
    onDragEnter(e) {
      e.dataTransfer.effectAllowed = "move";
      this.$emit("on-drag-enter", this.item);
    }
  }
};
</script>

<style lang="scss" scoped>
.title-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.resizer {
  position: absolute;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  background-color: cornflowerblue;
}
</style>
