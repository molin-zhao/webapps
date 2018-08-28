<template>
    <div class="modal-footer">
        <slot></slot>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss">
.modal-footer {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 40rpx;
}
</style>