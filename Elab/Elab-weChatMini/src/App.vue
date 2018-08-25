<script>
export default {
  created() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    console.log("app created and cache logs by setStorageSync");
  }
};
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  width: 100%;
  height: 50rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20rpx;
}
.title > p {
  font-size: 40rpx;
  color: #6cb7f1;
  margin-left: 20rpx;
}

.title > img {
  width: 40rpx;
  height: 40rpx;
  margin-left: 20rpx;
}

.separator-bold {
  width: 100%;
  height: 20rpx;
  background-color: lightgrey;
  opacity: 0.6;
  margin-top: 10rpx;
}

.separator {
  width: 95%;
  height: 3rpx;
  background-color: lightgrey;
  margin-top: 10rpx;
  margin-left: 20rpx;
  opacity: 0.6;
  margin-right: 20rpx;
}

/* this rule will be remove */
/* * {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
} */
</style>
