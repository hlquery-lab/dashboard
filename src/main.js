import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins.js";
import "./style.css";
import "./workspace.css";

import "./navigation.css";
import "./metronic.css";
import "./dashboard.css";
import "./commerce/commerce.css";

createApp(App).use(vuetify).mount("#app");
