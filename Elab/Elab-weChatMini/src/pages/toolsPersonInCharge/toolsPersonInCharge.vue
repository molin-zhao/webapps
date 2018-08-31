<template>
    <div class="container">
        <div class="bg">
            <toolCardComponent v-for="(item, index) in items" :key="index" :item="item"></toolCardComponent>
        </div>
    </div>
</template>
<script>
import toolCardComponent from "@/components/仪器卡";
export default {
  components: {
    toolCardComponent
  },
  data() {
    return {
      items: [
        {
          image: "/static/images/xwj.png",
          name: "电子秤 1000g 物理生物化学专用实验器材",
          status: "open",
          person: {
            status: "pending",
            name: "张雅"
          }
        },
        {
          image: "/static/images/xwj.png",
          name: "电子秤 1000g 物理生物化学专用实验器材",
          status: "closed",
          person: {
            status: "active",
            name: "侯小刚"
          }
        },
        {
          image: "/static/images/xwj.png",
          name: "电子秤 1000g 物理生物化学专用实验器材",
          status: "closed",
          person: {
            status: "active",
            name: "毛子"
          }
        },
        {
          image: "/static/images/xwj.png",
          name: "电子秤 1000g 物理生物化学专用实验器材",
          status: "open",
          person: {
            status: "pending",
            name: "魏璎珞"
          }
        }
      ]
    };
  },
  methods: {}
};
</script>
<style lang="scss">
.bg {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(248, 248, 248, 1);
}
</style>


