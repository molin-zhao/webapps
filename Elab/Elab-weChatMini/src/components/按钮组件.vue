<template>
    <div @click="点击事件()" class="btn">
        <img mode="scaleToFill" :src="btn_src">
        <p :style="font_size">{{btn_label}}</p>
    </div>
</template>
<script>
export default {
  props: ['btn_src', 'btn_label', 'btn_fn', 'font_size', 'data'],
  methods: {
    点击事件: function () {
      return this.btn_fn(this.data)
    }
  }
}
</script>
<style lang="scss">
.btn {
  margin-top: 10%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  img {
    width: 80%;
    height: 80%;
  }
  p {
    position: absolute;
    margin: auto;
    top: 15%;
    color: white;
  }
}
</style>


