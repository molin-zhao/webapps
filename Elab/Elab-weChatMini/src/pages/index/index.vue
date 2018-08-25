<template>
<div class="container">
    <div class="background" style="background-image: url('/static/images/切图/首页/bj.png')">
        <div class="card" @click="registerLab()">
            <img src="/static/images/切图/首页/zc.png" alt="注册">
            <p>实验室注册</p>
        </div>
        <div class="card" @click="settleLab()">
            <img src="/static/images/切图/首页/rz.png" alt="入驻">
            <p>入驻实验室</p>
        </div>
    </div>
</div>
</template>
<script>
export default {
  methods: {
    registerLab: function () {
      console.log('实验室注册')
      wx.navigateTo({
        url: '/pages/labRegisteration/main'
      })
    },
    settleLab: function () {
      console.log('实验室入驻')
    }
  }
}
</script>
<style>
.background {
  width: 100%;
  height: 100%;
  align-items: center;
  background-repeat: no-repeat;
  background-size: 100%;
}

.card {
  width: 40vw;
  height: 40vw;
  margin: auto;
  margin-top: 100rpx;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.card > img {
  width: 80%;
  height: 80%;
  margin: auto;
}

.card > p {
  color: aliceblue;
  margin: auto;
}
</style>

