<template>
  <div class="label-input">
    <div class="label" :style="{height: height}">
      <div class="label-name">{{labelName}}</div>
      <div v-if="category === 'input'" class="input">
        <input type="text" placeholder-class="pl" :placeholder="placeholder" v-model="value">
      </div>
      <div v-if="category === 'radio'" class="radio" @click="reservationModelChange()">
        <div v-if="value === ''? defaultValue : value" class="shared">
          <img src="/static/images/res/addSharedEquipment/k.png" model="aspectFit">
          <span>共享</span>
        </div>
        <div v-else class="exclusive">
          <img src="/static/images/res/addSharedEquipment/g.png" model="aspectFit">
          <span>独占</span>
        </div>
      </div>
      <div v-if="category === 'picker'" class="picker" @click="bindOnClick()">
        <div>{{value === ''? defaultValue : value}}</div>
        <img model="scaleToFill" src="/static/images/res/labRegisteration/y.png">
      </div>
      <div v-if="category === 'textarea'" style="width:50%; float:right"></div>
    </div>
    <div v-if="category === 'textarea'" class="textarea">
      <textarea class="textarea-input" :placeholder="placeholder" placeholder-class="pl" maxlength="200" v-model="value"></textarea>
    </div>
    <div v-if="separator" class="separator"></div>

    <!-- modal组件，用来显示picker选项 -->
    <modalComponent ref="pickerModal">
      <modalHeaderComponent :separator="true">
        <p style="font-size: 30rpx;">请选择</p>
      </modalHeaderComponent>
      <modalContentComponent>
        <picker-view-controller-component ref="pickerViewController" dimensions="ONE_DIMENSIONAL" pickerHeight="400rpx" :options="options"></picker-view-controller-component>
      </modalContentComponent>
      <modalFooterComponent>
        <div class="btn-wrapper" style="margin-top:-20rpx; margin-bottom:20rpx;">
          <buttonComponent btn_src="/static/images/res/moveInLabRequest2/b1.png" :btn_fn="pickerModalConfirm" btn_label="确定" font_size="font-size:30rpx"></buttonComponent>
        </div>
      </modalFooterComponent>
    </modalComponent>
  </div>
</template>
<script>
import modalComponent from "@/components/Modal";
import modalHeaderComponent from "@/components/ModalHeader";
import modalContentComponent from "@/components/ModalContent";
import modalFooterComponent from "@/components/ModalFooter";
import pickerViewControllerComponent from "@/components/PickerViewController";
import pickerComponent from "@/components/PickerInput";
import buttonComponent from "@/components/Button";
export default {
  components: {
    modalComponent,
    modalHeaderComponent,
    modalContentComponent,
    modalFooterComponent,
    pickerViewControllerComponent,
    pickerComponent,
    buttonComponent
  },
  data() {
    return {
      value: ""
    };
  },
  mounted() {
    this.value = this.$options.propsData.defaultValue;
  },
  props: [
    "separator",
    "height",
    "labelName",
    "category",
    "placeholder",
    "options",
    "defaultValue"
  ],
  methods: {
    reservationModelChange: function() {
      if (this.value === "") {
        this.value = this.defaultValue;
      }
      this.value = !this.value;
    },
    bindOnClick: function() {
      this.$refs.pickerViewController.setFirstColumnOptions(this.options);
      this.modalTitle = this.labelName;
      this.$refs.pickerModal.showModal();
    },
    pickerModalConfirm: function() {
      this.$refs.pickerModal.hideModal();
      let optionArr = this.$refs.pickerViewController.getAllSelectedOptions();
      this.value = optionArr[0];
    },
    getInputValue: function() {
      return this.value;
    }
  }
};
</script>
<style lang="scss">
.label-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .label {
    width: 95%;
    margin-bottom: 10rpx;
    display: flex;
    flex-direction: row;
    font-size: 30rpx;
    color: #433b39;
    .label-name {
      margin-left: 20prx;
      float: left;
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: left;
    }
    .input {
      margin-right: 20rpx;
      width: 50%;
      float: right;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      margin: auto;
      input {
        text-align: right;
        margin-right: 10rpx;
      }
    }

    .radio {
      width: 50%;
      float: right;
      height: 100%;
      margin: auto;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      .shared {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100rpx;
        height: 100%;
        img {
          width: 90%;
          height: 60%;
        }
        span {
          position: absolute;
          margin-left: 40rpx;
          font-size: 20rpx;
          color: white;
        }
      }
      .exclusive {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100rpx;
        height: 100%;
        img {
          width: 90%;
          height: 60%;
        }
        span {
          position: absolute;
          margin-left: 10rpx;
          font-size: 20rpx;
          color: transparent;
        }
      }
    }
    .picker {
      width: 50%;
      float: right;
      height: 100%;
      margin: auto;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      div {
        color: #666666;
        font-size: 30rpx;
        margin-right: 20rpx;
      }
      img {
        width: 10rpx;
        height: 20rpx;
        float: right;
      }
    }
  }
  .textarea {
    width: 95%;
    height: 250rpx;
    margin-bottom: 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: solid 0.5rpx #bbbbbb;
    border-radius: 10rpx;
    z-index: 0;
    .textarea-input {
      width: 95%;
      margin-top: 20rpx;
      text-align: left;
      font-size: 30rpx;
    }
  }
}
</style>

