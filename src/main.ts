import Vue from 'vue';
import './plugins/axios'
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify'
import VueCompositionAPI from "@vue/composition-api";
import Amplify, { Auth } from 'aws-amplify';
import { awsconfig } from './aws-exports';
import "core-js/stable";
import "regenerator-runtime/runtime";

Amplify.configure(awsconfig);

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
