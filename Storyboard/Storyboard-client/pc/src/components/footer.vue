<template>
  <div class="footer">
    <span class="display-only">© {{ copyRight }} {{ $t("MOLINZ") }}</span>
  </div>
</template>

<script>
export default {
  computed: {
    copyRight: () => {
      let date = new Date();
      let currentYear = date.getFullYear();
      if (currentYear > 2018) return `2018-${currentYear}`;
      else return `2018`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.footer {
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dcdcdc80;
  span {
    display: inline-block;
    vertical-align: middle;
    font-weight: bold;
    font-size: 15px;
    line-height: normal;
  }
}
</style>
