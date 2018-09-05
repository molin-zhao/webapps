<template>
  <div :class="{'show': ifShow, 'my-modal':true}" @click="hideModal()" @touchmove.stop="preventTouchMove()">
    <div class="modal-wrapper" @click.stop="remain()">
      <!-- 下面可以添加任意内容 -->
      <slot></slot>
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
  props: ["id", "name"],
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
    remain: function() {
      // empty
    },
    preventTouchMove: function() {
      // empty
    }
  }
};
</script>
<style lang="scss">
.my-modal {
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
    width: 80%;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 20rpx;
  }
  slot {
    margin-top: 10rpx;
    margin-bottom: 10rpx;
  }
}
.show {
  opacity: 1;
  visibility: visible;
  transition: all 0.2s linear;
}
</style>