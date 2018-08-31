<template>
  <div class="container">
    <div class="header">
      <img src="/static/images/切图/实验室管理的主菜单页面/tt_02.png" mode="scaleToFill">
      <div class="header-description">
        <p class="description-header">仪器预约</p>
        <p class="description-content">使实验室的安排更加的高效</p>
        <button @click="立即预约()" class="description-button">立即预约</button>
      </div>
    </div>
    <div class="toolManagement">
      <p>仪器管理</p>
      <div>
        <div class="card" @click="我的仪器()">
          <img src="/static/images/切图/实验室管理的主菜单页面/yq.png">
          <p>我的仪器</p>
        </div>
        <div class="card" @click="人员分配()">
          <img src="/static/images/切图/实验室管理的主菜单页面/ry.png">
          <p>人员分配</p>
        </div>
      </div>
    </div>
    <div class="separator-bold"></div>
    <div class="labManagement">
      <p>实验室管理</p>
      <div>
        <div class="card" @click="人员审核()">
          <img src="/static/images/切图/实验室管理的主菜单页面/rs.png">
          <p>人员审核</p>
        </div>
        <div class="card" @click="实验室成员()">
          <img src="/static/images/切图/实验室管理的主菜单页面/syy.png">
          <p>实验室成员</p>
        </div>
        <div class="card" @click="仪器审核()">
          <img src="/static/images/切图/实验室管理的主菜单页面/ys.png">
          <p>仪器审核</p>
        </div>
        <div class="card" @click="基本信息设置()">
          <img src="/static/images/切图/实验室管理的主菜单页面/sz.png">
          <p>基本信息设置</p>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  methods: {
    我的仪器: function () {
      console.log('我的仪器')
      wx.navigateTo({
        url: '/pages/myEquipments/main'
      })
    },
    人员分配: function () {
      console.log('人员分配')
      wx.navigateTo({
        url: '/pages/groupMemberAlloc/main'
      })
    },
    人员审核: function () {
      console.log('人员审核')
      wx.navigateTo({
        url: '/pages/labMemberApprovement/main'
      })
    },
    立即预约: function () {
      console.log('立即预约')
      wx.navigateTo({
        url: '/pages/toolAppointment/main'
      })
    },
    实验室成员: function () {
      console.log('实验室成员')
      wx.navigateTo({
        url: '/pages/labMemberManagement/main'
      })
    },
    仪器审核: function () {
      console.log('仪器审核')
      wx.navigateTo({
        url: '/pages/toolsPersonInCharge/main'
      })
    },
    基本信息设置: function () {
      console.log('基本信息设置')
    }
  }
}
</script>
<style lang="scss">
.card {
  width: 30vw;
  height: 30vw;
  margin-top: 20rpx;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.card > img {
  width: 30%;
  height: 28%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10rpx;
}

.card > p {
  color: #6cb7f1;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10rpx;
  font-size: 25rpx;
}

.toolManagement {
  height: 20%;
  width: 100%;
  margin-top: 20rpx;
}

.toolManagement > p {
  font-size: 35rpx;
  color: #6cb7f1;
  margin-left: 3%;
  margin-top: 5rpx;
}

.labManagement > p {
  font-size: 35rpx;
  color: #6cb7f1;
  margin-left: 3%;
}

.toolManagement > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.labManagement > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.labManagement {
  height: 40%;
  width: 100%;
  margin-top: 20rpx;
}
.header {
  width: 95%;
  height: 250rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 100%;
    height: 90%;
  }
  .header-description {
    position: absolute;
    width: 50%;
    margin-left: 5%;
    margin-top: 5rpx;
    margin-bottom: 5rpx;
    display: flex;
    flex-direction: column;
    align-items: left;
    p {
      color: aliceblue;
    }
  }
}

.description-header {
  font-size: 30rpx;
}

.description-content {
  margin-top: 10rpx;
  font-size: 20rpx;
}

.description-button {
  text-align: center;
  color: cornflowerblue;
  font-size: 20rpx;
  width: 160rpx;
  height: 50rpx;
  margin-left: 0rpx;
  margin-top: 20rpx;
  border-radius: 25rpx;
}
</style>

