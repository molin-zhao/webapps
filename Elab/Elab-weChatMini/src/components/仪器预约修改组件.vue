<template>
    <div class="tools">
        <div class="tools-wrapper">
            <div class="thumb">
                <img :src="tool.image" mode="aspectFit">
            </div>
            <div class="detail">
                <div class="detail-description">
                    <p class="detail-title">{{tool.title}}</p>
                    <p class="detail-appointment">预约时间：{{tool.appointment}}</p>
                    <p class="detail-badge">{{tool.badge}}</p>
                </div>
                <div class="scope-btn-wrapper">
                    <btn-component v-if="tool.status === 1" btn_src="/static/images/切图/实验室仪器预约/tb2.png" btn_label="预约" :btn_fn=btn_click font_size="font-size:20rpx" :data="tool"></btn-component>
                    <btn-component v-else btn_src="/static/images/切图/实验室仪器预约/tb1.png" btn_label="修改" :btn_fn=btn_click font_size="font-size:20rpx" :data="tool"></btn-component>
                </div>
            </div>
        </div>
        <div class="separator"></div>
    </div>
</template>
<script>
import btnComponent from "@/components/按钮组件";
export default {
  components: {
    btnComponent
  },
  props: ["tool"],
  methods: {
    btn_click: function(tool) {
      if (tool.status === 0) {
        console.log("修改 id:" + tool.id + " " + tool.title);
      } else {
        console.log("预约 id:" + tool.id + " " + tool.title);
      }
    },
    test: function() {
      console.log("test");
    }
  }
};
</script>
<style lang="scss">
.tools {
  margin-top: 5rpx;
  width: 100%;
  height: 33vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 5rpx;
  .tools-wrapper {
    width: 100%;
    height: 30vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .thumb {
      width: 28vw;
      height: 28vw;
      float: left;
      margin-left: 20rpx;
      margin-top: 30rpx;
      img {
        width: 80%;
        height: 80%;
      }
    }
    .detail {
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: flex-start;
      .detail-description {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .detail-title {
          font-size: 30rpx;
        }
        .detail-appointment {
          font-size: 20rpx;
          opacity: 0.3;
        }
        .detail-badge {
          font-size: 20rpx;
          color: red;
          opacity: 0.7;
        }
      }
      .scope-btn-wrapper {
        width: 130rpx;
        height: 70rpx;
        margin-left: -20rpx;
      }
    }
  }
}
</style>


