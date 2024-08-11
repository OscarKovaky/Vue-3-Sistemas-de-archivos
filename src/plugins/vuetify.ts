// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VTreeview } from 'vuetify/labs/VTreeview';
// Vuetify
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
  components: {
    VTreeview,
  },
});

export default vuetify;
