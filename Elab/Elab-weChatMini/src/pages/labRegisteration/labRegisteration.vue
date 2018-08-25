<template>
    <div class="container">
        <div class="title">
            <img src="/static/images/切图/实验室注册页面/xx.png">
            <p>基本信息</p>
        </div>
        <div class="basicInfo">
            <div class="input-wrapper-selection">
                <input placeholder-class="pl" placeholder="请选择高校名称"><img model="scaleToFill" src="/static/images/切图/实验室注册页面/y.png">
            </div>
            <div class="separator"></div>
            <div class="input-wrapper-selection">
                <input placeholder-class="pl" placeholder="请选择学院名称"><img model="scaleToFill"  src="/static/images/切图/实验室注册页面/y.png">
            </div>
            <div class="separator"></div>
            <input placeholder-class="pl" placeholder="请输入实验室名称">
            <div class="separator"></div>
            <input placeholder-class="pl" placeholder="请输入管理员姓名">
            <div class="separator-bold"></div>
            <input placeholder-class="pl" placeholder="请输入管理员学号">
            <div class="separator"></div>
            <input placeholder-class="pl" placeholder="请输入管理员手机号">
            <div class="separator"></div>
            <div class="input-wrapper-sim">
                <input placeholder-class="pl" placeholder="请输入验证码"><span>|</span><button v-if='!sendVerificationCode' @click="获取验证码()">{{btn_text}}</button><button v-else @click="获取验证码()" disabled>{{btn_text}}</button>
            </div>
            <div class="separator"></div>
        </div>
        <div class="btn">
            <button hover-class="btn-hover" @click="点击下一步()" style="background-image: url('/static/images/切图/实验室注册页面/btn1.png')">下一步</button>
        </div>
    </div>
</template>
<script>
// var counter = 60;
// var sendVerificationCode = false;
// var btn_text = "获取验证码";
export default {
  data() {
    return {
      counter: 60,
      sendVerificationCode: false,
      btn_text: "获取验证码"
    };
  },
  methods: {
    counterStart: function() {
      this.sendVerificationCode = true;
      this.btn_text = "重新发送(" + this.counter + ")";
      let interval = setInterval(() => {
        this.counter--;
        this.btn_text = "重新发送(" + this.counter + ")";
        console.log(this.counter);
        if (this.counter === 0) {
          clearInterval(interval);
          this.btn_text = "获取验证码";
          this.counter = 60;
          this.sendVerificationCode = false;
        }
      }, 1000);
    },
    获取验证码: function() {
      console.log("获取验证码");
      this.counterStart();
    },
    点击下一步: function() {
      console.log("下一步");
    }
  }
};
</script>
<style>
.basicInfo {
  margin-top: 40rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.pl {
  font-size: 30rpx;
  font-family: Arial, Helvetica, sans-serif;
  color: lightgray;
  opacity: 0.8;
}

.basicInfo > input {
  margin-left: 30rpx;
  margin-top: 20rpx;
  height: 35rpx;
}

.input-wrapper-selection {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.input-wrapper-selection > input {
  width: 85%;
  height: 35rpx;
  margin-left: 30rpx;
  margin-top: 20rpx;
}

.input-wrapper-selection > img {
  height: 25rpx;
  width: 15rpx;
  float: right;
  margin-right: 10rpx;
  margin-top: 10rpx;
}

.input-wrapper-sim {
  display: flex;
  flex-direction: row;
  margin-left: 30rpx;
  align-items: center;
}

.input-wrapper-sim > input {
  width: 60%;
  height: 35rpx;
  margin-top: 20rpx;
}

.input-wrapper-sim > span {
  color: lightgray;
  opacity: 0.6;
  height: 35rpx;
  margin-left: 20rpx;
  margin-right: 10rpx;
}

.input-wrapper-sim > button {
  margin-left: 20rpx;
  font-size: 25rpx;
  color: #6cb7f1;
  margin-top: 10rpx;
}

.btn {
  margin-top: 60rpx;
  width: 60%;
  height: 50rpx;
}

.btn > button {
  color: white;
  background-size: 100%;
  background-repeat: no-repeat;
  border: none;
  background-color: transparent;
  margin-top: 10rpx;
  font-size: 30rpx;
}

.btn > button::after {
  border: none;
}

.btn-hover {
  width: 98%;
}
</style>


