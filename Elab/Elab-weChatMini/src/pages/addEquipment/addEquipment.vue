<template>
    <div class="container">
        <div class="add-photo">
            <img @click="addEquipmentPhoto()" :src="equipmentImageSrc" model="aspectFit">
            <p>添加仪器照片</p>
        </div>
        <div class="form-content">
            <label-input-component ref="equipmentName" labelName="仪器名称" height="70rpx" :separator="true" category="input" placeholder="请输入仪器名称"></label-input-component>
            <label-input-component ref="equipmentId" labelName="仪器编号" height="70rpx" :separator="true" category="input" placeholder="请输入仪器编号"></label-input-component>
            <label-input-component ref="equipmentBookingModel" labelName="预约模式" height="70rpx" :separator="true" category="radio" :defaultValue="true"></label-input-component>
            <label-input-component ref="equipmentSlotNum" labelName="槽位数" height="70rpx" :separator="true" category="picker" defaultValue="10" :options="slotOptions"></label-input-component>
            <label-input-component ref="equipmentDuration" labelName="单位测试基本时长" height="70rpx" :separator="true" category="picker" defaultValue="15分钟" :options="durationOptions"></label-input-component>
            <label-input-component ref="equipmentDescription" labelName="仪器描述" height="70rpx" category="textarea" placeholder="请输入仪器描述"></label-input-component>
        </div>
        <div class="btn-wrapper">
            <buttonComponent btn_src="/static/images/res/moveInLabRequest2/b1.png" :btn_fn="btnFn" btn_label="确定" font_size="font-size:30rpx"></buttonComponent>
        </div>
        <buttom-modal-component ref="bottomModal" :bindUpperBtnClick="goToPhoto" :bindLowerBtnClick="goToUpload" upperBtnLabel="拍照" lowerBtnLabel="从相册上传">
        </buttom-modal-component>
    </div>
</template>
<script>
import buttomModalComponent from "@/components/ButtomModal";
import buttonComponent from "@/components/Button";
import labelInputComponent from "@/components/LabelInput";
export default {
  data() {
    return {
      equipmentImageSrc: "/static/images/res/addSharedEquipment/j.png",
      slotOptions: [10, 9, 8, 7, 6, 5, 4, 3],
      durationOptions: ["15分钟", "30分钟", "45分钟", "60分钟", "90分钟"]
    };
  },
  components: {
    labelInputComponent,
    buttonComponent,
    buttomModalComponent
  },
  methods: {
    addEquipmentPhoto: function() {
      this.$refs.bottomModal.showModal();
    },
    btnFn: function() {
      console.log("确定");
      let equipmentInfo = {
        img: this.equipmentImageSrc,
        name: this.$refs.equipmentName.getInputValue(),
        id: this.$refs.equipmentId.getInputValue(),
        shared: this.$refs.equipmentBookingModel.getInputValue(),
        slotNum: this.$refs.equipmentSlotNum.getInputValue(),
        duration: this.$refs.equipmentDuration.getInputValue(),
        description: this.$refs.equipmentDescription.getInputValue()
      };
      console.log(equipmentInfo);
      wx.showToast({
        title: "仪器添加成功",
        icon: "success",
        duration: 3000,
        success: () => {
          setTimeout(function() {
            wx.redirectTo({
              url: "/pages/labManagement/main"
            });
          }, 3000);
        }
      });
    },
    goToPhoto: function() {
      wx.chooseImage({
        count: 1,
        sizeTyle: ["compressed"],
        sourceType: ["camera"],
        success: res => {
          this.equipmentImageSrc = res.tempFilePaths[0];
        },
        fail: () => {
          console.log("获取图片失败");
        }
      });
      this.$refs.bottomModal.hideModal();
    },
    goToUpload: function() {
      wx.chooseImage({
        count: 1,
        sizeTyle: ["compressed"],
        sourceType: ["album"],
        success: res => {
          this.equipmentImageSrc = res.tempFilePaths[0];
        },
        fail: () => {
          console.log("获取图片失败");
        }
      });
      this.$refs.bottomModal.hideModal();
    }
  }
};
</script>
<style lang="scss">
.add-photo {
  width: 100%;
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    border: solid 0.5rpx #bbbbbb;
    border-radius: 10rpx;
    width: 200rpx;
    height: 200rpx;
    margin-top: 20rpx;
  }
  p {
    margin-top: 30rpx;
    color: #bbbbbb;
    font-size: 25rpx;
  }
}
</style>

