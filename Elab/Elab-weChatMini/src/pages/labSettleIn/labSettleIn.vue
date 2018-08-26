<template>
    <div class="container">
        <button v-if="!userInfo" class="btn" open-type="getUserInfo" @getuserinfo="onGetUserInfo" @click="getUserInfo()">获取用户信息</button>
        <button v-else class="btn" disabled>获取用户信息</button> 
        <div v-if="userInfo">
            <p>用户已经授权</p>
            <img :src="userInfo.avatarUrl" model="scaleToFill">
            <p>用户昵称：{{userInfo.nickName}}</p>
            <p>省份：{{userInfo.province}}</p>
            <p>城市：{{userInfo.city}}</p>
            <p>国家：{{userInfo.country}}</p>
        </div>
        <div v-else>
            <p>用户暂未授权</p>
        </div>
   </div>
</template>
<script>
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = wx.getStorageSync('userInfo')
  },
  methods: {
    getUserInfo () {
      // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
      // console.log(wx.canIUse('button.open-type.getUserInfo'))
      if (!wx.canIUse('button.open-type.getUserInfo')) {
        // 用户版本不可用
        console.log('请升级微信版本')
      }
    },
    onGetUserInfo: function (e) {
      if (e.mp.detail.rawData) {
        console.log('用户允许授权')
        console.log(e.mp.detail.userInfo)
        this.userInfo = e.mp.detail.userInfo
      } else {
        console.log('用户取消授权')
      }
    }
  }
}
</script>
<style lang="scss">
.btn {
  width: 300rpx;
  height: 80rpx;
  font-size: 35rpx;
}

.container {
  div {
    margin-top: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50rpx;
    }
    p {
      margin-top: 10rpx;
      font-size: 30rpx;
      color: cornflowerblue;
      margin-bottom: 10rpx;
    }
  }
}
</style>


