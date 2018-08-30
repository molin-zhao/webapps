<template>
    <div class="content-title">
        <img mode="aspectFit" :src="contentTitle_src">
        <p>{{contentTitle_text}}</p>
    </div>
</template>
<script>
export default {
  props: ["contentTitle_src", "contentTitle_text"]
};
</script>
<style lang="scss">
.content-title {
  width: 100%;
  height: 40rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20rpx;
  p {
    font-size: 30rpx;
    color: #6cb7f1;
    margin-left: 15rpx;
  }
  img {
    width: 30rpx;
    height: 30rpx;
    margin-left: 20rpx;
  }
}
</style>


