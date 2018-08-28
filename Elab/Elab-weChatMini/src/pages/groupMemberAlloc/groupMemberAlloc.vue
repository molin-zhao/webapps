<template>
    <div class="container">
        <button @click="showModal()">弹出Modal</button>
        <modal-component ref="modalComponent">
          <modal-header-component :separator="false">
            <p style="font-size: 30rpx;">选择管理员身份</p>
          </modal-header-component>
          <modal-content-component :separator="false">
            <option-controller-component ref="optionController" selection="single_notnull" :options="options">
              <simple-selection-component :key='option.id' v-for='option in options' :option="option" :options='options' :click_fn="click_fn"></simple-selection-component>
            </option-controller-component>
          </modal-content-component>
          <modal-footer-component>
            <div class="btn-wrapper" style="margin-top:-30rpx; margin-bottom:20rpx;">
              <btn-component btn_src="/static/images/切图/实验室人员入驻申请2-类别/b1.png" :btn_fn=btn_fn btn_label="确定" font_size="font-size:30rpx"></btn-component>
            </div>
          </modal-footer-component>
        </modal-component>
    </div>
</template>
<script>
import modalComponent from "@/components/Modal弹窗";
import modalHeaderComponent from "@/components/Modal头";
import modalContentComponent from "@/components/Modal内容";
import modalFooterComponent from "@/components/Modal尾";
import btnComponent from "@/components/按钮组件";
import optionControllerComponent from "@/components/单复选控件";
import simpleSelectionComponent from "@/components/简单选择Cell";
export default {
  components: {
    modalComponent,
    modalHeaderComponent,
    modalContentComponent,
    modalFooterComponent,
    btnComponent,
    optionControllerComponent,
    simpleSelectionComponent
  },
  methods: {
    showModal: function() {
      this.$refs.modalComponent.showModal();
    },
    btn_fn: function() {
      this.$refs.modalComponent.hideModal();
    },
    click_fn: function(option) {
      this.$refs.optionController.choiceManager(option);
    }
  },
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
          checked: true
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
  }
};
</script>
<style lang="scss">
</style>


