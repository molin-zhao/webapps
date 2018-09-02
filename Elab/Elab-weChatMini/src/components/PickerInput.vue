<template>
    <div class="input-selection">
        <div class="input-selection-wrapper" @click="点击事件()">
            <input placeholder-class="pl" :placeholder="holder" disabled v-model="selection"><img model="scaleToFill" src="/static/images/切图/实验室注册页面/y.png">
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
  props: ['holder', 'separator', 'click_fn', 'data_toggle'],
  methods: {
    renderInput: function (options) {
      if (options.length === 0) {
        this.selection = '未选择'
      } else if (options.length === 1) {
        this.selection = options[0].description
      } else {
        options.forEach(element => {
          this.selection = element.description + ' '
        })
      }
    },
    点击事件: function () {
      return this.click_fn(this.data_toggle)
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