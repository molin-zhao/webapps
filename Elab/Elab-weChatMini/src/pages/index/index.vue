<template>
  <div class="container">
    <div class="background">
      <img src="/static/images/res/index/bj.png" model="scaleToFill">
      <div class="card_1">
        <div class="card" @click="registerLab()">
          <img src="/static/images/res/index/zc.png">
          <p>实验室注册</p>
        </div>
      </div>
      <div class="card_2">
        <div class="card" @click="settleLab()">
          <img src="/static/images/res/index/rz.png">
          <p>入驻实验室</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { compareVersion } from '@/utils/utils'
export default {
  created () {
    let info = wx.getSystemInfoSync()
    let systemInfo = info.system
    let versionArr = systemInfo.split(' ')
    let systemVersion = versionArr[0]
    let version = versionArr[1]
    if (systemVersion === 'iOS' && compareVersion('11.1.0', version) > 0) {
      console.log('here')
      wx.showToast({
        title: 'IOS版本号低于11.1.0 请升级',
        icon: 'none',
        duration: 2000
      })
    }
  },
  methods: {
    registerLab: function () {
      console.log('实验室注册')
      wx.navigateTo({
        url: '/pages/labRegisteration/main'
      })
    },
    settleLab: function () {
      console.log('实验室入驻')
      wx.navigateTo({
        url: '/pages/labGroupMemberRequest/main'
      })
    }
  }
}
</script>
<style lang="scss">
.background {
  width: 100%;
  height: 100%;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
  }
  .card_1 {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    position: absolute;
    margin: auto;
    top: 100rpx;
  }
  .card_2 {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    position: absolute;
    margin: auto;
    top: 500rpx;
  }
}

.card {
  width: 40vw;
  height: 40vw;
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

