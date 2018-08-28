<template>
    <div class="option-middleware" @click="点击事件()" :option="option">
        <slot></slot>
    </div>
</template>
<script>
export default {
  props: ["option", "onClickFn"],
  method: {
    点击事件: function() {
      return this.onClickFn(this.option);
    }
  }
};
</script>
<style lang="scss">
.option-middleware {
  width: 100%;
}
</style>

