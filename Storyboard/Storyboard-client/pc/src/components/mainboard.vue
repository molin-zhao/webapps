<template>
  <div class="mainboard-wrapper">
    <div v-if="hasProject" class="mainboard">
      <div class="mainboard-title">
        <h1 class="display-only" style="font-family: kai">
          {{ projects[index].name }}
        </h1>
        <div class="mainboard-title-right">
          <badge-icon
            wrapper-style="width: 4vh; height: 4vh; border-radius: 2vh"
            wrapper-hover-style="background-color: lightgrey"
            icon-style="width: 2vw; height: 2vw"
            name="more"
            @click.native="mouseclick('sidebar')"
          >
            <tooltip style="top:0 ; right: 0">
              <div
                style="width: 200px; height: 200px; background-color: red"
              ></div>
            </tooltip>
          </badge-icon>
        </div>
      </div>
      <div class="mainboard-info">
        <editable-text
          style="width: 30%; height: 100%; padding: 1px"
          default-value="ADD_DESCRIPTION"
          :value="description"
          font-style="font-family: kai; font-size: 2vh;"
          :row="3"
          @change="descriptionChange"
        />
      </div>
      <div class="mainboard-phrases"></div>
    </div>
    <div v-else class="mainboard"></div>

    <!-- sidebar -->
    <sidebar
      ref="sidebar"
      sidebarStyle="height: 100vh; width: 25vw; box-shadow: -5px 2px 5px lightgrey; right: -5px; top: 0"
    >
      <div class="sidebar-content"></div>
    </sidebar>
  </div>
</template>

<script>
import badgeIcon from "@/components/badgeIcon";
import tooltip from "@/components/tooltips";
import sidebar from "@/components/sidebar";
import editableText from "@/components/editableText";
import mouse from "@/common/utils/mouse";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      description: ""
    };
  },
  components: {
    badgeIcon,
    tooltip,
    sidebar,
    editableText
  },
  props: {
    index: {
      type: Number,
      required: true,
      default: 0
    }
  },
  computed: {
    ...mapState("user", ["projects"]),
    hasProject() {
      return this.projects[this.index] ? true : false;
    }
  },
  methods: {
    ...mouse,
    descriptionChange(val) {
      this.description = val;
    }
  },
  watch: {
    description(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.mainboard-wrapper {
  width: 100%;
  height: 100%;
  .mainboard {
    padding: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .mainboard-title {
      width: 100%;
      height: 10%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      .mainboard-title-right {
        position: absolute;
        height: 100%;
        width: 50%;
        right: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}

.sidebar-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
}

.mainboard-info {
  height: 10%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.mainboard-phrases {
  height: 80%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: lightblue;
}
</style>
