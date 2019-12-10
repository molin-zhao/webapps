<template>
  <div class="wrapper">
      <storyboardHeader></storyboardHeader>
      <storyboardContent></storyboardContent>
      <storyboardFooter></storyboardFooter>
  </div>
</template>

<script>
import storyboardHeader from "@/pages/header";
import storyboardFooter from "@/pages/footer";
import storyboardContent from "@/pages/content";
export default {
  components: {
    storyboardHeader,
    storyboardFooter,
    storyboardContent
  }
};
</script>

<style lang="scss" scoped>
.wrapper{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>
