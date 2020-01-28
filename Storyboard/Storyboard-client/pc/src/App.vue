<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Storyboard-App",
  mounted() {
    // check if the client requested from a mobile device
    let isMobile = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    let currentNavStackIsMobile =
      this.$route.path.split("/").pop() === "mobile" ? true : false;
    if (isMobile && !currentNavStackIsMobile) this.$router.replace("/mobile");
  }
};
</script>

<style>
@import "./assets/font/font.css";
html,
body {
  margin: 0;
}
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* protect browser from scrolling along x-axis */
  overflow-x: hidden;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  font-family: kai;
  min-width: 1024px;
  min-height: 600px;
}
#app::-webkit-scrollbar {
  display: none;
}
.btn:focus,
.btn:active,
.btn:active:focus,
.btn.active:focus,
.btn.focus,
.btn:active.focus,
.btn.active.focus {
  outline: none;
  box-shadow: none;
}
</style>
