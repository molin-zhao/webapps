<template>
    <div class="input-simple">
        <div class="input-simple-wrapper">
            <input placeholder-class="pl" :placeholder="holder">
        </div>
        <div v-if="separator" class="separator"></div>
    </div>
</template>
<script>
export default {
  props: ['holder', 'separator']
}
</script>
<style lang="scss">
.input-simple {
  width: 100%;
  height: 80rpx;
  margin-top: 20rpx;
  margin-bottom: 5rpx;
  display: flex;
  flex-direction: column;
  .input-simple-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10rpx;
    input {
      width: 85%;
      height: 30rpx;
      margin-left: 30rpx;
    }
  }
}
</style>


