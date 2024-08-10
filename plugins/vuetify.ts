// src/plugins/vuetify.ts
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Importar los estilos de Vuetify
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Importar el icono MDI

const vuetify = createVuetify({
    theme: {
      defaultTheme: 'light', // Establecer el tema predeterminado
      themes: {
        light: {
          colors: {
            primary: '#008080',
            secondary: '#36454F',
            accent: '#E30B5C',
          },
        },
        dark: {
          colors: {
            primary: '#FF5722',
            secondary: '#FFC107',
            accent: '#009688',
          },
        },
      },
    },
    icons: {
        // Configuración de íconos
        defaultSet: 'mdi', // Usar el conjunto de íconos Material Design Icons
        sets: {
          mdi,
        },
        aliases,
      },
  });

export default vuetify;
