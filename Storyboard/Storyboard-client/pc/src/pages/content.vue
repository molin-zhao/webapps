<template>
  <div class="content">
    <div style=" margin-top:100px">
      <icon name="bell" style="height: 50px; width: 50px; color: green"/>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.content {
  min-height: 100%;
  margin-bottom: -5vh;
}
.content::after {
  content: "";
  display: block;
  height: 5vh;
}
</style>
