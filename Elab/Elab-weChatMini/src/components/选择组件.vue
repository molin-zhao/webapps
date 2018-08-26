<template>
    <div class="input-selection">
        <div class="input-selection-wrapper">
            <input placeholder-class="pl" :placeholder="holder"><img model="scaleToFill" src="/static/images/切图/实验室注册页面/y.png">
        </div>
        <div v-if="separator" class="separator"></div>
    </div>
</template>
<script>
export default {
  props: ['holder', 'separator']
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