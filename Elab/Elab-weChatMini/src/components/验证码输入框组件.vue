<template>
    <div class="input-sim">
        <div class="input-sim-wrapper">
            <input placeholder-class="pl" :placeholder="holder">
            <span>|</span>
            <button v-if='!sendVerificationCode' @click="获取验证码()">{{btn_text}}</button>
            <button v-else @click="获取验证码()" disabled>{{btn_text}}</button>
        </div>
        <div v-if="separator" class="separator"></div>
    </div>
</template>
<script>
export default {
  props: ['holder', 'separator'],
  data () {
    return {
      counter: 60,
      sendVerificationCode: false,
      btn_text: '获取验证码'
    }
  },
  methods: {
    counterStart: function () {
      this.sendVerificationCode = true
      this.btn_text = '重新发送(' + this.counter + ')'
      let interval = setInterval(() => {
        this.counter--
        this.btn_text = '重新发送(' + this.counter + ')'
        if (this.counter === 0) {
          clearInterval(interval)
          this.btn_text = '获取验证码'
          this.counter = 60
          this.sendVerificationCode = false
        }
      }, 1000)
    },
    获取验证码: function () {
      console.log('获取验证码')
      this.counterStart()
    }
  }
}
</script>
<style lang="scss">
.input-sim {
  width: 100%;
  height: 80rpx;
  margin-top: 20rpx;
  margin-bottom: 5rpx;
  display: flex;
  flex-direction: column;
  .input-sim-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10rpx;
    input {
      width: 60%;
      height: 30rpx;
      margin-left: 30rpx;
    }
    span {
      color: lightgray;
      font-size: 35rpx;
      opacity: 0.6;
      margin: auto;
      margin-left: 10rpx;
      margin-right: 10rpx;
    }
    button {
      height: 22;
      margin: auto;
      margin-left: 20rpx;
      font-size: 20rpx;
      color: #6cb7f1;
    }
  }
}
</style>


