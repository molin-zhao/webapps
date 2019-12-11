<template>
  <div class="header">
    <nav class="navbar navbar-expand-lg">
      <a class="navbar-brand nav-title" href="#">
        <img
          src="@/assets/logo.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt=""
        />
        Storyboard
      </a>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle nav-title"
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <icon name="lang" style="color: white" />
            {{ $t("LANGUAGE") }}
          </a>
          <div
            class="dropdown-menu dropdown-menu-right"
            aria-labelledby="navbarDropdownMenuLink"
          >
            <a class="dropdown-item" @click="changeLocale('en-US')"
              >{{ $t("EN_US") }} {{ renderCurrentLocale("en-US") }}</a
            >
            <a class="dropdown-item" @click="changeLocale('zh-CN')"
              >{{ $t("ZH_CN") }} {{ renderCurrentLocale("zh-CN") }}</a
            >
          </div>
        </li>
        <li v-if="!isMobile" class="nav-item active">
          <a class="nav-link nav-title" href="#"
            >{{ $t("REGISTER") }} <span class="sr-only">(current)</span></a
          >
        </li>
        <li v-if="!isMobile" class="nav-item active">
          <a class="nav-link nav-title">|</a>
        </li>
        <li v-if="!isMobile" class="nav-item active">
          <a class="nav-link nav-title" href="#"
            >{{ $t("LOGIN") }} <span class="sr-only">(current)</span></a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  computed: {
    isMobile() {
      let pathLastValue = this.$route.path.split("/").pop();
      return pathLastValue === "mobile" ? true : false;
    }
  },
  methods: {
    changeLocale(localeId) {
      if (this.$i18n.locale !== localeId) {
        this.$i18n.locale = localeId;
      }
    },
    renderCurrentLocale(localeId) {
      if (this.$i18n.locale === localeId) {
        return "✔";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  height: 5vh;
  width: 100%;
  background-color: #090723;
  nav {
    height: 100%;
    width: 100%;
    .nav-title {
      color: white;
    }
  }
}
</style>
