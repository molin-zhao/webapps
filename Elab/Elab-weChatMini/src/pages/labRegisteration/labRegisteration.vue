<template>
  <div class="container">
    <title-component title_src="/static/images/res/labRegisteration/xx.png" title_text="基本信息"></title-component>
    <div class="basicInfo">
      <picker-component ref="uniPickerInput" holder="请输入学校名称" :separator="true" :bindOnClick="pickUniversity"></picker-component>
      <picker-component ref="schoolPickerInput" holder="请输入学院名称" :separator="true" :bindOnClick="pickSchool"></picker-component>
      <input-component holder="请输入管理员姓名"></input-component>
      <div class="separator-bold"></div>
      <input-component holder="请输入管理员学号" :separator="true"></input-component>
      <simCodeComponent holder="请输入管理员手机号" :separator="true"></simCodeComponent>
      <input-component holder="请输入验证码" :separator="true"></input-component>
    </div>
    <div class="btn-wrapper">
      <buttonComponent btn_src="/static/images/res/labRegisteration/btn1.png" :btn_fn="nextBtnFn" btn_label="下一步" font_size="font-size:30rpx"></buttonComponent>
    </div>
    <modal-component ref="uniPickerModal">
      <modal-header-components>
        <p style="font-size: 30rpx;">选择学校名称</p>
      </modal-header-components>
      <modal-content-components>
        <picker-view-controller-components ref="uniPickerController" dimensions="TWO_DIMENSIONAL" :options="uniOptions" pickerHeight="400rpx"></picker-view-controller-components>
      </modal-content-components>
      <modal-footer-components>
        <div class="btn-wrapper-middle" style="margin-bottom:20rpx;">
          <buttonComponent btn_src="/static/images/res/moveInLabRequest2/b1.png" :btn_fn="uniPickerModalBtnFn" btn_label="确定" font_size="font-size:20rpx"></buttonComponent>
        </div>
      </modal-footer-components>
    </modal-component>

    <modal-component ref="schoolPickerModal">
      <modal-header-components>
        <p style="font-size: 30rpx;">选择学院名称</p>
      </modal-header-components>
      <modal-content-components>
        <picker-view-controller-components ref="schoolPickerController" dimensions="ONE_DIMENSIONAL" pickerHeight="400rpx" :options="schoolOptions"></picker-view-controller-components>
      </modal-content-components>
      <modal-footer-components>
        <div class="btn-wrapper-middle" style="margin-bottom:20rpx;">
          <buttonComponent btn_src="/static/images/res/moveInLabRequest2/b1.png" :btn_fn="schoolPickerModalBtnFn" btn_label="确定" font_size="font-size:20rpx"></buttonComponent>
        </div>
      </modal-footer-components>
    </modal-component>
  </div>
</template>
<script>
import modalComponent from '@/components/Modal'
import modalHeaderComponents from '@/components/ModalHeader'
import modalContentComponents from '@/components/ModalContent'
import modalFooterComponents from '@/components/ModalFooter'
import pickerViewControllerComponents from '@/components/PickerViewController'
import titleComponent from '@/components/Title'
import simCodeComponent from '@/components/SimCodeInput'
import buttonComponent from '@/components/Button'
import pickerComponent from '@/components/PickerInput'
import inputComponent from '@/components/NormalInput'
export default {
  components: {
    simCodeComponent,
    buttonComponent,
    pickerComponent,
    inputComponent,
    titleComponent,
    modalComponent,
    modalHeaderComponents,
    modalContentComponents,
    modalFooterComponents,
    pickerViewControllerComponents
  },
  data () {
    return {
      schoolOptions: [],
      canPickSchool: false,
      uniPickValue: [-1, -1],
      uniOptions: [
        ['四川省', '江苏省', '辽宁省', '北京市'],
        [
          // 四川省
          ['四川大学', '电子科技大学', '西南财经大学'],
          // 江苏省
          ['南京大学', '南京航空航天大学', '苏州大学'],
          // 辽宁省
          ['大连理工大学', '东北大学'],
          // 北京市
          [
            '清华大学',
            '北京大学',
            '中国人民大学',
            '北京航空航天大学',
            '北京理工大学'
          ]
        ]
      ],
      schools: [
        [
          ['轻纺学院', '水电学院', '马克思学院', '吴玉章学院'],
          ['微电子学院', '计算机学院', '经济学院'],
          ['国际贸易学院', '商学院']
        ],
        [
          ['数学学院', '文学院', '历史学院'],
          ['电子信息学院', '计算机与科学学院', '航天工程学院', '机械学院'],
          ['商学院', '外语学院', '法学院']
        ],
        [
          ['机械学院', '外语学院', '数学学院', '电子信息工程学院'],
          ['历史学院', '物理学院', '化学学院']
        ],
        [
          ['清华大学经管学院', '清华大学环境学院', '管理学院', '医学院'],
          ['北京大学医学部', '计算机学院', '北京大学光华管理学院'],
          ['信息学院', '历史学院', '艺术学院'],
          ['高分子材料学院', '航空航天工程学院', '机械学院', '计算机学院'],
          ['车辆工程学院', '信息工程学院', '机电学院']
        ]
      ]
    }
  },
  watch: {
    uniPickValue: {
      // 如果选择的学校更新，将学院的信息重置
      handler (newVal, oldVal) {
        this.$refs.schoolPickerInput.renderInput([])
      },
      deep: true
    }
  },
  methods: {
    nextBtnFn: function () {
      wx.navigateTo({
        url: '/pages/labManagement/main'
      })
    },
    pickUniversity: function () {
      this.$refs.uniPickerModal.showModal()
    },
    pickSchool: function () {
      if (this.uniPickValue[0] + this.uniPickValue[1] < 0) {
        this.canPickSchool = false
        wx.showToast({
          title: '请先选择学校名称',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.canPickSchool = true
        this.$refs.schoolPickerController.setFirstColumnOptions(
          this.getSchoolOptions()
        )
        this.$refs.schoolPickerModal.showModal()
      }
    },
    // 选择学校Modal关闭的时候得到controller选择的值，并且将选择值坐标存在本地
    // 为选择学院或者改变学校时将学院值重置使用
    uniPickerModalBtnFn: function () {
      this.$refs.uniPickerModal.hideModal()
      let optionArr = this.$refs.uniPickerController.getAllSelectedOptions()
      this.uniPickValue = this.$refs.uniPickerController.getPickValue()
      this.$refs.uniPickerInput.renderInput(optionArr)
    },
    schoolPickerModalBtnFn: function () {
      this.$refs.schoolPickerModal.hideModal()
      let optionArr = this.$refs.schoolPickerController.getAllSelectedOptions()
      this.$refs.schoolPickerInput.renderInput(optionArr)
    },
    // 通过选择学校Modal关闭之后存在本地的uniPickValue数组进行学院信息的筛选
    getSchoolOptions: function () {
      let province = this.uniPickValue[0]
      let university = this.uniPickValue[1]
      return this.schools[province][university]
    }
  }
}
</script>
<style lang="scss">
</style>


