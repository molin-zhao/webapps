<template>
  <div class="options">
    <slot></slot>
  </div>
</template>
<script>
export default {
  // 选项为以下格式，包含字段checked，用以表明选项的状态
  // 每个选项可以包含一个id也可以不包含，如果不包含，需要传入index
  /*
  options: [
      {
          id: 0,
          ...
          some data,
          ...
          checked: true
      },
      {
          id:  1,
          ...
          some data,
          ...
          checked: false
      },
      {
          id: 2,
          ...
          some data,
          ...
          checked: true
      },
      ...
  ]
  */
  props: ['options', 'selection'],
  methods: {
    // 根据调用组件时传入的selection条件选项更改所有选项的选中和非选中状态改变
    // selection的参数有三种选择
    // SINGLE -> 单项选择，可以一项不选
    // SINGLE_NOTNULL -> 单项选择，至少选择一项
    // MULTIPLE -> 多项选择，没有限制
    choiceManager: function (option, index) {
      // 首先得到此选项的下标，根据下标改变options数组当中其他选项的状态
      var i = this.options.length
      let checkStatus = option.checked
      if (this.selection === 'SINGLE') {
        // 单项选择，此时该选项为选择状态，其他选项应该为非选择状态
        // 和NOTNULL相比，该条件下此选项在被选中的状态下可以取消选中状态
        // 当该选项未被选中时选择，先将其他选项取消选中
        while (i--) {
          this.options[i].checked = false
        }
        if (checkStatus === false) {
          this.options[index].checked = true
        }
      } else if (this.selection === 'SINGLE_NOTNULL') {
        // 单项选择并且至少有一个选项为选择状态
        // 如果该选项未被选择，则其他项取消选择并将该选项选中
        // 如果该选项已经被选中，则不进行其他操作，保持选中状态
        if (checkStatus === false) {
          while (i--) {
            this.options[i].checked = false
          }
          this.options[index].checked = true
        }
      } else {
        // 此时为多选状态，该条件下选项的状态不受约束，只需要更改当前选项的状态即可
        this.options[index].checked = !this.options[index].checked
      }
    },
    getAllSelectedOptions: function () {
      var selected = []
      var i = this.options.length
      while (i--) {
        if (this.options[i].checked === true) {
          selected.push(this.options[i].description)
        }
      }
      return selected
    }
  }
}
</script>
<style lang="scss">
.options {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>