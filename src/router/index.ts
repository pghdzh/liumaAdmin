import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false }); // NProgress Configuration 刷新页面头部进度条

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("@/views/Login/index.vue"),
    },
    {
      path: "/layout",
      name: "layout",
      component: () => import("@/views/Layout/index.vue"),
      redirect: "/homeView",
      children: [
        {
          path: "/homeView",
          name: "homeView",
          component: () => import("@/views/HomeView/index.vue"),
        },
        {
          path: "/courseManagement",
          name: "courseManagement",
          component: () => import("@/views/courseManage/index.vue"),
        },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// 判断用户是否登陆
const checkIfUserIsLoggedIn = () => {
  return localStorage.getItem("username") || "";
};

// 路由加载前
router.beforeEach((to, from, next) => {
  const isLoggedIn = checkIfUserIsLoggedIn();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
