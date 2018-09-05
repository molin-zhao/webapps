<template>
  <div class="input-selection">
    <div class="input-selection-wrapper" @click="bindClick()">
      <input placeholder-class="pl" :placeholder="holder" disabled v-model="selection"><img model="scaleToFill" src="/static/images/res/labRegisteration/y.png">
    </div>
    <div v-if="separator" class="separator"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selection: ''
    }
  },
  props: ['holder', 'separator', 'bindOnClick', 'bindData'],
  methods: {
    renderInput: function (options) {
      if (options.length === 0) {
        this.selection = ''
      } else {
        this.selection = options[options.length - 1]
      }
    },
    bindClick: function () {
      return this.bindOnClick(this.bindData)
    }
  }
}
</script>
<style lang="scss">
.input-selection {
  width: 100%;
  height: 80rpx;
  margin-top: 20rpx;
  margin-bottom: 5rpx;
  display: flex;
  flex-direction: column;
  .input-selection-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10rpx;
    input {
      width: 85%;
      height: 30rpx;
      margin-left: 30rpx;
    }
    img {
      height: 25rpx;
      width: 15rpx;
      float: right;
      margin-right: 10rpx;
    }
  }
}
</style>