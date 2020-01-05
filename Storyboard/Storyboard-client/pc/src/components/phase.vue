<template>
  <div class="phase-wrapper">
    <div class="phase-nav">
      <div
        class="nav-link display-only"
        v-for="(item, i) in projects[index].phases"
        :key="i"
        :style="navActiveStyle(i)"
        @click="selectPhase(i)"
      >
        <span>{{ item.name }}</span>
      </div>
      <div class="nav-link" style="padding: 0">
        <icon name="add" style="width: 25px; height: 25px; color: grey" />
      </div>
    </div>
    <div class="phase-body"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      selectedPhase: 0
    };
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
    navActiveStyle() {
      return function(index) {
        return index === this.selectedPhase
          ? "background-color: lightgrey"
          : "background-color: white";
      };
    }
  },
  methods: {
    selectPhase(i) {
      this.selectedPhase = i;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.phase-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .phase-nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    flex-wrap: nowrap;
    width: 100%;
    height: 40px;
    border-bottom: lightgrey 1px solid;
    .nav-link {
      width: 10%;
      min-width: 100px;
      max-width: 150px;
      height: 90%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: lightgrey 1px solid;
      border-bottom: none;
      margin-right: -1px;
      padding-top: 10px;
      padding-left: 0;
      padding-right: 0;
      cursor: pointer;
      span {
        width: 95%;
        height: 90%;
        line-height: 90%;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: kai;
        font-size: 14px;
      }
    }
    .nav-link:active {
      -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    }
  }
  .phase-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: lightblue;
  }
}
</style>
