<template>
    <div class="subTitle">
        <img mode="aspectFit" :src="subTitle_src">
        <p>{{subTitle_text}}</p>
    </div>
</template>
<script>
export default {
  props: ['subTitle_src', 'subTitle_text']
}
</script>
<style lang="scss">
.subTitle {
  width: 100%;
  height: 40rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20rpx;
  p {
    font-size: 30rpx;
    color: black;
    opacity: 0.4;
    margin-left: 20rpx;
  }
  img {
    width: 25rpx;
    height: 25rpx;
    margin-left: 20rpx;
  }
}
</style>


