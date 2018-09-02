<template>
    <div class="container">
        <titleComponent title_src="/static/images/切图/实验室成员列表/cl.png" title_text="材料实验室" :title_sfx="displayName"></titleComponent>
        <subTitleComponent subTitle_src="/static/images/切图/实验室成员列表/xt.png" subTitle_text="四川大学 高分子学院"></subTitleComponent>
    </div>
</template>
<script>
import titleComponent from '@/components/Title'
import subTitleComponent from '@/components/SubTitle'
export default {
  mounted () {
    this.id = this.$root.$mp.query.id
    this.displayName = this.$root.$mp.query.displayName
  },
  components: {
    titleComponent,
    subTitleComponent
  },
  data () {
    return {
      id: 0,
      displayName: ''
    }
  }
}
</script>
<style lang="scss">
</style>

