<template>
    <div class="container">
        <div class="cover">
            <img src="/static/images/切图/仪器分配/dt.png" model="aspectFit">
            <div class="cover-detail">
                <div class="thumb">
                    <img :src="student.image" model="aspectFit">
                </div>
                <div class="description">
                    <p class="name">{{student.name}}</p>
                    <p class="id">{{student.id}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { _getStudent } from '@/utils/utils'
export default {
  mounted () {
    var id = this.$root.$mp.query.id
    this.student = _getStudent(id)
  },
  data () {
    return {
      student: {}
    }
  }
}
</script>
<style lang="scss">
.cover {
  position: relative;
  width: 100vw;
  height: 230rpx;
  img {
    width: 100%;
    height: 100%;
  }
  .cover-detail {
    position: absolute;
    background: transparent;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .thumb {
      width: 30%;
      height: 100%;
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      img {
        margin-left: 30rpx;
        margin: auto;
        border-radius: 60rpx;
        width: 120rpx;
        height: 120rpx;
      }
    }
    .description {
      width: 60%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: left;
      .name {
        font-size: 30rpx;
        font-weight: bold;
        color: white;
      }
      .id {
        font-size: 25rpx;
        font-weight: normal;
        color: white;
      }
    }
  }
}
</style>


