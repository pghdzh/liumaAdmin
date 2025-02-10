<template>
  <div class="content">
    <div class="titleArea">
      流麻展示后台管理系统
      <div style="margin-left: 220px; font-size: 32px; font-weight: normal;margin-top: 20px;">
        -霜落专用
      </div>
    </div>
    <div class="form">
      <el-form ref="ruleFormRef" :rules="rules" :model="state.ruleForm" size="large" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="state.ruleForm.username" placeholder="用户名" autocomplete="off"
            @input="onVerifyCnAndAccount($event)">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="state.ruleForm.password" :type="state.isShowPassword ? 'text' : 'password'"
            placeholder="密码" autocomplete="off" @input="onVerifyCnAndPwd($event)">
            <template #prefix>
              <el-icon>
                <Unlock />
              </el-icon>
            </template>
            <template #suffix>
              <i class="cursor-pointer" @click="state.isShowPassword = !state.isShowPassword">
                <el-icon v-if="state.isShowPassword">
                  <Hide />
                </el-icon>
                <el-icon v-else>
                  <View />
                </el-icon>
              </i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(ruleFormRef)" :loading="state.loading.signIn">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { View, Unlock, Hide, User } from "@element-plus/icons-vue";

import { verifyCnAndSpace } from "@/utils/toolsValidate";
import { formatAxis } from "@/utils/formatTime";
import { useRoute, useRouter } from "vue-router";

interface RuleForm {
  username: string;
  password: string;
}

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const state = reactive({
  isShowPassword: false,
  ruleForm: {
    username: localStorage.getItem("username") || "",
    password: "",
  },
  loading: {
    signIn: false,
  },
});

const rules = reactive<FormRules<RuleForm>>({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
});

// 去掉中文及空格
const onVerifyCnAndAccount = (val: string) => {
  state.ruleForm.username = verifyCnAndSpace(val);
};

// 去掉中文及空格
const onVerifyCnAndPwd = (val: string) => {
  state.ruleForm.password = verifyCnAndSpace(val);
};

// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});

// 登录成功后的跳转
const signInSuccess = () => {
  // 初始化登录成功时间问候语
  let currentTimeInfo = currentTime.value;
  // 登录成功，跳到转首页
  if (route.query?.redirect) {
    router.push({
      path: <string>route.query?.redirect,
      query:
        Object.keys(<string>route.query?.params).length > 0
          ? JSON.parse(<string>route.query?.params)
          : "",
    });
  } else {
    router.push({
      path: "/layout",
    });
  }
  // 登录成功提示
  ElMessage.success(`${currentTimeInfo}`);
  state.loading.signIn = false;
};

// 确认登陆
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (state.ruleForm.username != 'admin') {
        ElMessage.warning('用户名错误哦！')
        return
      }
      if (state.ruleForm.password != '123456') {
        ElMessage.warning('密码错误')
        return
      }
      state.loading.signIn = true;
      localStorage.setItem("username", state.ruleForm.username);
      signInSuccess();
    }
  });
};
</script>
<style scoped lang="scss">
.content {
  width: 100%;
  height: 100vh;
  background: url("./img/loginBack.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .titleArea {
    position: absolute;
    left: 10%;
    font-size: 48px;
    font-weight: bold;
    top: 35%;
  }

  .form {
    position: absolute;
    width: 400px;
    right: 15%;
    top: 50%;
  }
}
</style>
