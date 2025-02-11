<template>
  <div class="head-layout-content flex justify-between align-center">
    <div class="head-layout-left flex align-center">
      <div class="logo">
        <img src="~@/assets/img/logo.png" alt="LOGO" />
      </div>
      <span class="platform-name">流麻管理系统-霜落专用</span>
    </div>
    <div class="head-layout-right flex align-center">
      <div class="boxes-icon flex justify-center align-center">
        <img src="~@/assets/img/notification.png" alt="通知" />
      </div>

      <div class="active-user flex align-center">
        <div class="boxes-active">
          <img src="~@/assets/img/active.png" alt="头像" />
        </div>
        <el-dropdown @command="handleCommand">
          <span class="user-name">{{ currentUserName }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const currentUserName = localStorage.getItem("username");

const handleCommand = (command: any) => {
  if (command == "logout") {
    logout();
  }
};

const logout = () => {
  ElMessageBox.alert("此操作将退出登陆，是否继续？", "提示", {
    confirmButtonText: "确认退出",
    callback: () => {
      localStorage.removeItem("username");
      router.push({
        path: "/",
      });
      ElMessage({
        type: "success",
        message: `退出登陆`,
      });
    },
  });
};
</script>
<style scoped lang="scss">
.head-layout-content {
  height: inherit;

  .head-layout-left {
    min-width: 234px;
    flex: 1;

    .logo {
      width: 32px;
      height: 32px;

      img {
        width: inherit;
        height: inherit;
      }
    }

    .platform-name {
      margin-left: 12px;
      font-family: 苹方-简;
      font-size: 20px;
      font-weight: 600;
      color: #1d2129;
    }
  }

  .head-layout-right {
    float: right;
    z-index: 9;

    .boxes-icon {
      width: 32px;
      height: 32px;
      margin-left: 16px;
      border-radius: 50%;
      box-sizing: border-box;
      border: 1px solid #f2f3f5;
      cursor: pointer;

      img {
        width: 18px;
        height: 18px;
      }
    }

    .active-user {
      margin-left: 40px;

      .boxes-active {
        width: 32px;
        height: 32px;
        margin-right: 10px;

        img {
          width: inherit;
          height: inherit;
        }
      }

      .user-name {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: normal;
        color: #3d3d3d;
        cursor: pointer;
      }
    }
  }
}
</style>
