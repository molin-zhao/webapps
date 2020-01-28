<template>
  <div class="mainboard-wrapper">
    <div v-if="hasProject" class="mainboard">
      <div class="mainboard-title">
        <h1 class="display-only" style="font-family: kai">
          {{ projects[index].name }}
        </h1>
        <div class="mainboard-title-right">
          <div
            class="online-user"
            data-toggle="tooltip"
            data-placement="bottom"
            :title="$t('ONLINE_MEMBER')"
          >
            <badge-icon
              :wrapper-style="group.wrapperStyle"
              :icon-style="group.iconStyle"
              :icon-name="group.iconName"
            />
            <span class="online-user-count display-only">{{
              onlineUsers
            }}</span>
          </div>
          <badge-icon
            :wrapper-style="more.wrapperStyle"
            :icon-style="more.iconStyle"
            :icon-name="more.iconName"
            @click.native="mouseclick('sidebar', $event)"
          >
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
      <div class="mainboard-phases">
        <phase :project-id="index" />
      </div>
    </div>
    <div v-else class="mainboard"></div>

    <!-- sidebar -->
    <sidebar
      ref="sidebar"
      class="shadow"
      sidebarStyle="
      height: 100vh; 
      width: 25vw; 
      right: -5px; 
      top: 0;
      "
    >
      <div class="sidebar-content"></div>
    </sidebar>
  </div>
</template>

<script>
import badgeIcon from "@/components/badgeIcon";
import popover from "@/components/popover";
import tooltip from "@/components/tooltip";
import sidebar from "@/components/sidebar";
import editableText from "@/components/editableText";
import datepicker from "@/components/datepicker";
import phase from "@/components/phase";
import { mouseclick } from "@/common/utils/mouse";
import { group, more } from "@/common/theme/icon";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      // component style
      group,
      more,
      // self data
      description: "",
      onlineUsers: 1
    };
  },
  components: {
    badgeIcon,
    popover,
    sidebar,
    editableText,
    tooltip,
    datepicker,
    phase
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
    mouseclick,
    descriptionChange(val) {
      this.description = val;
    }
  },
  watch: {
    description(val) {
      console.log(val);
    }
  },
  mounted() {
    $(document).ready(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.mainboard-wrapper {
  width: 100%;
  height: 100%;
  .mainboard {
    padding: 10px 10px 0 10px; // padding bottom 0px
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
.mainboard-phases {
  height: 80%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.online-user {
  margin-right: 2vw;
  width: 6vw;
  height: 3vw;
  border-radius: 1vw;
  border: lightgrey solid 1px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .online-user-count {
    width: 3vw;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: lightgrey solid 1px;
  }
}
</style>
