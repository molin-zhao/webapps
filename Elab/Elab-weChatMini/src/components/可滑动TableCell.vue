<template>
    <div class="table-view-cell" :style="{height: height}">
        <div class="front-layer" :data-type="item.type" :style="slideEffect" @click="上层点击事件()" @touchstart="touchStart($event)" @touchend="touchEnd($event,index)" @touchmove="touchMove($event)">
            <slot></slot>
        </div>
        <div v-if="btns" class="back-layer">
            <div class="left-btn" :style="{width: leftBtnClickEffect, fontSize: btns.leftBtn.style.fontSize, backgroundColor: btnBackgroundColors.leftBtn}" @click="左按钮点击事件()">{{btnLabels.leftBtn}}</div>
            <div v-if="btns.rightBtn" class="right-btn" :style="{width: rightBtnClickEffect, fontSize: btns.rightBtn.style.fontSize, backgroundColor: btnBackgroundColors.rightBtn}" @click="右按钮点击事件()">{{btnLabels.rightBtn}}</div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      startX: 0,
      moveX: 0,
      endX: 0,
      distX: 0,
      slideEffect: "", // 滑动的效果，用于添加style
      leftBtnClickEffect: "",
      rightBtnClickEffect: "",
      btnLabels: {
        leftBtn: "",
        rightBtn: ""
      },
      btnStatus: {
        leftBtn: 0,
        rightBtn: 0
      },
      btnBackgroundColors: {
        leftBtn: "",
        rightBtn: ""
      },
      backLayerBoundaryWidth: 0
    };
  },
  mounted() {
    if (this.$options.propsData.btns != null) {
      let btns = this.$options.propsData.btns;
      this.backLayerBoundaryWidth = btns.boundaryWidth;
      this.leftBtnClickEffect = btns.leftBtn.style.width;
      this.rightBtnClickEffect = btns.rightBtn.style.width;
      this.btnBackgroundColors.leftBtn = btns.leftBtn.style.backgroundColor(
        this
      );
      this.btnBackgroundColors.rightBtn = btns.rightBtn.style.backgroundColor(
        this
      );
      this.btnLabels.leftBtn = btns.leftBtn.label(this);
      this.btnLabels.rightBtn = btns.rightBtn.label(this);
    }
  },
  props: ["item", "index", "btns", "height", "frontLayerOnClickFn"],
  methods: {
    touchStart(e) {
      if (e.mp.touches.length === 1) {
        // 等于1时表示只有一个手指触摸
        // 获得起始x轴位置
        this.startX = e.mp.changedTouches[0].clientX;
      }
    },
    touchEnd(e, index) {
      if (e.mp.changedTouches.length === 1) {
        let endX = e.mp.changedTouches[0].clientX;
        this.distX = endX - this.startX;
        if (this.distX < 0 && this.item.type === 0) {
          // 手指向左移动并且此时cell没有滑到左边
          if (-this.distX < this.backLayerBoundaryWidth / 3) {
            this.slideEffect = "transform: translate3d(0,0,0)";
          } else {
            this.slideEffect =
              "transform: translate3d(-" +
              this.backLayerBoundaryWidth +
              "rpx,0,0)";
            this.item.type = 1;
          }
        } else if (this.distX > 0 && this.item.type === 1) {
          // 手指向右滑动并且此时cell滑到了左面
          if (this.distX > this.backLayerBoundaryWidth / 3) {
            this.slideEffect = "transform: translate3d(0,0,0)";
            this.item.type = 0;
          } else {
            this.slideEffect =
              "transform: translate3d(-" +
              this.backLayerBoundaryWidth +
              "rpx,0,0)";
          }
        }
      }
    },
    touchMove(e) {
      if (e.mp.touches.length === 1) {
        this.moveX = e.mp.changedTouches[0].clientX;
        this.distX = this.moveX - this.startX;
        if ((this.distX < 0 || this.distX === 0) && this.item.type === 0) {
          // 向左移动并且cell没有完全滑到左
          if (-this.distX >= this.backLayerBoundaryWidth) {
            this.slideEffect =
              "transform: translateX(-" + this.backLayerBoundaryWidth + "rpx)";
          } else {
            this.slideEffect = "transform:translateX(" + this.distX + "rpx)";
          }
        } else if (this.distX > 0 && this.item.type === 1) {
          // 向右移动并且cell此时已经滑到了左面正在跟随向右移动
          if (this.distX >= this.backLayerBoundaryWidth) {
            this.slideEffect =
              "transform: translateX(" + this.backLayerBoundaryWidth + "rpx)";
          } else {
            this.slideEffect =
              "transform:translateX(" +
              (this.distX - this.backLayerBoundaryWidth) +
              "rpx)";
          }
        }
      }
    },
    上层点击事件: function() {
      if (this.item.type === 1) {
        console.log("复原Cell");
        return this.recover();
      }
      console.log("点击Cell");
      return this.frontLayerOnClickFn(this.item);
    },

    // 点击回复原状
    recover() {
      if (this.item.type === 1) {
        this.item.type = 0;
        this.slideEffect = "transform: translate3d(0,0,0)";
        this.recoverBtn();
        console.log("复原了");
      }
    },
    // 回复按钮样式
    recoverBtn() {
      if (this.btns) {
        this.leftBtnClickEffect = this.btns.leftBtn.style.width;
        this.rightBtnClickEffect = this.btns.rightBtn.style.width;
        this.btnStatus.rightBtn = 0;
        this.btnStatus.leftBtn = 0;
        this.btnLabels.leftBtn = this.btns.leftBtn.label(this);
        this.btnLabels.rightBtn = this.btns.rightBtn.label(this);
      }
    },
    左按钮点击事件: function() {
      if (this.btnStatus.leftBtn === 0) {
        // 按钮的初始状态，此时点击进入等待确认状态
        this.btnStatus.leftBtn = 1;
        this.btnStatus.rightBtn = -1;
        this.btnLabels.leftBtn = "确定";
        this.btnLabels.rightBtn = "";
        this.leftBtnClickEffect = this.backLayerBoundaryWidth + "rpx";
        this.rightBtnClickEffect = "0rpx";
      } else {
        // 按钮进入等待确认状态，再次点击执行btnFn函数
        this.recover();
        return this.btns.leftBtn.btnFn(this, this.item);
      }
    },
    右按钮点击事件: function() {
      if (this.btnStatus.rightBtn === 0) {
        // 按钮的初始状态，此时点击进入等待确认状态
        this.btnStatus.rightBtn = 1;
        this.btnStatus.leftBtn = -1;
        this.btnLabels.rightBtn = "确定";
        this.btnLabels.leftBtn = "";
        this.rightBtnClickEffect = this.backLayerBoundaryWidth + "rpx";
        this.leftBtnClickEffect = "0rpx";
      } else {
        // 按钮进入等待确认状态，再次点击执行btnFn函数
        this.recover();
        return this.btns.rightBtn.btnFn(this, this.item);
      }
    },
    resetBtn: function() {
      this.btnLabels.leftBtn = this.btns.leftBtn.label(this);
      this.btnLabels.rightBtn = this.btns.rightBtn.label(this);
      this.btnBackgroundColors.leftBtn = this.btns.leftBtn.style.backgroundColor(
        this
      );
      this.btnBackgroundColors.rightBtn = this.btns.rightBtn.style.backgroundColor(
        this
      );
    }
  }
};
</script>
<style lang="scss">
.table-view-cell {
  position: relative;
  width: 100%;
  border-bottom: 1px solid lightgray;
}
.front-layer {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 11;
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.back-layer {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background-color: white;
  .left-btn {
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  .right-btn {
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
}
</style>


