import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "../utils/rem";

Vue.config.productionTip = false;

Vue.use(require("vue-wechat-title"));

if (process.env.VUE_APP_CURRENTMODE !== "prod") {
  // 非生产环境
  const VConsole = require("vconsole");
  new VConsole();
}

const app = new Vue({
  components: {
    App
  },
  router,
  store,
  render: h => h(App)
});

(window as any).mountApp = () => {
  app.$mount("#app");
};
if (process.env.NODE_ENV === "development" || (window as any).STYLE_READY) {
  (window as any).mountApp();
}
