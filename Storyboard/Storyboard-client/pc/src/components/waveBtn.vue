<template>
  <div class="button" @click="wavesEffect" :style="computedBtnStyle">
    <span class="display-only">{{ title }}</span>
    <div class="wavesbtn" ref="wavesbtn"></div>
  </div>
</template>
<script>
export default {
  props: {
    waveColor: {
      type: String,
      default: "#426fc5cc"
    },
    btnColor: {
      type: String,
      default: "#426fc599"
    },
    btnStyle: {
      type: String,
      default: "width: 100px; height: 40px"
    },
    title: {
      type: String,
      default: "button"
    }
  },
  computed: {
    computedBtnStyle() {
      const { btnStyle, style, btnColor } = this;
      return `${btnStyle}; ${style}; background-color: ${btnColor}`;
    }
  },
  methods: {
    wavesEffect(e) {
      e = e || window.event;
      let position = e.target.getBoundingClientRect();
      let doc = document.documentElement;
      let div = document.createElement("div");
      div.className = "effect";
      this.$refs.wavesbtn.appendChild(div);
      let top = e.pageY - (position.top + window.pageYOffset) - doc.clientTop;
      let left =
        e.pageX - (position.left + window.pageXOffset) - doc.clientLeft;
      let dur = 750;
      div.style = `
        background: ${this.waveColor};
        left:${left}px;
        top:${top}px;
        transform:scale(20);
        transition-duration: 1s;
        transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);`;
      setTimeout(() => {
        div.style = `
        background: ${this.waveColor};
        transition-duration: 1s;
        transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity:0;
        left:${left}px;
        top:${top}px;
        transform:scale(20);`;
        setTimeout(() => {
          this.$refs.wavesbtn.removeChild(div);
        }, dur);
      }, 100);
    }
  }
};
</script>
<style scoped>
@import "../common/theme/container.css";
.button {
  position: relative;
  overflow: hidden;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
span {
  width: 100%;
  z-index: 1;
}
.wavesbtn {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
<style>
.effect {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: all 0.7s ease-out;
  transform: scale(0);
  transition-property: transform, opacity, -webkit-transform;
  pointer-events: none;
}
</style>
