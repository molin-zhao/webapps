<template>
  <div class="container">
    <titleComponent title_src="/static/images/res/labMember/cl.png" title_text="材料实验室"></titleComponent>
    <subTitleComponent subTitle_src="/static/images/res/labMember/xt.png" subTitle_text="四川大学 高分子学院"></subTitleComponent>
    <div class="basicInfo">
      <simple-input-component holder="请输入姓名" :separator="true"></simple-input-component>
      <picker-input-component ref="rolePicker" holder="请选择管理员身份" :separator="true" :click_fn="rolePickerOnClickFn"></picker-input-component>
      <picker-input-component holder="请选择时间" :separator="true" :click_fn="_test"></picker-input-component>
      <sim-code-component holder="请输入管理员手机号" :separator="true"></sim-code-component>
      <simple-input-component holder="请输入验证码" :separator="true"></simple-input-component>
    </div>
    <div class="btn-wrapper">
      <button-component btn_src="/static/images/res/moveInLabRequest2/b1.png" :btn_fn=pageBtnOnClickFn btn_label="确定" font_size="font-size:30rpx"></button-component>
    </div>
    <modal-component ref="modalComponent">
      <modal-header-component :separator="false">
        <p style="font-size: 30rpx;">选择管理员身份</p>
      </modal-header-component>
      <modal-content-component :separator="false">
        <option-controller-component ref="optionController" selection="single_notnull" :options="options">
          <simple-selection-component :key='option.id' v-for='option in options' :option="option" :options='options' :click_fn="modalSelectionCellOnClickFn"></simple-selection-component>
        </option-controller-component>
      </modal-content-component>
      <modal-footer-component>
        <div class="btn-wrapper" style="margin-top:-30rpx; margin-bottom:20rpx;">
          <buttonComponent btn_src="/static/images/res/moveInLabRequest2/b1.png" :btn_fn=modalBtnOnClickFn btn_label="确定" font_size="font-size:30rpx"></buttonComponent>
        </div>
      </modal-footer-component>
    </modal-component>
  </div>
</template>
<script>
import titleComponent from "@/components/Title";
import subTitleComponent from "@/components/SubTitle";
import simpleInputComponent from "@/components/NormalInput";
import pickerInputComponent from "@/components/PickerInput";
import simCodeComponent from "@/components/SimCodeInput";
import buttonComponent from "@/components/Button";
import modalComponent from "@/components/Modal";
import modalHeaderComponent from "@/components/ModalHeader";
import modalContentComponent from "@/components/ModalContent";
import modalFooterComponent from "@/components/ModalFooter";
import optionControllerComponent from "@/components/SelectionController";
import simpleSelectionComponent from "@/components/NormalSelection";
import { test } from "@/utils/utils";
export default {
  data() {
    return {
      options: [
        {
          id: 0,
          description: "老师",
          checked: false
        },
        {
          id: 1,
          description: "博士生",
          checked: false
        },
        {
          id: 2,
          description: "研究生",
          checked: false
        },
        {
          id: 3,
          description: "本科生",
          checked: false
        }
      ]
    };
  },
  components: {
    titleComponent,
    subTitleComponent,
    simpleInputComponent,
    pickerInputComponent,
    simCodeComponent,
    buttonComponent,
    modalComponent,
    modalHeaderComponent,
    modalContentComponent,
    modalFooterComponent,
    optionControllerComponent,
    simpleSelectionComponent
  },
  methods: {
    rolePickerOnClickFn: function() {
      this.$refs.modalComponent.showModal();
    },
    modalBtnOnClickFn: function() {
      this.$refs.rolePicker.renderInput(
        this.$refs.optionController.getCheckedOptions()
      );
      this.$refs.modalComponent.hideModal();
    },
    modalSelectionCellOnClickFn: function(option) {
      this.$refs.optionController.choiceManager(option);
    },
    pageBtnOnClickFn: function() {
      console.log("确定");
      wx.navigateTo({
        url: "/pages/settleInApplicationProcessing/main"
      });
    },
    _test: function() {
      return test();
    }
  }
};
</script>
<style lang="scss">
</style>
