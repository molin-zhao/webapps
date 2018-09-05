<template>
  <div class="picker">
    <picker-view class="picker-view" indicator-style="height:45rpx" :style="{height: pickerHeight}" @change="pickerValueChange">
      <div class="picker-view-wrapper">
        <picker-view-column v-if="firstColumnOptions.length > 0">
          <div class="option" v-for="(option, index) in firstColumnOptions" :key="index">{{option}}</div>
        </picker-view-column>
        <picker-view-column v-if="secondColumnOptions.length > 0">
          <div class="option" v-for="(option, index) in secondColumnOptions" :key="index">{{option}}</div>
        </picker-view-column>
      </div>
    </picker-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
      firstColumnOptions: [],
      secondColumnOptions: [],
      pickValue: [0, 0]
    }
  },
  mounted () {
    let props = this.$options.propsData
    if (typeof props.options === 'undefined') {
      this.firstColumnOptions = []
      this.secondColumnOptions = []
    } else {
      if (props.dimensions === 'TWO_DIMENSIONAL') {
        this.firstColumnOptions = props.options[0]
        this.secondColumnOptions = props.options[1][0]
      } else {
        this.firstColumnOptions = props.options
        this.secondColumnOptions = []
      }
    }
  },
  props: ['pickerHeight', 'options', 'dimensions'],
  methods: {
    pickerValueChange: function (e) {
      let currentValue = e.mp.detail.value
      if (this.pickValue[0] !== currentValue[0]) {
        // 第一列发生滚动，值发生了改变，此时改变第二列内容
        if (this.dimensions === 'TWO_DIMENSIONAL') {
          // 如果有第二列
          this.secondColumnOptions = this.options[1][currentValue[0]]
        }
      }
      this.pickValue = currentValue
    },
    getAllSelectedOptions: function () {
      if (this.dimensions === 'TWO_DIMENSIONAL') {
        // 如果是二维数组
        let firstColVal = this.firstColumnOptions[this.pickValue[0]]
        let secondColVal = this.secondColumnOptions[this.pickValue[1]]
        let selectedOptions = [firstColVal, secondColVal]
        return selectedOptions
      }
      // 一维数组
      let selectedOptions = [this.firstColumnOptions[this.pickValue[0]]]
      return selectedOptions
    },
    getPickValue: function () {
      return this.pickValue
    },
    setFirstColumnOptions: function (options) {
      this.firstColumnOptions = options
    },
    setSecondColumnOptions: function (options) {
      this.secondColumnOptions = options
    }
  }
}
</script>
<style lang="scss">
.picker {
  width: 100%;
  height: 100%;
  .picker-view {
    width: 100%;
    .picker-view-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .option {
        font-size: 25rpx;
        color: #6cb7f1;
        line-height: 30rpx;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>


