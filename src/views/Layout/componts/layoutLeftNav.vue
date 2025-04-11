<template>
  <div class="menu-layout">
    <el-menu class="el-menu-vertical-demo" :router="true" :default-active="$route.path">
      <el-menu-item v-for="item in navList" :index="item.path" :key="item.path">
        <template #title>
          <component :is="item.icon" style="width: 16px; margin-right: 20px" />
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
    </el-menu>
    <!-- 底部菜单 -->
    <!-- <div class="menu-bottom">
      <div
        class="menu-list flex align-center"
        v-for="item in menuList"
        :key="item.title"
      >
        <img :src="item.icon" alt="" />
        <span class="label">{{ item.title }}</span>
      </div>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import Pivas from "@/assets/img/pivas.png";
import UserPlus from "@/assets/img/user-plus.png";
import AlertCircle from "@/assets/img/alert-circle.png";
import { reactive } from "vue";

const navList = reactive<any>([
  {
    title: "首页总览",
    path: "/homeView",
    icon: "House",
  },
  {
    title: "流麻管理",
    icon: "Menu",
    path: "/liumaManagement",
  },
  {
    title: 'AI绘图管理',
    icon: 'Menu',
    path: '/AIGeneratedImageManage'
  },
  {
    title: '抽奖人管理',
    icon: 'Menu',
    path: '/LuckyDrawView'
  }

]);

const menuList = reactive([
  {
    title: "配置中心",
    icon: Pivas,
  },
  {
    title: "邀请成员",
    icon: UserPlus,
  },
  {
    title: "帮助中心",
    icon: AlertCircle,
  },
]);
</script>
<style scoped lang="scss">
:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
}

:deep(.el-menu) {
  border: unset;
}

.menu-layout {
  width: 200px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: #ffffff;
  z-index: 8;

  .menu-bottom {
    white-space: nowrap;
    padding-left: 20px;
    margin-bottom: 40px;
    box-sizing: border-box;

    .menu-list {
      overflow: hidden;
      height: 40px;

      img {
        width: 18px;
        height: 18px;
        margin-right: 19.33px;
      }

      .label {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: normal;
        color: #86909c;
      }
    }
  }
}
</style>
