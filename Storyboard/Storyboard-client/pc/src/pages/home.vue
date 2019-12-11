<template>
  <div class="wrapper">
      <storyboardHeader :mobile="mobile"></storyboardHeader>
      <storyboardContent></storyboardContent>
      <storyboardFooter></storyboardFooter>
  </div>
</template>

<script>
import storyboardHeader from "@/components/header";
import storyboardFooter from "@/components/footer";
import storyboardContent from "@/components/content";
export default {
  components: {
    storyboardHeader,
    storyboardFooter,
    storyboardContent
  },
  computed: {
    mobile(){
      return this.$route.params.mobile
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../common/theme/container.css';
</style>
