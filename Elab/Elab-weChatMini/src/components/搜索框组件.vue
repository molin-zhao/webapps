<template>
    <div class="search-bar-wrapper">
        <div v-if="options.option.length > 0" class="search-bar" style="width:75%">
            <img model="aspectFit" src="/static/images/切图/仪器负责人修改/ss.png">
            <input placeholder-class="search-pl" :placeholder="holder">
        </div>
        <div v-else class="search-bar" style="width:95%">
            <img model="aspectFit" src="/static/images/切图/仪器负责人修改/ss.png">
            <input placeholder-class="search-pl" :placeholder="holder">
        </div>
        <div v-if="options.option.length > 0" class="filter">
            <p>{{options.option[0]}}</p>
            <img v-if="!showFilter" model="aspectFit" src="/static/images/切图/共享仪器预约页-按分钟预约1/xx.png">
            <img v-else model="aspectFit" src="/static/images/切图/共享仪器预约页-按分钟预约1/xs.png">
        </div>
    </div>
</template>
<script>
export default {
  created () {
    console.log('创建搜索框')
  },
  props: ['holder', 'options'],
  data () {
    return {
      showFilter: false,
      options: {}
    }
  }
}
</script>
<style lang="scss">
.search-bar-wrapper {
  margin-top: 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 60rpx;
  .search-bar {
    margin-left: 20rpx;
    margin-right: 20rpx;
    height: 58rpx;
    border-color: lightgrey;
    border-radius: 30rpx;
    border-width: thin;
    border-style: solid;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    img {
      height: 35rpx;
      width: 35rpx;
      margin-left: 5rpx;
    }
    input {
      width: 100%;
      margin-left: 10rpx;
      height: 50rpx;
    }
    .search-pl {
      font-size: 25rpx;
      opacity: 0.4;
    }
  }
  .filter {
    width: 25%;
    height: 50rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    p {
      margin-left: 10rpx;
      color: #6cb7f1;
      font-size: 30rpx;
      float: right;
      margin-right: 5rpx;
    }
    img {
      width: 20rpx;
      height: 10rpx;
    }
  }
}
</style>

