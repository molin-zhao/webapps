<template>
  <div class="tooltip-wrapper" :style="computedContentStyle">
    <div class="tooltip-arrow-outside" :style="computedArrowOutsideStyle" />
    <div class="tooltip-arrow-inside" :style="computedArrowInsideStyle" />
    <div class="tooltip-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    computedContentStyle() {
      return `background-color: ${this.backgroundColor}; ${this.contentStyle}`;
    },
    computedArrowOutsideStyle() {
      let borderWidthNumber = this.arrowSizeNumber;
      let borderWidth = `border-width: ${borderWidthNumber}${this.arrowSizeUnit};`;
      let borderColor = `border-color: ${this.drawArrowIsOutside(true)};`;
      let borderOffset = `${this.getArrowOffsetIsOutside(true)}`;
      return `${borderWidth}; ${borderColor}; ${borderOffset}; ${this.arrowPosition}`;
    },
    computedArrowInsideStyle() {
      let borderWidthNumber = this.arrowSizeNumber;
      let borderWidth = `border-width: ${borderWidthNumber}${this.arrowSizeUnit};`;
      let borderColor = `border-color: ${this.drawArrowIsOutside(false)};`;
      let borderOffset = `${this.getArrowOffsetIsOutside(false)}`;
      return `${borderWidth}; ${borderColor}; ${borderOffset}; ${this.arrowPosition}`;
    }
  },
  props: {
    backgroundColor: {
      type: String,
      default: "gainsboro"
    },
    arrowSizeNumber: {
      type: Number,
      default: 1
    },
    arrowSizeUnit: {
      type: String,
      default: "vh"
    },
    arrowPlacement: {
      type: String,
      default: "top"
    },
    arrowPosition: {
      type: String,
      default: ""
    },
    borderColor: {
      type: String,
      default: ""
    },
    borderWidthAlpha: {
      type: Number,
      default: 0.1
    },
    contentStyle: {
      type: String
    }
  },
  methods: {
    drawArrowIsOutside(isOutside) {
      let color = isOutside ? this.borderColor : this.backgroundColor;
      switch (this.arrowPlacement) {
        case "bottom": // bottom arrow placement
          return `${color} transparent transparent transparent`;
          break;
        case "left": // left arrow placement
          return `transparent ${color} transparent transparent`;
          break;
        case "top": // top arrow placement
          return `transparent transparent ${color} transparent`;
          break;
        default:
          // right arrow placement
          return `transparent transparent transparent ${color}`;
          break;
      }
    },
    getArrowOffsetIsOutside(isOutside) {
      // type indicates 'outside' or 'inside' arrow
      // border width is computed by arrow-size
      let borderWidthNumber = this.arrowSizeNumber * this.borderWidthAlpha;
      let outsideOffsetNumber = 2 * this.arrowSizeNumber;
      let insideOffsetNumber = outsideOffsetNumber - 2 * borderWidthNumber;
      let arrowOffsetNumber = isOutside
        ? outsideOffsetNumber
        : insideOffsetNumber;
      let arrowOffset = `-${arrowOffsetNumber}${this.arrowSizeUnit}`;
      switch (this.arrowPlacement) {
        case "top":
          return `top: ${arrowOffset};`;
          break;
        case "right":
          return `right: ${arrowOffset};`;
          break;
        case "bottom":
          return `bottom: ${arrowOffset};`;
          break;
        default:
          return `left: ${arrowOffset};`;
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tooltip-wrapper {
  position: relative;
  .tooltip-content {
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .tooltip-arrow-outside {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }
  .tooltip-arrow-inside {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }
}
</style>
