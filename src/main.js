import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueTimeago from 'vue-timeago3';
import piniaPersistedState from 'pinia-plugin-persistedstate';
import vuetify from './plugins/vuetify'; // Import the vuetify instance



const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPersistedState);

app.use(pinia)
app.use(router)
app.use(VueTimeago, { locale: 'en' })
app.use(vuetify)

app.mount('#app')
