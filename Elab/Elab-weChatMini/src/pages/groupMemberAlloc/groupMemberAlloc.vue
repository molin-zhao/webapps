<template>
  <div class="container">
    <titleComponent title_src="/static/images/res/labMember/cl.png" title_text="材料实验室"></titleComponent>
    <subTitleComponent subTitle_src="/static/images/res/labMember/xt.png" subTitle_text="四川大学 高分子学院"></subTitleComponent>
    <searchBarComponent holder="请输入姓名" :options="options"></searchBarComponent>
    <div class="table-view">
      <slideTableCellComponent v-for="(item,index) in studentList" :key="index" :item="item" :index="index" :btns="null" height="180rpx" :frontLayerOnClickFn="frontLayerOnClickFn">
        <studentCellComponent :item="item" titleFontSize="25rpx" subTitleFontSize="20rpx"></studentCellComponent>
      </slideTableCellComponent>
    </div>
  </div>
</template>
<script>
import searchBarComponent from '@/components/SearchBar'
import titleComponent from '@/components/Title'
import subTitleComponent from '@/components/SubTitle'
import slideTableCellComponent from '@/components/TableViewCell'
import studentCellComponent from '@/components/StudentCell'
export default {
  components: {
    titleComponent,
    subTitleComponent,
    slideTableCellComponent,
    studentCellComponent,
    searchBarComponent
  },
  methods: {
    frontLayerOnClickFn: function (item) {
      console.log('选择: ' + item.name)
      wx.navigateTo({
        url: `/pages/myPage/main?id=${item.id}`
      })
    }
  },
  data () {
    return {
      options: {
        option: []
      },
      studentList: [
        {
          image: '/static/images/hou.png',
          name: '侯小刚',
          description: '2014级研究生',
          id: '76498653'
        },
        {
          image: '/static/images/maozi.png',
          name: '毛子',
          description: '2014级博士生',
          id: '76032653'
        },
        {
          image: '/static/images/xiaogang.png',
          name: '侯大刚',
          description: '2010级博导',
          id: '76498487'
        },
        {
          image: '/static/images/weiyingluo.png',
          name: '魏璎珞',
          description: '2010级本科生',
          id: '98798653'
        },
        {
          image: '/static/images/mingyu.png',
          name: '明玉小可爱',
          description: '2013级本科生',
          id: '67598653'
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


