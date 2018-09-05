<template>
  <div :class="{'show': ifShow, 'bottom-modal':true}" @click="hideModal()" @touchmove.stop="preventTouchMove()">
    <div class="modal-wrapper" @click.stop="remain()">
      <div class="buttom-modal-btns">
        <div class="btn-1" @click="btn1Fn()">{{upperBtnLabel}}</div>
        <div class="btn-2" @click="btn2Fn()">{{lowerBtnLabel}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ifShow: false
    };
  },
  props: [
    "bindUpperBtnClick",
    "bindLowerBtnClick",
    "upperBtnLabel",
    "lowerBtnLabel"
  ],
  methods: {
    hideModal: function() {
      if (this.ifShow === true) {
        this.ifShow = false;
      }
    },
    showModal: function() {
      if (this.ifShow === false) {
        this.ifShow = true;
      }
    },
    btn1Fn: function() {
      return this.bindUpperBtnClick();
    },
    btn2Fn: function() {
      return this.bindLowerBtnClick();
    },
    remain: function() {},
    preventTouchMove: function() {
      //empty
    }
  }
};
</script>
<style lang="scss">
.bottom-modal {
  position: absolute;
  top: 0rpx;
  width: 100vw;
  height: 100vh;
  left: 0rpx;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.2);
  visibility: hidden;
  transition: all 0.2s linear;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .modal-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 20rpx;
    position: fixed;
    bottom: 0rpx;
    height: 200rpx;
    .buttom-modal-btns {
      width: 98%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .btn-1 {
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-bottom: solid 0.5rpx #bbbbbb;
        font-size: 30rpx;
        color: #6cb7f1;
      }
      .btn-2 {
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
        color: #6cb7f1;
      }
    }
  }
}
.show {
  opacity: 1;
  visibility: visible;
  transition: all 0.2s linear;
}
</style>