<template>
  <div class="container">
    <title-component title_src="/static/images/切图/实验室注册页面/xx.png" title_text="基本信息"></title-component>
    <div class="basicInfo">
      <picker-component holder="请输入学校名称" :separator="true"></picker-component>
      <picker-component holder="请输入学院名称" :separator="true"></picker-component>
      <input-component holder="请输入管理员姓名" :separator="false"></input-component>
      <div class="separator-bold"></div>
      <input-component holder="请输入管理员学号" :separator="true"></input-component>
      <simCodeComponent holder="请输入管理员手机号" :separator="true"></simCodeComponent>
      <input-component holder="请输入验证码" :separator="true"></input-component>
    </div>
    <div class="btn-wrapper">
      <buttonComponent btn_src="/static/images/切图/实验室注册页面/btn1.png" :btn_fn=button_function btn_label="下一步" font_size="font-size:30rpx"></buttonComponent>
    </div>
  </div>
</template>
<script>
import titleComponent from "@/components/Title";
import simCodeComponent from "@/components/SimCodeInput";
import buttonComponent from "@/components/Button";
import pickerComponent from "@/components/PickerInput";
import inputComponent from "@/components/NormalInput";
export default {
  data() {
    return {
      button_function: function() {
        console.log("下一步");
        wx.navigateTo({
          url: "/pages/labManagement/main"
        });
      }
    };
  },
  components: {
    simCodeComponent,
    buttonComponent,
    pickerComponent,
    inputComponent,
    titleComponent
  },
  methods: {}
};
</script>
<style lang="scss">
</style>


