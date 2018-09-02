<template>
  <div class="container">
    <titleComponent title_src="/static/images/切图/个人仪器列表/yq.png" title_text="我的仪器"></titleComponent>
    <div class="myEquipmentList">
      <myEquipmentComponent :key='equipment.id' v-for='equipment in equipments' :equipment='equipment'></myEquipmentComponent>
    </div>
    <bottom-button-component src="/static/images/切图/个人仪器列表/tj.png" label="添加仪器" :clickFn="addEquipment"></bottom-button-component>
  </div>
</template>
<script>
import titleComponent from "@/components/Title";
import myEquipmentComponent from "@/components/Equipment";
import bottomButtonComponent from "@/components/BottomButton";
export default {
  components: {
    myEquipmentComponent,
    bottomButtonComponent,
    titleComponent
  },
  methods: {
    addEquipment: function() {
      console.log("添加仪器");
    }
  },
  data: function() {
    return {
      equipments: [
        {
          id: 0,
          image: "/static/images/dzc.png",
          name: "电子秤 1000g 物理生物化学专用实验器材",
          available: true
        },
        {
          id: 2,
          image: "/static/images/dzc.png",
          name: "电子秤 1000g 物理生物化学专用实验器材",
          available: false
        },
        {
          id: 3,
          image: "/static/images/dzc.png",
          name: "电子秤 1000g 物理生物化学专用实验器材",
          available: true
        },
        {
          id: 1,
          image: "/static/images/dzc.png",
          name: "电子秤 1000g 物理生物化学专用实验器材",
          available: true
        }
      ]
    };
  }
};
</script>
<style>
.myEquipmentList {
  margin-top: 20rpx;
}
</style>
