<template>
  <div class="title">
    <img mode="aspectFit" :src="title_src">
    <p>{{title_text}}</p>
    <p class="title-sfx" v-if="title_sfx">({{title_sfx}})</p>
  </div>
</template>
<script>
export default {
  props: ['title_src', 'title_text', 'title_sfx']
}
</script>
<style lang="scss">
.title {
  width: 100%;
  height: 50rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20rpx;
  p {
    font-size: 40rpx;
    color: #6cb7f1;
    margin-left: 20rpx;
    font-weight: bold;
  }
  img {
    width: 40rpx;
    height: 40rpx;
    margin-left: 20rpx;
  }
  .title-sfx {
    font-size: 35rpx;
    color: #6cb7f1;
    font-weight: normal;
    margin-left: 20rpx;
  }
}
</style>