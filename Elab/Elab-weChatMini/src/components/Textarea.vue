<template>
  <div class="textarea" :style="{height: height}">
    <textarea class="textarea-input" ref="textareaInput" :placeholder="placeholder" placeholder-class="pl" maxlength="300" v-model="value"></textarea>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: '',
      placeholder: ''
    }
  },
  props: ['placeholder', 'height'],
  methods: {
    getTextareaValue: function () {
      return this.value
    },
    setTextareaPlaceholder: function (placeholder) {
      this.placeholer = placeholder
    },
    setTextareaValue: function (textVal) {
      this.value = textVal
    }
  }
}
</script>
<style lang="scss">
.textarea {
  width: 95%;
  margin-bottom: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 0.5rpx #bbbbbb;
  border-radius: 10rpx;
  z-index: 20;
  .textarea-input {
    width: 95%;
    height: 100%;
    margin-top: 20rpx;
    text-align: left;
    font-size: 30rpx;
    z-index: 100;
  }
}
</style>

