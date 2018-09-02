<template>
  <div class="simple-selection">
    <div class="simple-selection-wrapper" @click="Cell点击事件()">
      <div v-if="options[option.id].checked" class="simple-selection-checked">
        <p>{{option.description}}</p>
        <img model="aspectFit" src="/static/images/res/moveInLabRequest2/r.png">
      </div>
      <div v-else class="simple-selection-unchecked">
        <p>{{option.description}}</p>
      </div>
    </div>
    <div class="separator"></div>
  </div>
</template>
<script>
export default {
  props: ["option", "click_fn", "options"],
  methods: {
    Cell点击事件: function() {
      return this.click_fn(this.option);
    }
  }
};
</script>
<style lang="scss">
.simple-selection {
  margin-top: 20rpx;
  width: 90%;
  height: 60rpx;
  display: flex;
  flex-direction: column;
  margin-bottom: 20rpx;
  .simple-selection-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 50rpx;
    .simple-selection-checked {
      width: 100%;
      height: 100%;
      p {
        margin-left: 10rpx;
        font-size: 25rpx;
        color: #6cb7f1;
        float: left;
      }
      img {
        width: 20rpx;
        height: 20rpx;
        margin-right: 10rpx;
        float: right;
      }
    }
    .simple-selection-unchecked {
      width: 100%;
      height: 100%;
      p {
        margin-left: 10rpx;
        font-size: 25rpx;
        color: black;
        float: left;
      }
    }
  }
}
</style>


