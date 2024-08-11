<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar :elevation="2" rounded>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Application Bar</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <router-link :to="{ name: 'home' }">Home</router-link>
      </v-list-item>
      <v-list-item>
        <router-link :to="{ name: 'about' }">About</router-link>
      </v-list-item>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="grey lighten-3" style="min-height: 100vh;">
        <router-view />
        <v-snackbar
          v-model="notification.state.show"
          :color="notification.state.color"
          timeout="5000"
          app
        >
          <span class="d-flex items-center">
            {{ notification.state.message }}
            <v-spacer />
            <v-btn icon @click="notification.state.show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </span>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import notification from "./store/notification";
import { defineComponent, computed, ref, PropType } from 'vue';
import DispatchDrawer from "./DispatchDrawer.vue";
import { client } from "./services/dispatch-client";

interface NavigationRoute {
  title: string;
  icon?: string;
  name: string;
}

export default defineComponent({
  components: { DispatchDrawer },
  props: {
    dispatchUrl: {
      type: String,
      default: process.env.VUE_APP_API_URL || "http://localhost:5143/api",
    },
    title: {
      type: String,
      default: "Union Management and Dispatch System",
    },
  },
  created() {
    client.init("http://localhost:5004/api", "test");
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  },
  data() {
    return {
      drawer: false,
      sidebarColor: "secondary",
      groupActiveClass: "secondary lighten-1 white--text",
      itemActiveClass: "primary white--text",
      showSidebar: true,
      notification,
      showButton: false,
      employerRoutes: [
        {
          title: "Employers",
          name: "dispatch.employers",
        },
        {
          title: "Collective Agreements",
          name: "dispatch.collectiveAgreements",
        },
      ] as NavigationRoute[],
    };
  },
  computed: {

  },
});
</script>

<style>
.btn-fullscreen {
  position: relative;
  top: 10px;
  right: 10px;
}

.rounded-btn {
  border-radius: 50%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background-color: #2c3e50;
  color: white;
}

.v-list-item {
  padding-left: 16px;
}

.v-list-group__header .v-list-item {
  padding-left: 16px;
}

.v-list-group .v-list-item {
  padding-left: 32px;
}
</style>
