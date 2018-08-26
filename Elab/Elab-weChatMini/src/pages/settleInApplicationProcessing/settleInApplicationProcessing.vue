<template>
    <div class="container">
        <titleComponent :title_src=title_src :title_text=title_text></titleComponent>
        <subTitleComponent :subTitle_src=subTitle_src :subTitle_text=subTitle_text></subTitleComponent>
        <div class="basicInfo">
            <div class="processing">
                <img mode="aspectFit" src="/static/images/切图/实验室入驻申请审核说明/icon.png">
                <p>入驻申请审核中...</p>
            </div>
        </div>
    </div>
</template>
<script>
import titleComponent from "@/components/Title";
import subTitleComponent from "@/components/SubTitle";
export default {
  data() {
    return {
      title_src: "/static/images/切图/实验室成员列表/cl.png",
      subTitle_src: "/static/images/切图/实验室成员列表/xt.png",
      title_text: "材料实验室",
      subTitle_text: "四川大学 高分子学院"
    };
  },
  components: {
    titleComponent,
    subTitleComponent
  }
};
</script>
<style lang="scss">
.processing {
  position: relative;
  width: 50%;
  height: 350rpx;
  top: 150rpx;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 80%;
  }
  p {
    font-size: 30rpx;
    opacity: 0.3;
    margin-top: -20rpx;
  }
}
</style>


