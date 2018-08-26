<template>
    <div class="container">
      <title-component :title_src=title_src :title_text=title_text></title-component>
        <div class="basicInfo">
          <picker-component :holder=placeholder_college :separator=separator_true></picker-component>
          <picker-component :holder=placeholder_school :separator=separator_true></picker-component>
          <input-component :holder=placeholder_managerName :separator=separator_false></input-component>
          <div class="separator-bold"></div>
          <input-component :holder=placeholder_managerId :separator=separator_true></input-component>
          <simCodeComponent :holder=placeholder_managerPhoneNum :separator=separator_true></simCodeComponent>
          <input-component :holder=placeholder_sim :separator=separator_true></input-component>
        </div>
        <buttonComponent :btn_src=button_image_src :btn_fn=button_function :btn_label=button_label></buttonComponent>
    </div>
</template>
<script>
import titleComponent from '@/components/Title'
import simCodeComponent from '@/components/验证码输入框组件'
import buttonComponent from '@/components/按钮组件'
import pickerComponent from '@/components/选择组件'
import inputComponent from '@/components/简单输入框组件'
export default {
  data () {
    return {
      button_image_src: '/static/images/切图/实验室注册页面/btn1.png',
      button_function: function () {
        console.log('下一步')
        wx.navigateTo({
          url: '/pages/labManagement/main'
        })
      },
      button_label: '下一步',
      separator_true: true,
      separator_false: false,
      placeholder_college: '请输入学校名称',
      placeholder_school: '请输入学院名称',
      placeholder_managerName: '请输入管理员姓名',
      placeholder_managerId: '请输入管理员学号',
      placeholder_managerPhoneNum: '请输入管理员手机号',
      placeholder_sim: '请输入验证码',
      title_src: '/static/images/切图/实验室注册页面/xx.png',
      title_text: '基本信息'
    }
  },
  components: {
    simCodeComponent,
    buttonComponent,
    pickerComponent,
    inputComponent,
    titleComponent
  },
  methods: {}
}
</script>
<style lang="scss">
</style>


