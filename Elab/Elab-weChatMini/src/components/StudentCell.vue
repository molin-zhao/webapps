<template>
  <div class="student-cell">
    <div class="thumb">
      <img :src="item.image" model="aspectFit">
    </div>
    <div class="detail">
      <div>
        <p :style="{fontSize: titleFontSize}">{{item.name}}</p>
        <div v-if="item.label" :style="{backgroundColor: labelBackgroundColor, borderColor: labelBorderColor, color: labelColor}" class="label">{{item.label}}</div>
      </div>
      <p :style="{fontSize: subTitleFontSize}">{{item.description}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'item',
    'titleFontSize',
    'subTitleFontSize',
    'labelBackgroundColor',
    'labelBorderColor',
    'labelColor'
  ]
}
</script>

<style lang="scss">
.student-cell {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .thumb {
    margin-left: 30rpx;
    width: 20%;
    height: 100%;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    img {
      margin: auto;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50rpx;
    }
  }
  .detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: left;
    margin-left: 20rpx;

    div {
      height: 30%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;

      p {
        color: black;
        font-weight: bold;
        opacity: 1;
      }
      .label {
        margin: auto;
        height: 30rpx;
        font-size: 20rpx;
        width: 80rpx;
        border-width: thin;
        border-color: #6cb7f1;
        border-radius: 5rpx;
        background-color: aliceblue;
        color: #6cb7f1;
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
    }
    p {
      color: black;
      opacity: 0.3;
    }
  }
}
</style>

