<template>
  <div class="content">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  min-height: 100%;
  margin-bottom: -5vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.content::after {
  content: "";
  display: block;
  height: 5vh;
}
</style>
