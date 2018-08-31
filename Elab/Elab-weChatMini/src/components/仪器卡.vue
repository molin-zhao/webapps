<template>
    <div class="card">
        <div class="card-description">
            <div class="thumb">
                <img :src="item.image" model="aspectFit">
            </div>
            <div class="description">
                <div class="title">
                    <div class="label">
                        <labelComponent v-if="item.status === 'open'" :label="labels.open.label" :src="labels.open.src" :fontSize="labels.open.fontSize" :color="labels.open.color"></labelComponent>
                        <labelComponent v-else :label="labels.closed.label" :src="labels.closed.src" :fontSize="labels.closed.fontSize" :color="labels.closed.color"></labelComponent>
                    </div>
                    <p>{{item.name}}</p>
                </div>
                <div v-if="item.person.status" class="person-incharge">
                    <div v-if="item.person.status === 'pending'" class="pending">
                        <p class="person">{{item.person.name}}</p>
                        <p>申请成为负责人</p>
                    </div>
                    <div v-else class="active">
                        <img src="/static/images/切图/实验室管理的主菜单页面/rs.png" model="aspectFit">
                        <p class="person">{{item.person.name}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-buttons">
            <div v-if="item.person.status === 'pending'" class="pending">
                <div class="btn-1" @click="同意申请()">
                    <img src="/static/images/切图/仪器负责人变更和仪器状态变更/sq.png" model="aspectFit">
                    <p>同意申请</p>
                </div>
                <div class="btn-2">
                    <img src="/static/images/切图/仪器负责人变更和仪器状态变更/bj.png" model="aspectFit">
                    <p>编辑负责人</p>
                </div>
                <div class="btn-3">
                    <img src="/static/images/切图/仪器负责人变更和仪器状态变更/sc.png" model="aspectFit">
                    <p>删除</p>
                </div>
            </div>
            <div v-else class="active">
                <div class="btn-1">
                    <img src="/static/images/切图/仪器负责人变更和仪器状态变更/bj.png" model="aspectFit">
                    <p>编辑负责人</p>
                </div>
                <div class="btn-2">
                    <img src="/static/images/切图/仪器负责人变更和仪器状态变更/sc.png" model="aspectFit">
                    <p>删除</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import labelComponent from "@/components/标签组件";
export default {
  props: ["item"],
  components: {
    labelComponent
  },
  methods: {
    同意申请: function() {
      this.item.person.status = "active";
    }
  },
  data() {
    return {
      labels: {
        open: {
          label: "开放",
          fontSize: "20rpx",
          src: "/static/images/切图/仪器负责人变更和仪器状态变更/bq1.png",
          color: "#1dd069"
        },
        closed: {
          label: "关停",
          fontSize: "20rpx",
          src: "/static/images/切图/仪器负责人变更和仪器状态变更/bq2.png",
          color: "#ff686f"
        }
      }
    };
  }
};
</script>
<style lang="scss">
.card {
  border-radius: 20rpx;
  background-color: white;
  width: 95%;
  margin-left: 30rpx;
  margin-top: 30rpx;
  margin-right: 30rpx;
  height: 380rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .card-description {
    width: 100%;
    height: 75%;
    border-bottom: 0.1rpx solid lightgray;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .thumb {
      height: 100%;
      width: 25%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 150rpx;
        height: 150rpx;
        margin-left: 30rpx;
        margin: auto;
        border-radius: 20rpx;
      }
    }
    .description {
      height: 100%;
      width: 75%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        width: 100%;
        height: 60%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        .label {
          width: 60rpx;
          height: 35rpx;
          margin-left: 10rpx;
          //   display: flex;
          //   flex-direction: row;
          //   justify-content: flex-start;
          //   align-items: center;
        }
        p {
          font-size: 30rpx;
          color: #433b39;
          font-weight: bold;
        }
      }
      .person-incharge {
        margin-top: 10rpx;
        margin-left: 40rpx;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .pending {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          p {
            font-size: 25rpx;
            color: #999999;
          }
          .person {
            font-size: 25rpx;
            color: #6cb7f1;
          }
        }
        .active {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          img {
            width: 30rpx;
            height: 30rpx;
          }
          .person {
            margin-left: 15rpx;
            font-size: 25rpx;
            color: #6cb7f1;
          }
        }
      }
    }
  }
  .card-buttons {
    width: 100%;
    height: 25%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .pending {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .btn-1 {
        width: 33%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-right: 0.1rpx solid lightgray;
        img {
          width: 35rpx;
          height: 35rpx;
        }
        p {
          font-size: 30rpx;
          color: #6cb7f1;
          margin-left: 14rpx;
        }
      }
      .btn-2 {
        width: 34%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-right: 0.1rpx solid lightgray;
        img {
          width: 35rpx;
          height: 35rpx;
        }
        p {
          font-size: 30rpx;
          color: #6cb7f1;
          margin-left: 14rpx;
        }
      }
      .btn-3 {
        width: 33%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        img {
          width: 35rpx;
          height: 35rpx;
        }
        p {
          font-size: 30rpx;
          color: #ff686f;
          margin-left: 14rpx;
        }
      }
    }
    .active {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .btn-1 {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-right: 0.1rpx solid lightgray;
        img {
          width: 35rpx;
          height: 35rpx;
        }
        p {
          font-size: 30rpx;
          color: #6cb7f1;
          margin-left: 14rpx;
        }
      }
      .btn-2 {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;

        align-items: center;
        img {
          width: 35rpx;
          height: 35rpx;
        }
        p {
          font-size: 30rpx;
          color: #ff686f;
          margin-left: 14rpx;
        }
      }
    }
  }
}
</style>


