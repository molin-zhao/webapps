<template>
    <div class="modal-content">
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
.modal-content {
  margin-top: 20rpx;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

