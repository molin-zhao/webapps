<template>
    <div @click="点击事件()" class="btn">
        <img mode="scaleToFill" :src="btn_src">
        <p>{{btn_label}}</p>
    </div>
</template>
<script>
export default {
  props: ['btn_src', 'btn_label', 'btn_fn'],
  methods: {
    点击事件: function () {
      return this.btn_fn()
    }
  }
}
</script>
<style lang="scss">
.btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;
  width: 60%;
  height: 80rpx;
  img {
    width: 80%;
    height: 80%;
  }
  p {
    position: absolute;
    margin: auto;
    top: 8rpx;
    font-size: 30rpx;
    color: white;
  }
}
</style>


