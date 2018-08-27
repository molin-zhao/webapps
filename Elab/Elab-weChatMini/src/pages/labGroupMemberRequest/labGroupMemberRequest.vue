<template>
    <div class="container">
        <titleComponent title_src="/static/images/切图/实验室成员列表/cl.png" title_text="材料实验室"></titleComponent>
        <subTitleComponent subTitle_src="/static/images/切图/实验室成员列表/xt.png" subTitle_text="四川大学 高分子学院"></subTitleComponent>
        <div class="basicInfo">
            <simple-input-component holder="请输入姓名" :separator="true"></simple-input-component>
            <picker-input-component holder="请选择管理员身份" :separator="true"></picker-input-component>
            <picker-input-component holder="请选择时间" :separator="true"></picker-input-component>
            <sim-code-component holder="请输入管理员手机号" :separator="true"></sim-code-component>
            <simple-input-component holder="请输入验证码" :separator="true"></simple-input-component>
        </div>
        <div class="btn-wrapper">
          <button-component btn_src="/static/images/切图/实验室人员入驻申请2-类别/b1.png" :btn_fn=button_function btn_label="确定" font_size="font-size:30rpx"></button-component>
        </div>
    </div>
</template>
<script>
import titleComponent from '@/components/Title'
import subTitleComponent from '@/components/SubTitle'
import simpleInputComponent from '@/components/简单输入框组件'
import pickerInputComponent from '@/components/选择组件'
import simCodeComponent from '@/components/验证码输入框组件'
import buttonComponent from '@/components/按钮组件'
export default {
  data () {
    return {
      button_function: function () {
        console.log('确定')
        wx.navigateTo({
          url: '/pages/settleInApplicationProcessing/main'
        })
      }
    }
  },
  components: {
    titleComponent,
    subTitleComponent,
    simpleInputComponent,
    pickerInputComponent,
    simCodeComponent,
    buttonComponent
  }
}
</script>
<style lang="scss">
</style>
