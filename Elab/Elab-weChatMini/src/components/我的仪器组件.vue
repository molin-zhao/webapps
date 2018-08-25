<template>
<div>
  <div class="myEquipment">
    <div class="thumb">
        <img :src="equipment.image" class="image">
    </div>
    <div class="equipment">
        <div class="equipmentName">
            <p>{{equipment.name}}</p>
        </div>
        <div class="options">
            <div class="ifAvailable" @click="改变状态(equipment)">
                <div class="available" style="background-image: url('/static/images/切图/个人仪器列表/dk.png')" v-if="equipment.available"><span>开放</span></div>
                <div class="unavailable" style="background-image: url('/static/images/切图/个人仪器列表/gb.png')" v-else><span>关停</span></div>
            </div>
            <div class="edit" @click="编辑我的仪器(equipment)">
                <img src="/static/images/切图/个人仪器列表/bj.png" model="scaleToFill">
                <p>编辑</p>
            </div>
        </div>
    </div>
  </div>
  <div class="separator"></div>
</div>
</template>
<script>
export default {
  props: ["equipment"],
  methods: {
    改变状态: function(equipment) {
      equipment.available = !equipment.available;
    },
    编辑我的仪器: function(equipment) {
      console.log("编辑我的仪器 " + equipment.name);
    }
  }
};
</script>
<style>
.myEquipment {
  width: 100%;
  height: 30vw;
  margin-top: 5rpx;
}

.thumb {
  width: 28vw;
  height: 28vw;
  float: left;
  margin-left: 20rpx;
  margin-top: 20rpx;
}
.image {
  width: 80%;
  height: 80%;
}

.equipment {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  margin-right: 20rpx;
}

.equipmentName {
  margin-top: 20rpx;
  font-size: 30rpx;
}

.ifAvailable {
  width: 80rpx;
  height: 50rpx;
  float: left;
  margin-left: 10rpx;
}

.ifAvailable > div {
  margin-top: 20rpx;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100%;
  font-size: 20rpx;
  color: aliceblue;
  align-content: center;
  align-items: center;
}

.ifAvailable > div > div {
  align-content: center;
  align-items: center;
}
.available > span {
  margin: auto;
  margin-left: 10rpx;
}

.unavailable > span {
  margin: auto;
  margin-left: 35rpx;
}

.edit {
  width: 80rpx;
  height: 50rpx;
  float: right;
  margin-top: 20rpx;
  margin-right: 20rpx;
}

.edit > img {
  width: 30rpx;
  height: 30rpx;
  float: left;
}

.edit > p {
  color: #6cb7f1;
  font-size: 20rpx;
  float: right;
}
</style>
