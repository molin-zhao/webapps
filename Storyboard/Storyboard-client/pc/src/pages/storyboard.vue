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
          <div class="project-wrapper">
            <span class="display-only" style="font-family: kai">{{
              $t("PROJECTS")
            }}</span>
            <div class="list-group list-group-flush project-list display-only">
              <a
                style="font-family: kai; border: none; border-radius: 5px; padding: 5px"
                @click="projectLabelClick(index)"
                v-for="(item, index) in projects"
                :key="index"
                :class="projectLabel(index)"
                >{{ item.name }}</a
              >
            </div>
            <a
              id="create-project-btn"
              class="list-group-item list-group-item-dark display-only"
              style="width: 100%; margin-top: 5px; font-family: kai; border-radius: 5px; padding: 5px; text-align: left"
              data-toggle="modal"
              data-target="#modal-create-project"
            >
              {{ `+ ${$t("CREATE_PROJECT")}` }}
            </a>
            <div></div>
          </div>
        </div>
        <div class="ad"></div>
      </div>

      <!-- storyboard -->
      <div class="storyboard">
        <mainboard :index="projectSelectedIndex" />
        <router-view></router-view>
      </div>
    </div>

    <!-- modals -->
    <div id="modal-create-project" class="modal fade" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title display-only" style="font-family: kai">
              {{ $t("CREATE_PROJECT") }}
            </h5>
            <a
              style="font-size: 20px"
              class="display-only"
              aria-hidden="true"
              aria-label="Close"
              data-target="#modal-create-project"
              data-dismiss="modal"
              >&times;</a
            >
          </div>
          <div class="modal-body">
            <p>body</p>
          </div>
          <div class="modal-footer">
            <button
              v-if="projectCreating"
              class="btn btn-sm btn-primary create-btn"
              disabled
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            </button>
            <button
              v-else
              @click="createNewProject"
              type="button"
              class="btn btn-sm btn-primary create-btn"
            >
              {{ $t("CREATE") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- alerts -->
    <alert ref="alert"
      ><strong>Holy guacamole!</strong> You should check in on some of those
      fields below.
    </alert>
  </div>
</template>

<script>
import badgeIcon from "@/components/badgeIcon";
import imageBtn from "@/components/imageBtn";
import tooltips from "@/components/tooltips";
import alert from "@/components/alert";
import mainboard from "@/components/mainboard";
import { mapState, mapActions } from "vuex";
import mouse from "@/common/utils/mouse";
export default {
  components: {
    badgeIcon,
    imageBtn,
    tooltips,
    alert,
    mainboard
  },
  data() {
    return {
      storyboardLoading: true,
      projectCreating: false,
      projectCreated: false,
      projectSelectedIndex: 0
    };
  },
  computed: {
    ...mapState("user", ["projects"]),
    projectLabel() {
      return function(index) {
        if (index === this.projectSelectedIndex) {
          return "list-group-item list-group-item-primary";
        }
        return "list-group-item list-group-item-action";
      };
    }
  },
  mounted() {
    this.fetch_projects().then(() => {
      this.storyboardLoading = false;
    });
  },
  methods: {
    ...mapActions({
      fetch_projects: "user/fetch_projects"
    }),
    ...mouse,
    projectLabelClick(index) {
      this.projectSelectedIndex = index;
    },
    createNewProject() {
      this.projectCreated = false;
      this.projectCreating = true;
      setTimeout(() => {
        this.projectCreating = false;
        this.projectCreated = true;
        this.$refs["alert"].alert("warning");
      }, 3000);
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
    background-color: white;
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
    background-color: white;
  }
}
.project-wrapper {
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .project-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    a {
      width: 100%;
      text-align: left;
    }
    a:hover {
      color: black;
    }
    a.list-group-item-primary {
      color: dodgerblue;
    }
  }
}
#create-project-btn:active {
  background-color: lightgray;
}
.create-btn {
  height: 30px;
  width: 70px;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: kai;
}
</style>
