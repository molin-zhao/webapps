<template>
<div class="container">
  <div class="title">
    <img src="/static/images/切图/个人仪器列表/yq.png">
    <p>我的仪器</p>
  </div>
  <div class="myEquipmentList">
    <myEquipmentComponent :key='equipment.id' v-for='equipment in equipments' :equipment='equipment'></myEquipmentComponent>
  </div>
  <div class="addingNewEquipment" @click="添加仪器()">
    <div>
    <img src="/static/images/切图/个人仪器列表/tj.png" model="scaleToFill">
    <p>添加仪器</p>
    </div>
  </div>
</div>
</template>
<script>
import myEquipmentComponent from '@/components/我的仪器组件'
export default {
  components: {
    myEquipmentComponent
  },
  methods: {
    添加仪器: function () {
      console.log('添加仪器')
    }
  },
  data: function () {
    return {
      equipments: [
        {
          id: 0,
          image: '/static/images/dzc.png',
          name: '电子秤 1000g 物理生物化学专用实验器材',
          available: true
        },
        {
          id: 2,
          image: '/static/images/dzc.png',
          name: '电子秤 1000g 物理生物化学专用实验器材',
          available: false
        },
        {
          id: 3,
          image: '/static/images/dzc.png',
          name: '电子秤 1000g 物理生物化学专用实验器材',
          available: true
        },
        {
          id: 1,
          image: '/static/images/dzc.png',
          name: '电子秤 1000g 物理生物化学专用实验器材',
          available: true
        }
      ]
    }
  }
}
</script>
<style>
.myEquipmentList {
  margin-top: 20rpx;
}
.addingNewEquipment {
  width: 100%;
  height: 100rpx;
  position: fixed;
  bottom: 0rpx;
  background-color: #6cb7f1;
  align-items: center;
}
.addingNewEquipment > div {
  width: 40%;
  height: 80%;
  margin: auto;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
  align-items: center;
}

.addingNewEquipment > div > p {
  font-size: 30rpx;
  color: azure;
  float: right;
  margin-right: 25%;
  margin-top: 15rpx;
}

.addingNewEquipment > div > img {
  width: 30rpx;
  height: 30rpx;
  margin: auto;
  float: left;
  margin-top: 20rpx;
  margin-left: 25%;
}
</style>
