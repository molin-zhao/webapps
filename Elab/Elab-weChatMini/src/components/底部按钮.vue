<template>
    <div class="addingNewEquipment" @click="点击事件()">
        <div v-if="src" class="with-image">
            <img :src="src" model="scaleToFill">
            <p>{{label}}</p>
        </div>
        <div v-else class="without-image">
            <p>{{label}}</p>
        </div>
    </div>
</template>
<script>
export default {
  props: ["label", "clickFn", "data", "src"],
  methods: {
    点击事件: function() {
      return this.clickFn(this.data);
    }
  }
};
</script>
<style lang="scss">
.addingNewEquipment {
  width: 100%;
  height: 100rpx;
  position: fixed;
  bottom: 0rpx;
  background-color: #6cb7f1;
  align-items: center;
  .with-image {
    width: 40%;
    height: 80%;
    margin: auto;
    margin-top: 10rpx;
    margin-bottom: 10rpx;
    align-items: center;
    p {
      font-size: 30rpx;
      color: azure;
      float: right;
      margin-right: 25%;
      margin-top: 15rpx;
    }
    img {
      width: 30rpx;
      height: 30rpx;
      margin: auto;
      float: left;
      margin-top: 20rpx;
      margin-left: 25%;
    }
  }
  .without-image {
    width: 40%;
    height: 80%;
    margin: auto;
    margin-top: 10rpx;
    margin-bottom: 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      font-size: 30rpx;
      color: azure;
      margin-top: 15rpx;
      margin: auto;
    }
  }
}
</style>


