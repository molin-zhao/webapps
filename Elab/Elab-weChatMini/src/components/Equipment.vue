<template>
  <div>
    <div class="myEquipment">
      <div class="thumb">
        <img model="aspectFit" :src="equipment.image" class="image">
      </div>
      <div class="equipment">
        <div class="equipmentName">
          <p>{{equipment.name}}</p>
        </div>
        <div class="options">
          <div class="ifAvailable" @click="改变状态(equipment)">
            <div class="available" v-if="equipment.available">
              <img src="/static/images/res/individualEquipmentList/dk.png" model="scaleToFill">
              <span>开放</span>
            </div>
            <div class="unavailable" v-else>
              <img src="/static/images/res/individualEquipmentList/gb.png" model="scaleToFill">
              <span>关停</span>
            </div>
          </div>
          <div class="edit" @click="编辑我的仪器(equipment)">
            <img src="/static/images/res/individualEquipmentList/bj.png" model="scaleToFill">
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
<style lang="scss">
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
  div {
    margin-top: 20rpx;
    width: 100%;
    height: 100%;
    font-size: 20rpx;
    color: aliceblue;
    align-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 70%;
    }
  }
}

.available > span {
  font-size: 18rpx;
  position: absolute;
  margin-top: 5rpx;
  margin-left: -70rpx;
}

.unavailable > span {
  margin-top: 5rpx;
  font-size: 18rpx;
  position: absolute;
  margin-left: -45rpx;
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
