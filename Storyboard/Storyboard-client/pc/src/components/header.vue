<template>
  <div class="header">
    <div class="header-nav">
      <a class="navbar-brand nav-title" style="margin-left: 10px">
        <img
          src="/static/logo.png"
          width="30"
          height="30"
          class="d-inline-block align-top"
        />
        Storyboard
      </a>
      <div class="ml-auto">
        <ul class="navbar-nav header-items">
          <li class="nav-item dropdown header-item">
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
              style="position: absolute; top: 5vh"
            >
              <a class="dropdown-item" @click="changeLocale('en-US')"
                >{{ $t("EN_US") }} {{ renderCurrentLocale("en-US") }}</a
              >
              <a class="dropdown-item" @click="changeLocale('zh-CN')"
                >{{ $t("ZH_CN") }} {{ renderCurrentLocale("zh-CN") }}</a
              >
            </div>
          </li>
          <li
            v-if="!isMobile"
            :class="`nav-item header-item ${computedActiveLink('register')}`"
          >
            <router-link class="nav-link nav-title" to="/register"
              >{{ $t("REGISTER") }}
              <span class="sr-only">(current)</span></router-link
            >
          </li>
          <li v-if="!isMobile" class="nav-item header-item">
            <a class="nav-link nav-title">|</a>
          </li>
          <li
            v-if="!isMobile"
            :class="`nav-item header-item ${computedActiveLink('login')}`"
          >
            <router-link class="nav-link nav-title" to="/login"
              >{{ $t("LOGIN") }}
              <span class="sr-only">(current)</span></router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeItem: this.$route.path.split("/").pop()
    };
  },
  computed: {
    isMobile() {
      let pathLastValue = this.$route.path.split("/").pop();
      return pathLastValue === "mobile" ? true : false;
    },
    computedActiveLink() {
      return function(item) {
        if (item === this.activeItem) return "nav-active";
        return "";
      };
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
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal) return (this.activeItem = newVal.path.split("/").pop());
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  height: 5vh;
  width: 100%;
  min-width: 1024px;
  background-color: #090723;
  .header-nav {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .header-items {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    .header-item {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  .nav-title {
    color: white;
  }
  .nav-active {
    font-weight: bold;
  }
}
a {
  cursor: pointer;
}
</style>
