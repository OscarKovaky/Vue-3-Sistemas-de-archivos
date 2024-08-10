<template>
  <div id="dispatch-app">
    <v-app-bar
      absolute
      height="88"
      app
      flat
      color="transparent"
    >
      <v-toolbar-title>
        <v-btn @click.stop="showSidebar = !showSidebar">
          <v-icon>mdi-view-list</v-icon>
          Menu
        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <component v-if="toolbarItems" :is="toolbarItems" />
    </v-app-bar>
    <DispatchDrawer
      :show="showSidebar"
      :topDrawer="topDrawer"
    />
    <v-main class="d-flex grey lighten-3" style="min-height: 100vh">
      <v-container fluid>
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
  </div>
</template>

<script lang="ts">
import notification from "./store/notification";
import { defineComponent, computed, ref, PropType } from 'vue';
import DispatchDrawer from "./DispatchDrawer.vue";
interface NavigationRoute {
  title: string;
  icon?: string;
  name: string;
}

export default defineComponent({
  components: { DispatchDrawer },
  props: {
    topDrawer: {
      type: Object,
      required: false,
    },
    toolbarItems: {
      type: Object,
      required: false,
    },
    token: {
      type: String,
    },
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
  },
  watch: {
  },
  data() {
    return {
      isFullscreen: false,
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
  methods: {
  
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
