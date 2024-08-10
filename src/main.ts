import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Importa los estilos globales de Vuetify
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import router from './router'; 

const vuetify = createVuetify({
    components,
    directives,
  });


createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app');
