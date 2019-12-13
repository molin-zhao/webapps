<template>
  <div class="storyboard-container">
    <loading
      v-if="storyboardLoading"
      :active="true"
      spinner="line-wave"
      color="#090723"
    />
    <div v-else class="storyboard color-primary">
      <!-- left menu -->
      <div class="menubar">
        <img src="/static/logo.png" style="width: 4vw; height: 4vw" />
        <div class="menubar-empty"></div>
        <div class="menubar-setting-wrapper">
          <badgeIcon
            wrapperStyle="width: 100%; height: 4vw"
            iconStyle="width: 1.5vw; height: 1.5vw"
            name="lang"
          />
          <badgeIcon
            wrapperStyle="width: 100%; height: 4vw"
            iconStyle="width: 2vw; height: 2vw;"
            badgeClass="badge-danger"
            name="bell"
            :number="90"
          />
          <imageBtn
            src="/static/image/user_m_3.png"
            wrapperStyle="width: 100%; height: 4.5vw"
            imgStyle="width: 4vw; height: 4vw; border-radius: 2vw"
          />
        </div>
      </div>

      <!-- taskbar -->
      <div class="taskbar">
        <div class="taskbar-item-wrapper">
          <h2 style="font-family: kai">{{ $t("STORYBOARD") }}</h2>
        </div>
        <div class="ad"></div>
      </div>

      <!-- storyboard -->
      <div class="storyboard"></div>
    </div>
  </div>
</template>

<script>
import badgeIcon from "@/components/badgeIcon";
import imageBtn from "@/components/imageBtn";
export default {
  components: {
    badgeIcon,
    imageBtn
  },
  data() {
    return {
      storyboardLoading: true
    };
  },
  mounted() {
    setTimeout(() => {
      this.storyboardLoading = false;
    }, 3000);
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/color.css";
.storyboard-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
}
.storyboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  .menubar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width: 5%;
    .menubar-empty {
      width: 100%;
      height: 40%;
    }
    .menubar-setting-wrapper {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-top: 1vh;
      padding-bottom: 1vh;
    }
  }
  .taskbar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width: 20%;
    border-top-left-radius: 2vw;
    background-color: lightgoldenrodyellow;
    border-right-width: 2px;
    border-right-color: lightgray;
    border-right-style: dashed;
    .taskbar-item-wrapper {
      width: 100%;
      height: 70%;
      padding: 1vw;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      background-color: red;
    }
    .ad {
      width: 100%;
      height: 30%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: lightgray;
    }
  }
  .storyboard {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width: 75%;
    background-color: lightgoldenrodyellow;
  }
}
.test {
  border-width: 10px;
  border-color: green;
  border-style: solid;
}
</style>
