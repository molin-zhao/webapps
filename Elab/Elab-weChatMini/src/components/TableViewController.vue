<template>
    <div class="table-view-controller">
        <slot></slot>
    </div>
</template>
<script>
export default {
  data () {
    return {
      activeCells: []
    }
  },
  props: ['items'],
  methods: {
    addActiveCell: function (index) {
      this.activeCells.push(index)
    },
    recoverActiveCells: function (allCellsArr, index) {
      while (this.activeCells.length > 0) {
        allCellsArr[this.activeCells.shift()].recover()
      }
    }
  }
}
</script>
<style lang="scss">
.table-view-controller {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
  justify-content: flex-start;
}
</style>


