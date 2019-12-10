<template>
  <div id="app">
    <layout></layout>
  </div>
</template>

<script>
import layout from '@/pages/layout';
export default {
  name: 'Storyboard-App',
  components: {
    layout
  }
}
</script>

<style>
html, body{
  height: 100%;
  margin:0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
