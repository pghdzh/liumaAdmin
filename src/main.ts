import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/theme/common.scss";
import "./assets/reset.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/es/locale/lang/zh-cn";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; // 数据持久化
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

export const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(ElementPlus, { locale });
app.use(router);
app.use(pinia);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
