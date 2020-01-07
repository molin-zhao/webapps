<template>
  <div class="wid100 hig100">
    <ul class="box" ref="box">
      <li class="left" ref="left">西瓜</li>
      <li class="resize" ref="resize"></li>
      <li class="mid" ref="mid">备注2</li>
    </ul>
    <ul class="box" ref="box">
      <li class="left" ref="left">西瓜</li>
      <li class="resize" ref="resize"></li>
      <li class="mid" ref="mid">备注2</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    dragControllerDiv: function() {
      var resize = document.getElementsByClassName("resize");
      var left = document.getElementsByClassName("left");
      var mid = document.getElementsByClassName("mid");
      var box = document.getElementsByClassName("box");
      for (let i = 0; i < resize.length; i++) {
        // 鼠标按下事件
        resize[i].onmousedown = function(e) {
          var startX = e.clientX;
          resize[i].left = resize[i].offsetLeft;
          // 鼠标拖动事件
          document.onmousemove = function(e) {
            var endX = e.clientX;
            var moveLen = resize[i].left + (endX - startX); // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
            var maxT = box[i].clientWidth - resize[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

            if (moveLen < 150) moveLen = 150; // 左边区域的最小宽度为150px
            if (moveLen > maxT - 150) moveLen = maxT - 150; //右边区域最小宽度为150px

            resize[i].style.left = moveLen; // 设置左侧区域的宽度

            for (let j = 0; j < left.length; j++) {
              left[j].style.width = moveLen + "px";
              mid[j].style.width = box[i].clientWidth - moveLen - 10 + "px";
            }
          };
          // 鼠标松开事件
          document.onmouseup = function(evt) {
            document.onmousemove = null;
            document.onmouseup = null;
            resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          };
          resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
          return false;
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
  display: block;
  margin: 0;
  padding: 0;
}
.box {
  width: 100%;
  height: 48%;
  margin: 1% 0px;
  overflow: hidden;
}
.left {
  width: calc(30% - 10px);
  height: 100%;
  background: #c9c9c9;
  float: left;
}
.resize {
  width: 5px;
  height: 100%;
  cursor: col-resize;
  float: left;
}
.mid {
  float: left;
  width: 70%;
  height: 100%;
  background: #f3f3f3;
}
</style>
