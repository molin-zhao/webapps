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
            iconStyle="width: 2vw; height: 2vw"
            name="color"
            @click.native="mouseclick('sidebar')"
          >
            <tooltips style="left: 5.2vw; bottom: 0">
              <div
                style="width: 200px; height: 200px; background-color: red"
              ></div>
            </tooltips>
          </badgeIcon>
          <badgeIcon
            wrapperStyle="width: 100%; height: 4vw"
            iconStyle="width: 2vw; height: 2vw;"
            badgeClass="badge-danger"
            name="bell"
            :number="90"
            @mouseover.native="mouseover('bell')"
            @mouseleave.native="mouseleave('bell')"
          >
            <tooltips ref="bell" style="left: 5vw; bottom: 0">
              <div
                style="width: 200px; height: 200px; background-color: red"
              ></div>
            </tooltips>
          </badgeIcon>
          <imageBtn
            src="/static/image/user_m_3.png"
            wrapperStyle="width: 100%; height: 4.5vw"
            imgStyle="width: 4vw; height: 4vw; border-radius: 2vw"
            @mouseover.native="mouseover('avatar')"
            @mouseleave.native="mouseleave('avatar')"
          >
            <tooltips ref="avatar" style="left: 5vw; bottom: 0">
              <div
                style="width: 200px; height: 200px; background-color: yellow"
              ></div>
            </tooltips>
          </imageBtn>
        </div>
      </div>

      <!-- taskbar -->
      <div class="taskbar">
        <div class="taskbar-item-wrapper">
          <h2 class="display-only" style="font-family: kai">
            {{ $t("STORYBOARD") }}
          </h2>
          <div>
            
          </div>
        </div>
        <div class="ad"></div>
      </div>

      <!-- storyboard -->
      <div class="storyboard">
        <router-view></router-view>
      </div>

      <!-- sidebar -->
      <sidebar 
      ref="sidebar"
      sidebarStyle="box-shadow: -5px 2px 5px lightgrey"
      >
        <div class="sidebar-content"></div>
      </sidebar>
    </div>
  </div>
</template>

<script>
import badgeIcon from "@/components/badgeIcon";
import imageBtn from "@/components/imageBtn";
import tooltips from "@/components/tooltips";
import sidebar from "@/components/sidebar";
import {mapState} from 'vuex';
export default {
  components: {
    badgeIcon,
    imageBtn,
    tooltips,
    sidebar
  },
  data() {
    return {
      storyboardLoading: true,
    };
  },
  computed: {
    projects(){}
  },
  mounted() {
    setTimeout(() => {
      console.log(this.$store.state);
      this.storyboardLoading = false;
    }, 3000);
  },
  methods: {
    mouseover(ref) {
      let refCpnt = this.$refs[ref];
      if (refCpnt && refCpnt.show) return refCpnt.show();
    },
    mouseleave(ref) {
      let refCpnt = this.$refs[ref];
      if (refCpnt && refCpnt.hide) return refCpnt.hide();
    },
    mouseclick(ref) {
      let refCpnt = this.$refs[ref];
      if (refCpnt) {
        if (refCpnt.visible && refCpnt.hide) return refCpnt.hide();
        if (!refCpnt.visible && refCpnt.show) return refCpnt.show();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/color.css";
@import "../common/theme/container.css";
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
.sidebar-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color:white;
}
</style>
