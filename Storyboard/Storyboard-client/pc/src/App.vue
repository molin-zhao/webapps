<template>
  <div id="app">
    <router-view></router-view>
    <!-- <home></home> -->
  </div>
</template>

<script>
import home from "@/pages/home";
export default {
  name: "Storyboard-App",
  components: {
    home
  },
  mounted() {
    // check if the client requested from a mobile device
    let isMobile = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    let currentNavStackIsMobile = this.$route.path.split('/').pop() === 'mobile'? true: false;
    if (isMobile && !currentNavStackIsMobile) this.$router.replace("/mobile");
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
