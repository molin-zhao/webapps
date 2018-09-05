<template>
    <div class="container">
        <subTitleComponent subTitle_src="/static/images/res/labMember/xt.png" subTitle_text="仪器描述"></subTitleComponent>
        <div class="textarea">
            <textarea class="textarea-input" ref="textareaInput" placeholder="请输入仪器描述（最多300字）" placeholder-class="pl" maxlength="300" v-model="value"></textarea>
        </div>
        <div class="btn-wrapper" style="margin-top:50rpx">
            <buttonComponent btn_src="/static/images/res/moveInLabRequest2/b1.png" :btn_fn="textareaConfirm" btn_label="确定" font_size="font-size:30rpx"></buttonComponent>
        </div>
    </div>
</template>
<script>
import subTitleComponent from "@/components/SubTitle";
import buttonComponent from "@/components/Button";
export default {
  components: {
    subTitleComponent,
    buttonComponent
  },
  mounted() {
    try {
      this.value = wx.getStorageSync("equipmentDescription");
    } catch (e) {
      this.value = "";
    }
  },
  data() {
    return {
      value: ""
    };
  },
  methods: {
    getTextareaValue: function() {
      return this.value;
    },
    setTextareaValue: function(textVal) {
      this.value = textVal;
    },
    textareaConfirm: function() {
      if (this.value !== "") {
        wx.setStorage({
          key: "equipmentDescription",
          data: this.value,
          success: function() {
            wx.showToast({
              title: "描述已保存",
              duration: 3000,
              icon: "success",
              success: function() {
                setTimeout(function() {
                  wx.navigateBack();
                }, 3000);
              }
            });
          }
        });
      } else {
        wx.navigateBack();
      }
    }
  }
};
</script>
<style lang="scss">
.textarea {
  margin-top: 80rpx;
  width: 90%;
  height: 500rpx;
  margin-bottom: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 0.5rpx #bbbbbb;
  border-radius: 10rpx;
  .textarea-input {
    width: 95%;
    height: 100%;
    margin-top: 20rpx;
    text-align: left;
    font-size: 30rpx;
  }
}
</style>

