<template>
 <v-navigation-drawer>
  <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
  <v-divider></v-divider>
  <v-list-item link title="List Item 1"></v-list-item>
  <v-list-item link title="List Item 2"></v-list-item>
  <v-list-item link title="List Item 3"></v-list-item>
</v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

export default defineComponent({
  name: "DispatchDrawer",
  show: {
      type: Boolean,
  },
  setup(props) {
    const sidebarColor = ref("secondary");
    const groupActiveClass = computed(() => "secondary lighten-1 white--text");
    const itemActiveClass = computed(() => "primary white--text");

    return {
      sidebarColor,
      groupActiveClass,
      itemActiveClass,
    };
  },
});
</script>

