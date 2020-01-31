import Vue from "vue";
import vueRouter from "vue-router";

Vue.use(vueRouter);

import home from "@/pages/home";
import storyboard from "@/pages/storyboard";
import index from "@/router-views/index";
import error from "@/router-views/error";
import mobile from "@/router-views/mobile";
import login from "@/pages/login";
import register from "@/pages/register";
const router = new vueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: home,
      children: [
        {
          path: "",
          component: index
        },
        {
          path: "mobile",
          component: mobile
        },
        {
          path: "error/:code",
          component: error
        },
        {
          path: "login",
          name: "login",
          component: login
        },
        {
          path: "register",
          name: "register",
          component: register
        }
      ]
    },
    {
      path: "/storyboard",
      component: storyboard
    },
    {
      path: "*",
      redirect: "/error/404"
    }
  ]
});

export default router;
