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

<style lang="scss">
// wrap all contents in the container div
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.separator-bold {
  width: 100%;
  height: 40rpx;
  background-color: lightgrey;
  opacity: 0.6;
  margin-top: 5rpx;
  margin-bottom: 20rpx;
}

.separator {
  width: 95%;
  height: 3rpx;
  background-color: lightgrey;
  margin-top: 10rpx;
  margin-left: 20rpx;
  opacity: 0.6;
  margin-right: 20rpx;
  margin-bottom: 10rpx;
}

// placeholder style for input field
.pl {
  font-size: 30rpx;
  font-family: Arial, Helvetica, sans-serif;
  color: lightgray;
  opacity: 0.8;
}

// wrap input field and form in basicInfo div
.basicInfo {
  margin-top: 40rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.btn-wrapper {
  margin-top: 40rpx;
  width: 400rpx;
  height: 100rpx;
}

.btn-wrapper-small {
  margin-top: 20rpx;
  width: 100;
  height: 25rpx;
}

/* this rule will be remove */
/* * {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
} */
</style>
