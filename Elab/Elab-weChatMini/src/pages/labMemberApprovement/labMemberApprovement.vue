a<template>
    <div class="container">
        <titleComponent title_src="/static/images/切图/实验室成员列表/cl.png" title_text="材料实验室"></titleComponent>
        <subTitleComponent subTitle_src="/static/images/切图/实验室成员列表/xt.png" subTitle_text="四川大学 高分子学院"></subTitleComponent>
        <content-title-component contentTitle_src="/static/images/切图/入驻实验室人员审核/sh.png" contentTitle_text="待审核成员"></content-title-component>
        <div class="table-view">
            <slideTableCellComponent v-for="(item,index) in studentList" :key="index" :item="item" :index="index" :btns="btns" height="180rpx" :frontLayerOnClickFn="frontLayerOnClickFn">
                <studentCellComponent :item="item" titleFontSize="25rpx" subTitleFontSize="20rpx"></studentCellComponent>
            </slideTableCellComponent>
        </div>
    </div>
</template>
<script>
import contentTitleComponent from "@/components/ContentTitle";
import searchBarComponent from "@/components/搜索框组件";
import titleComponent from "@/components/Title";
import subTitleComponent from "@/components/SubTitle";
import slideTableCellComponent from "@/components/可滑动TableCell";
import studentCellComponent from "@/components/StudentCell";
export default {
  components: {
    titleComponent,
    subTitleComponent,
    slideTableCellComponent,
    studentCellComponent,
    searchBarComponent,
    contentTitleComponent
  },
  methods: {
    frontLayerOnClickFn: function(item) {
      console.log("选择: " + item.name);
    }
  },
  data() {
    return {
      options: {
        option: []
      },
      btns: {
        leftBtn: {
          style: {
            width: "140rpx",
            fontSize: "20rpx",
            backgroundColor: function(object) {
              return "#1dd069";
            }
          },
          btnFn: function() {
            console.log("左面按钮点击");
          },
          label: function(object) {
            return "同意";
          }
        },
        rightBtn: {
          style: {
            width: "140rpx",
            fontSize: "20rpx",
            backgroundColor: function(object) {
              return "#ff686f";
            }
          },
          btnFn: function() {
            console.log("右面按钮点击");
          },
          label: function(object) {
            return "拒绝";
          }
        },
        boundaryWidth: 280
      },
      studentList: [
        {
          image: "/static/images/hou.png",
          name: "侯小刚",
          id: "76498653",
          description: "76498653",
          type: 0
        },
        {
          image: "/static/images/maozi.png",
          name: "毛子",
          id: "76032653",
          description: "76032653",
          type: 0
        },
        {
          image: "/static/images/xiaogang.png",
          name: "侯大刚",
          id: "76498487",
          description: "76498487",
          type: 0
        },
        {
          image: "/static/images/weiyingluo.png",
          name: "魏璎珞",
          id: "98798653",
          description: "98798653",
          type: 0
        },
        {
          image: "/static/images/mingyu.png",
          name: "明玉小可爱",
          id: "67598653",
          description: "67598653",
          type: 0
        }
      ]
    };
  }
};
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


