<template>
  <div class="container">
    <titleComponent title_src="/static/images/切图/实验室成员列表/cl.png" title_text="材料实验室"></titleComponent>
    <subTitleComponent subTitle_src="/static/images/切图/实验室成员列表/xt.png" subTitle_text="四川大学 高分子学院"></subTitleComponent>
    <searchBarComponent holder="请输入姓名" :options="options"></searchBarComponent>
    <tableViewControllerComponent :items="items" ref="tableViewController">
      <slideTableCellComponent v-on:slide="滑动(index)" v-on:active="记录(index)" v-for="(item,index) in items" :key="index" :item="item" :index="index" :btns="btns" height="180rpx" :frontLayerOnClickFn="frontLayerOnClickFn">
        <studentCellComponent :item="item" titleFontSize="25rpx" subTitleFontSize="20rpx"></studentCellComponent>
      </slideTableCellComponent>
    </tableViewControllerComponent>
  </div>
</template>
<script>
import tableViewControllerComponent from '@/components/TableViewController'
import searchBarComponent from '@/components/搜索框组件'
import titleComponent from '@/components/Title'
import subTitleComponent from '@/components/SubTitle'
import slideTableCellComponent from '@/components/可滑动TableCell'
import studentCellComponent from '@/components/StudentCell'
export default {
  components: {
    titleComponent,
    subTitleComponent,
    slideTableCellComponent,
    studentCellComponent,
    searchBarComponent,
    tableViewControllerComponent
  },
  methods: {
    frontLayerOnClickFn: function (item) {
      console.log('选择: ' + item.name)
    },
    滑动: function (index) {
      let controller = this.$refs.tableViewController
      controller.recoverActiveCells(controller.$children, index)
    },
    记录: function (index) {
      let controller = this.$refs.tableViewController
      controller.addActiveCell(index)
    }
  },
  data () {
    return {
      options: {
        option: []
      },
      btns: {
        leftBtn: {
          style: {
            width: '140rpx',
            fontSize: '20rpx',
            backgroundColor: function (object) {
              if (object.$options.propsData.item.label === '管理员') {
                return '#cccccc'
              } else {
                return '#ffc63e'
              }
            }
          },
          btnFn: function (object, item) {
            if (item.label === '管理员') {
              console.log('取消管理员身份')
              item.label = ''
            } else {
              console.log('指定管理员身份')
              item.label = '管理员'
            }
            return object.resetBtn()
          },
          label: function (object) {
            if (object.$options.propsData.item.label === '管理员') {
              return '取消管理员身份'
            } else {
              return '指定管理员身份'
            }
          }
        },
        rightBtn: {
          style: {
            width: '140rpx',
            fontSize: '20rpx',
            backgroundColor: function (object) {
              return '#ff686f'
            }
          },
          btnFn: function (object, item) {
            console.log('右面按钮点击')
          },
          label: function (object) {
            return '删除'
          }
        },
        boundaryWidth: 280
      },
      items: [
        {
          image: '/static/images/hou.png',
          name: '侯小刚',
          id: '76498653',
          description: '76498653',
          label: '管理员',
          type: 0
        },
        {
          image: '/static/images/maozi.png',
          name: '毛子',
          id: '76032653',
          description: '76032653',
          label: '管理员',
          type: 0
        },
        {
          image: '/static/images/xiaogang.png',
          name: '侯大刚',
          id: '76498487',
          description: '76498487',
          label: '',
          type: 0
        },
        {
          image: '/static/images/weiyingluo.png',
          name: '魏璎珞',
          id: '98798653',
          description: '98798653',
          label: '',
          type: 0
        },
        {
          image: '/static/images/mingyu.png',
          name: '明玉小可爱',
          id: '67598653',
          description: '67598653',
          label: '',
          type: 0
        }
      ]
    }
  }
}
</script>
<style lang="scss">
.table-view {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
}
</style>


