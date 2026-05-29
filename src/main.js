import { createApp } from "vue";
import App from "./App.vue";
import { pinia } from "./pinia";
import router from "./router";
import "./styles.css";

createApp(App).use(pinia).use(router).mount("#app");
