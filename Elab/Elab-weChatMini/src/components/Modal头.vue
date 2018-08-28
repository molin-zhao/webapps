<template>
    <div class="modal-header">
        <slot></slot>
        <div v-if="separator" class="separator"></div>
    </div>
</template>
<script>
export default {
  props: ["separator"]
};
</script>
<style lang="scss">
.modal-header {
  margin-top: 40rpx;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>