<template>
    <div class="container">
        <titleComponent :title_src=title_src :title_text=title_text></titleComponent>
        <subTitleComponent :subTitle_src=subTitle_src :subTitle_text=subTitle_text></subTitleComponent>
        <div class="basicInfo">
            <simple-input-component :holder=placeholder_name :separator=separator_true></simple-input-component>
            <picker-input-component :holder=placeholder_managerRole :separator=separator_true></picker-input-component>
            <picker-input-component :holder=placeholder_time :separator=separator_true></picker-input-component>
            <sim-code-component :holder=placeholder_managerPhoneNum :separator=separator_true></sim-code-component>
            <simple-input-component :holder=placeholder_simCode :separator=separator_true></simple-input-component>
        </div>
        <button-component :btn_src=button_src :btn_fn=button_function :btn_label=button_text></button-component>
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
      title_src: '/static/images/切图/实验室成员列表/cl.png',
      subTitle_src: '/static/images/切图/实验室成员列表/xt.png',
      title_text: '材料实验室',
      subTitle_text: '四川大学 高分子学院',
      separator_true: true,
      separator_false: false,
      placeholder_name: '请输入姓名',
      placeholder_managerRole: '请选择管理员身份',
      placeholder_time: '请选择时间',
      placeholder_managerPhoneNum: '请输入管理员手机号',
      placeholder_simCode: '请输入验证码',
      button_src: '/static/images/切图/实验室人员入驻申请2-类别/b1.png',
      button_text: '确定',
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
